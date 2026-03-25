// WP XML → DB eşleştirme scripti
// Mevcut plates ve accessories kayıtlarına slug + sales_mode + meta atar
// Çalıştır: node scripts/match-wp-to-db.js > scripts/generated/migration-v11c-matched.sql

const fs = require('fs');
const path = require('path');
const https = require('https');

// ─── Supabase credentials ────────────────────────────────────
const SUPABASE_URL  = process.env.SUPABASE_URL || 'https://latlzskzemmdnotzpscc.supabase.co';
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_KEY || '';

// ─── HTTP helper ──────────────────────────────────────────────
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
  });
}

// ─── XML parse yardımcıları ───────────────────────────────────
const xml = fs.readFileSync(
  path.join(__dirname, '..', 'tasyunufiyatlari.WP.Urunler2026-03-20.xml'),
  'utf8'
);

function getCDATA(block, tag) {
  const open  = `<${tag}><![CDATA[`;
  const close = `]]></${tag}>`;
  const start = block.indexOf(open);
  if (start === -1) return '';
  const valueStart = start + open.length;
  const end = block.indexOf(close, valueStart);
  if (end === -1) return '';
  return block.slice(valueStart, end).trim();
}

// excerpt:encoded yoksa content:encoded'dan ilk 200 karakter
function getExcerpt(block) {
  const excerpt = getCDATA(block, 'excerpt:encoded');
  if (excerpt && excerpt.length > 10) return excerpt.slice(0, 400);
  const content = getCDATA(block, 'content:encoded');
  if (content && content.length > 10) return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 400);
  return '';
}

function getCategories(block, domain) {
  const results = [];
  const pattern = `domain="${domain}" nicename="`;
  let pos = 0;
  while (true) {
    const start = block.indexOf(pattern, pos);
    if (start === -1) break;
    const niceStart = start + pattern.length;
    const niceEnd   = block.indexOf('"', niceStart);
    const nicename  = block.slice(niceStart, niceEnd);
    const cdataStart = block.indexOf('<![CDATA[', niceEnd);
    const cdataEnd   = block.indexOf(']]>', cdataStart);
    const label = cdataStart !== -1 ? block.slice(cdataStart + 9, cdataEnd) : '';
    results.push({ nicename, label });
    pos = cdataEnd + 3;
  }
  return results;
}

// ─── Kategori ayarları ────────────────────────────────────────
const CATEGORY_CONFIG = {
  'tasyunu-levhalar': { table: 'plates',      sales_mode: 'quote_only',       pricing: 'quote_required' },
  'eps-levhalar':     { table: 'plates',      sales_mode: 'quote_only',       pricing: 'quote_required' },
  'yapistiricilar':   { table: 'accessories', sales_mode: 'single_or_quote',  pricing: 'quote_required' },
  'sivalar':          { table: 'accessories', sales_mode: 'single_or_quote',  pricing: 'quote_required' },
  'kaplamalar':       { table: 'accessories', sales_mode: 'single_or_quote',  pricing: 'quote_required' },
  'astarlar':         { table: 'accessories', sales_mode: 'single_or_quote',  pricing: 'quote_required' },
  'boyalar':          { table: 'accessories', sales_mode: 'single_or_quote',  pricing: 'quote_required' },
  'yardimci-urunler': { table: 'accessories', sales_mode: 'single_or_quote',  pricing: 'quote_required' },
  'dubeller':         { table: 'accessories', sales_mode: 'system_only',      pricing: 'hidden' },
  'fileler':          { table: 'accessories', sales_mode: 'system_only',      pricing: 'hidden' },
  'profiller':        { table: 'accessories', sales_mode: 'system_only',      pricing: 'hidden' },
};

// ─── Normalize: eşleştirme için ──────────────────────────────
function normalize(s) {
  return s
    .toLowerCase()
    .replace(/ş/g,'s').replace(/ç/g,'c').replace(/ğ/g,'g')
    .replace(/ü/g,'u').replace(/ö/g,'o').replace(/ı/g,'i').replace(/İ/g,'i')
    .replace(/[^a-z0-9]+/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

// WP title'dan kalınlık suffix'ini temizle: "SW035 5 cm" → "SW035"
function stripThicknessFromTitle(t) {
  return t.replace(/\s+\d{1,2}\s*cm$/i, '').trim();
}

// ─── Slug üretici ─────────────────────────────────────────────
function normalizeTR(s) {
  return s
    .replace(/ş/g,'s').replace(/Ş/g,'s')
    .replace(/ç/g,'c').replace(/Ç/g,'c')
    .replace(/ğ/g,'g').replace(/Ğ/g,'g')
    .replace(/ü/g,'u').replace(/Ü/g,'u')
    .replace(/ö/g,'o').replace(/Ö/g,'o')
    .replace(/ı/g,'i').replace(/İ/g,'i');
}

function toSlug(s) {
  return normalizeTR(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function stripThickness(slug) {
  return slug
    .replace(/-\d{1,2}-cm$/, '')
    .replace(/-\d{1,2}cm$/, '');
}

// ─── Eşleştirme skoru ─────────────────────────────────────────
// WP title vs DB name/short_name benzerlik skoru (0-100)
function matchScore(wpTitle, dbName, dbShortName) {
  const wp = normalize(stripThicknessFromTitle(wpTitle));
  const dbN = normalize(dbName || '');
  const dbS = normalize(dbShortName || '');

  // Tam eşleşme
  if (wp === dbN || wp === dbS) return 100;

  // WP title DB adını içeriyor veya tersi
  if (dbN.length > 3 && wp.includes(dbN)) return 90;
  if (wp.length > 3 && dbN.includes(wp)) return 85;
  if (dbS.length > 3 && wp.includes(dbS)) return 80;

  // Kelime bazlı örtüşme
  const wpWords  = new Set(wp.split(' ').filter(w => w.length > 2));
  const dbWords  = new Set(dbN.split(' ').filter(w => w.length > 2));
  const dbSWords = new Set(dbS.split(' ').filter(w => w.length > 2));
  const allDb    = new Set([...dbWords, ...dbSWords]);

  const overlap = [...wpWords].filter(w => allDb.has(w)).length;
  const total   = Math.max(wpWords.size, 1);
  return Math.round((overlap / total) * 70);
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  // DB verilerini çek
  const [plates, accessories] = await Promise.all([
    fetchJSON(`${SUPABASE_URL}/rest/v1/plates?select=id,name,short_name,slug&is_active=eq.true&order=id&limit=200`),
    fetchJSON(`${SUPABASE_URL}/rest/v1/accessories?select=id,name,short_name,slug,brands(name)&is_active=eq.true&order=id&limit=200`),
  ]);

  process.stderr.write(`DB: ${plates.length} plate, ${accessories.length} accessory\n`);

  // WP ürünlerini parse et
  const items = xml.split('<item>').slice(1).map(s => s.split('</item>')[0]);
  const wpProducts = [];
  for (const item of items) {
    if (getCDATA(item, 'wp:post_type') !== 'product') continue;
    if (getCDATA(item, 'wp:status') !== 'publish') continue;
    const title   = getCDATA(item, 'title');
    const wpSlug  = getCDATA(item, 'wp:post_name');
    const cats    = getCategories(item, 'product_cat').map(c => c.nicename);
    const brands  = getCategories(item, 'pwb-brand');
    const excerpt = getExcerpt(item);
    const primaryCat = cats.find(c => CATEGORY_CONFIG[c]) ?? cats[0];
    const config  = CATEGORY_CONFIG[primaryCat];
    if (!config) continue;
    wpProducts.push({ title, wpSlug, primaryCat, config, excerpt, brandLabel: brands[0]?.label ?? '' });
  }

  // baseSlug bazlı grupla (kalınlık varyantlarını tek kayda indir)
  const grouped = new Map();
  for (const p of wpProducts) {
    const base = stripThickness(p.wpSlug);
    if (!grouped.has(base)) {
      grouped.set(base, { ...p, finalSlug: base, cleanTitle: stripThicknessFromTitle(p.title) });
    }
  }

  process.stderr.write(`WP: ${grouped.size} ürün grubu\n\n`);

  // ─── Eşleştir ────────────────────────────────────────────────
  const usedSlugs = new Set();
  const updates = { plates: [], accessories: [], unmatched: [] };

  for (const [, wp] of grouped) {
    const table = wp.config.table;
    const dbRows = table === 'plates' ? plates : accessories;

    // Tüm DB kayıtlarına skor hesapla
    const scored = dbRows.map(row => ({
      row,
      score: matchScore(wp.cleanTitle, row.name, row.short_name),
    })).sort((a, b) => b.score - a.score);

    const best = scored[0];
    const threshold = 40; // min skor

    if (!best || best.score < threshold) {
      updates.unmatched.push({ ...wp, bestScore: best?.score, bestName: best?.row.name });
      continue;
    }

    // Slug çakışma kontrolü
    let finalSlug = wp.finalSlug;
    if (usedSlugs.has(finalSlug)) {
      let i = 2;
      while (usedSlugs.has(`${finalSlug}-${i}`)) i++;
      finalSlug = `${finalSlug}-${i}`;
    }
    usedSlugs.add(finalSlug);

    updates[table].push({
      id: best.row.id,
      dbName: best.row.name,
      wpTitle: wp.cleanTitle,
      score: best.score,
      slug: finalSlug,
      sales_mode: wp.config.sales_mode,
      pricing: wp.config.pricing,
      excerpt: wp.excerpt,
    });
  }

  // ─── SQL üret ─────────────────────────────────────────────────
  const sql = [
    '-- ============================================================',
    '-- Migration v11c: WP → DB eşleştirilmiş slug + meta güncelleme',
    '-- Tarih: 2026-03-20',
    '-- Yöntem: ID bazlı kesin güncelleme (isim eşleştirmesi script\'te yapıldı)',
    '-- ============================================================',
    '',
    `-- plates: ${updates.plates.length} eşleşme`,
    `-- accessories: ${updates.accessories.length} eşleşme`,
    `-- eşleşmeyen: ${updates.unmatched.length}`,
    '',
    '-- ─── PLATES ─────────────────────────────────────────────────',
  ];

  for (const u of updates.plates) {
    const esc = s => (s || '').replace(/'/g, "''");
    const excerptClean = u.excerpt.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    sql.push(`-- ${u.dbName} ← "${u.wpTitle}" (skor: ${u.score})`);
    sql.push(
      `UPDATE plates SET` +
      ` slug = '${esc(u.slug)}',` +
      ` sales_mode = '${u.sales_mode}',` +
      ` pricing_visibility_mode = '${u.pricing}'` +
      (excerptClean ? `,\n  catalog_description = '${esc(excerptClean.slice(0,500))}'` : '') +
      `\nWHERE id = ${u.id} AND slug IS NULL;\n`
    );
  }

  sql.push('', '-- ─── ACCESSORIES ────────────────────────────────────────────');
  for (const u of updates.accessories) {
    const esc = s => (s || '').replace(/'/g, "''");
    const excerptClean = u.excerpt.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    sql.push(`-- ${u.dbName} ← "${u.wpTitle}" (skor: ${u.score})`);
    sql.push(
      `UPDATE accessories SET` +
      ` slug = '${esc(u.slug)}',` +
      ` sales_mode = '${u.sales_mode}',` +
      ` pricing_visibility_mode = '${u.pricing}'` +
      (excerptClean ? `,\n  catalog_description = '${esc(excerptClean.slice(0,500))}'` : '') +
      `\nWHERE id = ${u.id} AND slug IS NULL;\n`
    );
  }

  if (updates.unmatched.length > 0) {
    sql.push('', '-- ─── EŞLEŞMEYENLERİ (manuel kontrol gerekir) ────────────────');
    for (const u of updates.unmatched) {
      sql.push(`-- UNMATCHED: "${u.cleanTitle}" (${u.primaryCat}) — en iyi skor: ${u.bestScore} → ${u.bestName}`);
    }
  }

  // Dosyaya yaz
  const outDir = path.join(__dirname, 'generated');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'migration-v11c-matched.sql');
  fs.writeFileSync(outPath, sql.join('\n'), 'utf8');

  process.stderr.write(`\n✓ plates: ${updates.plates.length} güncelleme\n`);
  process.stderr.write(`✓ accessories: ${updates.accessories.length} güncelleme\n`);
  process.stderr.write(`✗ eşleşmeyen: ${updates.unmatched.length}\n`);
  process.stderr.write(`\n✓ Yazılan: ${outPath}\n`);

  // Eşleşmeleri stderr'e listele (debug)
  process.stderr.write('\n=== PLATES eşleşmeleri ===\n');
  for (const u of updates.plates) {
    process.stderr.write(`  id=${u.id} "${u.dbName}" ← "${u.wpTitle}" (${u.score}) → slug: ${u.slug}\n`);
  }
  process.stderr.write('\n=== ACCESSORIES eşleşmeleri (ilk 20) ===\n');
  for (const u of updates.accessories.slice(0, 20)) {
    process.stderr.write(`  id=${u.id} "${u.dbName}" ← "${u.wpTitle}" (${u.score}) → slug: ${u.slug}\n`);
  }
  if (updates.unmatched.length > 0) {
    process.stderr.write('\n=== EŞLEŞMEYENLER ===\n');
    for (const u of updates.unmatched) {
      process.stderr.write(`  "${u.cleanTitle}" (${u.primaryCat}) → en iyi: ${u.bestScore} "${u.bestName}"\n`);
    }
  }
}

main().catch(e => { process.stderr.write(e.stack + '\n'); process.exit(1); });
