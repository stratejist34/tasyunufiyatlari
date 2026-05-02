# Master CRO Roadmap

Bu doküman iki kaynağın sentezidir:

- [docs/site-plan-cro.md](./site-plan-cro.md)
- [Claude audit planı](<C:/Users/Emrah/.claude/plans/i-inde-bulundu-umuz-projeyi-decision-eng-linked-moon.md>)

Amaç:

- ortak doğruları tek planda toplamak
- çelişen önerilerde nihai yönü seçmek
- uygulama sırasını netleştirmek

---

## Nihai Stratejik Karar

### Omurga

- Birincil omurga: `Karar motoru`
- İkincil omurga: `Trust-first`

### Neden

Site zaten hız hissi üreten bir hesap akışına sahip. Eksik olan şey:

- kullanıcıya neyi çözmek üzere geldiğini isimlendirmek
- yanlış karar riskini görünür kılmak
- güven kanıtını ekranda toplamak

Bu yüzden `Hız` ayrı bir ikincil omurga olarak değil, mevcut wizard akışının davranışsal özelliği olarak korunmalı. Stratejik ikincil omurga `Trust-first` olmalı.

---

## Ortak Noktalar

İki planın da güçlü biçimde birleştiği maddeler:

### 1. Wizard güçlü, karar yardımı zayıf

Ortak teşhis:

- hesap motoru iyi
- kullanıcıyı hesap öncesinde yönlendiren katman eksik

Nihai karar:

- wizard korunacak
- ama wizard öncesine karar yardımı eklenecek

### 2. Trust görünürlüğü düşük

Ortak teşhis:

- güven sinyalleri veri/model tarafında var
- fakat ekranda dağınık veya görünmez

Nihai karar:

- hero altı trust strip eklenecek
- proof ve kurumsal kanıt section'ı eklenecek

### 3. SituationSelector gerekli

Ortak teşhis:

- kullanıcı doğrudan marka/ürün seçiminden başlamamalı

Nihai karar:

- hero ile wizard arasında bir `SituationSelector` olacak
- ama segment dili kullanıcı problemi üzerinden kurulacak

### 4. FAQ karar itirazlarını çözmeli

Ortak teşhis:

- mevcut FAQ var
- ama sadece operasyonel değil, karar odaklı da olmalı

Nihai karar:

- FAQ korunacak
- soru seti yeniden yazılacak

### 5. Proof katmanı eksik

Ortak teşhis:

- örnek teklif
- sevkiyat kanıtı
- depo gücü
- marka/sistem güveni

gibi unsurlar sayfada merkezi biçimde görünmüyor.

Nihai karar:

- ayrı bir `ProofBlock` eklenecek

---

## Çelişen Noktalar ve Nihai Seçim

### 1. İkincil omurga: `Hız` mı `Trust-first` mü?

Claude planı:

- `Karar motoru + Hız`

Bu plan:

- `Karar motoru + Trust-first`

Nihai seçim:

- `Karar motoru + Trust-first`

Sebep:

- kullanıcıyı tutan ana eksik hız değil güven ve rehberlik
- mevcut wizard zaten yeterince hızlı
- asıl büyüme alanı güven kanıtı ve doğru seçim anlatısı

### 2. Sticky iletişim bar önceliği

Claude planı:

- mobil sticky WhatsApp + telefon bar `P0`

Bu plan:

- erken aşamada öncelikli değil

Nihai seçim:

- sticky iletişim bar `P2`

Sebep:

- erken gelirse wizard dışı kaçışı artırabilir
- anasayfanın ana işi hesap başlatmak
- önce karar motoru kapanmalı, sonra iletişim kısayolu optimize edilmeli

### 3. SituationSelector kurgusu

Claude planı:

- kullanıcı tipi merkezli chip'ler

Bu plan:

- ihtiyaç/problemi merkezli kartlar

Nihai seçim:

- problem merkezli seçim modeli

Sebep:

- kullanıcı kendini her zaman personaya göre tanımlamaz
- ama problemini daha kolay tanımlar

Tercih edilen kart mantığı:

- `Sadece levha fiyatını görmek istiyorum`
- `Komple mantolama seti hesaplamak istiyorum`
- `Hangi kalınlık uygun emin değilim`
- `Nakliye dahil gerçek maliyeti görmek istiyorum`
- `PDF teklif hazırlamak istiyorum`
- `WhatsApp'tan hızlı ilerlemek istiyorum`

### 4. Kararsız kullanıcı çıkışı

Claude planı:

- wizard içinde `Bilmiyorum → WhatsApp`

Bu plan:

- önce yardım metni ve yönlendirici copy

Nihai seçim:

- ikisi birlikte ama sıralı

Uygulama:

- önce step içi yardımcı metin
- sonra düşük sürtünmeli `Emin değilseniz bize yazın` çıkışı

Sebep:

- her kararsızlığı insan desteğine göndermek funnel verimliliğini düşürür
- ama tamamen çıkışsız bırakmak da terk yaratır

### 5. Teknik SEO temizlik önceliği

Claude planı:

- metadata/schema cleanup ayrı sprint olarak güçlü vurgulanmış

Bu plan:

- CRO ana gövdesinden sonra yapılmalı

Nihai seçim:

- teknik SEO işi önemli ama `P1.5` seviyesinde

Sebep:

- dönüşüm akışı kapanmadan teknik temizlik ana etkiyi getirmez

---

## Nihai Homepage Roof

Uygulanacak sıralama:

1. Hero
2. TrustStrip
3. SituationSelector
4. WizardCalculator
5. RiskBlock
6. WrongDecisionBlock
7. ProcessBlock
8. PackageLogicBlock
9. ProofBlock
10. FAQ
11. FinalDecisionCta

Not:

- mevcut `Highlights` ve `Logistics` içerikleri çöpe atılmayacak
- `ProcessBlock`, `PackageLogicBlock` ve `ProofBlock` içine yeniden dağıtılacak

---

## Sprint Sırası

### Sprint 1: Mesajı Netleştir

Hedef:

- anasayfanın karar vaadini keskinleştirmek

İşler:

- hero copy revizyonu
- trust strip ekleme
- final CTA copy revizyonu
- FAQ başlık ve soru setini karar odaklı güncelleme

Beklenen etki:

- daha fazla kullanıcı wizard'a girer
- daha az erken kafa karışıklığı olur

### Sprint 2: Karar Yardımını Kur

Hedef:

- kullanıcıyı wizard öncesinde yönlendirmek

İşler:

- `SituationSelector` ekleme
- wizard step yardım metinlerini güçlendirme
- step içinde düşük sürtünmeli `emin değilim` çıkışı ekleme

Beklenen etki:

- wizard terk oranı düşer
- marka/kalınlık bilinmediği için yaşanan donma azalır

### Sprint 3: Risk ve Yanlış Kararı Görünür Kıl

Hedef:

- karar motorunu gerçekten tamamlamak

İşler:

- `RiskBlock`
- `WrongDecisionBlock`
- mevcut `3 Adımda` bölümünü süreç anlatısına çevirmek

Beklenen etki:

- kullanıcı sadece fiyat değil, doğru sistem mantığı üzerinden düşünmeye başlar

### Sprint 4: Güven Kanıtını Topla

Hedef:

- trust-first eksiklerini kapatmak

İşler:

- `ProofBlock`
- örnek teklif görünümü
- depo/sevkiyat/güvence kanıtları
- varsa bayi/marka/sertifika bandı

Bağımlılık:

- gerçek içerik ve görsel gerekiyorsa bunlar toplanmalı

### Sprint 5: Teknik SEO ve Metadata Temizliği

Hedef:

- görünürlük ve SERP kalitesini artırmak

İşler:

- title separator standardizasyonu
- `buildMetadata()` helper yaygınlaştırma
- `og-default.png` kararı
- `BreadcrumbList`
- `LocalBusiness`
- ürün schema tamamlama

### Sprint 6: Yardımcı İletişim Kısayolları

Hedef:

- hesaplamak istemeyen kullanıcıya kontrollü alternatif açmak

İşler:

- sticky mobile contact bar
- context-light WhatsApp şablonu
- bazı section'larda doğrudan yardım CTA testi

Şart:

- ancak önce wizard merkezli akış ölçülmeli

---

## Bileşen Kararları

### Eklenecekler

- `components/cro/TrustStrip.tsx`
- `components/cro/SituationSelector.tsx`
- `components/cro/RiskBlock.tsx`
- `components/cro/WrongDecisionBlock.tsx`
- `components/cro/ProofBlock.tsx`
- `components/cro/FinalDecisionCta.tsx`

### Sonra değerlendirilecekler

- `components/global/StickyContactBar.tsx`
- `components/cro/BrandCertificateBand.tsx`

### Korunacak çekirdek

- `WizardCalculator`
- `SiteHeader`
- `SiteFooter`
- mevcut paket mantığı
- mevcut nakliye anlatısı

---

## Analytics Kararı

Ölçüm üç katmanda ilerlemeli:

### Ana KPI

- `Fiyat_Gosterildi`
- `Pdf_Teklif_Talebi`
- `Whatsapp_Siparis`

### Yeni section event'leri

- `Situation_Selected`
- `Risk_Block_Viewed`
- `Wrong_Decision_Block_Viewed`
- `Proof_Block_Viewed`

### Karar destek event'leri

- `Wizard_Help_Opened`
- `Wizard_Unsure_Clicked`

---

## Sonuç

Nihai yol haritası şunu söylüyor:

- Claude planı mevcut boşlukları iyi teşhis ediyor
- bizim plan karar motoru omurgasını daha doğru çerçeveliyor
- en iyi sonuç, bu iki yaklaşımı birleştirip
  `hız`ı davranış seviyesi özellik,
  `trust-first`i ise stratejik destek omurga
  olarak ele almakla gelir

İlk uygulanacak çekirdek sıra:

1. Hero + TrustStrip
2. SituationSelector
3. RiskBlock + WrongDecisionBlock
4. ProofBlock
5. Teknik SEO cleanup
6. Sticky iletişim deneyleri
