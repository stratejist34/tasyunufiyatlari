Ürün Detay Sayfası — Mimari & UX Analiz Raporu
Rol: Senior Frontend Architect + UX Analyst
Tarih: 2026-03-22
Kapsam: /urunler/[kategori]/[slug] + bağlı bileşenler

1. Bileşen Hiyerarşisi & Sorumluluklar

UrunDetayPage (RSC — server)
├── SiteHeader (shared, client)
├── Breadcrumb (inline JSX)
├── ProductImage (catalog, client — Next.js Image wrapper)
├── Başlık Bloğu (inline JSX — marka badge, h1, model)
├── ThicknessSelector (catalog, client — URL query driver)
├── Açıklama (inline JSX — catalog_description)
├── ProductPricePanel (catalog, CLIENT — ana dönüşüm motoru)
│   ├── Şehir Seçimi (select)
│   ├── m² Giriş + Öneri Banner
│   ├── Tier Kartları (Kamyon / TIR / Depo)
│   │   └── SingleProductQuoteButton → PdfOfferModal (portal)
│   └── WizardLinkButton → Takım Sistem Fiyat Al
└── SiteFooter (shared, client)
Sorumluluk Dağılımı:

Bileşen	Satır	Sorumluluk
UrunDetayPage	246	Veri çekme, metadata, sayfa iskeleti
ProductPricePanel	438	Tier hesaplama, şehir/m² state, fiyat gösterimi
SingleProductQuoteButton	166	PDF teklif, DB kayıt, WhatsApp link
ThicknessSelector	65	URL param yönetimi (?kalinlik=Xcm)
ProductImage	41	Supabase URL + fallback placeholder
WizardLinkButton	57	Wizard pre-fill + router.push('/')
Güçlü Yönler:

RSC (Server Component) → paralel Promise.all ile 3 tablo aynı anda çekilir
ProductPricePanel bileşenine tüm veriler prop olarak iner (hydration sırasında re-fetch yok)
Suspense + skeleton ile FID düşürülmüş
Zayıf Yön:

ProductPricePanel 438 satır → tek dosyada çok fazla state + hesaplama; extract edilebilir
2. Veri Akışı (Server → Client)

Supabase DB
  ├── plates JOIN plate_prices JOIN brands JOIN material_types
  │     └── buildPlateView() → CatalogProductView
  ├── shipping_zones (tüm aktif şehirler, sortZones ile öncelikli)
  └── logistics_capacity (kalınlık bazlı araç kapasitesi, cm×10=mm key)

CatalogProductView {
  thickness_prices: [{ thickness, base_price, is_kdv_included, discount_2, stock_tuzla }]
  rules: { sales_mode, pricing_visibility_mode, ... }
  depot_discount, depot_min_m2, depot_stock (toplam)
  wizard_prefill: { levhaTipi, markaId, modelId, kalinlik }
}
    ↓ props
ProductPricePanel (client)
  → selectedCode (state) → zone (derived)
  → selectedThickness (URL param → prop) → activeThicknessPrice (derived)
  → neededM2 (state) → recommendation (derived, pure logic)
  → selectedTier (state) → activeTier → displayPrice
Kalınlık → Lojistik Eşleşme Sorunu:


// ProductPricePanel satır 73:
const logistics = logisticsCapacity.find(l => l.thickness === (activeThickness ?? 0) * 10)
plate_prices.thickness cm cinsinden (5), logistics_capacity.thickness mm cinsinden (50).
Bu ×10 dönüşümü implicit — belgelenmemiş ve kırılgan. Eşleşme bulunamazsa logistics = null → tüm tier kartları gizlenir, hiçbir hata gösterilmez.

İskonto Akışı:


rawPrice (KDV dahil ya da hariç)
  → kdvHaricListe (is_kdv_included ? /1.20 : raw)
  → pricePerM2Base (/ packageSizeM2 — paket birim fiyatı)
  → calcPrice(isk1Pct) = pricePerM2Base × (1-isk1/100) × (1-isk2/100) × 1.10
Kâr marjı PROFIT_MARGIN = 0.10 sabit coded, dışarıdan yapılandırılamaz.

3. Karar & Fiyatlama Mantığı
Tier Motoru
Tier	Koşul	İskonto
Kamyon	logistics.lorry_capacity_m2 var	zone.discount_kamyon
TIR	logistics.truck_capacity_m2 var	zone.discount_tir
Depo	activeThicknessPrice.stock_tuzla > 0	product.depot_discount
Depo tier artık per-thickness (son migration sonrası). ✅

Öneri Motoru

if (neededM2 < lorryM2)  → "X m² ekle, kamyon indiriminden faydalan"
else if (neededM2 < truckM2) → "Y m² ekle, TIR indiriminden faydalan"
Eksikler:

neededM2 >= truckM2 iken öneri yok (TIR doluyor, kutlama mesajı?)
Depo tier için öneri yok (mevcut stok vs. istenilen m² karşılaştırması)
Öneri banner, tier'ı otomatik seçmiyor — recommendedTierId state'i var ama sadece badge gösteriyor
pricing_visibility_mode Uygulaması
Mod	Görsel	Tier Kartı	Fiyat
hidden	"Fiyat görüntülenmez"	Gizli	—
quote_required	"Teklif ile belirlenir"	Gizli	—
from_price	Fiyat gösterilir	Gösterilir	✅
exact_price	Fiyat gösterilir	Gösterilir	✅
showTiers = tiers.length > 0 && logistics !== null — logistics olmadan tierlar gösterilmez.
Fiyat var ama tier gizlenirse displayPrice = activeTier?.price de null döner — bu tutarsız olabilir.

4. UX Analizi
Güçlü Noktalar
Sticky panel (lg:sticky lg:top-6) — scroll sırasında fiyat sürekli görünür
Tier kartları — Kamyon/TIR/Depo seçimi dokunmatik-dostu, görsel ayrım net
Öneri banner — "X m² daha ekle, şu kadar tasarruf" somut bilgi
İskonto badge — -%X indirim ve ₺Y/m² tasarruf yan yana, güven oluşturuyor
PDF quote button — Portal kullanımıyla doğru konumlandırılmış modal
Breadcrumb — Kullanıcı nerede olduğunu biliyor
Zayıf Noktalar
A. Kalınlık Seçimi ile Fiyat Paneli Ayrımı
ThicknessSelector URL'i güncelliyor → page re-render → selectedThickness prop olarak iner.
router.replace(url, { scroll: false }) kullanıyor — iyi. Ama Suspense fallback tetiklenirse
fiyat paneli birkaç frame flash yapabilir.

B. Tier Seçimi Bilgi Karmaşası

"min 300 m²" etiketi Depo tier'ında var
"min X m²" bilgisi ayrıca "Minimum sipariş" satırında tekrar gösteriliyor
Kamyon ve TIR için "X m²" miktarı tam sipariş kapasitesi — kullanıcı bunu "minimum" olarak anlıyor mu?
C. Fiyat Şeffaflığı
KDV hariç notu sadece ana fiyatın altında — tier kartlarında yok. Kullanıcı tereddüt yaşayabilir.

D. Mobile Layout
grid grid-cols-1 lg:grid-cols-[3fr_2fr] — mobilde fiyat paneli görselin altında.
Kullanıcı fiyatı görmeden önce tüm görsel + başlık + kalınlık seçiminden geçmeli.
Mobilde floating sticky CTA veya paneli scroll üstüne taşımak dönüşümü artırır.

E. "Takım Sistem Fiyat Al" Bloğu Her Zaman Görünüyor
sales_mode === 'single_only' ürünlerde de wizard bloğu gösteriliyor — mesaj karmaşası.
Bu blok rules.requires_system_context || rules.sales_mode !== 'single_only' koşuluna bağlanmalı.

F. Boş Durum / Hata Durumu
logistics === null iken tier kartları sessizce gizleniyor. Kullanıcı "neden fiyat yok?" sorusu sorar.
"Bu ürün için nakliye verisi henüz girilmemiştir" notu gösterilmeli.

5. Eksikler & Zayıf Noktalar (Öncelik Sırası)
Yüksek Öncelik
#	Eksik	Dosya	Etki
1	logistics === null durumunda kullanıcıya açıklama yok	ProductPricePanel:145	Dönüşüm kaybı
2	Tier kartları KDV hariç/dahil etiketlemiyor	ProductPricePanel:326-330	Güven sorunu
3	Mobile: fiyat paneli scroll altında	UrunDetayPage:139	Mobil dönüşüm
4	'single_only' ürünlerde wizard bloğu görünüyor	ProductPricePanel:408-424	Mesaj karmaşası
Orta Öncelik
#	Eksik	Dosya	Etki
5	neededM2 >= truckM2 durumunda öneri/tebrik yok	ProductPricePanel:159-180	Eksik geri bildirim
6	PROFIT_MARGIN = 0.10 sabit coded	ProductPricePanel:48	Admin kontrolü yok
7	image_gallery veri modelde var, UI'da kullanılmıyor	UrunDetayPage:145-151	SEO + satış
8	Açıklamada rich text / teknik özellik tablosu yok	UrunDetayPage:196-212	İçerik zenginliği
9	Depo tier stok/ihtiyaç karşılaştırması yok	ProductPricePanel:107-108	Karar kolaylaştırma
Düşük Öncelik
#	Eksik	Dosya	Etki
10	logistics_capacity thickness MM formatı belgelenmemiş	ProductPricePanel:73	Bakım riski
11	DecisionPanel bileşeni detay sayfasında kullanılmıyor	DecisionPanel.tsx	Kural görünürlüğü
12	Schema.org Product JSON-LD markup yok	UrunDetayPage	SEO
13	Direkt WhatsApp butonu yok (sadece PDF içinde)	ProductPricePanel	Hızlı iletişim
14	ErrorBoundaryWrapper detay sayfasında sarmalanmamış	app/urunler/[k]/[s]/page.tsx	Hata izolasyonu
6. Performans Analizi
Mevcut İyi Pratikler
Promise.all — 3 Supabase sorgusu paralel (plates + shipping_zones + logistics_capacity)
priority prop — ProductImage above-the-fold LCP optimize
Suspense + skeleton — ProductPricePanel bağımsız hydrate olabilir
RSC mimarisi — JavaScript bundle minimal (sadece client bileşenler gönderilir)
Performans Sorunları
A. shipping_zones Over-fetch
Tüm aktif şehirler çekiliyor (~70+ satır) — sadece sort için tam tablo geliyor.
Alternatif: ORDER BY CASE WHEN city_name IN (...) ... END ile DB'de sıralanmış.

B. getCatalogProduct Double Sequential Query


// Önce plates → MISS olursa
// Sonra accessories → sıralı iki sorgu
slug'ın hangi tabloya ait olduğu URL'den (/urunler/aksesuar/) çıkarılabilir.

C. logistics_capacity Her İstekte Full Table Scan
~10-15 satır statik data. unstable_cache veya revalidate: 3600 ile cache'lenebilir.

D. ISR (Incremental Static Regeneration) Yok
Sayfa ISR olmadan her istek fresh render. Ürün fiyatları sık değişebilir ama sayfa
export const revalidate = 60 ile kolayca cache'lenebilir; admin güncelleme yaptığında
revalidatePath ile on-demand invalidation yapılabilir.

E. ProductPricePanel Re-render Optimizasyonu

3 state değişiminde tüm 438 satır re-render
calcPrice fonksiyonu, tiers dizisi, recommendation IIFE her render'da yeniden hesaplanıyor
Çözüm: useMemo ile memoize et (düşük effort, belirgin gain)
Özet Tablo
Kategori	Puan (10)	Ana Not
Mimari	8/10	RSC + paralel fetch iyi; PricePanel monolitik
Veri Akışı	7/10	Logistics cm×10 implicit; double-query riski
Karar Mantığı	8/10	Tier + öneri sistemi olgun; depo per-thickness ✅
UX	7/10	Sticky panel + tier kartlar güçlü; mobil zayıf
Eksikler	—	logistics=null boş durum, gallery, Schema.org
Performans	6/10	ISR yok, shipping_zones over-fetch, memo yok
Önerilen Sonraki Adımlar (Öncelik Sırası)
logistics === null boş durum mesajı — 2 satır ekleme, yüksek etki
sales_mode === 'single_only' ürünlerde wizard bloğunu gizle — 3 satır koşul
Tier kartlarına KDV hariç etiketi — UX güveni
logistics_capacity cache — unstable_cache ile, DB yükü azalır
image_gallery galeri bileşeni — CatalogProductView'da zaten var, UI yok
Schema.org Product JSON-LD markup — SEO kazanımı
ISR (revalidate = 60 + revalidatePath) — sunucu yükü azaltır