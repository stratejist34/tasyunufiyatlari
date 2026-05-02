# Net Sprint Plan

Bu plan:

- [docs/site-plan-cro.md](./site-plan-cro.md)
- [docs/master-cro-roadmap.md](./master-cro-roadmap.md)

üzerinden çıkarılmış uygulanabilir sprint sırasıdır.

Amaç:

- hangi işi önce yapacağımızı netleştirmek
- sprint bazında kapsamı dar tutmak
- ölçülebilir teslimler tanımlamak

---

## Genel Yön

Ana strateji:

- Birincil omurga: `Karar motoru`
- İkincil omurga: `Trust-first`

Ana hedef:

- daha çok kullanıcıyı wizard’a sokmak
- wizard içindeki kararsızlığı azaltmak
- `Fiyat_Gosterildi` sonrası teklif/WhatsApp dönüşümünü artırmak

Ana KPI:

- `Hero CTA -> Wizard giriş oranı`
- `Fiyat_Gosterildi`
- `Pdf_Teklif_Talebi`
- `Whatsapp_Siparis`

---

## Sprint 1

### Ad

Mesajı Netleştir

### Hedef

Kullanıcı daha ilk ekranda:

- burada ne çözüldüğünü anlasın
- niçin güvenmesi gerektiğini görsün
- wizard’a daha net bir niyetle girsin

### Kapsam

- Hero copy revizyonu
- TrustStrip ekleme
- Final CTA copy revizyonu
- FAQ başlık ve soru setini karar odaklı güncelleme

### Dokunulacak alanlar

- `app/page.tsx`
- yeni `components/cro/TrustStrip.tsx`

### Teslim çıktıları

- Yeni hero başlık ve alt metin
- Hero altı 4 maddelik trust strip
- Final CTA metin güncellemesi
- Karar odaklı FAQ soruları

### Başarı ölçütü

- Hero CTA tıklama oranında artış
- Sayfada ilk scroll sonrası terk oranında düşüş

### Risk

- Fazla copy yükü hero’yu ağırlaştırabilir

### Not

Bu sprintte layout mümkün olduğunca az bozulmalı. Hedef yeni section eklemek değil, mesajı keskinleştirmek.

---

## Sprint 2

### Ad

Karar Yardımını Kur

### Hedef

Wizard öncesi ve wizard içinde kararsız kullanıcıyı yalnız bırakmamak.

### Kapsam

- `SituationSelector` ekleme
- wizard step yardım metinleri
- `Emin değilim` destek çıkışı

### Dokunulacak alanlar

- `app/page.tsx`
- yeni `components/cro/SituationSelector.tsx`
- `components/wizard/WizardCalculator.tsx`

### Teslim çıktıları

- Hero ile wizard arasında problem merkezli seçim kartları
- Step 1-4 için daha yönlendirici yardımcı metinler
- Kararsız kullanıcı için düşük sürtünmeli yardım aksiyonu

### Başarı ölçütü

- Wizard step geçiş oranlarında artış
- Step 1 ve Step 2 terk oranında düşüş
- `Situation_Selected` event dağılımı

### Risk

- Fazla seçenek eklenirse kullanıcı yeniden donar

### Not

Selector persona değil, problem üzerinden kurgulanmalı.

---

## Sprint 3

### Ad

Karar Motorunu Görünür Kıl

### Hedef

Kullanıcıya sadece fiyat değil, doğru karar mantığını da göstermek.

### Kapsam

- RiskBlock
- WrongDecisionBlock
- mevcut süreç bölümünü yeniden çerçeveleme

### Dokunulacak alanlar

- `app/page.tsx`
- yeni `components/cro/RiskBlock.tsx`
- yeni `components/cro/WrongDecisionBlock.tsx`

### Teslim çıktıları

- `Mantolama hesabı eksik yapılırsa ne olur?` bölümü
- `En sık yapılan 4 hata` bölümü
- süreç section’ının yeni copy roof ile güncellenmesi

### Başarı ölçütü

- `Fiyat_Gosterildi` oranında artış
- FAQ açılma ihtiyacında göreli düşüş
- Yeni section view event’leri

### Risk

- Korku dili fazla kaçarsa satış copy’si sertleşebilir

### Not

Bu sprintte CTA baskısı artırılmamalı; amaç rehberlik.

---

## Sprint 4

### Ad

Trust Katmanını Topla

### Hedef

Dağınık güven sinyallerini tek yerde görünür hale getirmek.

### Kapsam

- ProofBlock
- örnek teklif kanıtı
- depo/sevkiyat kanıtı
- marka/sistem güven sinyalleri

### Dokunulacak alanlar

- `app/page.tsx`
- yeni `components/cro/ProofBlock.tsx`

### Teslim çıktıları

- merkezi proof section
- örnek PDF/teklif anlatısı
- sevkiyat, depo, referans kodu gibi somut kanıtlar

### Başarı ölçütü

- `Pdf_Teklif_Talebi` oranında artış
- proof section etkileşimleri

### Risk

- gerçek görsel ve kanıt eksikse bu bölüm zayıf kalır

### Not

Bu sprint için mümkünse gerçek saha görseli, örnek teklif ve marka ilişki kanıtı toplanmalı.

---

## Sprint 5

### Ad

Metadata ve SEO Temizliği

### Hedef

Teknik görünürlük ve SERP kalitesini toparlamak.

### Kapsam

- title separator standardizasyonu
- `buildMetadata()` helper yaygınlaştırma
- `og-default.png` kararı
- `BreadcrumbList`
- `LocalBusiness`
- ürün schema eksiklerini tamamlama

### Dokunulacak alanlar

- `lib/seo/buildMetadata.ts`
- `app/layout.tsx`
- `app/hakkimizda/page.tsx`
- `app/iletisim/page.tsx`
- `app/bolge/[sehir]/[ilce]/page.tsx`
- `app/urunler/[kategori]/[slug]/page.tsx`

### Teslim çıktıları

- tek title disiplini
- OG fallback kararı
- schema kapsamının genişlemesi

### Başarı ölçütü

- Rich result test geçişleri
- title tutarlılığı
- paylaşım kartı doğruluğu

### Risk

- ana CRO etkisi kısa vadede görünmeyebilir

---

## Sprint 6

### Ad

İletişim Kısayolu Testleri

### Hedef

Hesaplama yapmak istemeyen kullanıcıya kontrollü alternatif sunmak.

### Kapsam

- sticky mobile contact bar
- generic WhatsApp yardım akışı
- seçili section’larda iletişim varyasyon testi

### Dokunulacak alanlar

- `app/layout.tsx`
- yeni `components/global/StickyContactBar.tsx`
- WhatsApp helper dosyaları

### Teslim çıktıları

- mobil sticky iletişim bileşeni
- context-light WhatsApp mesaj şablonu

### Başarı ölçütü

- mobil iletişim tıklamaları
- sticky bar kullanım oranı
- sticky bar sonrası wizard dönüşümüne negatif etkisinin olmaması

### Risk

- kullanıcıyı ana akıştan erken koparabilir

### Not

Bu sprint ancak Sprint 1-4 sonrası ölçüm alındıktan sonra açılmalı.

---

## Sprint Öncelik Tablosu

### Hemen

1. Sprint 1
2. Sprint 2
3. Sprint 3

### Sonra

4. Sprint 4
5. Sprint 5

### Ölçüme bağlı

6. Sprint 6

---

## Uygulama Bağımlılıkları

### İçerik bağımlı işler

- ProofBlock
- marka/bayi/sertifika kanıtları
- örnek teklif görselleri

### Teknik bağımlı işler

- analytics event genişletmesi
- schema üretimi
- metadata helper standardizasyonu

---

## Net Teslim Kararı

En doğru ilk uygulama sırası:

1. `Hero + TrustStrip + Final CTA + FAQ`
2. `SituationSelector + Wizard help`
3. `RiskBlock + WrongDecisionBlock`
4. `ProofBlock`
5. `SEO/metadata cleanup`
6. `Sticky contact experiments`

---

## Yönetici Özeti

Eğer tek cümleyle söylersek:

Önce sayfayı daha iyi anlatan ve karar verdiren hale getireceğiz; sonra güven kanıtını toplayacağız; en son iletişim kısayolları ve teknik temizlikle optimizasyonu tamamlayacağız.
