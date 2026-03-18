const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://latlzskzemmdnotzpscc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdGx6c2t6ZW1tZG5vdHpwc2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjY5MjUsImV4cCI6MjA4MDkwMjkyNX0.r9N8JGfi_IxMX31eeSnkQusK2aZlZudfQYlvPLQysFw';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  // 1. Plates tablosunu kontrol et
  const { data: plates, error: platesError } = await supabase
    .from('plates')
    .select('id, short_name, brand_id, material_type_id, thickness_options');

  if (platesError) {
    console.error('Plates error:', platesError);
    return;
  }

  console.log('═══════════════════════════════════════════');
  console.log('PLATES TABLOSU:');
  console.log('Toplam:', plates.length, 'levha');
  console.log('═══════════════════════════════════════════');

  // Material type'a göre grupla
  const byMaterialType = {};
  plates.forEach(p => {
    const matId = p.material_type_id || 'null';
    if (!byMaterialType[matId]) byMaterialType[matId] = [];
    byMaterialType[matId].push(p);
  });

  console.log('\nMaterial Type Bazlı:');
  Object.entries(byMaterialType).forEach(([matId, items]) => {
    console.log(`  Material Type ${matId}: ${items.length} levha`);
  });

  // Marka bazlı
  const byBrand = {};
  plates.forEach(p => {
    const brandId = p.brand_id || 'null';
    if (!byBrand[brandId]) byBrand[brandId] = [];
    byBrand[brandId].push(p);
  });

  console.log('\nMarka Bazlı:');
  Object.entries(byBrand).forEach(([brandId, items]) => {
    console.log(`  Brand ${brandId}: ${items.length} levha`);
  });

  // Tüm ürünleri göster
  console.log('\nTÜM LEVHALAR:');
  plates.forEach(p => {
    console.log(`  - ${p.short_name} (brand: ${p.brand_id}, mat: ${p.material_type_id}, kalınlıklar: ${p.thickness_options?.join(', ') || 'yok'})`);
  });

  // 2. Brands tablosunu kontrol et
  const { data: brands } = await supabase.from('brands').select('*');
  console.log('\n═══════════════════════════════════════════');
  console.log('BRANDS TABLOSU:');
  console.log('Toplam:', brands.length, 'marka');
  brands.forEach(b => console.log(`  - ${b.name} (id: ${b.id})`));

  // 3. Material Types tablosunu kontrol et
  const { data: matTypes } = await supabase.from('material_types').select('*');
  console.log('\n═══════════════════════════════════════════');
  console.log('MATERIAL_TYPES TABLOSU:');
  console.log('Toplam:', matTypes.length, 'material type');
  matTypes.forEach(m => console.log(`  - ${m.name} (id: ${m.id}, slug: ${m.slug})`));
})();
