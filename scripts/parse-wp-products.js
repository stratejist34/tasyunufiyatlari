// WordPress XML'den slug + sales_mode SQL üreticisi
// node scripts/parse-wp-products.js > scripts/generated/migration-v11-slugs.sql

const fs = require('fs');
const path = require('path');

const xml = fs.readFileSync(
  path.join(__dirname, '..', 'tasyunufiyatlari.WP.Urunler2026-03-20.xml'),
  'utf8'
);

// ─── Yardımcı ─────────────────────────────────────────────

function getCDATA(block, tag) {
  // tag içinde : olabilir (wp:post_name), dolayısı ile RegExp yerine string split kullan
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
    const cdataStart = block.indexOf('<![CDATA[', niceEnd);
    const cdataEnd   = block.indexOf(']]>', cdataStart);
    const label = cdataStart !== -1 ? block.slice(cdataStart + 9, cdataEnd) : '';
    results.push({ nicename, label });
    pos = cdataEnd + 3;
  }
  return results;
}

// ─── Kategori → sales_mode eşlemesi ──────────────────────

const CATEGORY_SALES_MODE = {
  'eps-levhalar':      'quote_only',
  'tasyunu-levhalar':  'quote_only',
  'yapistiricilar':    'single_or_quote',
  'sivalar':           'single_or_quote',
  'kaplamalar':        'single_or_quote',
  'astarlar':          'single_or_quote',
  'boyalar':           'single_or_quote',
  'yardimci-urunler':  'single_or_quote',
  'dubeller':          'system_only',
  'fileler':           'system_only',
  'profiller':         'system_only',
};

const CATEGORY_PRICING_MODE = {
  'eps-levhalar':      'quote_required',
  'tasyunu-levhalar':  'quote_required',
  'yapistiricilar':    'quote_required',
  'sivalar':           'quote_required',
  'kaplamalar':        'quote_required',
  'astarlar':          'quote_required',
  'boyalar':           'quote_required',
  'yardimci-urunler':  'quote_required',
  'dubeller':          'hidden',
  'fileler':           'hidden',
  'profiller':         'hidden',
};

// ─── Türkçe slug normalize ────────────────────────────────

function normalizeTR(s) {
  return s
    .replace(/ş/g,'s').replace(/Ş/g,'s')
    .replace(/ç/g,'c').replace(/Ç/g,'c')
    .replace(/ğ/g,'g').replace(/Ğ/g,'g')
    .replace(/ü/g,'u').replace(/Ü/g,'u')
    .replace(/ö/g,'o').replace(/Ö/g,'o')
    .replace(/ı/g,'i').replace(/İ/g,'i');
}

// WP slug'dan kalınlık suffix'ini temizle: "-2-cm", "-10-cm" gibi
function stripThickness(slug) {
  // Sondaki -XX-cm veya -XXcm kalıplarını çıkar (1-2 haneli sayılar)
  return slug
    .replace(/-\d{1,2}-cm$/, '')
    .replace(/-\d{1,2}cm$/, '');
}

// Aynı slug için çakışma tespiti
const usedSlugs = new Set();
function uniqueSlug(base) {
  if (!usedSlugs.has(base)) { usedSlugs.add(base); return base; }
  let i = 2;
  while (usedSlugs.has(`${base}-${i}`)) i++;
  usedSlugs.add(`${base}-${i}`);
  return `${base}-${i}`;
}

// ─── XML parse ───────────────────────────────────────────

const items = xml.split('<item>').slice(1).map(s => s.split('</item>')[0]);

const products = [];
for (const item of items) {
  const postType = getCDATA(item, 'wp:post_type');
  if (postType !== 'product') continue;
  const status = getCDATA(item, 'wp:status');
  if (status !== 'publish') continue;

  const title   = getCDATA(item, 'title');
  const wpSlug  = getCDATA(item, 'wp:post_name');
  const cats    = getCategories(item, 'product_cat');
  const brands  = getCategories(item, 'pwb-brand');

  const catNicenames = cats.map(c => c.nicename);
  const brandName    = brands.length > 0 ? brands[0].label : '';
  const brandSlug    = brands.length > 0 ? brands[0].nicename : '';

  // Birincil kategori belirle
  const primaryCat = catNicenames.find(c => CATEGORY_SALES_MODE[c]) ?? catNicenames[0] ?? 'yardimci-urunler';
  const salesMode    = CATEGORY_SALES_MODE[primaryCat]  ?? 'quote_only';
  const pricingMode  = CATEGORY_PRICING_MODE[primaryCat] ?? 'quote_required';

  // Slug: WP slug'dan kalınlık suffix'ini temizle
  const baseSlug = stripThickness(wpSlug);

  products.push({ title, wpSlug, baseSlug, brandName, brandSlug, catNicenames, primaryCat, salesMode, pricingMode });
}

// ─── Grupla: aynı baseSlug → tek ürün ────────────────────

const grouped = new Map();
for (const p of products) {
  if (!grouped.has(p.baseSlug)) {
    grouped.set(p.baseSlug, p);
  }
  // Aynı base slug'a sahip birden fazla WP ürün (farklı kalınlıklar) → sadece ilkini al
}

// ─── SQL üret ────────────────────────────────────────────

const lines = [
  '-- ============================================================',
  '-- Migration v11b: WP slug + sales_mode + pricing_visibility_mode',
  '-- plates tablosuna WordPress\'ten alınan slug verileri',
  '-- Güncelleme: plates.short_name (ILIKE) veya plates.name ile eşleşme',
  '-- ============================================================',
  '',
  '-- NOT: Bu SQL ile eşleşen kayıtlar güncellenir.',
  '-- Eşleşmeyen kayıtlar (sonuç 0 satır) görmezden gelinir.',
  '-- Migration sonrası admin\'den kalan slug\'lar manuel doldurulabilir.',
  '',
];

// Kategori bazlı bölümler
const byCategory = {};
for (const [baseSlug, p] of grouped) {
  if (!byCategory[p.primaryCat]) byCategory[p.primaryCat] = [];
  byCategory[p.primaryCat].push({ ...p, finalSlug: baseSlug });
}

for (const [cat, items] of Object.entries(byCategory)) {
  lines.push(`-- ─── ${cat} (${items.length} ürün) ─────────────────────────────────────────`);
  for (const p of items) {
    // Title'dan kalınlık kısmını çıkar (eşleşme için)
    // "Fawori Karbonlu Isı Yalıtım Levhası 2 cm" → "Fawori Karbonlu Isı Yalıtım Levhası"
    const cleanTitle = p.title.replace(/\s+\d{1,2}\s*cm$/i, '').trim();
    const escaped = cleanTitle.replace(/'/g, "''");
    const escapedSlug = p.finalSlug.replace(/'/g, "''");
    lines.push(
      `UPDATE plates SET slug = '${escapedSlug}', sales_mode = '${p.salesMode}', pricing_visibility_mode = '${p.pricingMode}'` +
      ` WHERE slug IS NULL AND (name ILIKE '%${escaped}%' OR short_name ILIKE '%${escaped}%')` +
      ` AND NOT EXISTS (SELECT 1 FROM plates WHERE slug = '${escapedSlug}');`
    );
  }
  lines.push('');
}

// ─── Output ──────────────────────────────────────────────

const outputDir = path.join(__dirname, 'generated');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const outputPath = path.join(outputDir, 'migration-v11b-wp-slugs.sql');
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');

console.error(`✓ ${grouped.size} ürün grubu işlendi`);
console.error(`✓ Yazılan: ${outputPath}`);

// Özet
const catSummary = {};
for (const [,p] of grouped) {
  catSummary[p.primaryCat] = (catSummary[p.primaryCat] || 0) + 1;
}
console.error('\nKategori özeti:');
for (const [cat, count] of Object.entries(catSummary)) {
  console.error(`  ${cat}: ${count} ürün → sales_mode=${CATEGORY_SALES_MODE[cat]}`);
}
