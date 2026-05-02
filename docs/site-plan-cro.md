# Site Plan CRO

## Teşhis

- Sektör: Mantolama / izolasyon + yapı malzemesi fiyatlandırma
- Birincil amaç: Wizard üzerinden fiyat gösterip PDF teklif veya WhatsApp lead almak
- Birincil omurga: Karar motoru
- İkincil omurga: Trust-first

### Boyut puanlaması

- Risk: 4/5
- Aciliyet: 2/5
- Tekrar: 2/5
- Yetki: 4/5

### Ana gözlem

Mevcut anasayfa doğru olarak hesaplayıcıyı merkeze koyuyor; ancak kullanıcıya önce "hangi karar problemini çözdüğü" ve "yanlış seçimin maliyeti" yeterince net anlatılmıyor. Sayfa bugün iyi bir hesap aracı gibi çalışıyor, fakat karar verdiren satış omurgası henüz tam kapanmıyor.

---

## Hedef

Anasayfayı:

- sadece "fiyat hesaplanan" bir yüzeyden
- "doğru mantolama kararına götüren" bir karar motoruna

dönüştürmek.

Başarı ölçüsü:

- `Fiyat_Gosterildi` → `Pdf_Teklif_Talebi`
- `Fiyat_Gosterildi` → `Whatsapp_Siparis`
- Hero CTA → wizard başlangıç oranı
- Durum seçici tıklama oranı

---

## Yeni Homepage Mimarisi

### 1. Hero

İş:
Kullanıcıya 3 saniyede "nakliye dahil komple mantolama seti hesabı burada çözülür" dedirtmek.

Mevcut durum:
Güçlü; korunmalı.

Revizyon:

- H1 daha net karar vaadi taşımalı
- Alt metin ikinci cümlede trust sinyali vermeli
- Birincil CTA wizard'a gitmeli
- İkincil CTA katalog yerine "nasıl hesaplanır" anchor'ı da olabilir

Öneri copy:

- H1: `Nakliye dahil mantolama seti fiyatını tek hesapta görün`
- Alt metin: `Metraj, kalınlık ve şehri girin; 8 kalemlik sistem, 3 paket seçeneği ve sevkiyat etkisi birlikte hesaplansın. Tuzla ve Gebze depo çıkışlı akışla teklifiniz saniyeler içinde oluşsun.`
- CTA: `Fiyatı hesapla`
- Mikrocopy: `PDF teklif ve WhatsApp sipariş aynı akışta`

### 2. Trust Strip

İş:
İlk tereddüdü kırmak.

Mevcut durum:
Header top bar ve wizard içi mini stat strip dağınık biçimde bu rolü görüyor.

Revizyon:

- Anasayfada tek bir net trust strip olmalı
- 4 sabit kanıt önerilir

Önerilen maddeler:

- `81 ile sevkiyat`
- `8 kalem tam set`
- `3 paket seçeneği`
- `PDF teklif + referans kodu`

### 3. Durum Seçici

İş:
Kullanıcının kendi ihtiyacını hızlı tanımasını sağlamak.

Mevcut durum:
Eksik.

Bu bölüm eklenmeli.

Kart önerileri:

- `Sadece levha fiyatı mı bakıyorsunuz?`
- `Komple mantolama seti mi hesaplayacaksınız?`
- `Hangi kalınlık uygun emin değil misiniz?`
- `Nakliye dahil gerçek maliyeti mi görmek istiyorsunuz?`
- `PDF teklif hazırlayıp paylaşmak mı istiyorsunuz?`
- `WhatsApp'tan hızlı sipariş mi vermek istiyorsunuz?`

Her kart:

- 1 cümle açıklama
- wizard adımına veya ilgili bilgi section'ına anchor

### 4. Risk Bloğu

İş:
Yanlış kararın somut maliyetini göstermek.

Mevcut durum:
Eksik.

Öneri H2:

- `Mantolama hesabı eksik yapılırsa ne olur?`

Öneri cevap paragrafı:

`Sadece levha fiyatına bakmak çoğu projede gerçek maliyeti gizler. Nakliye, paket yuvarlama, kalınlığa uygun aksesuar ve bölgesel iskonto birlikte okunmazsa teklif ile gerçek sipariş tutarı arasında fark oluşur.`

Risk kartları:

- `Nakliye sonradan eklenir`
- `Eksik aksesuar unutulur`
- `Kalınlık seçimi yanlış kalır`
- `Paket miktarı sahada yetmez`

### 5. Yanlış Karar Bloğu

İş:
Sektörde en sık yapılan hataları isimlendirmek.

Mevcut durum:
Eksik; en büyük CRO açığı burada.

Öneri H2:

- `Mantolama fiyatında en sık yapılan 4 hata nedir?`

Maddeler:

- `Sadece m² levha fiyatına bakıp set maliyetini görmemek`
- `Nakliyeyi teklif sonuna bırakmak`
- `Kalınlığı bina ihtiyacından değil alışkanlıktan seçmek`
- `Tek paket yerine sistem uyumunu gözden kaçırmak`

Not:
Bu block'ta CTA olmamalı. Sonraki bölüm olan süreç bloğuna köprü kurmalı.

### 6. Doğru Süreç

İş:
Kullanıcıya doğru karar akışını öğretmek.

Mevcut durum:
`3 Adımda` bölümü var; geliştirilmeli.

Yeni çerçeve:

1. `Malzeme tipini seçin`
2. `Kalınlık ve şehri girin`
3. `Nakliye dahil 3 paketi görün`
4. `PDF teklif veya WhatsApp ile ilerleyin`

Öneri H2:

- `Mantolama maliyeti doğru nasıl hesaplanır?`

### 7. Paket Mantığı

İş:
3 paket farkını fiyat tablosundan önce zihinsel olarak netleştirmek.

Mevcut durum:
Var, iyi; ama daha karar odaklı olabilir.

Revizyon:

- Paket isimlerinin altına hangi kullanıcı için uygun olduğu eklenmeli
- Sadece ürün farkı değil karar tipi de anlatılmalı

Öneri kısa etiketler:

- `Ekonomik` → `Toplam maliyeti aşağı çekmek isteyenler için`
- `Dengeli` → `Fiyat ve marka dengesini arayan projeler için`
- `Orijinal` → `Tek marka sistem bütünlüğü isteyenler için`

Öneri H2:

- `Aynı metrajda hangi paket daha mantıklı?`

### 8. Proof

İş:
Sayfadaki vaatleri doğrulamak.

Mevcut durum:
Parçalı şekilde var, merkezi proof bölümü yok.

Eklenmeli.

Proof önerileri:

- `81 ile sevkiyat akışı`
- `Tuzla ve Gebze depo çıkışı`
- `Referans kodlu PDF teklif`
- `Taşyünü ve EPS için ayrı hesap motoru`

İkinci sıra proof:

- örnek PDF görseli
- örnek teklif özeti
- örnek şehir bazlı fiyat farkı

### 9. FAQ

İş:
Son itirazları çözmek.

Mevcut durum:
İyi; ancak sadece operasyonel değil karar odaklı sorular da eklenmeli.

Tutulmalı ve şu sorularla güçlendirilmeli:

- `Sadece levha fiyatına göre karar vermek neden yanıltır?`
- `Nakliye dahil teklif ne zaman daha doğru olur?`
- `Hangi kalınlık hangi projede daha mantıklıdır?`
- `PDF teklif ile WhatsApp sipariş arasındaki fark nedir?`

### 10. Final CTA

İş:
Karar vermiş kullanıcıyı tek aksiyona göndermek.

Mevcut durum:
Var; copy daha netleşebilir.

Öneri:

- H2: `Nakliye dahil fiyatı şimdi görmek ister misiniz?`
- Alt metin: `Şehir, kalınlık ve metraj yeterli. Paketleri birlikte görün, sonra PDF teklif veya WhatsApp ile ilerleyin.`
- CTA: `Hesabı başlat`

---

## Copy Roof

### Hero

- H1: `Nakliye dahil mantolama seti fiyatını tek hesapta görün`
- Subtitle: `Metraj, kalınlık ve şehri girin; 8 kalemlik sistem, 3 paket seçeneği ve sevkiyat etkisi birlikte hesaplansın. Teklifiniz saniyeler içinde hazır olsun.`
- CTA: `Fiyatı hesapla`
- Microcopy: `PDF teklif ve WhatsApp sipariş aynı akışta`

### Durum seçici

- H2: `Şu an hangi hesabı netleştirmek istiyorsunuz?`
- Lead: `Kimi kullanıcı sadece levha fiyatını görmek ister, kimi komple mantolama setini. Aşağıdan kendi ihtiyacınıza en yakın yolu seçin.`

### Risk bloğu

- H2: `Mantolama hesabı eksik yapılırsa ne olur?`
- Lead: `Gerçek maliyet çoğu zaman levha fiyatının ötesindedir. Nakliye, aksesuar, paket yuvarlama ve kalınlık etkisi birlikte hesaplanmadığında teklif şaşar.`

### Yanlış karar bloğu

- H2: `Mantolama fiyatında en sık yapılan 4 hata nedir?`
- Lead: `Bu hatalar genelde bütçe baskısından değil, hesabın parça parça yapılmasından çıkar. En büyük farkı toplam sistem maliyeti yaratır.`

### Süreç

- H2: `Mantolama maliyeti doğru nasıl hesaplanır?`
- Lead: `Doğru hesap önce ürün tipini, sonra kalınlığı, sonra lojistiği bir arada okur. Son adımda paket karşılaştırması karar vermeyi kolaylaştırır.`

### Paket mantığı

- H2: `Aynı metrajda hangi paket daha mantıklı?`
- Lead: `Her projede en ucuz seçenek en doğru seçenek olmayabilir. Paketler maliyet, marka bütünlüğü ve sistem yaklaşımına göre ayrılır.`

### Proof

- H2: `Teklif akışında hangi kanıtları görürsünüz?`
- Lead: `Bu sistem sadece fiyat göstermez; sevkiyat mantığını, paket yapısını ve resmi teklif çıktısını da görünür hale getirir.`

### FAQ

- H2: `Mantolama hesabında en çok ne soruluyor?`

### Final CTA

- H2: `Nakliye dahil fiyatı şimdi görmek ister misiniz?`
- Lead: `Şehir, kalınlık ve metraj yeterli. Üç paketi birlikte görün, sonra teklifinizi oluşturun.`
- CTA: `Hesabı başlat`
- Microcopy: `PDF teklif saniyeler içinde oluşur`

---

## Component Revizyon Listesi

### Korunacaklar

- `SiteHeader`
- `WizardCalculator`
- `SectionHeader`
- `SiteFooter`

### Güncellenecekler

- `app/page.tsx`
- `WizardCalculator` sol proof paneli
- mevcut FAQ başlık/copy yapısı
- CTA copy dili

### Yeni component önerileri

- `components/cro/TrustStrip.tsx`
- `components/cro/SituationSelector.tsx`
- `components/cro/RiskBlock.tsx`
- `components/cro/WrongDecisionBlock.tsx`
- `components/cro/ProofBlock.tsx`
- `components/cro/FinalDecisionCta.tsx`

---

## Uygulama Sırası

### Faz 1

- Hero copy revizyonu
- Trust strip sadeleştirmesi
- FAQ karar odaklı güncelleme
- Final CTA güncelleme

### Faz 2

- Durum seçici ekleme
- Risk bloğu ekleme
- Yanlış karar bloğu ekleme

### Faz 3

- Proof bölümü ekleme
- Paket kartlarında karar dilini netleştirme
- Event bazlı ölçüm genişletme

---

## Analytics Önerisi

Yeni bölümler eklenirse şu event'ler düşünülmeli:

- `Situation_Selected`
- `Risk_Block_Viewed`
- `Wrong_Decision_Block_Viewed`
- `Proof_Example_Opened`

Ana KPI:

- `Fiyat_Gosterildi`
- `Pdf_Teklif_Talebi`
- `Whatsapp_Siparis`
- section bazlı CTA click oranı

---

## Kısa Karar

Bu siteyi büyütecek ana hamle yeni bir tasarım değil; karar akışını görünür kılmak. En yüksek etki sırası:

1. Durum seçici
2. Yanlış karar bloğu
3. Trust/proof kanıtı
4. CTA dilinin karar odaklı sadeleşmesi
