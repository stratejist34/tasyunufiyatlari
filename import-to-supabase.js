/**
 * CSV'DEN FİYATLARI SUPABASE'E İMPORT ET
 * Kullanım: node import-to-supabase.js
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Supabase client
const supabaseUrl = 'https://latlzskzemmdnotzpscc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdGx6c2t6ZW1tZG5vdHpwc2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjY5MjUsImV4cCI6MjA4MDkwMjkyNX0.r9N8JGfi_IxMX31eeSnkQusK2aZlZudfQYlvPLQysFw';
const supabase = createClient(supabaseUrl, supabaseKey);

// CSV'yi parse et
function parseCSV(filePath) {
    console.log(`\n📂 Dosya okunuyor: ${filePath}`);

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const products = [];
    let headerFound = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(';');

        // Header satırını bul
        if (line.includes('MALZEME İSMİ')) {
            headerFound = true;
            continue;
        }

        if (!headerFound) continue;

        const productName = columns[0];
        if (!productName || productName.includes('Ürün Tanımı') || productName.trim() === '') continue;

        // Sadece marka ismi ile başlayan satırları al
        if (!productName.match(/^(Dalmaçyalı|Expert|Fawori|Optimix)/i)) continue;

        // Fiyat sütunlarını parse et - CSV formatına göre
        const listPriceStr = columns[1]; // Column 2 (index 1): KDV HARİÇ LİSTE FİYATI (m²)
        const isk1Str = columns[2]; // Column 3 (index 2): İSK 1
        const isk2Str = columns[3]; // Column 4 (index 3): İSK 2
        const packageDiscountedPriceStr = columns[8]; // Column 9 (index 8): İskontolu Paket Fiyatı (KDV Hariç)
        const m2DiscountedPriceStr = columns[9]; // Column 10 (index 9): İskontolu m² Fiyatı (KDV Hariç)

        if (!listPriceStr || !listPriceStr.includes('TL')) continue;

        // base_price = CSV Column 2: KDV HARİÇ LİSTE FİYATI (m² bazında)
        // Bu değer veritabanına base_price olarak kaydedilecek
        const basePrice = parseFloat(listPriceStr.replace(/\./g, '').replace(',', '.').replace(' TL', ''));

        // İskonto oranları
        const discount1 = parseFloat(isk1Str) || 0;
        const discount2 = parseFloat(isk2Str) || 0;

        // Doğrulama: Hesaplanan iskontolu fiyat ile CSV'deki değeri karşılaştır
        const calculatedDiscountedM2 = basePrice * (1 - discount1 / 100) * (1 - discount2 / 100);
        const csvDiscountedM2 = m2DiscountedPriceStr ? parseFloat(m2DiscountedPriceStr.replace(/\./g, '').replace(',', '.').replace(' TL', '')) : 0;
        
        if (csvDiscountedM2 > 0 && Math.abs(calculatedDiscountedM2 - csvDiscountedM2) > 0.01) {
            console.log(`⚠️  İskonto hesaplama uyuşmazlığı: ${productName}`);
            console.log(`   Hesaplanan: ${calculatedDiscountedM2.toFixed(2)}, CSV: ${csvDiscountedM2.toFixed(2)}`);
        }

        // Kalınlık bilgisini ürün adından çıkar
        const thicknessMatch = productName.match(/(\d+)\s*cm/i);
        if (!thicknessMatch) continue;

        const thicknessCm = parseInt(thicknessMatch[1]);

        products.push({
            name: productName,
            basePrice, // CSV Column 2: Liste Fiyatı (m², KDV Hariç)
            discount1, // CSV Column 3: İSK 1
            discount2, // CSV Column 4: İSK 2
            packageDiscountedPrice: packageDiscountedPriceStr ? parseFloat(packageDiscountedPriceStr.replace(/\./g, '').replace(',', '.').replace(' TL', '')) : 0,
            m2DiscountedPrice: csvDiscountedM2, // CSV Column 10: İskontolu m² Fiyatı (KDV Hariç)
            thicknessCm,
            isKdvIncluded: false, // TAŞYÜNÜ LEVHA KDV HARİÇ
        });
    }

    console.log(`✅ ${products.length} ürün parse edildi\n`);
    return products;
}

// Ürün isminden marka ve model çıkar
function extractProductInfo(fullName) {
    const brandMatch = fullName.match(/^(Dalmaçyalı|Expert|Fawori|Optimix)/i);
    const brand = brandMatch ? brandMatch[1] : null;

    let model = null;
    if (fullName.includes('SW035')) model = 'SW035';
    else if (fullName.includes('CS60')) model = 'CS60';
    else if (fullName.includes('HD150')) model = 'HD150';
    else if (fullName.includes('LD125')) model = 'LD125';
    else if (fullName.includes('Premium')) model = 'Premium';
    else if (fullName.includes('VF80')) model = 'VF80';
    else if (fullName.includes('RF150')) model = 'RF150';
    else if (fullName.includes('PW50')) model = 'PW50';
    else if (fullName.includes('TR7.5')) model = 'TR7.5';
    else if (fullName.includes('Yangın Bariyeri')) model = 'Yangın Bariyeri';

    return { brand, model };
}

// Ana fonksiyon
async function main() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  CSV → SUPABASE İMPORT ARACI');
    console.log('  Taşyünü Fiyatlarını Veritabanına Aktar');
    console.log('═══════════════════════════════════════════════════════════════');

    // 1. CSV'den fiyatları oku
    const csvProducts = parseCSV('tasyunu_maliyet.csv');

    // 2. Supabase'den plates ve brands tablolarını çek
    console.log('📦 Supabase\'den plates ve brands tabloları çekiliyor...\n');

    const [brandsRes, platesRes] = await Promise.all([
        supabase.from('brands').select('*'),
        supabase.from('plates').select('*')
    ]);

    if (brandsRes.error) {
        console.error('❌ Brands tablosu çekilemedi:', brandsRes.error);
        return;
    }

    if (platesRes.error) {
        console.error('❌ Plates tablosu çekilemedi:', platesRes.error);
        return;
    }

    const brands = brandsRes.data;
    const plates = platesRes.data;

    console.log(`✅ ${brands.length} marka, ${plates.length} levha bulundu\n`);

    // 3. CSV ile plates tablosunu eşleştir
    const platePrices = [];
    const platesToUpdate = new Map(); // Plate ID -> { discount_1, discount_2 }
    let matchedCount = 0;
    let unmatchedCount = 0;

    csvProducts.forEach(csvProduct => {
        const { brand: brandName, model } = extractProductInfo(csvProduct.name);

        if (!brandName || !model) {
            console.log(`⚠️  Marka/Model bulunamadı: ${csvProduct.name}`);
            unmatchedCount++;
            return;
        }

        // Marka ID'sini bul
        const brand = brands.find(b => b.name === brandName);
        if (!brand) {
            console.log(`⚠️  Marka bulunamadı: ${brandName}`);
            unmatchedCount++;
            return;
        }

        // Plate'i bul (marka + model eşleşmesi)
        const plate = plates.find(p =>
            p.brand_id === brand.id &&
            p.short_name.includes(model)
        );

        if (!plate) {
            console.log(`⚠️  Plate bulunamadı: ${brandName} ${model}`);
            unmatchedCount++;
            return;
        }

        // Doğrulama: base_price çok düşükse (200 TL'den az), bu muhtemelen iskontolu fiyat demektir
        if (csvProduct.basePrice < 200) {
            console.log(`⚠️  UYARI: ${csvProduct.name} için base_price çok düşük (${csvProduct.basePrice} TL). Bu muhtemelen iskontolu fiyat, liste fiyatı olmalı!`);
        }

        // Eşleşti!
        platePrices.push({
            plate_id: plate.id,
            thickness: csvProduct.thicknessCm,
            base_price: csvProduct.basePrice, // CSV Column 2 (pratikte paket liste): KDV Hariç Liste
            is_kdv_included: csvProduct.isKdvIncluded,
            discount_1: csvProduct.discount1,
            discount_2: csvProduct.discount2,
            m2_discounted_price: csvProduct.m2DiscountedPrice || 0,
            package_discounted_price: csvProduct.packageDiscountedPrice || 0
        });

        // Plates tablosundaki discount'ları güncelle (her plate için bir kez)
        if (!platesToUpdate.has(plate.id)) {
            platesToUpdate.set(plate.id, {
                discount_1: csvProduct.discount1, // CSV Column 3: İSK1
                discount_2: csvProduct.discount2  // CSV Column 4: İSK2
            });
        }

        matchedCount++;
    });

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`✅ ${matchedCount} ürün eşleşti`);
    console.log(`⚠️  ${unmatchedCount} ürün eşleşmedi`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    // 4. Kullanıcıya sor
    console.log(`\n🚀 ${platePrices.length} fiyat kaydi Supabase'e eklenecek.`);
    console.log('\n⚠️  DIKKAT: Mevcut plate_prices tablosu SILINECEK ve yeniden olusturulacak!');
    console.log('\nDevam etmek icin ENTER\'a bas, iptal icin Ctrl+C...');

    // Kullanıcının onayını bekle
    await new Promise(resolve => {
        process.stdin.once('data', resolve);
    });

    // 5. plate_prices tablosunu temizle
    console.log('\n🗑️  Mevcut plate_prices tablosu temizleniyor...');
    const { error: deleteError } = await supabase
        .from('plate_prices')
        .delete()
        .neq('id', 0); // Tüm kayıtları sil

    if (deleteError) {
        console.error('❌ Silme hatası:', deleteError);
        return;
    }

    console.log('✅ Tablo temizlendi\n');

    // 6. Yeni fiyatları ekle
    console.log('📥 Yeni fiyatlar ekleniyor...');

    const { data, error } = await supabase
        .from('plate_prices')
        .insert(platePrices)
        .select();

    if (error) {
        console.error('❌ Ekleme hatası:', error);
        return;
    }

    console.log(`\n✅ ${data.length} fiyat kaydı başarıyla eklendi!`);

    // 7. Plates tablosundaki discount'ları güncelle
    if (platesToUpdate.size > 0) {
        console.log(`\n📝 ${platesToUpdate.size} plate'in discount değerleri güncelleniyor...`);
        
        for (const [plateId, discounts] of platesToUpdate.entries()) {
            const { error: updateError } = await supabase
                .from('plates')
                .update({
                    discount_1: discounts.discount_1,
                    discount_2: discounts.discount_2
                })
                .eq('id', plateId);

            if (updateError) {
                console.error(`❌ Plate ${plateId} güncellenemedi:`, updateError);
            } else {
                console.log(`✅ Plate ${plateId} güncellendi: İSK1=${discounts.discount_1}%, İSK2=${discounts.discount_2}%`);
            }
        }
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  İMPORT TAMAMLANDI! 🎉');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // İlk 10 kaydı göster
    console.log('📋 Eklenen ilk 10 kayıt:\n');
    data.slice(0, 10).forEach((record, i) => {
        console.log(`${i + 1}. plate_id: ${record.plate_id}, ${record.thickness}cm, ${record.base_price} ₺`);
    });

    process.exit(0);
}

// Script'i çalıştır
main().catch(error => {
    console.error('❌ HATA:', error);
    process.exit(1);
});
