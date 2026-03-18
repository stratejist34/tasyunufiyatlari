# TaşYünü & EPS Fiyatları | Sistem Mimarisi ve İş Mantığı (Project Bible)

Bu döküman, projenin teknik yapısını, veritabanı ilişkilerini ve en önemlisi **kuruşu kuruşuna hesaplama mantığını** tanımlar. Gelecekteki geliştirmeler veya yapay zeka modelleri için "tek gerçeklik kaynağı" (Single Source of Truth) olarak tasarlanmıştır.

---

## 1. Veri Yapısı ve Hiyerarşi

Sistem, ürünleri katı bir hiyerarşi içinde yönetir. Bu hiyerarşinin bozulması hesaplamaların sapmasına neden olur.

### Veritabanı İlişkileri (Database Architecture)
1.  **Brands (Markalar):** Dalmaçyalı, Expert, Optimix vb.
2.  **Material Types (Malzeme Türleri):** Taşyünü (slug: `tasyunu`), EPS (slug: `eps`).
3.  **Plates (Levhalar):** Ana yalıtım levhaları. Marka ve Malzeme türüne bağlıdır.
4.  **Plate Prices (Levha Fiyatları):** Kalınlık bazlı (2cm, 5cm, 10cm vb.) liste fiyatları.
    *   **Kritik Alan:** `package_m2`. Her kalınlığın paket metrajı burada tutulur.

### Paket Metrajı Öncelik Sırası (Priority Logic)
Sistem bir ürünün m² fiyatını hesaplarken paket metrajını şu sırayla arar:
1.  **`plate_prices.package_m2`**: (En Yüksek Öncelik) Kalınlığa özel metraj (Örn: EPS 5cm = 5.0m²).
2.  **`plates.package_m2`**: Ürüne genel tanımlı metraj.
3.  **`logistics_capacity.package_size_m2`**: (En Düşük Öncelik) Kalınlığa göre genel varsayılan değer.

---

## 2. Fiyatlandırma Motoru (The Pricing Engine)

Hesaplamalar hem Admin Panelinde (Görüntüleme) hem de Wizard'da (Hesaplama) birebir aynı algoritmayı kullanır.

### A. Net Maliyet Hesabı (KDV Hariç)
Sistem her zaman **KDV Hariç Net Fiyat** üzerinden işlem yapar.
1.  **Normalize Fiyat:** Eğer veritabanında fiyat `is_kdv_included = true` ise, sistem bunu hemen `ListeFiyati / 1.20` yaparak KDV'den arındırır.
2.  **İSK1 (Bölge İskontosu):**
    *   **Taşyünü:** Şehre göre `discount_tir` veya `discount_kamyon` uygulanır.
    *   **EPS:** Şehre özel `eps_toz_region_discount` uygulanır. **Eksikse varsayılan: %9.**
3.  **İSK2 (Bayi/Ürün İskontosu):**
    *   Ürün bazlı iskonto uygulanır. **EPS için eksikse varsayılan: %8.**

**Formül:**
$$NetNet = NormalizeFiyat \times (1 - \frac{İSK1}{100}) \times (1 - \frac{İSK2}{100})$$

### B. Satış Fiyatı (Revenue)
Sistem tüm müşterilere (Admin ve Wizard) nakliye dahil ama KDV hariç olan **"Net Satış"** fiyatını gösterir.
1.  **Kar Marjı:** Sabit **%10**.
2.  **KDV:** Sabit **%20** (Sadece fatura aşamasında/PDF sonunda eklenir).

**Satış Formülü:**
$$NetSatis = NetNet \times 1.10$$

---

### 3. Lojistik ve Metraj Hesaplama (Logistics Flow)

Lojistik hesaplamaları hacimseldir ve m² üzerinden değil, **Paket Adedi** üzerinden yapılır.

1.  **Paketleme:** Müşterinin girdiği m², ürünün gerçek paket metrajına (`realPackageM2`) bölünür ve yukarı yuvarlanır (`Math.ceil`).
    *   *Örn:* 102 m² EPS 5cm (5m²/pkt) seçilirse; `102 / 5 = 20.4` -> **21 Paket**.
2.  **Gerçek Metraj:** Teklif her zaman tam paket üzerinden verilir. `21 Paket * 5m² = 105 m²`.
3.  **Araç Kapasitesi ve Özel Taşyünü Kuralı:** 
    *   Tır/Kamyon doluluk oranları paket adedi üzerinden hesaplanır.
    *   **Yeni Taşyünü Kuralı (v1.2.0):** Eğer Taşyünü siparişi bir kamyonu doldurmuyorsa (low metrage), müşteriye yine de en iyi fiyat olan **Tır İskontosu** (`discount_tir`) verilir. Ancak bu durumda **Nakliye Ücretsiz Değildir**; teklif "Nakliye Hariç" olarak revize edilir ve UI/PDF üzerinde uyarı mesajları gösterilir.
    *   Araç kapasitesi dolduğunda ise hem Tır iskontosu uygulanır hem de Nakliye ücretsiz (Dahil) olur.

---

## 4. Kullanıcı Arayüzü ve Modüller
... (içerik korunur) ...

---

## 5. Kritik Uyarılar (Maintenance)

> [!IMPORTANT]
> **Metraj Senkronu:** Yeni bir EPS ürünü eklenirse veya metrajı değişirse, `plate_prices` tablosundaki `package_m2` alanı mutlaka güncellenmelidir. Sadece lojistik tablosunu güncellemek yeterli değildir.

> [!WARNING]
> **Taşyünü Lojistik İstisnası:** Düşük metrajlı Taşyünü siparişlerinde m² fiyatı çok düşük görünebilir çünkü Tır iskontosu uygulanmıştır. Bu durumlarda "Nakliye Hariç" ibaresinin her yerde (Wizard, WhatsApp, PDF) göründüğünden emin olunmalıdır.

---

**Sürüm:** 1.2.0 (Lojistik Revizyonu)  
**Son Güncelleme:** 2026-01-03  
**Hazırlayan:** Antigravity AI
