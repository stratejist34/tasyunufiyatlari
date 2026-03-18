// Tekno tam liste - Ambalaj fiyatları ile

const teknoProducts = [
  {
    name: 'TEKNOİZOFİX',
    unitPrice: 8.80,
    packagePrice: 220.00,
    packageSize: 25,
    unit: 'KG',
    category: 'yapistirici',
  },
  {
    name: 'TEKNOİZOSIVA',
    unitPrice: 9.70,
    packagePrice: 242.50,
    packageSize: 25,
    unit: 'KG',
    category: 'siva',
  },
  {
    name: 'TEKNODEKO İNCE (1,2 MM)',
    unitPrice: 12.20,
    packagePrice: 305.00,
    packageSize: 25,
    unit: 'KG',
    category: 'kaplama',
  },
  {
    name: 'TEKNODEKO KALIN (2 MM)',
    unitPrice: 12.20,
    packagePrice: 305.00,
    packageSize: 25,
    unit: 'KG',
    category: 'kaplama',
  },
  {
    name: 'TEKNODEKO ÇİZGİLİ',
    unitPrice: 14.00,
    packagePrice: 350.00,
    packageSize: 25,
    unit: 'KG',
    category: 'kaplama',
  },
  {
    name: 'TEKNOİZOSIVA MAKİNE SIVASI',
    unitPrice: 6.40,
    packagePrice: 160.00,
    packageSize: 25,
    unit: 'KG',
    category: 'siva',
  },
  {
    name: 'FİLE 4X4 - 160 GR',
    unitPrice: 32.00,
    packagePrice: 1600.00,
    packageSize: 50,
    unit: 'M²',
    category: 'file',
  },
  {
    name: 'FİLELİ PVC KÖŞE PROFİLİ',
    unitPrice: 16.60,
    packagePrice: 2075.00,
    packageSize: 125,
    unit: 'MT',
    category: 'fileli-kose',
  },
  {
    name: 'ÇELİK ÇİVİLİ DÜBEL 115 MM',
    unitPrice: 4.50,
    packagePrice: 2250.00,
    packageSize: 500,
    unit: 'ADET',
    category: 'dubel',
    dowelLength: 115,
  },
  {
    name: 'ÇELİK ÇİVİLİ DÜBEL 155 MM',
    unitPrice: 5.20,
    packagePrice: 2600.00,
    packageSize: 500,
    unit: 'ADET',
    category: 'dubel',
    dowelLength: 155,
  },
  {
    name: 'PLASTİK ÇİVİLİ DÜBEL 10 CM',
    unitPrice: 2.10,
    packagePrice: 1050.00,
    packageSize: 500,
    unit: 'ADET',
    category: 'dubel',
    dowelLength: 100,
  },
  {
    name: 'PLASTİK ÇİVİLİ DÜBEL 12 CM',
    unitPrice: 2.40,
    packagePrice: 1200.00,
    packageSize: 500,
    unit: 'ADET',
    category: 'dubel',
    dowelLength: 120,
  },
  {
    name: 'CHELFIX DEKORATİF SIVA',
    unitPrice: 10.64,
    packagePrice: 266.00,
    packageSize: 25,
    unit: 'KG',
    category: 'kaplama',
  },
  {
    name: 'CHELFIX DEKORATİF SIVA İNCE',
    unitPrice: 10.64,
    packagePrice: 266.00,
    packageSize: 25,
    unit: 'KG',
    category: 'kaplama',
  },
];

console.log('📦 TEKNO ÜRÜNLERİ - TAM LİSTE (14 ÜRÜN)\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

teknoProducts.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name}`);
  console.log(`   Birim Fiyat: ${product.unitPrice} TL/${product.unit}`);
  console.log(`   Ambalaj Fiyatı: ${product.packagePrice} TL`);
  console.log(`   Paket İçeriği: ${product.packageSize} ${product.unit}`);
  console.log(`   Kategori: ${product.category}`);
  if (product.dowelLength) {
    console.log(`   Dübel Boyu: ${product.dowelLength} mm`);
  }

  // İskonto hesaplama (%40 + %8 + %10 kar)
  const isk1 = 40;
  const isk2 = 8;
  const kar = 10;

  const priceWithoutVat = product.packagePrice / 1.20;
  const afterIsk1 = priceWithoutVat * (1 - isk1 / 100);
  const afterIsk2 = afterIsk1 * (1 - isk2 / 100);
  const withKar = afterIsk2 * (1 + kar / 100);
  const finalPrice = withKar * 1.20;

  console.log(`   💰 SATIŞ FİYATI: ${finalPrice.toFixed(2)} TL/paket`);
  console.log('');
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('⚠️ DİKKAT: EPS/TAŞYÜNÜ uyumluluğu henüz belirlenmedi!');
console.log('Teklif dosyalarından kontrol edilmeli.\n');
