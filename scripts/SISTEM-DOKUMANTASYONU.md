# TaşYünü Fiyatları — Sistem Dokümantasyonu

**Tarih:** 2026-03-23
**Versiyon:** v1.1 (Katalog + Teklif Sistemi)

---

## 1. Proje Özeti

Taşyünü ve EPS levha izolasyon ürünlerinin fiyat hesaplama, katalog listeleme ve teklif oluşturma platformu. B2B odaklı; müşteri müteahhitler ve yapı firmaları, sipariş miktarı / şehir / ürün seçimine göre anlık fiyat görerek resmi PDF teklif oluşturabiliyor.

**Ana iş akışı:**
```
Ürün sayfası → Şehir + m² seç → Tier seç → Teklif Oluştur → PDF indir
```

---

## 2. Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Stil | Tailwind CSS v4 (config dosyası YOK, tümü globals.css) |
| Veritabanı | Supabase (PostgreSQL) |
| Auth (admin) | HTTP Basic Auth — middleware.ts |
| PDF Üretimi | jsPDF + html2canvas (client-side) |
| Form Validation | react-hook-form + zod |
| State (Wizard) | Zustand (useWizardStore) |
| Deployment | Vercel (ISR destekli) |

---

## 3. Veritabanı Tabloları

### Ürün Tabloları
```
plates
  ├── id, name, short_name, slug
  ├── base_price, discount_2
  ├── thickness_options[]          — statik fallback (plate_prices'tan türetilir)
  ├── sales_mode                   — 'single_only' | 'quote_only' | 'single_or_quote' | 'system_only'
  ├── pricing_visibility_mode      — 'hidden' | 'from_price' | 'exact_price' | 'quote_required'
  ├── minimum_order_type/value
  ├── requires_city_for_pricing
  ├── requires_system_context
  ├── catalog_description, meta_title, meta_description
  ├── image_cover, image_gallery[]
  ├── depot_discount, depot_min_m2 — Tuzla depo tier konfigürasyonu
  ├── brands (FK)
  └── material_types (FK)

plate_prices                       — kalınlık bazlı fiyat tablosu
  ├── thickness (cm)               — ⚠️ cm cinsinden
  ├── base_price
  ├── is_kdv_included (bool)
  ├── discount_2 (%)               — ISK2 iskontosu
  └── stock_tuzla (m²)             — Tuzla depo stoku

accessories
  ├── id, name, short_name, slug
  ├── base_price
  ├── sales_mode, pricing_visibility_mode
  ├── brands (FK)
  └── accessory_types (FK)
```

### Operasyon Tabloları
```
quotes                             — teklif kayıtları
  ├── ref_code (TY + timestamp)
  ├── customer_name, email, phone, company, address
  ├── submission_type              — 'pdf_quote' | 'wizard_quote'
  ├── source_channel               — 'catalog' | 'wizard'
  ├── material_type, brand_id, model_id, model_name
  ├── thickness_cm, area_m2
  ├── city_code, city_name
  ├── total_price, price_per_m2
  └── created_at

shipping_zones                     — şehir bazlı nakliye ve iskonto
  ├── city_code, city_name
  ├── base_shipping_cost
  ├── discount_kamyon (%)          — Kamyon tier için ISK1
  ├── discount_tir (%)             — TIR tier için ISK1
  └── is_active

logistics_capacity                 — araç kapasitesi (tier hesabı için)
  ├── thickness (mm)               — ⚠️ mm cinsinden (plate_prices.thickness × 10)
  ├── lorry_capacity_m2            — Kamyon kapasitesi
  ├── truck_capacity_m2            — TIR kapasitesi
  └── package_size_m2              — paket birim alanı

quote_funnel_events               — funnel takip
```

---

## 4. URL Yapısı

```
/                                  — Ana sayfa (Wizard)
/urunler                           — Ürün kategorileri
/urunler/tasyunu-levha             — Kategori listesi
/urunler/eps-levha                 — Kategori listesi
/urunler/aksesuar                  — Kategori listesi
/urunler/[kategori]/[slug]         — Ürün detay sayfası
/ofis                              — Admin paneli (Basic Auth korumalı)
/api/admin/*                       — Admin API (Basic Auth korumalı)
/api/quotes                        — Teklif kayıt API
/api/catalog/products              — Katalog ürün listesi
```

---

## 5. Katalog Sistemi Mimarisi

### Veri Akışı
```
Supabase DB
  ├── plates JOIN plate_prices JOIN brands JOIN material_types
  │     └── buildPlateView() → CatalogProductView
  └── accessories JOIN brands JOIN accessory_types
        └── buildAccessoryView() → CatalogProductView

CatalogProductView          — frontend unified tip
  ├── rules: ProductRules   — satış + fiyat kural seti
  ├── thickness_prices[]    — kalınlık bazlı tam fiyat tablosu
  ├── wizard_prefill        — Wizard pre-fill verisi
  └── depot_* fields        — Tuzla depo tier konfigürasyonu
```

### ProductRules
Her ürünün iki temel kuralı:

**sales_mode** — kullanıcı ne yapabilir?
- `single_only` → sadece direkt teklif (Wizard bloğu gizlenir)
- `quote_only` → sadece teklif akışı
- `single_or_quote` → ikisi de
- `system_only` → sadece paket/sistem içinde (katalogda listelenmez)

**pricing_visibility_mode** — fiyat görünür mü?
- `hidden` → fiyat hiç gösterilmez
- `quote_required` → "Teklif ile belirlenir"
- `from_price` → fiyat + tier kartları gösterilir
- `exact_price` → fiyat + tier kartları gösterilir (aynı davranış)

---

## 6. Ürün Detay Sayfası Mimarisi

```
UrunDetayPage (RSC — server)
├── Paralel veri çekimi (Promise.all)
│   ├── getCatalogProduct(slug)
│   ├── shipping_zones (aktif şehirler, öncelikli sıralı)
│   └── logistics_capacity (kalınlık/araç kapasitesi)
│
├── SiteHeader
├── Breadcrumb
├── [MOBIL BAĞLAM BLOĞU — lg:hidden]
│   ├── Başlık + Marka + Badge
│   ├── Kalınlık Seçimi (ThicknessSelector)
│   └── "Seçtiğiniz kalınlığa göre fiyatlar aşağıda gösterilir"
│
├── Grid: grid-cols-1 lg:grid-cols-[3fr_2fr]
│   ├── SOL KOLON (order-2 lg:order-1)
│   │   ├── ProductImage (priority LCP)
│   │   ├── Başlık Bloğu [hidden lg:block]
│   │   ├── Kalınlık Seçici [hidden lg:block]
│   │   └── Açıklama (catalog_description)
│   │
│   └── SAĞ KOLON (order-1 lg:order-2, lg:sticky lg:top-6)
│       └── ProductPricePanel [CLIENT]
│           ├── Fiyat göstergesi
│           ├── Şehir seçimi
│           ├── Proje Metrajı (m²)
│           ├── TIR kapasitesi banner
│           ├── Öneri banner
│           ├── Tier kartları (Kamyon / TIR / Hızlı Teslim)
│           ├── SingleProductQuoteButton [CLIENT]
│           │   ├── Normal: "Anında Teklif Oluştur" (solid orange)
│           │   └── Success: checklist + PDF butonları
│           ├── Güven notu
│           ├── WhatsApp text link
│           └── Takım Upsell Bloğu
│
└── SiteFooter
```

**Mobil sıralama:** başlık → kalınlık → fiyat paneli → görsel → açıklama
**Desktop sıralama:** görsel + içerik (sol) | fiyat paneli sticky (sağ)

---

## 7. Fiyatlandırma Motoru

### Fiyat Hesaplama Formülü
```
rawPrice (DB'den)
  → kdvHaricListe = isKdvIncluded ? rawPrice / 1.20 : rawPrice
  → pricePerM2Base = kdvHaricListe / packageSizeM2        (paket birim fiyatı)
  → calcPrice(isk1Pct) = pricePerM2Base × (1 - ISK1/100) × (1 - ISK2/100) × 1.10
```

- **ISK1:** Tier iskontosu (Kamyon / TIR için shipping_zones'dan gelir)
- **ISK2:** Ürün iskontosu (plate_prices.discount_2, varsayılan %8)
- **PROFIT_MARGIN:** %10 sabit (ProductPricePanel.tsx satır 48)
- **KDV:** Fiyatlar KDV hariç gösterilir, teklif PDF'inde %20 KDV ayrıca hesaplanır

### Tier Sistemi
```
Tier        Koşul                           ISK1
────────────────────────────────────────────────
Kamyon 🚛   logistics.lorry_capacity_m2     zone.discount_kamyon
TIR 🚚      logistics.truck_capacity_m2     zone.discount_tir
Hızlı Teslim ⚡ plate_prices.stock_tuzla > 0  product.depot_discount
```

**Kritik dönüşüm:** `logistics_capacity.thickness` MM cinsinden, `plate_prices.thickness` CM cinsinden.
Eşleşme: `logistics.thickness === activeThickness * 10`

### Öneri Motoru
```
neededM2 < lorryM2  → "X m² ekle → Kamyon indiriminden faydalan"
neededM2 < truckM2  → "Y m² ekle → TIR indiriminden faydalan"
neededM2 >= truckM2 → "✅ En avantajlı fiyat seviyesine ulaştınız — TIR fiyatı uygulanır"
```

### Şehir Öncelik Sıralaması
İstanbul, Kocaeli, Bursa, Bolu, Sakarya, Düzce, Tekirdağ, Yalova, Balıkesir öncelikli.
Konum notu: İstanbul → "Depoya en yakın — en hızlı teslim" / Yakın il kodları → "Bölgesel avantajlı teslim"

---

## 8. Teklif Oluşturma Akışı

```
Kullanıcı: "Anında Teklif Oluştur" (solid orange primary buton)
    ↓
PdfOfferModal açılır
  Form alanları: Firma Adı* | İlgili Kişi* | İlçe* | İl* | Adres* | Telefon* | Mail
  Submit: "Teklifimi Oluştur" / "Hazırlanıyor..."
    ↓
handleSubmit()
  1. refCode = TY + timestamp (son 7 hane)
  2. POST /api/quotes → DB kayıt (hata olsa devam)
  3. generateQuotePDF() → doc.save() (otomatik indir) + blobUrl döner
  4. window.open(blobUrl, '_blank') → yeni sekmede aç (popup blocker riski var)
  5. setSuccessState({ refCode, pdfUrl, pdfFilename })
    ↓
Başarı Ekranı
  ✅ Teklifiniz hazır
  ✓ En avantajlı fiyat uygulandı
  ✓ Talep sisteme kaydedildi
  ✓ PDF hazırlandı
  "PDF yeni sekmede açıldı. İsterseniz cihazınıza da indirebilirsiniz."
  [Teklifi Görüntüle] [↓ PDF İndir]
  Yeni teklif oluştur
```

### PDF İçeriği
- Firma ve kişi bilgileri
- Ürün: marka, model, kalınlık, m²
- Fiyat tablosu: m² fiyatı, KDV hariç toplam, %20 KDV, genel toplam
- Geçerlilik süresi: 24 saat
- QR kod / WhatsApp linki (müşteri → şirket iletişim için)
- Referans kodu

### Teklif Referans Kodu Formatı
`TY` + `Date.now()` son 7 hanesi → örnek: `TY4823619`

---

## 9. ISR (Incremental Static Regeneration)

```ts
// app/urunler/[kategori]/[slug]/page.tsx
export const revalidate = 60; // 60 saniye cache
```

Admin panelinden fiyat güncellemesi yapıldığında `revalidatePath('/urunler/...')` ile on-demand invalidation yapılabilir (henüz entegre edilmemiş).

---

## 10. Admin Paneli

**URL:** `/ofis`
**Koruma:** HTTP Basic Auth (env: `ADMIN_USER`, `ADMIN_PASSWORD`)
**Mimari:** Tek büyük `app/ofis/page.tsx` (monolitik, ~2700+ satır)

Admin bileşenleri (`components/admin/`):
- `AdminShell` — ana wrapper (sidebar + topbar + sağ panel)
- `AdminSidebar` — navigasyon (240px, Nexus design)
- `AdminTopbar` — breadcrumb + arama + saat
- `AdminRightPanel` — 24s bar chart + DB istatistikleri
- `AdminLoadingScreen` — açılış animasyonu
- `MetricCard` — dashboard metrik kartları
- `ParticleBackground` — canvas particle animasyonu
- `ImportPreview` — Excel import önizleme

Admin API'leri (`/api/admin/`):
- `quotes/` — teklif listesi + tekil teklif
- `plates/[id]` — ürün kural güncelleme (PATCH)
- `dashboard-metrics/` — özet istatistikler
- `combination-metrics/` — ürün kombinasyon analizi

---

## 11. Önemli Teknik Kararlar

### RSC + Client Component Ayrımı
- Veri çekme: Server Component (RSC) — paralel `Promise.all`
- Fiyat hesaplama, tier state, form: Client Component
- Hydration sırasında re-fetch yok — tüm veriler prop olarak iner

### ThicknessSelector — URL State
Kalınlık seçimi `?kalinlik=9cm` URL parametresiyle yönetilir.
`parseInt("9cm") → 9` — doğrudan parse çalışır, ek işlem gerekmez.

### Kalınlık Birimi Dönüşümü (Kritik!)
`plate_prices.thickness` → **cm** (örn: 5)
`logistics_capacity.thickness` → **mm** (örn: 50)
Eşleşme: `logistics.thickness === activeThickness * 10`
Bu dönüşüm implicit ve belgelenmemiş — dikkat edilmeli.

### Depo Stoku — Per-Thickness
Depo stoku `plate_prices.stock_tuzla` ile kalınlık bazında tutulur.
`depot_stock` toplam sum, `activeThicknessPrice.stock_tuzla` seçili kalınlığın stoku.

### PDF Üretimi — Client Side
jsPDF + html2canvas ile tamamen tarayıcı tarafında üretilir. Server maliyeti yok.
Ana fonksiyon: `lib/pdfGenerator.ts::generateQuotePDF()` → `Promise<string>` (blob URL)
Fallback: `generateFallbackQuotePDF()` — html2canvas başarısız olursa sade jsPDF

### PROFIT_MARGIN
`ProductPricePanel.tsx:48` → `const PROFIT_MARGIN = 0.10` — hardcoded, admin kontrolü yok.

---

## 12. Açık TODOlar

```
[ ] Ops bildirimi: server-side WhatsApp Business API (Twilio/360dialog)
    → DB kaydı yeterli şimdilik, admin panelinden takip

[ ] getCatalogProduct() double sequential query
    → plates → miss → accessories sıralı iki sorgu
    → Optimizasyon: kategori URL segmentinden ('/aksesuar') tablo seç

[ ] logistics_capacity cache
    → ~15 satır statik data, her request full fetch
    → unstable_cache veya revalidate:3600 ile çözülebilir

[ ] revalidatePath entegrasyonu
    → Admin fiyat güncellediğinde /urunler/* otomatik invalidate edilmeli

[ ] PROFIT_MARGIN admin kontrolü
    → plates tablosuna profit_margin kolonu eklenebilir

[ ] image_gallery galerisi
    → CatalogProductView'da var, UI'da kullanılmıyor

[ ] A/B test: otomatik PDF indirme
    → Seçenek A (mevcut): yeni sekme + otomatik indir
    → Seçenek B: sadece yeni sekme, kullanıcı "PDF İndir" ile indirir

[ ] useMemo — ProductPricePanel
    → tiers, calcPrice, recommendation her render'da yeniden hesaplanıyor
    → useMemo ile memoize edilebilir
```

---

## 13. Dosya Haritası (Kritik Dosyalar)

```
app/
  page.tsx                              — Ana sayfa (Wizard)
  globals.css                           — Tailwind v4 + Nexus design tokens
  urunler/
    page.tsx                            — Kategori listesi
    [kategori]/page.tsx                 — Alt kategori
    [kategori]/[slug]/page.tsx          — Ürün detay (RSC)
  ofis/page.tsx                         — Admin paneli (monolitik ~2700 satır)
  api/
    quotes/route.ts                     — Teklif kayıt
    admin/quotes/route.ts               — Admin teklif API
    admin/plates/[id]/route.ts          — Ürün kural güncelleme
    catalog/products/route.ts           — Katalog API

components/
  catalog/
    ProductPricePanel.tsx               — Ana fiyat + CTA bileşeni (474 satır)
    SingleProductQuoteButton.tsx        — Teklif butonu + success state
    ThicknessSelector.tsx               — URL-based kalınlık seçimi
    ProductImage.tsx                    — Supabase URL + fallback
    WizardLinkButton.tsx                — Wizard pre-fill + router.push
  modal/
    PdfOfferModal.tsx                   — Teklif formu modal
  admin/
    AdminShell.tsx, AdminSidebar.tsx    — Admin UI
  shared/
    SiteHeader.tsx, SiteFooter.tsx
    ErrorBoundaryWrapper.tsx            — react-error-boundary wrapper

lib/
  catalog/
    types.ts                            — CatalogProductView, ProductRules, DecisionContext
    server.ts                           — getCatalogProduct(), getCatalogProducts()
    decision.ts                         — getDecisionContext() pure function
    slug.ts                             — generateSlug(), buildMinimumOrderLabel()
  pdfGenerator.ts                       — Client-side PDF üretimi (jsPDF + html2canvas)
  supabase.ts                           — Supabase client
  supabase-server.ts                    — Server-side Supabase client

middleware.ts                           — /ofis + /api/admin/* Basic Auth koruması
```
