/**
 * clean-wp-images.js
 * ─────────────────────────────────────────────────────────────
 * WordPress upload klasöründeki thumbnail/duplicate'leri ayıklar.
 * Orijinal görselleri scripts/generated/wp-images-clean/ klasörüne kopyalar.
 *
 * Kullanım:
 *   node scripts/clean-wp-images.js            → dry-run (sadece rapor)
 *   node scripts/clean-wp-images.js --execute  → gerçekten kopyala
 */

const fs   = require('fs');
const path = require('path');

const EXECUTE = process.argv.includes('--execute');

const SRC_DIR = path.resolve(__dirname, '../wp-imagelar');
const OUT_DIR = path.resolve(__dirname, 'generated/wp-images-clean');

// ─── Ayıklama kuralları ───────────────────────────────────────

// 1. THUMBNAIL: -NNNxNNN soneki (genişlik x yükseklik)
const RE_THUMBNAIL = /-\d+x\d+\.(jpg|jpeg|png|webp|avif|gif)$/i;

// 2. FORMAT DÖNÜŞÜM: .png.webp  .jpeg.webp  .jpg.webp
const RE_FMT_TO_WEBP = /\.(png|jpeg|jpg)\.webp$/i;

// 3. FORMAT DÖNÜŞÜM: -png.avif  -jpeg.avif  -jpg.avif  -webp.avif
const RE_FMT_TO_AVIF = /-(png|jpeg|jpg|webp)\.avif$/i;

// 4. WordPress edit timestamp: -e1234567890123.ext
const RE_WP_EDIT = /-e\d{10,13}\.(jpg|jpeg|png|webp|avif)$/i;

// 5. WooCommerce boyutları: _Large_HASH.webp  _Medium_HASH.webp  _Small_HASH.webp
//    Ama _Photoroom_ içerenler tek versiyonsa sakla (aşağıda ele alınıyor)
const RE_WC_SIZE = /_(Large|Medium|Small|Mediumv\d+)_[a-f0-9]{8,}\.webp$/i;

// 6. Thumbnail başka formatlara dönüştürülmüş: -300x225.png.webp
const RE_THUMB_FMT = /-\d+x\d+\.(png|jpeg|jpg)\.webp$/i;

// 7. .bk. içeren backup dosyalar: Dalmacyali.bk.png → ORIJINAL (sakla)
//    Bu dosyalar PNG'nin orijinali — .bk. marker'ını temizleyerek kopyalanır
const RE_BACKUP = /\.bk\.(png|jpeg|jpg)$/i;

// İzin verilen görsel formatları
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

// ─── Tüm dosyaları tara ───────────────────────────────────────

function walkDir(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, files);
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

// ─── Dosya sınıflandırıcı ────────────────────────────────────

function classify(filePath) {
  const name = path.basename(filePath);
  const ext  = path.extname(name).toLowerCase();

  if (!ALLOWED_EXT.has(ext) && !name.endsWith('.bk.png') && !name.endsWith('.bk.jpeg') && !name.endsWith('.bk.jpg')) {
    return 'skip'; // csv, pdf, gif, zip vs.
  }

  // Thumbnail + format: -300x225.png.webp
  if (RE_THUMB_FMT.test(name)) return 'delete';

  // Format dönüşüm: .png.webp .jpeg.webp
  if (RE_FMT_TO_WEBP.test(name)) return 'delete';

  // Format dönüşüm: -png.avif -jpeg.avif
  if (RE_FMT_TO_AVIF.test(name)) return 'delete';

  // WordPress edit timestamp
  if (RE_WP_EDIT.test(name)) return 'delete';

  // WooCommerce boyut varyantları
  if (RE_WC_SIZE.test(name)) return 'delete';

  // Thumbnail: -150x150.jpg
  if (RE_THUMBNAIL.test(name)) return 'delete';

  // Backup orijinal: .bk.png → sadece BASE'de boyut yoksa orijinal sayılır.
  // 08.1485 klasöründe thumbnail'ların backup'ı da var: anasayfafawori-100x100.bk.png
  // Bu dosyaların BASE'i (-100x100 ile bitiyor) thumbnail backup'ı → sil.
  if (RE_BACKUP.test(name)) {
    const baseBeforeBk = name.replace(/\.bk\.(png|jpeg|jpg)$/i, '');
    if (/-\d+x\d+$/.test(baseBeforeBk)) return 'delete'; // thumbnail backup'ı
    return 'backup_original';
  }

  // Geri kalan → orijinal
  return 'original';
}

// ─── Baz isim hesapla (deduplication için) ───────────────────
// "Dalmacyali-Tasyunu-levha.bk.png" → "Dalmacyali-Tasyunu-levha"
// "Expert-RF150.jpg" → "Expert-RF150"
function baseName(filePath) {
  let name = path.basename(filePath);
  // .bk. temizle
  name = name.replace(/\.bk\.(png|jpeg|jpg)$/i, '');
  // uzantıyı kaldır
  name = name.replace(/\.[^.]+$/, '');
  return name.toLowerCase();
}

// ─── Format öncelik skoru (düşük = daha iyi) ─────────────────
function formatScore(filePath) {
  const name = path.basename(filePath).toLowerCase();
  if (RE_BACKUP.test(name)) return 0;           // .bk.png en iyi
  if (/\.(png)$/i.test(name))   return 1;
  if (/\.(jpg|jpeg)$/i.test(name)) return 2;
  if (/\.webp$/i.test(name))    return 3;
  if (/\.avif$/i.test(name))    return 4;
  return 5;
}

// ─── Ana mantık ───────────────────────────────────────────────

console.log(`\nWP Görsel Ayıklayıcı ${EXECUTE ? '(EXECUTE MODE)' : '(DRY RUN)'}`);
console.log('='.repeat(50));
console.log(`Kaynak : ${SRC_DIR}`);
console.log(`Hedef  : ${OUT_DIR}`);
console.log('');

const allFiles = walkDir(SRC_DIR);
console.log(`Toplam dosya: ${allFiles.length}`);

const stats = { delete: 0, skip: 0, original: 0, backup_original: 0 };
const candidates = new Map(); // baseName → [filePath, ...]

for (const f of allFiles) {
  const cls = classify(f);
  stats[cls] = (stats[cls] || 0) + 1;

  if (cls === 'original' || cls === 'backup_original') {
    const key = baseName(f);
    if (!candidates.has(key)) candidates.set(key, []);
    candidates.get(key).push(f);
  }
}

console.log(`  → Silinecek (thumbnail/format dönüşüm): ${stats.delete}`);
console.log(`  → Atlanacak (jpg olmayan dosya):         ${stats.skip}`);
console.log(`  → Orijinal adayı:                        ${stats.original + stats.backup_original}`);
console.log(`  → Unique baz isim:                       ${candidates.size}`);
console.log('');

// Her baz isim için en iyi versiyonu seç
const winners = [];
const duplicates = [];

for (const [key, files] of candidates) {
  files.sort((a, b) => formatScore(a) - formatScore(b));
  winners.push(files[0]);
  for (let i = 1; i < files.length; i++) duplicates.push(files[i]);
}

console.log(`Seçilen orijinaller: ${winners.length}`);
console.log(`Çıkarılan format duplikatlar: ${duplicates.length}`);
console.log('');

// ─── Kopyalama ────────────────────────────────────────────────

if (EXECUTE) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

let copied = 0;
const conflicts = [];

for (const src of winners) {
  let name = path.basename(src);

  // .bk. marker'ını temizle: Dalmacyali.bk.png → Dalmacyali.png
  name = name.replace(/\.bk\.(png|jpeg|jpg)$/i, (_, ext) => `.${ext}`);

  const dest = path.join(OUT_DIR, name);

  // Hedefte aynı isimde dosya var mı?
  if (EXECUTE && fs.existsSync(dest)) {
    conflicts.push({ src, dest });
    // Boyutu karşılaştır, büyük olanı seç
    const srcSize  = fs.statSync(src).size;
    const destSize = fs.statSync(dest).size;
    if (srcSize > destSize) {
      fs.copyFileSync(src, dest);
    }
    continue;
  }

  if (EXECUTE) {
    fs.copyFileSync(src, dest);
  }
  copied++;
}

// ─── Rapor ───────────────────────────────────────────────────

const reportLines = [
  `=== WP Görsel Ayıklama Raporu ===`,
  `Toplam kaynak dosya  : ${allFiles.length}`,
  `Silinecek (thumb)    : ${stats.delete}`,
  `Seçilen orijinaller  : ${winners.length}`,
  `Kopyalanan           : ${copied}`,
  `Format duplikat      : ${duplicates.length}`,
  `Ad çakışması         : ${conflicts.length}`,
  ``,
  `=== SEÇİLEN ORİJİNALLER ===`,
  ...winners.map(f => `KEEP  ${path.basename(f)}`),
  ``,
  `=== FORMAT DUPLIKATLAR (atlandı) ===`,
  ...duplicates.map(f => `SKIP  ${path.basename(f)}`),
];

const reportPath = path.resolve(__dirname, 'generated/wp-images-report.txt');
if (EXECUTE) {
  fs.mkdirSync(path.resolve(__dirname, 'generated'), { recursive: true });
  fs.writeFileSync(reportPath, reportLines.join('\n'));
  console.log(`Rapor: ${reportPath}`);
  console.log(`\n✓ ${copied} dosya kopyalandı → ${OUT_DIR}`);
} else {
  // Dry-run: ilk 30 winner'ı göster
  console.log('── Seçilecek orijinaller (ilk 30) ──');
  winners.slice(0, 30).forEach(f => console.log(`  KEEP  ${path.basename(f)}`));
  if (winners.length > 30) console.log(`  ... ve ${winners.length - 30} dosya daha`);

  console.log('\n── Format duplikatlar (ilk 15) ──');
  duplicates.slice(0, 15).forEach(f => console.log(`  SKIP  ${path.basename(f)}`));
  if (duplicates.length > 15) console.log(`  ... ve ${duplicates.length - 15} dosya daha`);

  console.log('\n── Thumbnail/format dönüşüm örnekleri (ilk 10) ──');
  allFiles
    .filter(f => classify(f) === 'delete')
    .slice(0, 10)
    .forEach(f => console.log(`  DEL   ${path.basename(f)}`));

  console.log(`\nGerçekten kopyalamak için:\n  node scripts/clean-wp-images.js --execute\n`);
}
