/**
 * TÜM LEVHALARI CSV'LERDEN SUPABASE'E İMPORT ET
 *
 * HEDEF:
 * - 68 Taşyünü levha (3 marka, 10 farklı model)
 * - 54 EPS levha (3 marka, 6 farklı tür)
 * - TOPLAM: 122 levha
 *
 * Kullanım: node import-all-plates.js
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
        if (columns[0] && columns[0].includes('MALZEME İSMİ')) {
            headerFound = true;
            continue;
        }

        if (!headerFound) continue;

        const productName = columns[0];
        if (!productName || productName.includes('Ürün Tanımı')) continue;

        // Kalınlık bilgisini ürün adından çıkar
        const thicknessMatch = productName.match(/(\d+)\s*cm/i);
        if (!thicknessMatch) continue;

        const thicknessCm = parseInt(thicknessMatch[1]);

        products.push({
            name: productName,
            thicknessCm
        });
    }

    console.log(`✅ ${products.length} ürün parse edildi`);
    return products;
}

// Ürün isminden marka, model ve tür bilgisini çıkar
function extractProductInfo(fullName) {
    let brand = null;
    let model = null;
    let materialType = null;

    // Marka tespiti (Optimix önce kontrol edilmeli!)
    if (fullName.includes('Optimix')) brand = 'Optimix';
    else if (fullName.includes('Dalmaçyalı')) brand = 'Dalmaçyalı';
    else if (fullName.includes('Expert')) brand = 'Expert';
    else if (fullName.includes('Fawori')) brand = 'Fawori';

    // Material type tespiti
    if (fullName.includes('Taşyünü') || fullName.includes('Stonewool')) {
        materialType = 'tasyunu';
    } else if (fullName.includes('EPS') || fullName.includes('Carbon') || fullName.includes('Optimix')) {
        materialType = 'eps';
    }

    // Model tespiti - Taşyünü modelleri
    if (fullName.includes('SW035')) model = 'SW035';
    else if (fullName.includes('CS60')) model = 'CS60';
    else if (fullName.includes('Yangın Bariyeri')) model = 'Yangın Bariyeri';
    else if (fullName.includes('Premium')) model = 'Premium';
    else if (fullName.includes('HD150')) model = 'HD150';
    else if (fullName.includes('LD125')) model = 'LD125';
    else if (fullName.includes('VF80')) model = 'VF80';
    else if (fullName.includes('RF150')) model = 'RF150';
    else if (fullName.includes('PW50')) model = 'PW50';
    else if (fullName.includes('TR7.5')) model = 'TR7.5';
    // EPS modelleri
    else if (fullName.includes('İdeal Carbon')) model = 'İdeal Carbon';
    else if (fullName.includes('Double Carbon')) model = 'Double Carbon';
    else if (fullName.includes('Optimix')) model = 'Optimix Karbonlu';
    else if (fullName.includes('Karbonlu')) model = 'EPS Karbonlu';
    else if (fullName.includes('035 EPS') || fullName.includes('EPS 035')) model = 'EPS 035 Beyaz';
    else if (fullName.includes('Beyaz')) model = 'EPS Beyaz';

    return { brand, model, materialType };
}

// Ana fonksiyon
async function main() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  TÜM LEVHALARI SUPABASE\'E IMPORT ET');
    console.log('  Hedef: 122 levha (68 Taşyünü + 54 EPS)');
    console.log('═══════════════════════════════════════════════════════════════');

    // 1. CSV'lerden tüm ürünleri oku
    const tasyunuProducts = parseCSV('tasyunu_maliyet.csv');
    const dalmacyaliProducts = parseCSV('dalmacyali_paket.csv');
    const faworiProducts = parseCSV('fawori_paket.csv');

    // Tüm ürünleri birleştir
    const allProducts = [
        ...tasyunuProducts,
        ...dalmacyaliProducts,
        ...faworiProducts
    ];

    console.log(`\n📊 TOPLAM: ${allProducts.length} ürün bulundu`);

    // 2. Supabase'den brands ve material_types çek
    console.log('\n📦 Supabase\'den brands ve material_types tabloları çekiliyor...');

    const [brandsRes, materialTypesRes] = await Promise.all([
        supabase.from('brands').select('*'),
        supabase.from('material_types').select('*')
    ]);

    if (brandsRes.error || materialTypesRes.error) {
        console.error('❌ Tablolar çekilemedi:', brandsRes.error || materialTypesRes.error);
        return;
    }

    const brands = brandsRes.data;
    const materialTypes = materialTypesRes.data;

    console.log(`✅ ${brands.length} marka, ${materialTypes.length} material type bulundu`);

    // 3. Unique ürünleri grupla (marka + model + kalınlık kombinasyonu)
    const uniquePlates = new Map();

    allProducts.forEach(product => {
        const { brand: brandName, model, materialType } = extractProductInfo(product.name);

        if (!brandName || !model || !materialType) {
            console.log(`⚠️  Eksik bilgi: ${product.name}`);
            return;
        }

        const brand = brands.find(b => b.name === brandName);
        if (!brand) {
            console.log(`⚠️  Marka bulunamadı: ${brandName}`);
            return;
        }

        const matType = materialTypes.find(mt => mt.slug === materialType);
        if (!matType) {
            console.log(`⚠️  Material type bulunamadı: ${materialType}`);
            return;
        }

        // Unique key: marka + model
        const key = `${brand.id}-${model}`;

        if (!uniquePlates.has(key)) {
            uniquePlates.set(key, {
                brand_id: brand.id,
                _brand_name: brandName, // Debug için (veritabanına eklenmeyecek)
                material_type_id: matType.id,
                _material_type: materialType, // Debug için (veritabanına eklenmeyecek)
                category_id: 1, // Varsayılan kategori
                name: `${brandName} ${model}`,
                short_name: model,
                density: null,
                thickness_options: [product.thicknessCm],
                base_price_per_cm: materialType === 'tasyunu' ? 50 : 30,
                package_m2: 1.8, // Varsayılan
                pallet_packages: null,
                consumption_rate: 1,
                is_active: true,
                base_price: null,
                discount_1: 9,
                discount_2: 8,
                is_kdv_included: materialType === 'eps'
            });
        } else {
            // Kalınlık seçeneğini ekle
            const plate = uniquePlates.get(key);
            if (!plate.thickness_options.includes(product.thicknessCm)) {
                plate.thickness_options.push(product.thicknessCm);
            }
        }
    });

    // Array'e çevir ve kalınlık seçeneklerini sırala
    const platesToInsert = Array.from(uniquePlates.values()).map(plate => {
        plate.thickness_options.sort((a, b) => a - b);
        return plate;
    });

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`📊 ÖZET:`);
    console.log(`   Toplam unique levha: ${platesToInsert.length}`);
    console.log(`   Taşyünü: ${platesToInsert.filter(p => p._material_type === 'tasyunu').length}`);
    console.log(`   EPS: ${platesToInsert.filter(p => p._material_type === 'eps').length}`);
    console.log('═══════════════════════════════════════════════════════════════');

    // Marka bazlı detay
    console.log('\n📋 MARKA BAZLI DETAY:');
    brands.forEach(brand => {
        const brandPlates = platesToInsert.filter(p => p.brand_id === brand.id);
        const tasyunu = brandPlates.filter(p => p._material_type === 'tasyunu').length;
        const eps = brandPlates.filter(p => p._material_type === 'eps').length;
        console.log(`   ${brand.name}: ${brandPlates.length} levha (${tasyunu} Taşyünü, ${eps} EPS)`);

        // Her modeli listele
        brandPlates.forEach(plate => {
            console.log(`      - ${plate.short_name}: ${plate.thickness_options.join(', ')}cm`);
        });
    });

    // 4. Kullanıcıya sor
    console.log(`\n🚀 ${platesToInsert.length} levha Supabase'e eklenecek.`);
    console.log('\n⚠️  DIKKAT: Mevcut plates tablosu SILINECEK ve yeniden oluşturulacak!');
    console.log('\nDevam etmek için ENTER\'a bas, iptal için Ctrl+C...');

    await new Promise(resolve => {
        process.stdin.once('data', resolve);
    });

    // 5. Önce plate_prices tablosunu temizle (foreign key constraint)
    console.log('\n🗑️  Mevcut plate_prices tablosu temizleniyor...');
    const { error: deletePricesError } = await supabase
        .from('plate_prices')
        .delete()
        .neq('id', 0);

    if (deletePricesError) {
        console.error('❌ plate_prices silme hatası:', deletePricesError);
        return;
    }

    console.log('✅ plate_prices temizlendi');

    // 6. plates tablosunu temizle
    console.log('\n🗑️  Mevcut plates tablosu temizleniyor...');
    const { error: deleteError } = await supabase
        .from('plates')
        .delete()
        .neq('id', 0);

    if (deleteError) {
        console.error('❌ plates silme hatası:', deleteError);
        return;
    }

    console.log('✅ plates temizlendi');

    // 7. Yeni levhaları ekle (debug alanlarını temizle)
    console.log('\n📥 Yeni levhalar ekleniyor...');

    const cleanPlates = platesToInsert.map(({_brand_name, _material_type, ...plate}) => plate);

    const { data, error } = await supabase
        .from('plates')
        .insert(cleanPlates)
        .select();

    if (error) {
        console.error('❌ Ekleme hatası:', error);
        return;
    }

    console.log(`\n✅ ${data.length} levha başarıyla eklendi!`);
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  İMPORT TAMAMLANDI! 🎉');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Özet göster
    console.log('📋 SON DURUM:');
    const tasyunuCount = data.filter(p => p.material_type_id === 2).length;
    const epsCount = data.filter(p => p.material_type_id === 1).length;
    console.log(`   Toplam: ${data.length} levha`);
    console.log(`   Taşyünü: ${tasyunuCount} levha`);
    console.log(`   EPS: ${epsCount} levha`);

    process.exit(0);
}

// Script'i çalıştır
main().catch(error => {
    console.error('❌ HATA:', error);
    process.exit(1);
});
