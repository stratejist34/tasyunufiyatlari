// WP XML → DB catalog_description import
// Eski sitedeki uzun ürün açıklamalarını (<content:encoded>) plates ve
// accessories tablolarındaki catalog_description kolonuna aktarır.
// Sanitize: HTML strip + entity decode + Yoast/wpseo token guard + length cap.
//
// Çalıştır:
//   node scripts/import-content-from-wp.js --dry-run
//   node scripts/import-content-from-wp.js
//
// Output: scripts/generated/migration-v11d-catalog-description-import.sql

const fs = require('fs');
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
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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

const xml = fs.readFileSync(
  path.join(__dirname, '..', 'tasyunufiyatlari.WP.Urunler2026-03-20.xml'),
  'utf8'
);

// CDATA'lı tag içeriği — namespace'li tag'leri (örn. content:encoded) destekler
function getCDATA(block, tag) {
  const open = `<${tag}><![CDATA[`;
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
    const niceEnd = block.indexOf('"', niceStart);
    const nicename = block.slice(niceStart, niceEnd);
    const cdataEnd = block.indexOf(']]>', niceEnd);
    results.push({ nicename });
    pos = cdataEnd + 3;
  }
  return results;
}

// ─── Sanitization ─────────────────────────────────────────────
const ENTITY_MAP = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#039;': "'", '&apos;': "'", '&nbsp;': ' ',
  '&ouml;': 'ö', '&uuml;': 'ü', '&Ouml;': 'Ö', '&Uuml;': 'Ü',
  '&ccedil;': 'ç', '&Ccedil;': 'Ç', '&scaron;': 'š',
  '&hellip;': '…', '&mdash;': '—', '&ndash;': '–',
  '&ldquo;': '"', '&rdquo;': '"', '&lsquo;': "'", '&rsquo;': "'",
};
const FORBIDDEN_TOKENS = /\b(yoast|wpseo|wordpress|wp-|focuskw|linkdex)\b/i;
const MAX_LENGTH = 1500; // catalog_description daha uzun olabilir; SEO meta'dan farklı

function sanitize(text) {
  if (!text) return null;
  let s = text;
  // Block-level tag'leri satır sonu olarak değiştir, sonra hepsini sök
  s = s.replace(/<\/?(p|br|li|h[1-6]|div|tr|td)[^>]*>/gi, ' ');
  s = s.replace(/<[^>]*>/g, '');
  // Entity decode
  s = s.replace(/&[a-z#0-9]+;/gi, (m) => {
    const lower = m.toLowerCase();
    if (ENTITY_MAP[lower]) return ENTITY_MAP[lower];
    if (m.startsWith('&#')) {
      const code = parseInt(m.slice(2, -1), 10);
      if (Number.isFinite(code)) return String.fromCharCode(code);
    }
    return ' ';
  });
  // %%token%% Yoast placeholder'larını sök
  s = s.replace(/%%[a-z_]+%%/gi, '');
  // Çoklu boşluk → tek
  s = s.replace(/\s+/g, ' ').trim();
  if (!s) return null;
  if (FORBIDDEN_TOKENS.test(s)) return null;
  if (s.length > MAX_LENGTH) {
    const cut = s.slice(0, MAX_LENGTH);
    const lastSpace = cut.lastIndexOf(' ');
    s = (lastSpace > 800 ? cut.slice(0, lastSpace) : cut).trim() + '…';
  }
  return s;
}

// ─── Skor bazlı eşleşme ──────────────────────────────────────
function normalize(s) {
  return s.toLowerCase()
    .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ı/g, 'i').replace(/İ/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function stripThicknessFromTitle(t) {
  return t.replace(/\s+\d{1,2}\s*cm$/i, '').trim();
}

function matchScore(wpTitle, dbName, dbShortName) {
  const wp = normalize(stripThicknessFromTitle(wpTitle));
  const dbN = normalize(dbName || '');
  const dbS = normalize(dbShortName || '');
  if (wp === dbN || wp === dbS) return 100;
  if (dbN.length > 3 && wp.includes(dbN)) return 90;
  if (wp.length > 3 && dbN.includes(wp)) return 85;
  if (dbS.length > 3 && wp.includes(dbS)) return 80;
  const wpWords = new Set(wp.split(' ').filter(w => w.length > 2));
  const dbWords = new Set(dbN.split(' ').filter(w => w.length > 2));
  const dbSWords = new Set(dbS.split(' ').filter(w => w.length > 2));
  const allDb = new Set([...dbWords, ...dbSWords]);
  const overlap = [...wpWords].filter(w => allDb.has(w)).length;
  const total = Math.max(wpWords.size, 1);
  return Math.round((overlap / total) * 70);
}

const PLATE_CATS = new Set(['tasyunu-levhalar', 'eps-levhalar']);
const ACC_CATS = new Set(['yapistiricilar', 'sivalar', 'kaplamalar', 'astarlar', 'boyalar', 'yardimci-urunler', 'dubeller', 'fileler', 'profiller']);

function classify(item) {
  const cats = getCategories(item, 'product_cat').map(c => c.nicename);
  for (const c of cats) {
    if (PLATE_CATS.has(c)) return 'plates';
    if (ACC_CATS.has(c)) return 'accessories';
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
    `${SUPABASE_URL}/rest/v1/plates?select=id,name,short_name,slug,catalog_description&is_active=eq.true&limit=500`
  );
  if (!Array.isArray(plates)) {
    process.stderr.write(`Hata (plates): ${JSON.stringify(plates).slice(0, 300)}\n`);
    process.exit(3);
  }

  const accessories = await fetchJSON(
    `${SUPABASE_URL}/rest/v1/accessories?select=id,name,short_name,slug,catalog_description&is_active=eq.true&limit=500`
  );
  if (!Array.isArray(accessories)) {
    process.stderr.write(`Hata (accessories): ${JSON.stringify(accessories).slice(0, 300)}\n`);
    process.exit(3);
  }

  process.stderr.write(`DB: ${plates.length} plate, ${accessories.length} accessory\n`);

  const items = xml.split('<item>').slice(1).map(s => s.split('</item>')[0]);

  const stats = {
    seen: 0, notProduct: 0, notPublished: 0, noTitle: 0, noContent: 0,
    sanitizationFailed: 0, noClassify: 0, plateMatch: 0, accessoryMatch: 0,
    noMatch: 0, skippedAlreadyFilled: 0,
  };

  const best = new Map(); // key: "plates:<id>" veya "accessories:<id>"
  const unmatched = [];

  for (const item of items) {
    if (getCDATA(item, 'wp:post_type') !== 'product') { stats.notProduct++; continue; }
    if (getCDATA(item, 'wp:status') !== 'publish') { stats.notPublished++; continue; }
    stats.seen++;

    const wpTitle = getCDATA(item, 'title');
    if (!wpTitle) { stats.noTitle++; continue; }

    // content:encoded uzun body, excerpt kısa özet — ikisini birleştir
    const content = getCDATA(item, 'content:encoded');
    const excerpt = getCDATA(item, 'excerpt:encoded');
    const rawBody = (content || '') + (excerpt && excerpt !== content ? '\n\n' + excerpt : '');
    if (!rawBody.trim()) { stats.noContent++; continue; }

    const cleanBody = sanitize(rawBody);
    if (!cleanBody) { stats.sanitizationFailed++; continue; }

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
    if (!existing || top.score > existing.score || cleanBody.length > existing.body.length) {
      best.set(key, {
        table,
        id: top.row.id,
        slug: top.row.slug,
        dbName: top.row.name,
        wpTitle,
        score: top.score,
        body: cleanBody,
        existingCatalog: top.row.catalog_description ?? null,
      });
    }
  }

  for (const u of best.values()) {
    if (u.existingCatalog) { stats.skippedAlreadyFilled++; continue; }
    if (u.table === 'plates') stats.plateMatch++;
    else stats.accessoryMatch++;
  }

  // ─── Rapor ───────────────────────────────────────────────────
  process.stderr.write('\n─── Rapor ──────────────────────────────────\n');
  process.stderr.write(`Toplam item: ${stats.seen + stats.notProduct + stats.notPublished}\n`);
  process.stderr.write(`  product değil: ${stats.notProduct}, draft/private: ${stats.notPublished}\n`);
  process.stderr.write(`Yayında ürün: ${stats.seen}\n`);
  process.stderr.write(`  title boş:                  ${stats.noTitle}\n`);
  process.stderr.write(`  content boş:                ${stats.noContent}\n`);
  process.stderr.write(`  sanitization'da atılan:     ${stats.sanitizationFailed}\n`);
  process.stderr.write(`  kategorisi sınıflanamadı:   ${stats.noClassify}\n`);
  process.stderr.write(`  DB'de eşleşme < 40 skor:    ${stats.noMatch}\n`);
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

  const escSql = (s) => s.replace(/'/g, "''");
  const lines = [
    '-- ============================================================',
    '-- WP\'den catalog_description import (ürün gövde açıklaması)',
    `-- Tarih: ${new Date().toISOString().slice(0, 10)}`,
    '-- Kapsam: catalog_description boş satırlar yazılır;',
    '--         dolu satırlar üzerine yazılmaz.',
    '-- ============================================================',
    '',
    `-- plates UPDATE: ${stats.plateMatch}`,
    `-- accessories UPDATE: ${stats.accessoryMatch}`,
    '',
    '-- ─── plates ─────────────────────────────────────────────────',
  ];

  for (const u of best.values()) {
    if (u.table !== 'plates' || u.existingCatalog) continue;
    lines.push(`-- ${u.dbName} ← "${u.wpTitle}" (skor: ${u.score}, ${u.body.length} char)`);
    lines.push(`UPDATE plates SET catalog_description = '${escSql(u.body)}' WHERE id = ${u.id} AND (catalog_description IS NULL OR catalog_description = '');`);
  }

  lines.push('', '-- ─── accessories ────────────────────────────────────────────');
  for (const u of best.values()) {
    if (u.table !== 'accessories' || u.existingCatalog) continue;
    lines.push(`-- ${u.dbName} ← "${u.wpTitle}" (skor: ${u.score}, ${u.body.length} char)`);
    lines.push(`UPDATE accessories SET catalog_description = '${escSql(u.body)}' WHERE id = ${u.id} AND (catalog_description IS NULL OR catalog_description = '');`);
  }

  const sqlText = lines.join('\n') + '\n';
  const sqlBody = lines.filter(l => !l.startsWith('--')).join('\n');
  if (FORBIDDEN_TOKENS.test(sqlBody)) {
    process.stderr.write('\nHata: Üretilen SQL içinde plugin token sızıntısı tespit edildi. Çıktı yazılmadı.\n');
    process.exit(2);
  }

  const outDir = path.join(__dirname, 'generated');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'migration-v11d-catalog-description-import.sql');
  fs.writeFileSync(outPath, sqlText, 'utf8');

  process.stderr.write(`\n✓ Yazılan: ${outPath}\n`);
}

main().catch(e => { process.stderr.write(e.stack + '\n'); process.exit(1); });
