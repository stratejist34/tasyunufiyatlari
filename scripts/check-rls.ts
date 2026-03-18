import { supabase } from '../lib/supabase';

async function checkRLS() {
  console.log('🔍 RLS Politikalarını Kontrol Ediyoruz...\n');

  // Try to insert a test record
  const testData = {
    brand_id: 6,
    accessory_type_id: 1,
    name: 'TEST ÜRÜN',
    short_name: 'Test',
    unit: 'KG',
    unit_content: 1,
    base_price: 100,
    is_for_eps: true,
    is_for_tasyunu: true,
    discount_1: 40,
    discount_2: 8,
    is_kdv_included: true,
    is_active: true,
  };

  console.log('📝 Test ürün eklemeye çalışıyoruz...');
  const { data, error } = await supabase
    .from('accessories')
    .insert(testData)
    .select();

  if (error) {
    console.error('❌ HATA:', error.message);
    console.error('\n📋 Hata Detayları:', error);
    console.log('\n⚠️ RLS politikası INSERT işlemini engelliyor!\n');
    console.log('✅ ÇÖZÜM: Aşağıdaki SQL\'i Supabase SQL Editor\'de çalıştırın:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`-- RLS politikasını devre dışı bırak (veya herkese izin ver)
-- SEÇenek 1: RLS'i tamamen kapat (önerilmez ama hızlı çözüm)
ALTER TABLE accessories DISABLE ROW LEVEL SECURITY;

-- VEYA

-- Seçenek 2: Herkese INSERT izni ver (daha güvenli)
DROP POLICY IF EXISTS "Enable insert for all users" ON accessories;
CREATE POLICY "Enable insert for all users"
ON accessories FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Seçenek 3: SELECT, UPDATE için de izin ver
DROP POLICY IF EXISTS "Enable read for all users" ON accessories;
CREATE POLICY "Enable read for all users"
ON accessories FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Enable update for all users" ON accessories;
CREATE POLICY "Enable update for all users"
ON accessories FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔗 SQL Editor Linki:');
    console.log('https://supabase.com/dashboard/project/latlzskzemmdnotzpscc/sql/new\n');
  } else {
    console.log('✅ Test ürün başarıyla eklendi!');
    console.log('📦 Eklenen ürün:', data);

    // Clean up test data
    console.log('\n🧹 Test ürünü siliyoruz...');
    await supabase.from('accessories').delete().eq('name', 'TEST ÜRÜN');
    console.log('✅ Test ürünü silindi.\n');
    console.log('🎉 RLS politikası düzgün çalışıyor, ürünleri ekleyebilirsiniz!');
  }
}

checkRLS();
