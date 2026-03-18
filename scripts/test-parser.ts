import { parseManualText } from '../lib/utils/pdfParser';

// Verdiğiniz Tekno fiyat listesi
const sampleText = `
TEKNOİZOFİX - 25 KG
Isı yalıtım levha yapıştırıcı
Fiyat: 8,80 TL/KG

TEKNOİZOSIVA - 25 KG
Isı yalıtım levha üstü sıvası
Fiyat: 9,70 TL/KG

TEKNODEKO İNCE (1,2 MM) - 25 KG
İnce tane dokulu dekoratif sıva
Fiyat: 12,20 TL/KG

TEKNODEKO KALIN (2 MM) - 25 KG
Kalın tane dokulu dekoratif sıva
Fiyat: 12,20 TL/KG

FİLE 4X4 - 160 GR
Mantolama filesi
Fiyat: 32,00 TL/M²

FİLELİ PVC KÖŞE PROFİLİ
Mantolama köşe profili
Fiyat: 16,60 TL/MT

ÇELİK ÇİVİLİ DÜBEL 115 MM
Mekanik tırnaklı mantolama dübeli
Fiyat: 4,50 TL/ADET

ÇELİK ÇİVİLİ DÜBEL 155 MM
Mekanik tırnaklı mantolama dübeli
Fiyat: 5,20 TL/ADET

PLASTİK ÇİVİLİ DÜBEL 10 CM
Mantolama dübeli
Fiyat: 2,10 TL/ADET

PLASTİK ÇİVİLİ DÜBEL 12 CM
Mantolama dübeli
Fiyat: 2,40 TL/ADET
`;

console.log('🧪 PDF Parser Test\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

try {
  const products = parseManualText(sampleText);

  console.log(`✅ ${products.length} ürün başarıyla parse edildi!\n`);

  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   Kısa Ad: ${product.shortName}`);
    console.log(`   Kategori: ${product.categorySlug}`);
    console.log(`   Birim: ${product.unit} (${product.unitContent} ${product.unit}/paket)`);
    console.log(`   Liste Fiyatı: ${product.basePrice} TL/${product.unit}`);
    console.log(`   EPS: ${product.isForEps ? '✓' : '✗'} | Taşyünü: ${product.isForTasyunu ? '✓' : '✗'}`);
    if (product.dowelLength) {
      console.log(`   Dübel Boyu: ${product.dowelLength} mm`);
    }
    console.log('');
  });

  // Fiyat hesaplama örneği
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💰 FİYAT HESAPLAMA ÖRNEĞİ (TEKNOİZOFİX)\n');

  const product = products[0];
  const isk1 = 40; // %40
  const isk2 = 8;  // %8
  const kar = 10;  // %10

  const kdvHaric = product.basePrice / 1.20; // KDV dahil geldiğini varsayarak
  const afterIsk1 = kdvHaric * (1 - isk1 / 100);
  const afterIsk2 = afterIsk1 * (1 - isk2 / 100);
  const withKar = afterIsk2 * (1 + kar / 100);
  const kdvDahilSatis = withKar * 1.20;

  console.log(`Liste Fiyatı (KDV Dahil): ${product.basePrice.toFixed(2)} TL/${product.unit}`);
  console.log(`KDV Hariç: ${kdvHaric.toFixed(2)} TL`);
  console.log(`İSK1 (%${isk1}): ${afterIsk1.toFixed(2)} TL`);
  console.log(`İSK2 (%${isk2}): ${afterIsk2.toFixed(2)} TL`);
  console.log(`Kar (%${kar}): ${withKar.toFixed(2)} TL`);
  console.log(`SATIŞ FİYATI (KDV Dahil): ${kdvDahilSatis.toFixed(2)} TL/${product.unit}`);
  console.log(`\nPaket Fiyatı: ${(kdvDahilSatis * product.unitContent).toFixed(2)} TL`);

} catch (error) {
  console.error('❌ Hata:', error);
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
