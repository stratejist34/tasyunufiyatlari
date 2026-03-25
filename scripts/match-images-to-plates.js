/**
 * match-images-to-plates.js
 * ─────────────────────────────────────────────────────────────
 * wp-images-clean-webp/ klasöründeki görselleri DB'deki ürünlerle eşleştirir.
 * plates + accessories tablolarını kapsar.
 * Çıktı: scripts/generated/image-mapping.json
 *
 * Kullanım:
 *   node scripts/match-images-to-plates.js
 *
 * Çıktıyı gözden geçir, sonra upload-product-images.js ile yükle.
 */

const fs   = require('fs');
const path = require('path');

// ─── .env.local okuyucu ───────────────────────────────────────
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  const lines   = fs.readFileSync(envPath, 'utf-8').split('\n');
  const env     = {};
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)="?(.+?)"?\s*$/);
    if (m) env[m[1]] = m[2].trim().replace(/^"(.*)"$/, '$1');
  }
  return env;
}

const ENV           = loadEnv();
const SUPABASE_URL  = ENV.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY   = ENV.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY .env.local\'da bulunamadı');
  process.exit(1);
}

const IMG_DIR  = path.resolve(__dirname, 'generated/wp-images-clean-webp');
const OUT_FILE = path.resolve(__dirname, 'generated/image-mapping.json');

// ─── Normalizer ───────────────────────────────────────────────
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenize(str) {
  return normalize(str).split(/\s+/).filter(Boolean);
}

// Sıradan kelimeler — eşleştirmede ağırlığı düşük
const COMMON = new Set([
  'tasyunu', 'levha', 'isi', 'yalitim', 'levhasi', 'yalitimli',
  'eps', 'plaka', 'panel', 'kg', 'mm', 'cm', 'webp', 'png',
  'photoroom', 'medium', 'large', 'small', 'aksesuar',
]);

function score(productTokens, imageTokens) {
  const imgSet = new Set(imageTokens);
  let match = 0;
  let weight = 0;
  for (const t of productTokens) {
    if (t.length < 2) continue;
    const w = COMMON.has(t) ? 0.3 : 1.0;
    weight += w;
    if (imgSet.has(t)) match += w;
  }
  if (weight === 0) return 0;
  return match / weight;
}

// ─── DB sorguları ─────────────────────────────────────────────
async function dbGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey:         SERVICE_KEY,
      Authorization:  `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`DB sorgusu başarısız (${path}): ${res.status} ${await res.text()}`);
  return await res.json();
}

async function fetchAllProducts() {
  const [plates, accessories] = await Promise.all([
    dbGet('plates?select=id,name,slug,brands(name)&order=id'),
    dbGet('accessories?select=id,name,slug,brands(name)&order=id'),
  ]);

  const all = [
    ...plates.map(r => ({
      ...r,
      table:     'plates',
      brandName: Array.isArray(r.brands) ? (r.brands[0]?.name ?? '') : (r.brands?.name ?? ''),
    })),
    ...accessories.map(r => ({
      ...r,
      table:     'accessories',
      brandName: Array.isArray(r.brands) ? (r.brands[0]?.name ?? '') : (r.brands?.name ?? ''),
    })),
  ];
  return all;
}

// ─── Ana ─────────────────────────────────────────────────────
async function main() {
  console.log('\nGörsel Eşleştirici (plates + accessories)');
  console.log('='.repeat(50));

  // 1. Görsel dosyaları oku
  const imageFiles = fs.readdirSync(IMG_DIR)
    .filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f));
  console.log(`Görsel dosya sayısı: ${imageFiles.length}`);

  const imageTokenMap = imageFiles.map(f => ({
    filename: f,
    tokens:   tokenize(path.basename(f, path.extname(f))),
  }));

  // 2. DB'den tüm ürünleri çek
  console.log('DB\'den ürünler çekiliyor...');
  const products = await fetchAllProducts();
  const plateCount = products.filter(p => p.table === 'plates').length;
  const accCount   = products.filter(p => p.table === 'accessories').length;
  console.log(`  plates      : ${plateCount}`);
  console.log(`  accessories : ${accCount}`);
  console.log(`  toplam      : ${products.length}`);
  console.log('');

  // 3. Her ürün için en iyi eşleşmeyi bul
  const mapping = [];
  const THRESHOLD = 0.35;

  for (const product of products) {
    const fullName      = `${product.brandName} ${product.name}`;
    const productTokens = tokenize(fullName);

    let best      = null;
    let bestScore = 0;

    for (const img of imageTokenMap) {
      const s = score(productTokens, img.tokens);
      if (s > bestScore) {
        bestScore = s;
        best = img.filename;
      }
    }

    mapping.push({
      table:        product.table,         // 'plates' veya 'accessories'
      product_id:   product.id,
      product_name: product.name,
      brand:        product.brandName,
      slug:         product.slug,
      image_file:   bestScore >= THRESHOLD ? best : null,
      score:        Math.round(bestScore * 100),
      confident:    bestScore >= THRESHOLD,
      override:     null,                  // manuel düzeltme için
    });
  }

  // 4. Sırala: önce yüksek skor
  mapping.sort((a, b) => b.score - a.score);

  // 5. JSON çıktı
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(mapping, null, 2));

  // 6. Rapor
  const confident = mapping.filter(m => m.confident).length;
  const uncertain = mapping.filter(m => !m.confident).length;

  console.log('Eşleşme raporu:');
  console.log(`  ✓ Güvenli eşleşme  : ${confident}`);
  console.log(`  ? Belirsiz/eşleşmez: ${uncertain}`);
  console.log('');

  console.log('── PLATES ──');
  for (const m of mapping.filter(p => p.table === 'plates')) {
    const icon = m.confident ? '✓' : '?';
    console.log(`  ${icon} [${String(m.score).padStart(3)}%] ${m.brand} ${m.product_name}`);
    console.log(`       → ${m.image_file ?? '(eşleşme yok)'}`);
  }

  console.log('');
  console.log('── ACCESSORIES ──');
  for (const m of mapping.filter(p => p.table === 'accessories')) {
    const icon = m.confident ? '✓' : '?';
    console.log(`  ${icon} [${String(m.score).padStart(3)}%] ${m.brand} ${m.product_name}`);
    console.log(`       → ${m.image_file ?? '(eşleşme yok)'}`);
  }

  console.log('');
  console.log(`Çıktı: ${OUT_FILE}`);
  console.log('');
  console.log('Sonraki adım:');
  console.log('  1. image-mapping.json dosyasını incele');
  console.log('  2. Yanlış eşleşmelerde "override" alanını düzenle:');
  console.log('     "override": "dogru-gorsel-adi.webp"');
  console.log('  3. Görseli olmayan ürünlerde override ile ekle, ya da null bırak');
  console.log('  4. Onayladıktan sonra: node scripts/upload-product-images.js --execute');
}

main().catch(err => {
  console.error('Hata:', err.message);
  process.exit(1);
});
