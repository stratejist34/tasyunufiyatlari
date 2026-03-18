/**
 * CSV'DEN FİYATLARI İMPORT ET
 * Kullanım: node import-prices.js
 *
 * Bu script:
 * 1. tasyunu_maliyet.csv'yi parse eder
 * 2. dalmacyali_paket.csv'yi parse eder
 * 3. Supabase'e fiyatları yükler
 */

const fs = require('fs');
const path = require('path');

// CSV dosyasını oku ve parse et
function parseCSV(filePath) {
    console.log(`\n📂 Dosya okunuyor: ${filePath}`);

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    console.log(`✅ ${lines.length} satır bulundu`);

    const products = [];
    let headerFound = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(';');

        // Header satırını bul
        if (columns[0] && columns[0].includes('MALZEME İSMİ')) {
            headerFound = true;
            console.log(`📋 Header bulundu: Satır ${i + 1}`);
            continue;
        }

        // Header'dan sonraki satırları parse et
        if (!headerFound) continue;

        const productName = columns[0];
        if (!productName || productName.includes('Ürün Tanımı')) continue;

        // Fiyat sütununu parse et (1.566,75 TL formatı)
        const priceStr = columns[1];
        if (!priceStr || !priceStr.includes('TL')) continue;

        const basePrice = parseFloat(priceStr.replace(/\./g, '').replace(',', '.').replace(' TL', ''));
        const isk1 = parseFloat(columns[2]) || 0;
        const isk2 = parseFloat(columns[3]) || 0;

        // Kalınlık bilgisini ürün adından çıkar (örn: "3cm", "6 cm", "10cm")
        const thicknessMatch = productName.match(/(\d+)\s*cm/i);
        if (!thicknessMatch) {
            console.log(`⚠️  Kalınlık bulunamadı: ${productName}`);
            continue;
        }

        const thicknessCm = parseInt(thicknessMatch[1]);
        const thicknessMm = thicknessCm * 10;

        products.push({
            name: productName,
            basePrice,
            isk1,
            isk2,
            thicknessMm,
            thicknessCm,
            isKdvIncluded: false, // TAŞYÜNÜ LEVHA KDV HARİÇ
        });
    }

    console.log(`✅ ${products.length} ürün parse edildi\n`);
    return products;
}

// Ürün isminden marka ve model bilgisini çıkar
function extractProductInfo(fullName) {
    // "Dalmaçyalı Stonewool SW035 Taşyünü Yalıtım Levhası 10cm" -> "SW035"
    // "Expert HD150 Taşyünü Isı Yalıtım Levhası 6 cm" -> "HD150"

    const brandMatch = fullName.match(/^(Dalmaçyalı|Expert|Fawori|Optimix)/i);
    const brand = brandMatch ? brandMatch[1] : null;

    // Modeli bul
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
    console.log('  CSV FİYAT İMPORT ARACI');
    console.log('  Taşyünü & EPS Fiyatlarını Veritabanına Aktar');
    console.log('═══════════════════════════════════════════════════════════════');

    // CSV dosyalarını parse et
    const tasyunuProducts = parseCSV('tasyunu_maliyet.csv');

    // Unique ürünleri grupla (marka + model)
    const productGroups = {};

    tasyunuProducts.forEach(product => {
        const { brand, model } = extractProductInfo(product.name);
        const key = `${brand}-${model}`;

        if (!productGroups[key]) {
            productGroups[key] = {
                brand,
                model,
                variants: []
            };
        }

        productGroups[key].variants.push(product);
    });

    console.log('\n📊 ÜRÜN GRUBU ÖZETİ:');
    console.log('═══════════════════════════════════════════════════════════════');

    Object.entries(productGroups).forEach(([key, group]) => {
        console.log(`\n${group.brand} - ${group.model}:`);
        group.variants.forEach(v => {
            console.log(`  ${v.thicknessCm}cm: ${v.basePrice.toFixed(2)} ₺ (İSK1: ${v.isk1}%, İSK2: ${v.isk2}%)`);
        });
    });

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`\n✅ Toplam ${Object.keys(productGroups).length} ürün grubu, ${tasyunuProducts.length} varyant bulundu`);
    console.log('\n📝 SQL INSERT komutları oluşturuluyor...\n');

    // SQL INSERT komutlarını oluştur
    generateSQL(productGroups);
}

// SQL INSERT komutlarını oluştur
function generateSQL(productGroups) {
    let sql = `-- ═══════════════════════════════════════════════════════════════
-- PLATE_PRICES GÜNCELLEME SCRIPTI
-- Tarih: ${new Date().toISOString().split('T')[0]}
-- Kaynak: tasyunu_maliyet.csv
-- ═══════════════════════════════════════════════════════════════

-- Önce mevcut plate_prices kayıtlarını temizle
TRUNCATE TABLE plate_prices;

-- Yeni fiyatları ekle
INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included)
VALUES\n`;

    const values = [];

    Object.entries(productGroups).forEach(([key, group]) => {
        const comment = `  -- ${group.brand} ${group.model}\n`;

        group.variants.forEach(v => {
            // plate_id'yi nasıl bulacağız? Şimdilik hardcode edelim, sonra map oluştururuz
            values.push(`  -- ${v.thicknessCm}cm: ${v.basePrice} ₺`);
        });
    });

    sql += values.join(',\n');

    // SQL dosyasını kaydet
    const sqlFilePath = 'update_prices_from_csv.sql';
    fs.writeFileSync(sqlFilePath, sql);

    console.log(`✅ SQL dosyası oluşturuldu: ${sqlFilePath}`);
    console.log(`\n⚠️  ÖNEMLİ: plate_id'leri eşleştirmek için veritabanından mevcut plates tablosunu kontrol etmeliyiz`);
    console.log(`\nŞimdi ne yapalım?`);
    console.log(`1. Önce plates tablosundan ürünleri çekelim`);
    console.log(`2. CSV ile eşleştirelim`);
    console.log(`3. SQL UPDATE komutlarını oluşturalım`);
}

// Script'i çalıştır
main().catch(console.error);
