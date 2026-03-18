import { supabase } from '../lib/supabase';

async function checkPackages() {
  console.log('🔍 Packages tablosunu kontrol ediyoruz...\n');

  // Get all brands first
  const { data: brands } = await supabase.from('brands').select('*');
  const brandMap = new Map(brands?.map(b => [b.id, b.name]) || []);

  // Get packages with OEM
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .order('id');

  if (error) {
    console.error('Hata:', error);
    return;
  }

  console.log('📦 PACKAGES (Paketler):\n');
  packages?.forEach(pkg => {
    const plateBrand = brandMap.get(pkg.plate_brand_id);
    const accessoryBrand = brandMap.get(pkg.accessory_brand_id);

    console.log(`ID: ${pkg.id} | ${pkg.name}`);
    console.log(`   Levha: ${plateBrand} (ID: ${pkg.plate_brand_id})`);
    console.log(`   Toz Grubu: ${accessoryBrand} (ID: ${pkg.accessory_brand_id})`);
    console.log(`   Tier: ${pkg.tier}`);
    console.log('');
  });

  // Find OEM brand ID
  const oemBrand = brands?.find(b => b.name === 'OEM');
  const teknoBrand = brands?.find(b => b.name === 'TEKNO');

  if (oemBrand && teknoBrand) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 DEĞİŞTİRME KOMUTLARI:\n');
    console.log(`OEM Brand ID: ${oemBrand.id}`);
    console.log(`TEKNO Brand ID: ${teknoBrand.id}\n`);

    console.log('-- Packages tablosunda OEM\'i TEKNO\'ya çevir:');
    console.log(`UPDATE packages SET accessory_brand_id = ${teknoBrand.id} WHERE accessory_brand_id = ${oemBrand.id};`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔗 Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/latlzskzemmdnotzpscc/sql/new\n');
  } else {
    if (!oemBrand) console.log('⚠️ OEM markası bulunamadı');
    if (!teknoBrand) console.log('⚠️ TEKNO markası bulunamadı');
  }
}

checkPackages();
