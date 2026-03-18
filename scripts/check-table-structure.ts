import { supabase } from '../lib/supabase';

async function checkTableStructure() {
  console.log('🔍 Checking accessories table structure...\n');

  // Get a sample row to see the structure
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Sample row structure:');
    console.log(JSON.stringify(data[0], null, 2));
    console.log('\n');
    console.log('Column names:');
    Object.keys(data[0]).forEach(key => {
      console.log(`  - ${key}: ${typeof data[0][key]}`);
    });
  } else {
    console.log('No data found in accessories table');
  }
}

checkTableStructure();
