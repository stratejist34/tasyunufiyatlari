// WP XML → DB meta description import
// Eski sitedeki SEO meta description metinlerini plates ve accessories
// tablolarına aktarır. Sadece pure description metni yazılır;
// SEO eklentisi (Yoast) izleri DB'ye gitmez (tüm key isimleri ve
// plugin tokenları sanitization'da elenir).
//
// Eşleşme: WP title → DB name/short_name skoru (match-wp-to-db.js
// ile aynı mantık). Aynı baz ürünün kalınlık varyantları varsa
// description'lar birleştirilir, en iyi skorlu DB satırına yazılır.
//
// Çalıştır:
//   node scripts/import-meta-from-wp.js --dry-run
//   node scripts/import-meta-from-wp.js
//
// Output: scripts/generated/migration-v11c-meta-description-import.sql

const fs   = require('fs');
const path = require('path');
const https = require('https');

const DRY_RUN = process.argv.includes('--dry-run');

// ─── Env load ────────────────────────────────────────────────
(function loadEnv() {
  if (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envPath)) return;
    const env = fs.readFileSync(envPath, 'utf8');
    const url = env.match(/(?:^|\n)\s*NEXT_PUBLIC_SUPABASE_URL\s*=\s*"?([^"\n]+)"?/);
    const key = env.match(/(?:^|\n)\s*SUPABASE_SERVICE_ROLE_KEY\s*=\s*"?([^"\n]+)"?/);
    if (url && !process.env.SUPABASE_URL) process.env.SUPABASE_URL = url[1].trim();
    if (key) process.env.SUPABASE_SERVICE_ROLE_KEY = key[1].trim();
  } catch {}
})();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://latlzskzemmdnotzpscc.supabase.co';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    });
    req.on('error', reject);
  });
}

// ─── XML kaynağı ─────────────────────────────────────────────
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
    const cdataEnd  = block.indexOf(']]>', niceEnd);
    results.push({ nicename });
    pos = cdataEnd + 3;
  }
  return results;
}

// SEO eklentisi postmeta'sından meta description çek (sadece value).
function getSeoMetaDescription(block) {
  const postmetaRe = /<wp:postmeta>([\s\S]*?)<\/wp:postmeta>/g;
  let match;
  while ((match = postmetaRe.exec(block)) !== null) {
    const inner = match[1];
    const key = getCDATA(inner, 'wp:meta_key');
    if (key === '_yoast_wpseo_metadesc') {
      return getCDATA(inner, 'wp:meta_value');
    }
  }
  return '';
}

// ─── Sanitization ─────────────────────────────────────────────
const ENTITY_MAP = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'", '&apos;': "'", '&nbsp;': ' ' };
const FORBIDDEN_TOKENS = /\b(yoast|wpseo|wordpress|wp-|focuskw|linkdex)\b/i;
const MAX_LENGTH = 160;

function sanitize(text) {
  if (!text) return null;
  let s = text;
  s = s.replace(/<[^>]*>/g, ' ');
  s = s.replace(/&[a-z#0-9]+;/gi, (m) => ENTITY_MAP[m.toLowerCase()] ?? ' ');
  s = s.replace(/\s+/g, ' ').trim();
  if (!s) return null;
  if (FORBIDDEN_TOKENS.test(s)) return null;
  if (s.length > MAX_LENGTH) {
    const cut = s.slice(0, MAX_LENGTH);
    const lastSpace = cut.lastIndexOf(' ');
    s = (lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trim() + '…';
  }
  return s;
}

// ─── Skor bazlı eşleşme ──────────────────────────────────────
function normalize(s) {
  return s.toLowerCase()
    .replace(/ş/g,'s').replace(/ç/g,'c').replace(/ğ/g,'g')
    .replace(/ü/g,'u').replace(/ö/g,'o').replace(/ı/g,'i').replace(/İ/g,'i')
    .replace(/[^a-z0-9]+/g,' ')
    .replace(/\s+/g,' ').trim();
}

function stripThicknessFromTitle(t) {
  return t.replace(/\s+\d{1,2}\s*cm$/i, '').trim();
}

function matchScore(wpTitle, dbName, dbShortName) {
  const wp  = normalize(stripThicknessFromTitle(wpTitle));
  const dbN = normalize(dbName || '');
  const dbS = normalize(dbShortName || '');
  if (wp === dbN || wp === dbS) return 100;
  if (dbN.length > 3 && wp.includes(dbN)) return 90;
  if (wp.length > 3 && dbN.includes(wp)) return 85;
  if (dbS.length > 3 && wp.includes(dbS)) return 80;

  const wpWords  = new Set(wp.split(' ').filter(w => w.length > 2));
  const dbWords  = new Set(dbN.split(' ').filter(w => w.length > 2));
  const dbSWords = new Set(dbS.split(' ').filter(w => w.length > 2));
  const allDb    = new Set([...dbWords, ...dbSWords]);
  const overlap  = [...wpWords].filter(w => allDb.has(w)).length;
  const total    = Math.max(wpWords.size, 1);
  return Math.round((overlap / total) * 70);
}

const PLATE_CATS = new Set(['tasyunu-levhalar', 'eps-levhalar']);
const ACC_CATS = new Set(['yapistiricilar','sivalar','kaplamalar','astarlar','boyalar','yardimci-urunler','dubeller','fileler','profiller']);

function classify(item) {
  const cats = getCategories(item, 'product_cat').map(c => c.nicename);
  for (const c of cats) {
    if (PLATE_CATS.has(c)) return 'plates';
    if (ACC_CATS.has(c))   return 'accessories';
  }
  return null;
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  if (!SERVICE_KEY) {
    process.stderr.write('Hata: SUPABASE_SERVICE_KEY env değişkeni gerekli.\n');
    process.exit(1);
  }

  const plates = await fetchJSON(
    `${SUPABASE_URL}/rest/v1/plates?select=id,name,short_name,slug,meta_description&is_active=eq.true&limit=500`
  );
  if (!Array.isArray(plates)) {
    process.stderr.write(`Hata (plates): ${JSON.stringify(plates).slice(0, 300)}\n`);
    process.exit(3);
  }

  let accessories = await fetchJSON(
    `${SUPABASE_URL}/rest/v1/accessories?select=id,name,short_name,slug,meta_description&is_active=eq.true&limit=500`
  );
  let accessoryMetaColumnReady = true;
  if (!Array.isArray(accessories)) {
    if (accessories && /meta_description/.test(accessories.message ?? '')) {
      process.stderr.write('Uyarı: accessories.meta_description kolonu yok.\n');
      process.stderr.write('       migration-v12-accessories-meta.sql Supabase\'e uygulanmamış.\n');
      process.stderr.write('       Accessory tarafı duplicate kontrolü olmadan işlenecek.\n\n');
      accessoryMetaColumnReady = false;
      accessories = await fetchJSON(
        `${SUPABASE_URL}/rest/v1/accessories?select=id,name,short_name,slug&is_active=eq.true&limit=500`
      );
      if (!Array.isArray(accessories)) {
        process.stderr.write(`Hata (accessories fallback): ${JSON.stringify(accessories).slice(0, 300)}\n`);
        process.exit(3);
      }
    } else {
      process.stderr.write(`Hata (accessories): ${JSON.stringify(accessories).slice(0, 300)}\n`);
      process.exit(3);
    }
  }

  process.stderr.write(`DB: ${plates.length} plate, ${accessories.length} accessory\n`);

  // ─── WP item'larından title + description topla ─────────────
  const items = xml.split('<item>').slice(1).map(s => s.split('</item>')[0]);

  const stats = {
    seen: 0,
    notProduct: 0,
    notPublished: 0,
    noTitle: 0,
    noDesc: 0,
    sanitizationFailed: 0,
    noClassify: 0,
    plateMatch: 0,
    accessoryMatch: 0,
    noMatch: 0,
    skippedAlreadyFilled: 0,
  };

  // En iyi skoru tutan map: tableId → { id, slug, dbName, wpTitle, score, description }
  const best = new Map(); // key: "plates:<id>" veya "accessories:<id>"
  const unmatched = [];

  for (const item of items) {
    if (getCDATA(item, 'wp:post_type') !== 'product') { stats.notProduct++; continue; }
    if (getCDATA(item, 'wp:status') !== 'publish')    { stats.notPublished++; continue; }
    stats.seen++;

    const wpTitle = getCDATA(item, 'title');
    if (!wpTitle) { stats.noTitle++; continue; }
    const rawDesc = getSeoMetaDescription(item);
    if (!rawDesc) { stats.noDesc++; continue; }
    const cleanDesc = sanitize(rawDesc);
    if (!cleanDesc) { stats.sanitizationFailed++; continue; }

    const table = classify(item);
    if (!table) { stats.noClassify++; continue; }

    const dbRows = table === 'plates' ? plates : accessories;
    const scored = dbRows.map(row => ({ row, score: matchScore(wpTitle, row.name, row.short_name) }))
                        .sort((a, b) => b.score - a.score);
    const top = scored[0];
    const THRESHOLD = 40;
    if (!top || top.score < THRESHOLD) {
      stats.noMatch++;
      unmatched.push({ wpTitle, table, bestScore: top?.score, bestName: top?.row.name });
      continue;
    }

    const key = `${table}:${top.row.id}`;
    const existing = best.get(key);
    if (!existing || top.score > existing.score) {
      best.set(key, {
        table,
        id: top.row.id,
        slug: top.row.slug,
        dbName: top.row.name,
        wpTitle,
        score: top.score,
        description: cleanDesc,
        existingMeta: top.row.meta_description ?? null,
      });
    }
  }

  // İstatistik tamamlama: best map'ten tablo bazlı say
  for (const u of best.values()) {
    if (u.table === 'plates') {
      if (u.existingMeta) { stats.skippedAlreadyFilled++; continue; }
      stats.plateMatch++;
    } else {
      if (accessoryMetaColumnReady && u.existingMeta) { stats.skippedAlreadyFilled++; continue; }
      stats.accessoryMatch++;
    }
  }

  // ─── Rapor ───────────────────────────────────────────────────
  process.stderr.write('\n─── Rapor ──────────────────────────────────\n');
  process.stderr.write(`Toplam item: ${stats.seen + stats.notProduct + stats.notPublished}\n`);
  process.stderr.write(`  product değil: ${stats.notProduct}, draft/private: ${stats.notPublished}\n`);
  process.stderr.write(`Yayında ürün: ${stats.seen}\n`);
  process.stderr.write(`  title boş:                  ${stats.noTitle}\n`);
  process.stderr.write(`  description boş:            ${stats.noDesc}\n`);
  process.stderr.write(`  sanitization'da atılan:     ${stats.sanitizationFailed}\n`);
  process.stderr.write(`  kategorisi sınıflanamadı:   ${stats.noClassify}\n`);
  process.stderr.write(`  DB'de eşleşme < ${40} skor: ${stats.noMatch}\n`);
  process.stderr.write(`  DB'de zaten dolu, atlandı:  ${stats.skippedAlreadyFilled}\n`);
  process.stderr.write(`\n  → plates UPDATE:      ${stats.plateMatch}\n`);
  process.stderr.write(`  → accessories UPDATE: ${stats.accessoryMatch}\n`);

  if (DRY_RUN) {
    process.stderr.write('\n[dry-run] SQL yazılmadı.\n');
    if (unmatched.length > 0 && unmatched.length <= 30) {
      process.stderr.write('\nDüşük skorlu eşleşmeyenler:\n');
      unmatched.forEach(u => process.stderr.write(`  [${u.table}] "${u.wpTitle}" → en iyi: ${u.bestScore} (${u.bestName})\n`));
    }
    return;
  }

  // ─── SQL üret ────────────────────────────────────────────────
  const escSql = (s) => s.replace(/'/g, "''");
  const lines = [
    '-- ============================================================',
    '-- WP\'den ürün meta description import (skor bazlı eşleşme)',
    `-- Tarih: ${new Date().toISOString().slice(0, 10)}`,
    '-- Kapsam: meta_description boş olan satırlar yazılır;',
    '--         dolu satırlar üzerine yazılmaz.',
    '-- ============================================================',
    '',
    `-- plates UPDATE: ${stats.plateMatch}`,
    `-- accessories UPDATE: ${stats.accessoryMatch}`,
    '',
    '-- ─── plates ─────────────────────────────────────────────────',
  ];

  for (const u of best.values()) {
    if (u.table !== 'plates' || u.existingMeta) continue;
    lines.push(`-- ${u.dbName} ← "${u.wpTitle}" (skor: ${u.score})`);
    lines.push(`UPDATE plates SET meta_description = '${escSql(u.description)}' WHERE id = ${u.id} AND (meta_description IS NULL OR meta_description = '');`);
  }

  lines.push('', '-- ─── accessories ────────────────────────────────────────────');
  for (const u of best.values()) {
    if (u.table !== 'accessories') continue;
    if (accessoryMetaColumnReady && u.existingMeta) continue;
    lines.push(`-- ${u.dbName} ← "${u.wpTitle}" (skor: ${u.score})`);
    lines.push(`UPDATE accessories SET meta_description = '${escSql(u.description)}' WHERE id = ${u.id} AND (meta_description IS NULL OR meta_description = '');`);
  }

  const sqlText = lines.join('\n') + '\n';

  // Token-leak check (script kendi yorumlarındaki nötr başlık dışında)
  const sqlBody = lines.filter(l => !l.startsWith('--')).join('\n');
  if (FORBIDDEN_TOKENS.test(sqlBody)) {
    process.stderr.write('\nHata: Üretilen SQL içinde plugin token sızıntısı tespit edildi. Çıktı yazılmadı.\n');
    process.exit(2);
  }

  const outDir = path.join(__dirname, 'generated');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'migration-v11c-meta-description-import.sql');
  fs.writeFileSync(outPath, sqlText, 'utf8');

  process.stderr.write(`\n✓ Yazılan: ${outPath}\n`);
}

main().catch(e => { process.stderr.write(e.stack + '\n'); process.exit(1); });
