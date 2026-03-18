# Fiyat Güncelleme Sistemi - Yol Haritası

## 1. Otomatik Fiyat Güncelleme Akışı

```
WhatsApp'tan gelen Excel → Google Drive'a yükle → Otomatik işleme → Supabase güncelleme
```

### Gerekli Bileşenler

#### A. Google Drive Entegrasyonu

- **Klasör:** `filli_boya_fiyat_listeleri`
- **Tetikleme:** Yeni dosya yüklendiğinde otomatik çalışacak
- **Teknoloji:** Google Apps Script veya Node.js + Google Drive API

#### B. Excel Parser

- **Kütüphane:** `xlsx` (SheetJS)
- **Özellikler:**
  - KDV dahil/hariç otomatik algılama (sütun başlığından)
  - İskonto sütunlarını okuma (İSK1, İSK2)
  - Kalınlık bazlı fiyatları parse etme

#### C. Supabase Güncelleme

- **Tablolar:** `plates`, `plate_prices`, `accessories`
- **Upsert mantığı:** Varsa güncelle, yoksa ekle

---

## 2. KDV Mantığı (TAMAMLANDI)

### Veritabanı Yapısı

```sql
-- Her tabloda is_kdv_included sütunu var
plates.is_kdv_included BOOLEAN DEFAULT true
plate_prices.is_kdv_included BOOLEAN DEFAULT true
accessories.is_kdv_included BOOLEAN DEFAULT true
```

### Kurallar

| Ürün Tipi | KDV Durumu | is_kdv_included |
|-----------|------------|-----------------|
| Taşyünü Levha | KDV HARİÇ | false |
| EPS Levha | KDV DAHİL | true |
| Toz Grubu | KDV DAHİL | true |

### Hesaplama Formülü

```typescript
// 1. KDV hariç fiyata normalize et
const kdvHaricListe = isKdvIncluded ? basePrice / 1.20 : basePrice;

// 2. İskonto uygula
const iskontoluFiyat = kdvHaricListe * (1 - isk1/100) * (1 - isk2/100);

// 3. Kar ekle
const karliKdvHaric = iskontoluFiyat * (1 + karMarji/100);

// 4. KDV ekle (müşteriye göster)
const kdvDahilSatis = karliKdvHaric * 1.20;
```

---

## 3. Site Entegrasyonu (tasyunufiyatlari.com)

### Mevcut Durum

- Günlük 50-60 ziyaretçi
- SEO değeri var (URL'ler korunmalı)
- Katalog modunda çalışıyor

### Yapılacaklar

1. **URL Yapısını Koru:** Mevcut linkler bozulmamalı
2. **Ürün Sayfalarına CTA Ekle:** "Paket Fiyatı Al" butonu
3. **Gamification Bar:** TIR/Kamyon doluluk göstergesi

### Gamification Bar Özellikleri

```
[████████░░░░░░░░░░░░] 40% Dolu

🚛 TIR kapasitesi: 1000 m²
📦 Sepetiniz: 400 m²
➕ Tamamlamak için: 600 m² daha

💡 Tam TIR'a tamamlarsanız %5 ek indirim!
```

---

## 4. Sonraki Adımlar

### Öncelik 1: KDV Güncellemesi (BUGÜN)

- [ ] `database_kdv_update.sql` dosyasını Supabase'de çalıştır
- [ ] Tarayıcıda test et

### Öncelik 2: Google Drive Entegrasyonu (BU HAFTA)

- [ ] Google Cloud Console'da proje oluştur
- [ ] Drive API etkinleştir
- [ ] Service Account oluştur
- [ ] Fiyat okuma scripti yaz

### Öncelik 3: Site Entegrasyonu (SONRAKI HAFTA)

- [ ] tasyunufiyatlari.com içeriğini analiz et
- [ ] URL yapısını çıkar
- [ ] Yeni siteye entegre et

---

## Notlar

### Excel Dosya Formatları

**Taşyünü Listesi (KDV HARİÇ):**

```
MALZEME İSMİ | KDV HARİÇ LİSTE | İSK1 | İSK2 | KDV HARİÇ İSKONTOLU | M2 FİYATI
```

**EPS/Toz Grubu Listesi (KDV DAHİL):**

```
MALZEME İSMİ | KDV DAHİL LİSTE | İSK1 | İSK2 | KDV DAHİL İSKONTOLU | M2 FİYATI
```

### Algılama Mantığı

```javascript
// Sütun başlığından KDV durumunu algıla
const isKdvIncluded = columnHeader.includes('KDV DAHİL') || 
                      !columnHeader.includes('KDV HARİÇ');
```
