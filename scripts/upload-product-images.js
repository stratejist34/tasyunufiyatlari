/**
 * upload-product-images.js
 * ─────────────────────────────────────────────────────────────
 * image-mapping.json'daki eşleşmelere göre:
 *  1. Görseli Supabase Storage'a yükler  (product-images bucket)
 *  2. plates.image_cover alanını günceller
 *
 * Kullanım:
 *   node scripts/upload-product-images.js            → dry-run (sadece rapor)
 *   node scripts/upload-product-images.js --execute  → gerçekten yükle + güncelle
 *
 * Önkoşul:
 *   - scripts/generated/image-mapping.json mevcut olmalı
 *   - Supabase'de "product-images" bucket PUBLIC olarak oluşturulmuş olmalı
 */

const fs   = require('fs');
const path = require('path');

const EXECUTE = process.argv.includes('--execute');

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

const ENV          = loadEnv();
const SUPABASE_URL = ENV.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = ENV.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY .env.local\'da bulunamadı');
  process.exit(1);
}

const BUCKET     = 'product-images';
const IMG_DIR    = path.resolve(__dirname, 'generated/wp-images-clean-webp');
const MAP_FILE   = path.resolve(__dirname, 'generated/image-mapping.json');

// ─── Supabase Storage upload ──────────────────────────────────
async function uploadFile(storagePath, fileBuffer, mimeType) {
  // PUT ile upsert (zaten varsa üzerine yazar)
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      apikey:          SERVICE_KEY,
      Authorization:   `Bearer ${SERVICE_KEY}`,
      'Content-Type':  mimeType,
      'x-upsert':      'true',
    },
    body: fileBuffer,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Storage upload başarısız (${res.status}): ${body}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

// ─── DB güncelleme ────────────────────────────────────────────
async function updateImageCover(table, productId, imageUrl) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${productId}`;
  const res = await fetch(url, {
    method:  'PATCH',
    headers: {
      apikey:          SERVICE_KEY,
      Authorization:   `Bearer ${SERVICE_KEY}`,
      'Content-Type':  'application/json',
      Prefer:          'return=minimal',
    },
    body: JSON.stringify({ image_cover: imageUrl }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DB güncelleme başarısız (${res.status}): ${body}`);
  }
}

// ─── MIME tipi ────────────────────────────────────────────────
function mimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
  return map[ext] ?? 'image/webp';
}

// ─── Ana ─────────────────────────────────────────────────────
async function main() {
  console.log(`\nSupabase Görsel Yükleyici ${EXECUTE ? '(EXECUTE MODE)' : '(DRY RUN)'}`);
  console.log('='.repeat(50));

  if (!fs.existsSync(MAP_FILE)) {
    console.error(`image-mapping.json bulunamadı: ${MAP_FILE}`);
    console.error('Önce çalıştır: node scripts/match-images-to-plates.js');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));

  // Yalnızca görsel atanmış kayıtları işle (override öncelikli)
  const toProcess = mapping.filter(m => m.override || m.image_file);
  const skipped   = mapping.filter(m => !m.override && !m.image_file);

  const plateCount = mapping.filter(m => m.table === 'plates').length;
  const accCount   = mapping.filter(m => m.table === 'accessories').length;
  console.log(`Toplam ürün          : ${mapping.length} (${plateCount} levha + ${accCount} aksesuar)`);
  console.log(`İşlenecek (görselli) : ${toProcess.length}`);
  console.log(`Atlanacak (görselsiz): ${skipped.length}`);
  console.log('');

  if (skipped.length > 0) {
    console.log('── Görseli olmayan ürünler (atlandı) ──');
    for (const m of skipped) {
      console.log(`  - [${m.table}] ${m.brand} ${m.product_name}`);
    }
    console.log('');
  }

  // Bucket kontrolü (sadece execute modunda)
  if (EXECUTE) {
    console.log(`Bucket: ${BUCKET}`);
    console.log('');
  }

  const results = { success: 0, error: 0, skip: 0 };
  const errors  = [];

  for (const m of toProcess) {
    // Slug yoksa atla
    if (!m.slug || m.slug === 'null') {
      console.log(`  ✗ SLUG YOK: ${m.brand} ${m.product_name} (atlandı)`);
      results.skip++;
      continue;
    }

    // override varsa onu kullan, yoksa otomatik eşleşmeyi
    const imageFilename = m.override ?? m.image_file;
    const srcPath       = path.join(IMG_DIR, imageFilename);

    if (!fs.existsSync(srcPath)) {
      console.log(`  ✗ DOSYA YOK: ${imageFilename}`);
      errors.push({ plate: `${m.brand} ${m.product_name}`, error: `Dosya bulunamadı: ${imageFilename}` });
      results.error++;
      continue;
    }

    // Hedef dosya adı: slug + orijinal uzantı
    const ext          = path.extname(imageFilename);
    const storageName  = `${m.slug}${ext}`;
    const publicUrl    = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storageName}`;

    console.log(`  → [${m.table}] ${m.brand} ${m.product_name}`);
    console.log(`     kaynak : ${imageFilename}`);
    console.log(`     hedef  : ${storageName}`);
    console.log(`     url    : ${publicUrl}`);

    if (EXECUTE) {
      try {
        const buffer = fs.readFileSync(srcPath);
        const mime   = mimeType(imageFilename);
        await uploadFile(storageName, buffer, mime);
        await updateImageCover(m.table, m.product_id, publicUrl);
        console.log(`     ✓ Yüklendi + DB güncellendi`);
        results.success++;
      } catch (err) {
        console.log(`     ✗ HATA: ${err.message}`);
        errors.push({ plate: `${m.brand} ${m.product_name}`, error: err.message });
        results.error++;
      }
    } else {
      results.success++; // dry-run'da sayıyoruz
    }
    console.log('');
  }

  // ─── Rapor ───────────────────────────────────────────────
  console.log('='.repeat(50));
  if (EXECUTE) {
    console.log(`✓ Başarılı: ${results.success}`);
    console.log(`✗ Hatalı  : ${results.error}`);
    if (errors.length > 0) {
      console.log('\nHatalı ürünler:');
      for (const e of errors) console.log(`  - ${e.plate}: ${e.error}`);
    }
    console.log('\nKatalog sayfaların görselleri güncellenmiştir.');
    console.log('Dev sunucuyu yeniden başlatmak gerekebilir (next dev).');
  } else {
    console.log(`Dry-run: ${results.success} dosya yüklenebilir`);
    console.log(`\nGerçekten yüklemek için:`);
    console.log(`  node scripts/upload-product-images.js --execute`);
    console.log('');
    console.log('NOT: Supabase\'de "product-images" bucket\'ın PUBLIC olduğundan emin ol.');
    console.log('  Storage → Buckets → product-images → Make Public');
  }
}

main().catch(err => {
  console.error('Hata:', err.message);
  process.exit(1);
});
