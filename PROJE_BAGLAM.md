# TaşYünü Fiyatları - Proje Bağlamı

> Bu dosya yeni chat oturumlarında bağlamı korumak için oluşturulmuştur.
> Son güncelleme: 11 Aralık 2024

---

## 1. Proje Özeti

**Amaç:** Taşyünü ve EPS yalıtım malzemeleri için dinamik fiyatlandırma sistemi ve e-ticaret benzeri web uygulaması.

**Mevcut Site:** [tasyunufiyatlari.com](https://tasyunufiyatlari.com) - Günlük 50-60 ziyaretçi, SEO değeri var.

**Yeni Uygulama:** Next.js + Supabase tabanlı paket fiyatlandırma sistemi.

---

## 2. Teknik Yapı

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **Konum:** `c:\Users\Emrah\Desktop\Tasyunufİyatlari\tasyunu-front\`

### Backend

- **Veritabanı:** Supabase (PostgreSQL)
- **Tablolar:**
  - `brands` - Markalar (Dalmaçyalı, Expert, Optimix, Kaspor, OEM)
  - `plates` - Levhalar (EPS, Taşyünü)
  - `plate_prices` - Kalınlık bazlı levha fiyatları
  - `accessories` - Toz grubu ürünleri (yapıştırıcı, sıva, dübel, file, vs.)
  - `accessory_types` - Aksesuar tipleri ve sarfiyat oranları
  - `package_definitions` - Paket tanımları (1. Kalite, 2. Kalite, Ekonomik)
  - `shipping_zones` - Şehir bazlı nakliye ve iskonto bilgileri
  - `shipping_districts` - İlçe bazlı ek nakliye maliyetleri
  - `material_types` - Malzeme tipleri (eps, tasyunu)

---

## 3. Fiyatlandırma Mantığı

### İskonto Sistemi

- **İSK1:** Ürün bazlı sabit iskonto (veritabanından)
- **İSK2:** Marka ve bölgeye göre değişen iskonto
  - Dalmaçyalı/Expert: Ürün bazlı (veritabanından)
  - Optimix Levha: Bölge bazlı (`shipping_zones.optimix_levha_discount`)
  - Optimix Toz: Ürün bazlı (veritabanından)

### KDV Mantığı (YENİ EKLENDİ)

| Ürün Tipi | Liste Fiyatı | is_kdv_included |
|-----------|--------------|-----------------|
| Taşyünü Levha | KDV HARİÇ | false |
| EPS Levha | KDV DAHİL | true |
| Toz Grubu | KDV DAHİL | true |

### Hesaplama Formülü

```typescript
// 1. KDV hariç fiyata normalize et
const kdvHaricListe = isKdvIncluded ? basePrice / 1.20 : basePrice;

// 2. İskonto uygula
const iskontoluFiyat = kdvHaricListe * (1 - isk1/100) * (1 - isk2/100);

// 3. Kar ekle (%10)
const karliKdvHaric = iskontoluFiyat * 1.10;

// 4. KDV ekle (müşteriye göster)
const kdvDahilSatis = karliKdvHaric * 1.20;
```

---

## 4. Uygulama Kategorileri

### Dış Cephe (Mantolama)

- Dalmaçyalı: SW035, İdeal Carbon, Double Carbon
- Expert: Premium, HD150, LD125, EPS Karbonlu, EPS Beyaz, EPS 035 Beyaz
- Optimix: TR7.5, Optimix Karbonlu

### Çatı

- Dalmaçyalı: CS60
- Expert: RF150, PW50

### Ara Bölme (Cephe Giydirme)

- Dalmaçyalı: Yangın Bariyeri
- Expert: VF80

---

## 5. Paket Yapısı

Her paket şunları içerir:

1. **Levha** (EPS veya Taşyünü)
2. **Yapıştırıcı**
3. **Sıva**
4. **Dübel** (kalınlığa uygun boy)
5. **File** (Donatı Filesi)
6. **Fileli Köşe**
7. **Astar**
8. **Mineral Kaplama**

### Paket Tipleri

- **1. Kalite:** Full orijinal sistem (Levha + Toz aynı marka)
- **2. Kalite:** Levha orijinal, toz alternatif
- **Ekonomik:** Alternatif levha + toz

---

## 6. Marka Logoları

Konum: `public/images/markalogolar/`

- `dalmaçyalı taşyünü fiyatları.png`
- `fawori taşyünü fiyatları.png` (Expert ve Optimix için de kullanılıyor)
- `filli boya.png`
- `Knauf Mineral yünleri.png`
- `Tekno Taşyünü ve EPs Fiyatları.png`
- `bina-dis-cephe-kaplama-4000x4000.png` (Hero arka plan)

---

## 7. Önemli Dosyalar

### Frontend

- `app/page.tsx` - Ana sayfa ve tüm hesaplama mantığı
- `lib/supabase.ts` - Supabase client

### SQL Dosyaları

- `database_schema_v3.sql` - Ana veritabanı şeması
- `complete_plate_data.sql` - Tüm levha ve fiyat verileri
- `database_kdv_update.sql` - KDV sütunları ekleme (YENİ)
- `database_update.sql` - Çeşitli güncellemeler
- `database_update_v2.sql` - İskonto güncellemeleri

### Dokümantasyon

- `FIYAT_GUNCELLEME_SISTEMI.md` - Fiyat güncelleme yol haritası
- `PROJE_BAGLAM.md` - Bu dosya

---

## 8. Bekleyen Görevler

### Acil (Bugün)

- [ ] `database_kdv_update.sql` dosyasını Supabase'de çalıştır
- [ ] Tarayıcıda fiyat hesaplamalarını test et

### Bu Hafta

- [ ] Google Drive entegrasyonu (otomatik fiyat güncelleme)
- [ ] Excel okuma scripti

### Sonraki Hafta

- [ ] tasyunufiyatlari.com entegrasyonu (URL'leri koruyarak)
- [ ] Gamification bar (TIR/Kamyon doluluk göstergesi)
- [ ] Sadece levha satışı için minimum miktar kontrolü

---

## 9. Bilinen Sorunlar ve Çözümleri

### Sorun 1: Fiyatlar düşük çıkıyor

**Sebep:** Şehir bazlı TIR iskontosu yanlış uygulanıyordu.
**Çözüm:** Dalmaçyalı/Expert için ürün bazlı iskonto kullanılacak şekilde düzeltildi.

### Sorun 2: Kalınlık bazlı fiyat yok

**Sebep:** `plate_prices` tablosu kullanılmıyordu.
**Çözüm:** `calculatePackage` fonksiyonu `plate_prices` tablosundan fiyat alacak şekilde güncellendi.

### Sorun 3: KDV dahil/hariç karışıklığı

**Sebep:** Taşyünü listeleri KDV hariç, EPS/Toz listeleri KDV dahil geliyor.
**Çözüm:** `is_kdv_included` sütunu eklendi, hesaplama fonksiyonu güncellendi.

---

## 10. Excel Fiyat Listeleri Formatı

### Taşyünü Listesi (KDV HARİÇ)

```
MALZEME İSMİ | KDV HARİÇ LİSTE | İSK1 | İSK2 | KDV HARİÇ İSKONTOLU | M2 FİYATI
```

### EPS/Toz Grubu Listesi (KDV DAHİL)

```
MALZEME İSMİ | KDV DAHİL LİSTE | İSK1 | İSK2 | KDV DAHİL İSKONTOLU | M2 FİYATI
```

---

## 11. Supabase Bağlantı Bilgileri

Konum: `tasyunu-front/lib/supabase.ts`

- URL ve ANON_KEY environment variable olarak saklanmalı
- Şu an hardcoded (güvenlik riski - düzeltilmeli)

---

## 12. Geliştirme Ortamı

```bash
# Projeyi çalıştır
cd c:\Users\Emrah\Desktop\Tasyunufİyatlari\tasyunu-front
npm run dev

# Varsayılan port: 3000
# Eğer meşgulse: 3001
```

---

## 13. Gelecek Özellikler

1. **Otomatik Fiyat Güncelleme**
   - WhatsApp → Google Drive → Otomatik işleme → Supabase

2. **Gamification Bar**
   - TIR kapasitesi göstergesi
   - "X m² daha ekleyin, %Y indirim kazanın" mesajı

3. **Sadece Levha Satışı**
   - Toz grubu olmadan levha satışı
   - Minimum kamyon/TIR kapasitesi kontrolü

4. **SEO Entegrasyonu**
   - tasyunufiyatlari.com URL yapısını koruma
   - Ürün sayfalarına "Paket Fiyatı Al" CTA

---

## 14. İletişim ve Notlar

- Proje sahibi: Emrah
- Geliştirme: Claude Opus 4.5 AI
- Son çalışma: 11 Aralık 2025, 08:12

---

> **Yeni chat açtığınızda:** Bu dosyayı okuyarak bağlamı yakalayabilirsiniz.
> Dosya yolu: `c:\Users\Emrah\Desktop\Tasyunufİyatlari\PROJE_BAGLAM.md`
