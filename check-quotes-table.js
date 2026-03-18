// Quotes tablosunu kontrol et
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://latlzskzemmdnotzpscc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdGx6c2t6ZW1tZG5vdHpwc2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjY5MjUsImV4cCI6MjA4MDkwMjkyNX0.r9N8JGfi_IxMX31eeSnkQusK2aZlZudfQYlvPLQysFw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkQuotesTable() {
    console.log("🔍 Quotes tablosu kontrol ediliyor...\n");

    // Basit bir test kaydı
    const testQuote = {
        customer_name: "Test Müşteri",
        customer_email: "test@example.com",
        customer_phone: "0532 123 45 67",
        material_type: "tasyunu",
        brand_name: "Test Marka",
        thickness_cm: 5,
        area_m2: 100,
        city_code: "34",
        city_name: "İstanbul",
        package_name: "Test Paket",
        plate_brand_name: "Test Levha",
        accessory_brand_name: "Test Aksesuar",
        total_price: 10000,
        price_per_m2: 100,
        price_without_vat: 8333.33,
        vat_amount: 1666.67,
        package_count: 28,
        package_size_m2: 3.6,
        items_per_package: 6,
        package_items: JSON.stringify([{ name: "Test Ürün", quantity: 1 }]),
        status: "pending",
        priority: "normal"
    };

    console.log("📝 Test verisi:");
    console.log(JSON.stringify(testQuote, null, 2));
    console.log("\n");

    // Tabloya eklemeyi dene
    const { data, error } = await supabase
        .from("quotes")
        .insert([testQuote])
        .select()
        .single();

    if (error) {
        console.error("❌ HATA:");
        console.error("Kod:", error.code);
        console.error("Mesaj:", error.message);
        console.error("Detay:", error.details);
        console.error("İpucu:", error.hint);
        console.log("\n");

        // Hata koduna göre çözüm önerileri
        if (error.code === "42P01") {
            console.log("💡 ÇÖZÜM: quotes tablosu bulunamadı!");
            console.log("   1. Supabase Dashboard → SQL Editor'ı aç");
            console.log("   2. database_quotes.sql dosyasının içeriğini yapıştır");
            console.log("   3. RUN butonuna tıkla\n");
        } else if (error.code === "23502") {
            console.log("💡 ÇÖZÜM: Zorunlu alan eksik!");
            console.log("   Eksik alan:", error.details);
        } else if (error.code === "42703") {
            console.log("💡 ÇÖZÜM: Sütun adı yanlış!");
            console.log("   Detay:", error.message);
        }

        return false;
    }

    console.log("✅ BAŞARILI! Teklif kaydedildi:");
    console.log("ID:", data.id);
    console.log("Oluşturulma:", data.created_at);
    console.log("\n");

    // Eklenen kaydı sil (test amaçlı)
    await supabase.from("quotes").delete().eq("id", data.id);
    console.log("🗑️  Test kaydı silindi.");

    return true;
}

checkQuotesTable().then(success => {
    if (success) {
        console.log("\n🎉 Quotes tablosu çalışıyor!");
    } else {
        console.log("\n⚠️  Quotes tablosunda sorun var, lütfen yukarıdaki çözümleri uygulayın.");
    }
    process.exit(success ? 0 : 1);
});
