import { supabase } from '../lib/supabase';

async function checkOtherBrands() {
  console.log('🔍 Diğer markaların fiyat yapısını kontrol ediyoruz...\n');

  // Get Filli Boya accessories as example
  const { data: filliBoya } = await supabase
    .from('accessories')
    .select('*')
    .eq('brand_id', 3) // Fawori
    .limit(5);

  const { data: optimix } = await supabase
    .from('accessories')
    .select('*')
    .eq('brand_id', 4) // Optimix
    .limit(5);

  console.log('📦 FAWORI ÖRNEKLERİ:\n');
  filliBoya?.forEach(product => {
    const pricePerUnit = product.base_price / product.unit_content;
    console.log(`${product.name}`);
    console.log(`   unit_content: ${product.unit_content} ${product.unit}`);
    console.log(`   base_price: ${product.base_price} TL`);
    console.log(`   Birim fiyat: ${pricePerUnit.toFixed(2)} TL/${product.unit}`);
    console.log(`   discount_1: ${product.discount_1}%, discount_2: ${product.discount_2}%`);
    console.log('');
  });

  console.log('\n📦 OPTIMIX ÖRNEKLERİ:\n');
  optimix?.forEach(product => {
    const pricePerUnit = product.base_price / product.unit_content;
    console.log(`${product.name}`);
    console.log(`   unit_content: ${product.unit_content} ${product.unit}`);
    console.log(`   base_price: ${product.base_price} TL`);
    console.log(`   Birim fiyat: ${pricePerUnit.toFixed(2)} TL/${product.unit}`);
    console.log(`   discount_1: ${product.discount_1}%, discount_2: ${product.discount_2}%`);
    console.log('');
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💡 SONUÇ:\n');
  console.log('base_price = PAKET FİYATI mı yoksa BİRİM FİYATI mı?');
  console.log('Yukarıdaki örneklere bakarak anlayabiliriz.');
}

checkOtherBrands();
