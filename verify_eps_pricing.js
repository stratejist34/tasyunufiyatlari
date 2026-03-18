// =====================================================
// EPS FİYAT HESAPLAMA DOĞRULAMA SCRIPTI
// Test Expert EPS Karbonlu 5cm fiyat hesabını
// =====================================================

const testData = {
    productName: "Expert EPS Karbonlu 5cm",
    basePrice: 787.20,        // PAKET fiyatı (KDV dahil)
    isKdvIncluded: true,
    packageM2: 5.0,           // 1 paket = 5 m²
    city: "İstanbul",
    isk1: 9,                  // Bölge 1 (İstanbul için EPS/Toz bölge iskontosu)
    isk2: 8,                  // Ürün bazlı iskonto
    profitMargin: 10          // %10 kar marjı
};

console.log("=".repeat(60));
console.log("EPS FİYAT HESAPLAMA DOĞRULAMA");
console.log("=".repeat(60));
console.log(`Ürün: ${testData.productName}`);
console.log(`Şehir: ${testData.city}`);
console.log("");

// ADIM 1: KDV Hariç Paket Fiyatı
const basePriceKdvHaric = testData.isKdvIncluded
    ? testData.basePrice / 1.20
    : testData.basePrice;
console.log("1. BASE PRICE (PAKET)");
console.log(`   KDV Dahil  : ${testData.basePrice.toFixed(2)} TL`);
console.log(`   KDV Hariç  : ${basePriceKdvHaric.toFixed(2)} TL`);
console.log("");

// ADIM 2: m² Liste Fiyatı (KDV Hariç)
const listPriceM2 = basePriceKdvHaric / testData.packageM2;
console.log("2. m² LİSTE FİYATI (KDV Hariç)");
console.log(`   ${basePriceKdvHaric.toFixed(2)} ÷ ${testData.packageM2} = ${listPriceM2.toFixed(2)} TL/m²`);
console.log("");

// ADIM 3: İskontolar
const afterIsk1 = listPriceM2 * (1 - testData.isk1 / 100);
const m2Alis = afterIsk1 * (1 - testData.isk2 / 100);
console.log("3. İSKONTOLAR");
console.log(`   İSK1 (%${testData.isk1}): ${listPriceM2.toFixed(2)} × ${(1 - testData.isk1 / 100).toFixed(2)} = ${afterIsk1.toFixed(2)} TL/m²`);
console.log(`   İSK2 (%${testData.isk2}): ${afterIsk1.toFixed(2)} × ${(1 - testData.isk2 / 100).toFixed(2)} = ${m2Alis.toFixed(2)} TL/m²`);
console.log("");

// ADIM 4: Kar Marjı
const m2AlisWithProfit = m2Alis * (1 + testData.profitMargin / 100);
console.log("4. KAR MARJİ (+%10)");
console.log(`   ${m2Alis.toFixed(2)} × 1.10 = ${m2AlisWithProfit.toFixed(2)} TL/m² (KDV Hariç)`);
console.log("");

// ADIM 5: KDV Ekle (Müşteriye Satış)
const m2Satis = m2AlisWithProfit * 1.20;
console.log("5. KDV DAHİL SATIŞ FİYATI");
console.log(`   ${m2AlisWithProfit.toFixed(2)} × 1.20 = ${m2Satis.toFixed(2)} TL/m²`);
console.log("");

// ADIM 6: Paket Fiyatları
const paketAlis = m2Alis * testData.packageM2;
const paketSatis = m2Satis * testData.packageM2;
console.log("6. PAKET FİYATLARI");
console.log(`   Paket Alış (KDV Hariç): ${paketAlis.toFixed(2)} TL`);
console.log(`   Paket Satış (KDV Dahil): ${paketSatis.toFixed(2)} TL`);
console.log("");

console.log("=".repeat(60));
console.log("✅ BEKLENEN SONUÇ");
console.log("=".repeat(60));
console.log(`m² Satış Fiyatı  : ~120.82 TL/m² (KDV Dahil)`);
console.log(`Gerçek Sonuç     : ${m2Satis.toFixed(2)} TL/m²`);
console.log(`Paket Satış      : ${paketSatis.toFixed(2)} TL`);
console.log("");

// Doğrulama
const expectedM2Satis = 120.82;
const difference = Math.abs(m2Satis - expectedM2Satis);
if (difference < 1) {
    console.log("✅ TEST BAŞARILI - Fiyat beklenen aralıkta!");
} else {
    console.log(`❌ TEST BAŞARISIZ - Fark: ${difference.toFixed(2)} TL`);
}
console.log("");
