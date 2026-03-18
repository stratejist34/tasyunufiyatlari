import { supabase } from '../lib/supabase';

async function checkPackagesStructure() {
  console.log('🔍 Packages tablosu yapısını kontrol ediyoruz...\n');

  // Get a sample row to see the structure
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('📋 Packages Tablosu Kolonları:\n');
    Object.keys(data[0]).forEach(key => {
      const value = data[0][key];
      console.log(`  - ${key}: ${typeof value} = ${value}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📦 İlk Paket Örneği:\n');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log('⚠️ Packages tablosunda veri yok');
  }

  // Get all packages
  const { data: allPackages } = await supabase
    .from('packages')
    .select('*')
    .order('id');

  if (allPackages && allPackages.length > 0) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📦 TÜM PAKETLER:\n');
    allPackages.forEach(pkg => {
      console.log(`ID: ${pkg.id} | ${pkg.name || 'İsimsiz'}`);
      console.log(`   ${JSON.stringify(pkg)}`);
      console.log('');
    });
  }
}

checkPackagesStructure();
