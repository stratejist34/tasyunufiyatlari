import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://latlzskzemmdnotzpscc.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdGx6c2t6ZW1tZG5vdHpwc2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjY5MjUsImV4cCI6MjA4MDkwMjkyNX0.r9N8JGfi_IxMX31eeSnkQusK2aZlZudfQYlvPLQysFw"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabase() {
  console.log('🔍 Veritabanı Sorgulanıyor...\n')

  // 1. Brands tablosundan Tekno'yu bul
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📦 BRANDS (Markalar)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  const { data: brands, error: brandsError } = await supabase
    .from('brands')
    .select('*')
    .order('name')

  if (brandsError) {
    console.error('❌ Brands hatası:', brandsError)
  } else {
    brands?.forEach(brand => {
      console.log(`ID: ${brand.id} | ${brand.name} | Tier: ${brand.tier}`)
    })
  }

  // Tekno'nun ID'sini bul
  const tekno = brands?.find(b => b.name === 'Tekno')
  if (tekno) {
    console.log(`\n✅ TEKNO BULUNDU - ID: ${tekno.id}\n`)
  } else {
    console.log('\n⚠️ TEKNO BULUNAMADI - Yeni marka eklemek gerekiyor!\n')
  }

  // 2. Accessory Types (Aksesuar Kategorileri)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🏷️  ACCESSORY TYPES (Aksesuar Kategorileri)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  const { data: accTypes, error: accTypesError } = await supabase
    .from('accessory_types')
    .select('*')
    .order('sort_order')

  if (accTypesError) {
    console.error('❌ Accessory Types hatası:', accTypesError)
  } else {
    accTypes?.forEach(type => {
      console.log(`ID: ${type.id} | Slug: ${type.slug.padEnd(15)} | ${type.name}`)
      console.log(`   EPS Sarfiyat: ${type.consumption_rate_eps} | Taşyünü Sarfiyat: ${type.consumption_rate_tasyunu}`)
    })
  }

  // 3. Mevcut Tekno Ürünlerini Göster (varsa)
  if (tekno) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔧 MEVCUT TEKNO ÜRÜNLERİ')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    const { data: teknoProducts, error: teknoError } = await supabase
      .from('accessories')
      .select(`
        *,
        accessory_types(name, slug)
      `)
      .eq('brand_id', tekno.id)
      .order('accessory_type_id')

    if (teknoError) {
      console.error('❌ Tekno ürünleri hatası:', teknoError)
    } else if (teknoProducts && teknoProducts.length > 0) {
      teknoProducts.forEach(product => {
        console.log(`\nID: ${product.id} | ${product.name}`)
        console.log(`  Kategori: ${product.accessory_types?.name} (${product.accessory_types?.slug})`)
        console.log(`  Base Price: ${product.base_price} ${product.unit}`)
        console.log(`  İSK1: ${product.discount_1}% | İSK2: ${product.discount_2}%`)
        console.log(`  EPS: ${product.is_for_eps ? '✓' : '✗'} | Taşyünü: ${product.is_for_tasyunu ? '✓' : '✗'}`)
      })
    } else {
      console.log('⚠️ Tekno için henüz ürün eklenmemiş.')
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

checkDatabase()
