/**
 * PACKAGE_M2 DEĞERLERİNİ DÜ ZELT
 * CSV'den paket fiyatı / m² fiyatı hesaplayarak doğru package_m2'yi bul
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://latlzskzemmdnotzpscc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdGx6c2t6ZW1tZG5vdHpwc2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjY5MjUsImV4cCI6MjA4MDkwMjkyNX0.r9N8JGfi_IxMX31eeSnkQusK2aZlZudfQYlvPLQysFw';
const supabase = createClient(supabaseUrl, supabaseKey);

// CSV'yi parse et
function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    console.log(`📄 Toplam ${lines.length} satır okundu`);

    const products = [];
    let headerFound = false;
    let skippedLines = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(';');

        // Header satırını bul (MALZEME İSMİ içeren satır)
        if (line.includes('MALZEME İSMİ')) {
            headerFound = true;
            console.log(`✅ Header bulundu (satır ${i})`);
            continue;
        }

        if (!headerFound) {
            skippedLines++;
            continue;
        }

        const productName = columns[0];
        // Boş satır veya başlık satırlarını atla
        if (!productName || productName.includes('Ürün Tanımı') || productName.trim() === '') continue;

        // Sadece marka ismi ile başlayan satırları al
        if (!productName.match(/^(Dalmaçyalı|Expert|Fawori|Optimix)/i)) {
            if (headerFound && i < 20) {
                console.log(`⏭️ Atland ı (satır ${i}): ${productName.substring(0, 50)}`);
            }
            continue;
        }

        const packageDiscountedPriceStr = columns[8]; // Column 9 (array index 8)
        const m2PriceStr = columns[9]; // Column 10 (array index 9)

        console.log(`🔍 Kontrol (satır ${i}): ${productName.substring(0, 30)} | Paket: "${packageDiscountedPriceStr}" | m²: "${m2PriceStr}"`);

        if (!m2PriceStr || !m2PriceStr.includes('TL')) {
            console.log(`   ❌ m² fiyatı yok`);
            continue;
        }
        if (!packageDiscountedPriceStr || !packageDiscountedPriceStr.includes('TL')) {
            console.log(`   ❌ Paket fiyatı yok`);
            continue;
        }

        const m2Price = parseFloat(m2PriceStr.replace(/\./g, '').replace(',', '.').replace(' TL', ''));
        const packagePrice = parseFloat(packageDiscountedPriceStr.replace(/\./g, '').replace(',', '.').replace(' TL', ''));

        // Paket büyüklüğünü hesapla: Paket Fiyatı / m² Fiyatı = Paket m²
        const packageM2 = packagePrice / m2Price;

        const thicknessMatch = productName.match(/(\d+)\s*cm/i);
        if (!thicknessMatch) continue;

        const thicknessCm = parseInt(thicknessMatch[1]);

        products.push({
            name: productName,
            thicknessCm,
            m2Price,
            packagePrice,
            packageM2: Math.round(packageM2 * 100) / 100 // 2 ondalık basamak
        });
    }

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

async function main() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  PACKAGE_M2 DÜZELTME ARACI');
    console.log('  CSV\'den doğru paket büyüklüklerini hesapla');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // 1. CSV'den verileri oku
    const csvProducts = parseCSV('tasyunu_maliyet.csv');
    console.log(`✅ ${csvProducts.length} ürün CSV'den okundu\n`);

    // 2. Supabase'den plates ve brands tablolarını çek
    const [brandsRes, platesRes] = await Promise.all([
        supabase.from('brands').select('*'),
        supabase.from('plates').select('*')
    ]);

    if (brandsRes.error || platesRes.error) {
        console.error('❌ Veritabanı hatası:', brandsRes.error || platesRes.error);
        return;
    }

    const brands = brandsRes.data;
    const plates = platesRes.data;

    console.log(`✅ ${brands.length} marka, ${plates.length} levha bulundu\n`);

    // 3. Her CSV ürünü için plate bulup package_m2'yi hesapla
    const updates = [];

    csvProducts.forEach(csvProduct => {
        const { brand: brandName, model } = extractProductInfo(csvProduct.name);

        if (!brandName || !model) {
            console.log(`⚠️  Marka/Model bulunamadı: ${csvProduct.name}`);
            return;
        }

        const brand = brands.find(b => b.name === brandName);
        if (!brand) {
            console.log(`⚠️  Marka bulunamadı: ${brandName}`);
            return;
        }

        const plate = plates.find(p =>
            p.brand_id === brand.id &&
            p.short_name.includes(model)
        );

        if (!plate) {
            console.log(`⚠️  Plate bulunamadı: ${brandName} ${model}`);
            return;
        }

        // Mevcut ve yeni değeri karşılaştır
        const currentPackageM2 = plate.package_m2 || 0;
        const newPackageM2 = csvProduct.packageM2;

        if (Math.abs(currentPackageM2 - newPackageM2) > 0.01) {
            console.log(`🔄 ${plate.short_name}: ${currentPackageM2.toFixed(2)} → ${newPackageM2.toFixed(2)} m²`);
            console.log(`   Paket Fiyatı: ${csvProduct.packagePrice.toFixed(2)} ₺, m² Fiyatı: ${csvProduct.m2Price.toFixed(2)} ₺`);

            updates.push({
                id: plate.id,
                package_m2: newPackageM2
            });
        }
    });

    console.log(`\n✅ ${updates.length} levha güncellenecek\n`);

    if (updates.length === 0) {
        console.log('✅ Tüm package_m2 değerleri zaten doğru!');
        process.exit(0);
    }

    console.log('⚠️  DEVAM ETMEK İÇİN ENTER\'A BASIN, İPTAL İÇİN CTRL+C...\n');
    await new Promise(resolve => process.stdin.once('data', resolve));

    // 4. Güncellemeleri yap
    for (const update of updates) {
        const { error } = await supabase
            .from('plates')
            .update({ package_m2: update.package_m2 })
            .eq('id', update.id);

        if (error) {
            console.error(`❌ Hata (ID: ${update.id}):`, error);
        } else {
            console.log(`✅ Güncellendi: ID ${update.id} → ${update.package_m2.toFixed(2)} m²`);
        }
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  GÜNCELLEME TAMAMLANDI! 🎉');
    console.log('═══════════════════════════════════════════════════════════════\n');

    process.exit(0);
}

main().catch(error => {
    console.error('❌ HATA:', error);
    process.exit(1);
});
