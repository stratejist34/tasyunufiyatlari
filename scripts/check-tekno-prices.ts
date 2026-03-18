import { supabase } from '../lib/supabase';

async function checkTeknoPrices() {
  console.log('🔍 TEKNO ürünlerini kontrol ediyoruz...\n');

  const { data: teknoProducts, error } = await supabase
    .from('accessories')
    .select('*')
    .eq('brand_id', 6) // TEKNO
    .order('id');

  if (error) {
    console.error('Hata:', error);
    return;
  }

  if (!teknoProducts || teknoProducts.length === 0) {
    console.log('⚠️ TEKNO ürünü bulunamadı');
    return;
  }

  console.log('📦 TEKNO ÜRÜNLERİ (Mevcut Durum):\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const updates: string[] = [];

  teknoProducts.forEach((product, index) => {
    const pricePerUnit = product.base_price / product.unit_content;

    console.log(`${index + 1}. ${product.name} (ID: ${product.id})`);
    console.log(`   Birim: ${product.unit_content} ${product.unit}/paket`);
    console.log(`   ❌ HATALI - Paket Fiyatı: ${product.base_price.toFixed(2)} TL`);
    console.log(`   ❌ HATALI - Birim Fiyatı: ${pricePerUnit.toFixed(2)} TL/${product.unit}`);
    console.log('');

    // Birim fiyatı zaten hesaplanmış, şimdi onu düzeltmeliyiz
    // base_price şu an paket fiyatı, ama sistemde birim fiyatı olmalı

    // Sistemin beklediği: base_price = BİRİM fiyatı (hesaplama sırasında unit_content ile çarpılacak)
    // Şu an olan: base_price = PAKET fiyatı (yanlış!)

    const correctUnitPrice = pricePerUnit; // Şu anki birim fiyatı

    console.log(`   ✅ DÜZELTME - base_price = ${correctUnitPrice.toFixed(2)} TL (birim fiyat)`);
    console.log(`   ✅ DÜZELTME - Paket fiyatı hesaplanacak = ${correctUnitPrice.toFixed(2)} × ${product.unit_content} = ${(correctUnitPrice * product.unit_content).toFixed(2)} TL`);
    console.log('');

    updates.push(`UPDATE accessories SET base_price = ${correctUnitPrice.toFixed(2)} WHERE id = ${product.id};`);
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔧 DÜZELTİCİ SQL KOMUTLARI:\n');
  console.log('-- base_price değerlerini paket fiyatından birim fiyatına çevir:');
  updates.forEach(sql => console.log(sql));
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔗 Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/latlzskzemmdnotzpscc/sql/new');
  console.log('\n💡 NOT: Sistemde base_price = BİRİM fiyatı olmalı (paket fiyatı değil!)');
  console.log('    Paket fiyatı hesaplama sırasında otomatik olarak base_price × unit_content ile bulunur.\n');
}

checkTeknoPrices();
