# Taşyünü Fiyatları Anasayfa Audit Sentez Raporu

Tarih: 2026-05-02  
Hazırlayan: Codex

## Kapsam

Bu rapor aşağıdaki 5 model analizinin sentezidir:

- `docs/AUDITSFINAL/Gemini-3-1-pro.md`
- `docs/AUDITSFINAL/GPT-5-5.md`
- `docs/AUDITSFINAL/Kimi-2-6.md`
- `docs/AUDITSFINAL/OPUS-4-7.md`
- `docs/AUDITSFINAL/QWEN-PLUS-3-6.md`

Ek olarak ekran görüntüleri ve mevcut implementasyon kodu birlikte okunmuştur. Amaç sadece “kim ne dedi” özeti çıkarmak değil; gerçekten projeye yarayan, kodla doğrulanmış, önceliklendirilebilir kararları ayıklamaktır.

## 1. Yönetici Özeti

Genel hüküm: Sayfa yayınlanabilir seviyede güçlü. Esas değer önerisi oturmuş, güven mimarisi sektör ortalamasının üstünde, hesap makinesi ürünün kalbi olarak doğru konumlanmış.

Asıl mesele artık “sayfa iyi mi?” değil. Asıl mesele şu:

1. Karar niyetini gerçekten hesaba bağlayabiliyor muyuz?
2. İki ayrı lead akışında aynı güven ve yasal standardı koruyor muyuz?
3. Uzun akışı biraz daha sertleştirip karar hızını artırabiliyor muyuz?

### Ortak Karar Tablosu

| Alan | Codex Puan | Yıldız | Hüküm | Gerekçe |
| --- | ---: | --- | --- | --- |
| Değer önerisi netliği | 9.5/10 | ★★★★★ | Çok güçlü | “Nakliye dahil net hesap” sektörde gerçek bir acıyı vuruyor. |
| Hesap makinesi konumu | 9.2/10 | ★★★★★ | Çok güçlü | Sayfa katalog değil, karar motoru gibi davranıyor. |
| Güven inşası | 8.9/10 | ★★★★☆ | Güçlü | PDF örneği, depo görseli, TSE/CE ve 81 il sevkiyat birlikte iyi çalışıyor. |
| Bilgi mimarisi | 8.3/10 | ★★★★☆ | İyi ama sıkılaştırılmalı | Risk blokları semantik olarak birbirine fazla yakın. |
| CTA mimarisi | 8.1/10 | ★★★★☆ | İyi ama rol ayrımı zayıf | CTA’lar kötü değil, fakat dilsel farkları daha keskin olabilir. |
| Mobil karar akışı | 7.8/10 | ★★★★☆ | En çok test isteyen alan | Desktop güçlü; mobilde wizard ve uzunluk etkisi ölçülmeli. |
| Teknik/iş gerçekçiliği | 8.4/10 | ★★★★☆ | Sağlam ama iki boşluk var | Niyet kartı state akmıyor, lead akışları arasında standart farkı var. |
| Genel seviye | 8.8/10 | ★★★★☆ | Yayına yakın güçlü iş | Öldürücü tasarım hatası yok; net optimizasyon alanları var. |

## 2. En Net Sonuçlar

### Ortak paydada “olmazsa olmaz” çıkan tespitler

| Tespit | Konsensüs | Codex Hükmü | Not |
| --- | --- | --- | --- |
| Niyet kartları çok iyi fikir ama hesaplayıcıya bağlanmalı | Çok yüksek | Doğru | Şu an `components/cro/SituationSelector.tsx` içinde analytics + scroll/router var; preset/state yok. |
| “Eksik hesap” ve “4 hata” blokları birbirine fazla yakın | Çok yüksek | Doğru | `RiskBlock` ve `WrongDecisionBlock` arka arkaya çalışıyor; aynı korku alanını iki kez anlatıyor. |
| Sayfanın büyük gücü “nakliye dahil net hesap” pozisyonlaması | Çok yüksek | Doğru | Bunu zayıflatmadan geri kalan akış sadeleştirilmeli. |
| PDF + depo görseli en güçlü güven katmanı | Çok yüksek | Doğru | Proof katmanı korunmalı, hatta bazı varyantlarda daha erken test edilebilir. |
| Mobilde wizard ve uzun akış dikkatle test edilmeli | Yüksek | Doğru | Varsayım değil, doğal ürün riski. |

### Benim özellikle önemsediğim ve “gözden kaçmış” bulduğum noktalar

| Bulgu | Puan | Yıldız | Neden önemli |
| --- | ---: | --- | --- |
| Niyet kartları şu an gerçek karar motoru değil, yönlendirme yüzeyi | 9.7/10 | ★★★★★ | Kopyada “hesaplayıcıyı doğru yönlendirir” deniyor ama mevcut kod bunu yapmıyor. Bu, en yüksek ROI’li boşluk. |
| PDF modalı ile WhatsApp teklif modalı arasında güven/yasal standart farkı var | 9.4/10 | ★★★★★ | PDF modalında checkbox + şema var; WhatsApp teklif modalında sadece metinsel beyan var. Aynı ürün içinde iki farklı güven standardı hissi doğuruyor. |
| Mevcut wizard store var ama anasayfa akışı local state ile gidiyor | 8.8/10 | ★★★★☆ | Bu, gelecekte state senkronu ve davranış ayrışması riski üretir. |
| WhatsApp hızlı teklif akışında e-posta zorunlu | 8.3/10 | ★★★★☆ | “Hızlı teklif” niyeti için gereksiz sürtünme olabilir. |
| Footer iletişim kümesi tek link gibi sunulmuş | 7.2/10 | ★★★☆☆ | Küçük görünür ama mobil tıklanabilirlik ve erişilebilirlikte anlamsız sürtünme yaratır. |

## 3. Kodla Doğrulanan Gerçekler

### Doğru çıkanlar

| İddia | Sonuç | Kod doğrulaması |
| --- | --- | --- |
| Niyet kartları dekoratif kalabilir | Doğru | `components/cro/SituationSelector.tsx` seçimde `notifySituationSelected(...)` çağırıyor, sonra sadece `scrollIntoView` veya `router.push` yapıyor. Hesaplayıcı state’i set edilmiyor. |
| Risk blokları overlap yaratıyor | Doğru | `app/page.tsx` içinde `RiskBlock` ve `WrongDecisionBlock` peş peşe render ediliyor. |
| CTA dili daha ayrışabilir | Kısmen doğru | Aynı ana fiil iki ana yerde tekrar ediyor: `app/page.tsx` hero ve final CTA. Paket bölümünde de benzer hedefe giden üçüncü CTA var. |
| Marka şeridi fazla pasif | Doğru | `components/cro/BrandStrip.tsx` logoları `opacity-70 grayscale` ile başlatıyor. |

### Yanlış alarm veya abartılı alarm çıkanlar

| İddia | Sonuç | Neden |
| --- | --- | --- |
| FAQ schema eksik | Yanlış | `app/page.tsx` içinde `FAQPage` JSON-LD zaten var. |
| KVKK tamamen yok | Yanlış | `components/modal/PdfOfferModal.tsx` içinde checkbox ve `pdfOfferSchema` ile zorunlu KVKK onayı var. |
| Mobilde topbar güven sinyali tamamen kayıp | Abartılı | `components/shared/SiteHeader.tsx` mobilde de “Fabrika Çıkışlı Satış” ve “Bölgeye Göre İskonto” kalıyor; sadece depo bilgisi küçülüyor/gizleniyor. |
| Homepage için parseInt kullanımı doğrudan launch blocker | Abartılı | Homepage wizard’da kalınlık seçenekleri şu an tam sayı. Teknik borç var ama bu audit bağlamında birincil launch blocker değil. |
| State persistence yok | Yanlış/Kısmi | Zustand store ve `localStorage` altyapısı var; sorun bunun homepage wizard’da fiilen kullanılmaması. |

## 4. Gerçek Riskler ve Elenen Riskler

### Gerçek riskler

| Risk | Puan | Yıldız | Neden gerçek |
| --- | ---: | --- | --- |
| Niyet → hesap akışı kopuk | 9.8/10 | ★★★★★ | En güçlü “ilk niyet” modülü, ürünün ana motoruna bağlanmıyor. Dönüşüm ve güven kaybı yaratır. |
| Dual lead-flow standardı | 9.2/10 | ★★★★★ | PDF akışı daha kurumsal; WhatsApp teklif akışı daha gevşek. Kullanıcı aynı marka içinde farklı kalite hissedebilir. |
| Semantik tekrar nedeniyle karar temposu düşmesi | 8.9/10 | ★★★★☆ | Aynı korku alanını iki blokta anlatmak etkiden çok sürtünme üretmeye başlıyor. |
| Mobil wizard ölçülmemiş karar yükü | 8.5/10 | ★★★★☆ | Tahmin değil; ürünün doğal hassas noktası. |
| Hızlı teklif akışında fazla alan zorunluluğu | 8.1/10 | ★★★★☆ | WhatsApp niyeti için e-posta zorunluluğu gereksiz olabilir. |

### Elenen veya önceliği düşük riskler

| Risk | Codex Hükmü | Neden |
| --- | --- | --- |
| Light mode eklenmeli | Düşük öncelik | Bu ürünün premium-endüstriyel dili dark temada daha güçlü. |
| AI metraj fotoğraf özelliği şart | Şimdilik alma | Güzel vitrin fikri ama mevcut dönüşüm darboğazını çözmüyor. |
| E-imza entegrasyonu hemen gerekli | Şimdilik alma | İş süreci olgunlaştığında mantıklı olabilir; bugünkü ana problem bu değil. |
| Video call / AR ölçüm / kredi hesaplama | Sonra | İlginç ama çekirdek ürün değerini henüz büyütmez. |

## 5. Fayda Matrisi

Buradaki sıralama “bu bizim işimize net yarar mı?” sorusuna göre yapılmıştır.

| Öncelik | Aksiyon | Karar | Puan | Yıldız | Beklenen fayda |
| --- | --- | --- | ---: | --- | --- |
| 1 | Niyet kartlarını wizard preset’ine bağla | Olmalı | 9.9/10 | ★★★★★ | İlk tıklamayı gerçek karar motoruna dönüştürür. “Isı kaybı”, “ses”, “çatı” seçimleri malzeme/kalınlık/paket ön ayarı vermeli. |
| 2 | `RiskBlock` + `WrongDecisionBlock` yapısını birleştir veya yeniden rol dağıt | Olmalı | 9.5/10 | ★★★★★ | Aynı korkuyu iki kez anlatmak yerine “Hata → sistem bunu nasıl kapatıyor?” formatı daha hızlı çalışır. |
| 3 | PDF ve WhatsApp teklif akışlarında aynı KVKK/güven standardını kur | Olmalı | 9.3/10 | ★★★★★ | Ürünün profesyonellik seviyesi tutarlı görünür; hukuki gri alan azalır. |
| 4 | CTA rollerini dilsel olarak ayrıştır | Çok faydalı | 8.9/10 | ★★★★☆ | Hero = başlat, paket = karşılaştır, final = teklif oluştur gibi ayrım karar yorgunluğunu azaltır. |
| 5 | WhatsApp hızlı teklif akışını sadeleştir | Çok faydalı | 8.7/10 | ★★★★☆ | E-posta zorunluluğu tekrar düşünülmeli; “hızlı” niyet için form hafiflemeli. |
| 6 | Proof bloğunu daha erken varyantta A/B test et | Güçlü aday | 8.5/10 | ★★★★☆ | Bu sayfanın en güçlü güven kanıtı beklenenden aşağıda kalıyor olabilir. |
| 7 | Paket kartlarında fiyat/ROI ön bilgisini görünürleştir | Güçlü aday | 8.3/10 | ★★★★☆ | Özellikle “Ekonomik” paketin erken görünür faydası premium algıyı dengeler. |
| 8 | FAQ’da ilk cevap cümlesini yarı görünür test et | Faydalı | 7.6/10 | ★★★☆☆ | İnsan için taranabilirliği ve bazı arama yüzeylerinde snippet değerini artırabilir. |
| 9 | Marka şeridini biraz daha görünür yap | Faydalı ama ikincil | 6.9/10 | ★★★☆☆ | Güven katkısı var, ama çekirdek darboğaz burada değil. |
| 10 | Doluluk barı / gamification | Deney | 7.8/10 | ★★★★☆ | İyi veriyle çok etkili olabilir; zayıf veriyle oyuncak gibi durabilir. |
| 11 | Bütçeden sisteme ters hesap modu | Deney | 7.4/10 | ★★★☆☆ | Güzel farklılaşma; ama önce mevcut çekirdek akış kusursuz olmalı. |
| 12 | Public paylaşılabilir PDF teklif linki | Güçlü aday | 8.8/10 | ★★★★☆ | Usta, patron, ev sahibi arasında doğal yayılım yaratır. “Viral B2B belge” etkisi var. |

## 6. “Vaay” Dediğim Fikirler

| Fikir | Kaynak model | Codex Puan | Yıldız | Neden etkileyici |
| --- | --- | ---: | --- | --- |
| Niyet kartlarını doğrudan ürün preset’ine çevirmek | GPT-5.5 / Gemini / OPUS ortak çizgi | 9.8/10 | ★★★★★ | Bu, dekoratif CRO öğesini gerçek karar motoruna dönüştürüyor. En büyük sıçrama burada. |
| Public paylaşılabilir teklif linki (`/teklif/TY...`) | OPUS | 9.1/10 | ★★★★★ | PDF’i sadece çıktı değil, dağıtılabilir satış nesnesine çeviriyor. Çok güçlü fikir. |
| Doluluk eşiğini oyunlaştırılmış teşvik olarak göstermek | Gemini | 8.6/10 | ★★★★☆ | Doğru uygulanırsa sepet ve karar motivasyonunu büyütür. |
| “Kimin için / Kimin için değil” segmentasyonu | OPUS’un doğru okuduğu mevcut güç | 8.4/10 | ★★★★☆ | Zaten koddaki iyi bir karar; modellerin bunu fark etmesi değerli. |
| Risk bloklarını “çözümleyen sistem” formatına çevirmek | GPT-5.5 / OPUS | 8.9/10 | ★★★★☆ | Negatif alanı daha ikna edici ve daha kısa bir forma sokabilir. |

## 7. Modellerin Bakış Açısı Puanı

Bu puan “haklı mı haksız mı” değil; bize ne kadar kaliteli sinyal verdiği üzerinedir.

| Model | Ürün/CRO | Teknik gerçekçilik | Özgünlük | Sinyal/Gürültü | Toplam | Kısa yorum |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| GPT-5.5 | 9.5 | 8.9 | 8.8 | 9.4 | 9.2/10 | En dengeli model. En iyi önceliklendirme ve en kullanışlı aksiyon listesi bunda. |
| OPUS-4-7 | 9.4 | 8.4 | 9.3 | 8.9 | 9.0/10 | En keskin “gözden kaçan” UX/CRO semantiklerini yakalıyor. Bazen risk tonunu fazla sertleştiriyor. |
| Gemini-3-1-pro | 8.9 | 7.9 | 9.0 | 8.6 | 8.6/10 | Güçlü psikoloji ve ürün sezgisi var. Gamification ve CRM yönü dikkat çekici. |
| Kimi-2-6 | 8.2 | 8.8 | 8.0 | 8.1 | 8.3/10 | Operasyon, hukuk ve iş modeli risklerini iyi kokluyor; bazı çözüm önerileri erken kaçıyor. |
| QWEN-PLUS-3-6 | 8.1 | 7.7 | 7.4 | 7.5 | 7.7/10 | Geniş çerçeve veriyor ama en az ayıklanmış ve en genel kalan analiz bu. |

### Model bazında kısa hüküm

| Model | Güçlü tarafı | Zayıf tarafı |
| --- | --- | --- |
| GPT-5.5 | Stratejik denge, aksiyon önceliği, karar motoru vizyonu | Bazı noktaları daha sert teknik doğrulamayla beslemek gerekirdi |
| OPUS-4-7 | “Placebo buton”, overlap, CTA rolü gibi ince kaçakları görmesi | Önceki repo bilgisini bazen launch blocker tonunda taşıyor |
| Gemini-3-1-pro | İkna psikolojisi ve dönüşüm sezgisi | Teknik risklerde varsayıma kayabiliyor |
| Kimi-2-6 | Hukuki/finansal/operasyonel gerçeklik | UX önceliklerini bazen ikincilleştiriyor |
| QWEN-PLUS-3-6 | Hızlı geniş çerçeve | Ayrıştırma gücü daha düşük |

## 8. Benim Net Kararım

Bu sayfanın problemi “zayıf bir landing olması” değil. Problem, zaten güçlü olan ürün fikrinin son %15’lik karar mühendisliğini henüz tam kapatmamış olması.

Eğer sadece 3 şey yapacaksak:

1. Niyet kartlarını gerçek preset/state akışına bağlayın.
2. İki risk bloğunu tek bir daha keskin anlatıya dönüştürün.
3. PDF ve WhatsApp teklif akışlarını aynı güven/KVKK standardına getirin.

Eğer 6 şey yapacaksak bunlara ek olarak:

4. CTA dillerini rol bazlı ayrıştırın.
5. WhatsApp teklif akışındaki sürtünmeyi azaltın.
6. Public paylaşılabilir teklif linkini ürün yol haritasına alın.

## 9. Kod Referansları

Raporu etkileyen ana doğrulama noktaları:

- `app/page.tsx`
- `components/cro/SituationSelector.tsx`
- `components/cro/RiskBlock.tsx`
- `components/cro/WrongDecisionBlock.tsx`
- `components/modal/PdfOfferModal.tsx`
- `components/wizard/WizardCalculator.tsx`
- `components/shared/SiteFooter.tsx`
- `components/cro/BrandStrip.tsx`
- `lib/notifyWizardEvent.ts`

## Son Cümle

En değerli ortak içgörü şu: Bu iş “taşyünü fiyatları sitesi” olmaktan çıkmış, “mantolama karar ve teklif motoru” olmaya çok yaklaşmış. Bundan sonraki kazanç yeni blok eklemekten değil, mevcut güçlü bloklar arasındaki niyet, güven ve karar akışını daha sıkı bağlamaktan gelecek.
