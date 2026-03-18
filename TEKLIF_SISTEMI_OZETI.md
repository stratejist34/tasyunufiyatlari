# Teklif Sistemi Özeti
**Tarih:** 13 Aralık 2025
**Özellik:** Müşteri Teklif Talepleri ve Admin Yönetimi

## 📋 İçindekiler
1. [Veritabanı Şeması](#veritabanı-şeması)
2. [Frontend - Teklif Formu](#frontend---teklif-formu)
3. [Admin Paneli - Teklif Yönetimi](#admin-paneli---teklif-yönetimi)
4. [Kullanım Senaryoları](#kullanım-senaryoları)

---

## 1. Veritabanı Şeması

### `quotes` Tablosu
**Dosya:** `database_quotes.sql`

```sql
CREATE TABLE quotes (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Müşteri Bilgileri
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_company VARCHAR(255),
    customer_address TEXT,

    -- Sipariş Detayları
    material_type VARCHAR(50) NOT NULL,
    brand_id BIGINT,
    brand_name VARCHAR(255) NOT NULL,
    model_name VARCHAR(255),
    thickness_cm INTEGER NOT NULL,
    area_m2 DECIMAL(10, 2) NOT NULL,
    city_code VARCHAR(10) NOT NULL,
    city_name VARCHAR(255) NOT NULL,

    -- Paket Bilgileri
    package_name VARCHAR(255) NOT NULL,
    package_description TEXT,
    plate_brand_name VARCHAR(255) NOT NULL,
    accessory_brand_name VARCHAR(255) NOT NULL,

    -- Fiyat Bilgileri
    total_price DECIMAL(12, 2) NOT NULL,
    price_per_m2 DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    price_without_vat DECIMAL(12, 2) NOT NULL,
    vat_amount DECIMAL(12, 2) NOT NULL,

    -- Lojistik Bilgileri
    package_count INTEGER NOT NULL,
    package_size_m2 DECIMAL(5, 2) NOT NULL,
    items_per_package INTEGER NOT NULL,
    vehicle_type VARCHAR(20),
    lorry_capacity_packages INTEGER,
    truck_capacity_packages INTEGER,
    lorry_fill_percentage DECIMAL(5, 2),
    truck_fill_percentage DECIMAL(5, 2),

    -- Paket İçeriği (JSON)
    package_items JSONB NOT NULL,

    -- Teklif Durumu
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',

    -- Admin Notları
    admin_notes TEXT,
    quoted_price DECIMAL(12, 2),
    quote_sent_at TIMESTAMP WITH TIME ZONE,
    quote_sent_by VARCHAR(255),

    -- İletişim Durumu
    contact_attempted_at TIMESTAMP WITH TIME ZONE,
    contact_successful BOOLEAN DEFAULT FALSE,
    follow_up_date DATE
);
```

### Durumlar (Status)
- `pending` - Bekliyor (Yeni gelen talepler)
- `contacted` - İletişimde (Müşteriyle görüşüldü)
- `quoted` - Teklif Verildi (Fiyat teklifi gönderildi)
- `approved` - Onaylandı (Müşteri onayladı)
- `rejected` - Reddedildi (Müşteri reddetti)
- `completed` - Tamamlandı (İş tamamlandı)

### Öncelikler (Priority)
- `low` - Düşük
- `normal` - Normal (Varsayılan)
- `high` - Yüksek
- `urgent` - Acil

---

## 2. Frontend - Teklif Formu

### Dosya
`tasyunu-front/app/page.tsx`

### Özellikler

#### 2.1 State Yönetimi
```typescript
// Teklif Formu State'leri
const [showQuoteModal, setShowQuoteModal] = useState(false);
const [selectedPackageForQuote, setSelectedPackageForQuote] = useState<CalculatedPackage | null>(null);
const [quoteForm, setQuoteForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerCompany: "",
    customerAddress: ""
});
const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
```

#### 2.2 Teklif Al Butonu
**Konum:** Satır 1448-1456

Her paket kartının altında bulunan "Teklif Al" butonu:
```tsx
<button
    onClick={() => handleQuoteRequest(pkg)}
    className="w-full mt-6 py-3 rounded-xl font-semibold transition-all"
>
    Teklif Al
</button>
```

#### 2.3 Teklif Modal
**Konum:** Satır 1497-1669

Modal yapısı:
- **Header:** Paket adı ve metraj bilgisi
- **Sipariş Özeti:** 6 adet bilgi kartı (Paket, Malzeme, Metraj, Fiyat, Şehir, Paket Sayısı)
- **Form Alanları:**
  - Ad Soyad (zorunlu)
  - E-posta (zorunlu)
  - Telefon (zorunlu)
  - Firma Adı (opsiyonel)
  - Teslimat Adresi (opsiyonel)
- **Butonlar:** İptal ve Teklif Gönder

#### 2.4 Veri Gönderimi
**Konum:** Satır 798-899

`handleSubmitQuote()` fonksiyonu:
1. Form validasyonu yapar
2. Teklif verisini hazırlar
3. Supabase'e kaydeder
4. Başarı/hata mesajı gösterir
5. Formu sıfırlar

---

## 3. Admin Paneli - Teklif Yönetimi

### Dosya
`tasyunu-front/app/admin/page.tsx`

### 3.1 Tab Ekleme
**Konum:** Satır 67

Yeni "📋 Teklifler" tabı eklendi:
```typescript
{ id: "quotes", label: "📋 Teklifler", icon: "📋" }
```

### 3.2 QuotesTab Bileşeni
**Konum:** Satır 199-614

#### 3.2.1 Özellikler
- **Filtreleme:** Durum bazlı filtreleme (Tümü, Bekliyor, İletişimde, vb.)
- **Tablo Görünümü:** 9 sütunlu tablo
- **Durum Güncelleme:** Dropdown ile anlık durum değiştirme
- **Öncelik Güncelleme:** Dropdown ile öncelik değiştirme
- **Detay Modal:** Tıklayarak tüm bilgileri görme

#### 3.2.2 Tablo Sütunları
1. **Tarih:** Teklif oluşturma tarihi ve saati
2. **Müşteri:** Ad, e-posta, telefon
3. **Paket:** Paket adı ve marka
4. **Malzeme:** Malzeme tipi ve kalınlık
5. **Metraj:** m² cinsinden alan
6. **Fiyat:** Toplam fiyat ve m² fiyatı
7. **Durum:** Dropdown ile değiştirilebilir
8. **Öncelik:** Dropdown ile değiştirilebilir
9. **Detay:** Modal açma butonu

#### 3.2.3 Detay Modal
**Konum:** Satır 457-611

Modal içeriği:
- **Müşteri Bilgileri:** Ad, e-posta, telefon, firma, adres
- **Sipariş Detayları:** Paket, marka, malzeme, metraj, şehir, paket sayısı
- **Fiyat Bilgileri:** KDV hariç, KDV, toplam, m² fiyatı
- **Lojistik Bilgileri:** Araç tipi, paket sayısı, kamyon/tır doluluk oranı

---

## 4. Kullanım Senaryoları

### 4.1 Müşteri Tarafı (Frontend)

#### Senaryo 1: Yeni Teklif Talebi
```
1. Müşteri fiyat hesaplar (Malzeme, Kalınlık, Metraj, Şehir seçer)
2. 3 paket seçeneği gösterilir
3. Birinde "Teklif Al" butonuna tıklar
4. Modal açılır ve sipariş özeti gösterilir
5. İletişim bilgilerini doldurur
6. "Teklif Gönder" butonuna tıklar
7. Başarı mesajı alır
```

#### Veri Akışı:
```
Frontend Form
    ↓
handleSubmitQuote()
    ↓
Supabase INSERT
    ↓
quotes tablosu
    ↓
status: 'pending'
priority: 'normal'
```

### 4.2 Admin Tarafı (Admin Panel)

#### Senaryo 2: Teklif Takibi
```
1. Admin "📋 Teklifler" tabına tıklar
2. Tüm teklifler listelenir
3. "Bekliyor" filtresine tıklar
4. Yeni gelen teklifler gösterilir
5. Bir teklife "Detay →" butonuna tıklar
6. Müşteri ve sipariş bilgilerini inceler
7. Modal'ı kapatır
8. Durum dropdown'ından "İletişimde" seçer
9. Öncelik dropdown'ından "Yüksek" seçer
```

#### Senaryo 3: Teklif İşleme
```
1. Admin teklifte durumu "İletişimde" olarak günceller
2. Müşteriyle görüşür
3. Fiyat teklifi verir
4. Durumu "Teklif Verildi" olarak günceller
5. Müşteri onaylarsa: "Onaylandı"
6. Müşteri reddederse: "Reddedildi"
7. İş tamamlanırsa: "Tamamlandı"
```

---

## 5. Veri Örnekleri

### 5.1 Örnek Teklif Kaydı
```json
{
  "id": 1,
  "created_at": "2025-12-13T10:30:00Z",
  "customer_name": "Ahmet Yılmaz",
  "customer_email": "ahmet@example.com",
  "customer_phone": "0532 123 45 67",
  "customer_company": "ABC İnşaat Ltd. Şti.",
  "customer_address": "Atatürk Cad. No:123 Kadıköy/İstanbul",

  "material_type": "tasyunu",
  "brand_name": "Paroc",
  "thickness_cm": 10,
  "area_m2": 500.00,
  "city_code": "34",
  "city_name": "İstanbul",

  "package_name": "Standart Paket",
  "package_description": "Dengeli fiyat/performans",
  "plate_brand_name": "Paroc",
  "accessory_brand_name": "Dalmacyalı",

  "total_price": 150000.00,
  "price_per_m2": 300.00,
  "shipping_cost": 5000.00,
  "discount_percentage": 10.00,
  "price_without_vat": 125000.00,
  "vat_amount": 25000.00,

  "package_count": 278,
  "package_size_m2": 1.8,
  "items_per_package": 3,
  "vehicle_type": "truck",
  "truck_capacity_packages": 416,
  "truck_fill_percentage": 66.83,

  "package_items": "[{\"name\":\"Levha\",\"quantity\":278,...}]",

  "status": "pending",
  "priority": "normal"
}
```

---

## 6. API Fonksiyonları

### Frontend Functions

#### `handleQuoteRequest(pkg: CalculatedPackage)`
Teklif modal'ını açar ve seçili paketi ayarlar.

#### `handleSubmitQuote()`
Teklif formunu Supabase'e kaydeder.

### Admin Functions

#### `loadQuotes()`
Teklifleri veritabanından çeker ve filtreler.

#### `updateQuoteStatus(quoteId, newStatus)`
Teklif durumunu günceller.

#### `updateQuotePriority(quoteId, newPriority)`
Teklif önceliğini günceller.

---

## 7. UI/UX Özellikleri

### Frontend Modal
- ✅ Gradient header (turuncu)
- ✅ Sipariş özeti kartı (turuncu bg)
- ✅ Form validasyonu
- ✅ Loading state (Gönderiliyor...)
- ✅ Başarı/hata mesajları
- ✅ Responsive tasarım
- ✅ Kapatma butonu (X)
- ✅ Bilgilendirme kutusu (mavi bg)

### Admin Panel
- ✅ Status filters (7 adet)
- ✅ Responsive tablo
- ✅ Inline dropdown edit
- ✅ Hover effects
- ✅ Detay modal (4 bilgi kategorisi)
- ✅ Renk kodlu durumlar
- ✅ Yenileme butonu
- ✅ Toplam sayaç

---

## 8. Güvenlik ve Validasyon

### Frontend Validasyon
```typescript
if (!quoteForm.customerName || !quoteForm.customerEmail || !quoteForm.customerPhone) {
    alert("Lütfen adınız, e-posta ve telefon numaranızı giriniz.");
    return;
}
```

### Database Constraints
- `customer_name` - NOT NULL
- `customer_email` - NOT NULL
- `customer_phone` - NOT NULL
- `total_price` - NOT NULL
- `package_items` - NOT NULL (JSONB)

### Indexes
- `idx_quotes_created_at` - Hızlı tarih sorgulama
- `idx_quotes_status` - Durum filtreleme
- `idx_quotes_priority` - Öncelik sıralama
- `idx_quotes_customer_email` - Müşteri arama
- `idx_quotes_brand_id` - Marka bazlı raporlama
- `idx_quotes_city_code` - Şehir bazlı raporlama

---

## 9. Gelecek Geliştirmeler

### Potansiyel Özellikler
1. **E-posta Bildirimleri**
   - Yeni teklif geldiğinde admin'e e-posta
   - Teklif durumu değiştiğinde müşteriye e-posta

2. **WhatsApp Entegrasyonu**
   - Tek tıkla müşteriyi WhatsApp'tan ara
   - Teklif PDF'ini WhatsApp'tan gönder

3. **PDF Export**
   - Teklif detayını PDF olarak indir
   - Müşteriye e-posta ile gönder

4. **Dashboard İstatistikleri**
   - Toplam teklif sayısı
   - Onaylanma oranı
   - Ortalama sipariş değeri
   - En çok talep edilen paketler

5. **Arama ve Filtreleme**
   - Müşteri adı ile arama
   - Tarih aralığı filtreleme
   - Fiyat aralığı filtreleme

6. **Admin Notları**
   - Her teklife not ekleme
   - Müşteriyle görüşme geçmişi

7. **Otomatik Takip**
   - Bekleyen teklifler için hatırlatma
   - 24 saat içinde yanıt verilmeyen teklifler

---

## 10. Dosya Yapısı

```
Tasyunufİyatlari/
├── database_quotes.sql           # Veritabanı şeması
├── TEKLIF_SISTEMI_OZETI.md      # Bu dosya
└── tasyunu-front/
    └── app/
        ├── page.tsx              # Ana sayfa + Teklif formu
        └── admin/
            └── page.tsx          # Admin paneli + Teklif yönetimi
```

---

## 11. Kurulum Adımları

### 1. Veritabanı Tablosunu Oluştur
```bash
# Supabase SQL Editor'da çalıştır:
psql -f database_quotes.sql
```

### 2. Frontend Test Et
```bash
cd tasyunu-front
npm run dev

# Tarayıcıda:
# 1. http://localhost:3000
# 2. Fiyat hesapla
# 3. "Teklif Al" butonuna tıkla
# 4. Formu doldur ve gönder
```

### 3. Admin Panel Test Et
```bash
# Tarayıcıda:
# 1. http://localhost:3000/admin
# 2. "📋 Teklifler" tabına tıkla
# 3. Gönderdiğin teklifi gör
# 4. Durumu değiştir
# 5. Detaya tıkla
```

---

## 12. Özet

✅ **Tamamlanan Özellikler:**
1. Veritabanı şeması oluşturuldu
2. Frontend teklif formu eklendi
3. Teklif modal tasarlandı
4. Supabase entegrasyonu yapıldı
5. Admin panel tab eklendi
6. Teklif listesi oluşturuldu
7. Durum/öncelik güncelleme eklendi
8. Detay modal tasarlandı

🎉 **Sistem kullanıma hazır!**

Müşteriler artık web sitesinden teklif talep edebilir, adminler de tüm talepleri tek ekrandan yönetebilir!
