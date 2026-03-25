// Mevcut DB kayıtlarından deterministik slug + sales_mode üretici
// node scripts/generate-slugs-from-db.js
// Çıktı: scripts/generated/migration-v11d-db-slugs.sql

const fs   = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://latlzskzemmdnotzpscc.supabase.co';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY || '';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

// ─── Slug normalize ───────────────────────────────────────────
function toSlug(s) {
  return (s || '')
    .replace(/ş/g,'s').replace(/Ş/g,'s')
    .replace(/ç/g,'c').replace(/Ç/g,'c')
    .replace(/ğ/g,'g').replace(/Ğ/g,'g')
    .replace(/ü/g,'u').replace(/Ü/g,'u')
    .replace(/ö/g,'o').replace(/Ö/g,'o')
    .replace(/ı/g,'i').replace(/İ/g,'i')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Çakışma önleyici
const used = new Set();
function uniqueSlug(base) {
  if (!used.has(base)) { used.add(base); return base; }
  let i = 2;
  while (used.has(`${base}-${i}`)) i++;
  used.add(`${base}-${i}`);
  return `${base}-${i}`;
}

// ─── Kural tablosu ────────────────────────────────────────────
// Plates: hepsi quote_only / quote_required
// Accessories: type'a göre
const ACC_RULES = {
  'yapistirici':  { sales_mode: 'single_or_quote', pricing: 'quote_required' },
  'siva':         { sales_mode: 'single_or_quote', pricing: 'quote_required' },
  'astar':        { sales_mode: 'single_or_quote', pricing: 'quote_required' },
  'kaplama':      { sales_mode: 'single_or_quote', pricing: 'quote_required' },
  'dubel':        { sales_mode: 'system_only',     pricing: 'hidden' },
  'file':         { sales_mode: 'system_only',     pricing: 'hidden' },
  'fileli-kose':  { sales_mode: 'system_only',     pricing: 'hidden' },
};

// ─── Slug stratejisi ─────────────────────────────────────────
// Plates:  {brand}-{short_name}-{material}
// Accessories: {brand}-{short_name_or_derived}
//   Dübel: {brand}-{plastik|celik}-dubel-{length_cm}cm
//   Others: {brand}-{type_slug}  veya  {brand}-{short_name}

function plateSlag(brand, shortName, matSlug) {
  return uniqueSlug(`${toSlug(brand)}-${toSlug(shortName)}-${toSlug(matSlug)}`);
}

function accSlug(brandName, typeSlug, accName, shortName, dowelLength) {
  const b = toSlug(brandName);

  if (typeSlug === 'dubel' && dowelLength != null) {
    // Normalize length: TEKNO stores in mm (100, 115, 120, 155), others in cm (9.5, 11.5...)
    const cmRaw = dowelLength >= 20 ? dowelLength / 10 : dowelLength;
    const cm = cmRaw.toString().replace('.', '');
    // plastik vs celik
    const kind = /celik|çelik/i.test(accName) ? 'celik' : 'plastik';
    return uniqueSlug(`${b}-${kind}-dubel-${cm}mm`);
  }

  // For other types, use short_name if it's distinct enough; else type_slug
  const sn = toSlug(shortName || '');
  if (sn && sn.length > 2 && sn !== typeSlug) {
    return uniqueSlug(`${b}-${sn}`);
  }
  return uniqueSlug(`${b}-${typeSlug}`);
}

async function main() {
  const [plates, accessories] = await Promise.all([
    fetchJSON(`${SUPABASE_URL}/rest/v1/plates?select=id,name,short_name,slug,brands(name),material_types(name,slug)&is_active=eq.true&order=id&limit=200`),
    fetchJSON(`${SUPABASE_URL}/rest/v1/accessories?select=id,name,short_name,slug,brands(name),accessory_types(name,slug),dowel_length&is_active=eq.true&order=id&limit=200`),
  ]);

  const sql = [
    '-- =================================================================',
    '-- Migration v11d: DB kaynağından deterministik slug + kural atama',
    '-- Tarih: 2026-03-20',
    '-- Yöntem: DB name/short_name/brand/type → slug üretimi (WP eşleştirme yok)',
    '-- =================================================================',
    '',
    '-- Sadece slug IS NULL olan satırlar güncellenir (idempotent)',
    '',
  ];

  // ─── PLATES ──────────────────────────────────────────────────
  sql.push('-- ─── PLATES (15 kayıt) ────────────────────────────────────────');
  let plateCount = 0;
  for (const p of plates) {
    if (p.slug) { sql.push(`-- id=${p.id} zaten slug var: ${p.slug}`); continue; }
    const brand   = (p.brands || {}).name || '';
    const matSlug = (p.material_types || {}).slug || 'levha';
    const slug    = plateSlag(brand, p.short_name || p.name, matSlug);
    sql.push(`-- id=${p.id}: ${p.name}`);
    sql.push(
      `UPDATE plates SET` +
      ` slug = '${slug}',` +
      ` sales_mode = 'quote_only',` +
      ` pricing_visibility_mode = 'quote_required'` +
      ` WHERE id = ${p.id} AND slug IS NULL;`
    );
    sql.push('');
    plateCount++;
  }

  // ─── ACCESSORIES ─────────────────────────────────────────────
  sql.push('', '-- ─── ACCESSORIES (69 kayıt) ──────────────────────────────────');
  let accCount = 0;
  for (const a of accessories) {
    if (a.slug) { sql.push(`-- id=${a.id} zaten slug var: ${a.slug}`); continue; }
    const brand    = (a.brands || {}).name || '';
    const typeSlug = (a.accessory_types || {}).slug || 'aksesuar';
    const rules    = ACC_RULES[typeSlug] || { sales_mode: 'single_or_quote', pricing: 'quote_required' };
    const slug     = accSlug(brand, typeSlug, a.name, a.short_name, a.dowel_length);
    sql.push(`-- id=${a.id}: ${a.name}`);
    sql.push(
      `UPDATE accessories SET` +
      ` slug = '${slug}',` +
      ` sales_mode = '${rules.sales_mode}',` +
      ` pricing_visibility_mode = '${rules.pricing}'` +
      ` WHERE id = ${a.id} AND slug IS NULL;`
    );
    sql.push('');
    accCount++;
  }

  sql.push(`-- Toplam: ${plateCount} plate + ${accCount} accessory güncellendi`);

  const outDir  = path.join(__dirname, 'generated');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'migration-v11d-db-slugs.sql');
  fs.writeFileSync(outPath, sql.join('\n'), 'utf8');

  process.stderr.write(`✓ ${plateCount} plate + ${accCount} accessory\n`);
  process.stderr.write(`✓ Yazılan: ${outPath}\n`);
}

main().catch(e => { process.stderr.write(e.stack + '\n'); process.exit(1); });
