# Opus 4.7 vs Codex Sentez Raporu — Karşılaştırmalı Değerlendirme

**Tarih:** 2026-05-02
**Kapsam:** `OPUS-4-7-SENTEZ.md` (benim raporum) vs `CODEX-SENTEZ-RAPORU.md` (Codex'in raporu)

---

## 1. Codex'in Benden Daha İyi Yaptığı: Kodla Doğrulama

Codex'in en büyük üstünlüğü **kod referanslarıyla doğrulama** yapması. Ben raporumda 5 modelin söylediklerini sentezledim ama hangi iddianın gerçekten kodda karşılığı var, hangisi yanlış alarm — bunu doğrulamadım. Codex doğruladı ve **bazı tespitlerimi çürüttü**:

### Codex'in haklı çürütmeleri (benim hatalarım)

| Konu | Benim raporum | Codex'in bulgusu | Kabul |
|---|---|---|---|
| **FAQPage JSON-LD eksik** | "Opus tek başına yakaladı, AEO kazancı" diye yazdım | "`app/page.tsx` içinde FAQPage JSON-LD zaten var" | ✅ Hatalıyım. Schema mevcut, eklemek değil belki zenginleştirmek konuşulabilir |
| **KVKK consent eksik = launch-blocker** | A1'e koydum, "form telefon+ad-soyad alıyor, KVKK ihlali" dedim | "`PdfOfferModal.tsx` içinde checkbox + `pdfOfferSchema` ile zorunlu KVKK onayı var" | ✅ Kısmen hatalıyım — PDF modalında VAR. Ama Codex'in 9.4 puanlı ikinci tespiti devreye giriyor: WhatsApp teklif akışında aynı standart yok. Yani sorun "tamamen yok" değil, "iki akış arasında standart farkı" |
| **parseInt → parseFloat launch-blocker** | A2'e launch-blocker olarak koydum | "Homepage wizard'da kalınlık seçenekleri tam sayı; teknik borç ama bu audit bağlamında launch blocker değil" | ✅ Kabul. Memory'de gördüğüm parseFloat notunu launch-blocker tonunda taşıdım — Codex haklı, abartmışım |

**Sonuç:** Benim 4 launch-blocker'ımdan 2'si kodda zaten çözülmüş veya abartılı. Codex'in eleştirisi yerinde.

---

## 2. Codex'in Yakaladığı Ama Benim Kaçırdığım

Bu Codex'in en değerli katkısı:

### 🥇 Dual lead-flow standardı farkı (9.4/10)
Ben sadece "KVKK consent var mı yok mu" diye baktım. Codex daha derin baktı:
- **PDF modalı:** checkbox + schema ile zorunlu KVKK
- **WhatsApp teklif modalı:** sadece metinsel beyan

Bu **kullanıcı algısı** açısından kritik — aynı marka içinde iki farklı kalite hissi. Ben tamamen kaçırdım. Codex'in en güçlü tespiti.

### 🥈 Wizard store kullanılmıyor (8.8/10)
- Zustand store + `localStorage` altyapısı VAR
- Anasayfa wizard'ı bunu **kullanmıyor**, local state ile gidiyor

Bu, niyet kartı state-flow probleminin **gerçek teknik kökü**. Ben "state aktarmıyor olabilir" dedim, Codex hangi store'un olduğunu ve neden kullanılmadığını gösterdi. Çok daha aksiyon alınabilir.

### 🥉 WhatsApp hızlı teklif e-posta zorunluluğu (8.3/10)
"Hızlı teklif" niyetinde e-posta zorunlu olması gereksiz friction. Bu micro-UX detayını hiçbir model ve ben de görmemiştim. Codex koda bakınca yakaladı.

### Mobil topbar — abartılı alarm
Opus "mobile'de topbar kayboluyor olabilir, trust signal kaybı" dedi, ben de tek-model altını çiz olarak listeye aldım. Codex doğruladı: "`SiteHeader.tsx` mobilde de 'Fabrika Çıkışlı' ve 'İskonto' kalıyor; sadece depo küçülüyor." Yani sorun yok. Bu maddeyi düşürmek lazım.

---

## 3. Benim Codex'ten Daha İyi Yaptığım

### Programmatic SEO (81 il × paket × kalınlık)
Codex bunu hiç işlemedi. Ben Opus'tan alıp B2'ye koydum. Şehir step'i zaten formda olduğu için bu **uygulanabilir** ve **uzun vadede en yüksek SEO ROI'si**. Codex bunu kaçırdı.

### "Vaay" listesi: Bot rate-limit (Gemini)
Codex bunu hiç anmadı. Rakip kazıma riski reel — fiyat varyasyonlarını çekmek saatlik iş. Tutmaya devam ediyorum.

### Schema.org Product/Offer eksikliği (sentez ekleme)
"Hiçbir modelin görmediği" bölümünde ben ekledim. Codex de demedi. Rich Result için kritik.

### `quote_funnel_events` data layer kullanımı
Memory'de tablo var, audit'lerde data-driven optimizasyon konuşulmadı. Ben ekledim, Codex de değinmedi.

---

## 4. Codex'e Katılmadıklarım

### "FAQ ilk cevap cümlesini yarı görünür test et" (7.6/10)
Codex 8. sıraya koymuş. Bence bu **A/B test edilecek micro-detay**, fayda matrisinde sıralama hakketmiyor. Akordeonun temel UX prensibi var; "yarı görünür" varyantı çoğu durumda taranabilirliği artırmıyor, görsel gürültü ekliyor. **D bucket'ına yakın.**

### "Doluluk barı / gamification — Deney" (7.8/10)
Codex "iyi veriyle çok etkili, zayıf veriyle oyuncak" diyor. Doğru ama puan 7.8 abartı — gerçek-zamanlı doluluk verisi backend'de canlı değilse sahte gösterge olur, **güveni kırar**. Ya gerçek veri ile yapılır ya da hiç yapılmaz. Orta yol yok. Bu yüzden "deney" değil, "altyapı kararı" — önce backend hazır mı sorusu.

### "Bütçeden sisteme ters hesap modu — Deney" (7.4/10)
Codex deney olarak listelemiş. Ben **D6** olarak Skip'e atmıştım. Hâlâ aynı fikirdeyim — mevcut akışı bozma riski yüksek, niş kullanım. Ana yola sokulmamalı.

### "Marka şeridi görünürlük — 6.9/10 ikincil"
Codex haklı, ben C3'e (★★★½) koymuştum. Codex daha düşük puan vermiş. **Codex'e katılıyorum** — 6.9 daha gerçekçi.

---

## 5. İki Raporun Sentezi — Düzeltilmiş Aksiyon Planı

Codex'in kod doğrulamalarını + benim ek tespitlerimi birleştirip 3 kovaya bölüyorum.

### 🔴 KESİN YAPILACAKLAR (Yayın öncesi veya ilk sprint)

| # | Aksiyon | Kaynak | Çaba | Etki | Neden kesin |
|---|---|---|---|---|---|
| 1 | **Niyet kartlarını wizard preset'ine bağla** (Zustand store + URL param) | Codex + GPT-5 + Gemini + Opus | 1 gün | CRO %10-15 | En yüksek ROI'li boşluk; "Isı kaybı" → 6cm + Taşyünü auto-select. Zustand store + localStorage zaten var, sadece anasayfa wizard kullanmıyor |
| 2 | **WhatsApp teklif modalına PDF modalıyla aynı KVKK checkbox + schema standardını uygula** | Codex (kaçırdım) | 2-3 saat | Hukuki + tutarlılık | Aynı marka içinde iki farklı güven standardı algısı = en yüksek hukuki + UX riski |
| 3 | **`RiskBlock` + `WrongDecisionBlock` birleştir** ("Hata → sistem nasıl kapatıyor?" formatı) | Codex + Opus + GPT-5 | 2-3 saat | UX hız + bounce ↓ | İki ardışık negatif blok semantik overlap; tek bloğa düşürünce karar temposu artar |
| 4 | **PDF teklif geçerlilik süresi tek dil** ("24 saat" VEYA tarih, ikisi bir arada değil) | Opus | 30 dk | Tutarlılık | Mikro-tutarsızlık güveni kırar |
| 5 | **CTA rollerini dilsel ayrıştır** (hero=başlat / paket=karşılaştır / final=teklif oluştur) | Codex + Opus + GPT-5 | 1 saat | Decision fatigue ↓ | Aynı fiil 3 yerde = banner blindness |

### 🟡 YAPILIRSA İYİ OLACAKLAR (İlk sonrası 2-4 hafta)

| # | Aksiyon | Kaynak | Çaba | Etki |
|---|---|---|---|---|
| 6 | WhatsApp hızlı teklif akışını sadeleştir (e-posta zorunluluğunu opsiyonel yap) | Codex (kaçırdım) | 2-3 saat | Friction ↓ |
| 7 | Public paylaşılabilir PDF teklif linki `/teklif/[ref]` + dinamik OG image | Opus + Codex | 4-6 saat | Viral + brand exposure + SEO |
| 8 | Mobile hızlı hesap modu (Şehir + m² + kalınlık → hızlı sonuç) | GPT-5 + Kimi | 1-2 gün | Mobile CRO |
| 9 | Paket kartlarında "Ekonomik"in faydasını erken görünür kıl (premium algı dengeleme) | Codex + GPT-5 + Kimi | 2-3 saat | Algı dengesi |
| 10 | Niyet kartı seçimine göre **paket önerisi** de değişsin (sadece pre-fill değil, post-result rerank) | Codex (genişletme) | 1 gün | Karar motoru derinleşir |
| 11 | Proof bloğunu (PDF + depo) hero'dan hemen sonra A/B test et | Codex | 2-3 saat A/B | Bounce ↓ test |
| 12 | parseFloat migration (decimal kalınlık desteği için altyapı) | Opus | 1-2 saat | Teknik borç |
| 13 | WCAG kontrast + ARIA-label denetimi | Kimi | 1 gün | A11y |
| 14 | Footer iletişim üçlüsünü ayrı satırlara böl | Opus | 30 dk | Mobile tap + a11y |
| 15 | Marka logo strip hover'da brand renklerine geç | Opus + Codex + Kimi | 2-3 saat | Trust |
| 16 | Hesaplayıcı submit endpoint rate-limit | Gemini | 4-6 saat | Bot kazıma savunması |
| 17 | Schema.org Product/Offer schema (FAQPage zaten var) | (sentez ekleme) | 2 saat | Rich Result |

### 🟢 UZUN VADEDE YAPILABİLİRLER (1-3 ay+)

| # | Aksiyon | Kaynak | Çaba | Etki |
|---|---|---|---|---|
| 18 | **Şehir bazlı landing matrisi** (`/sehir/istanbul-tasyunu-fiyatlari` × 81 il × paket) | Opus | 1-2 hafta | Long-tail SEO patlaması |
| 19 | "Çalıştığımız markalar" → her markaya ürün × kalınlık landing matrisi | Opus | 1-2 hafta | Brand × ürün long-tail |
| 20 | TIR doluluk gauge — **gerçek-zamanlı backend hazırsa** sticky widget | Gemini + Opus | 1-2 gün + altyapı | FOMO + sepet ortalaması |
| 21 | `quote_funnel_events` drop-off heatmap dashboard (admin) | (sentez ekleme) | 2-3 gün | Optimizasyon datası |
| 22 | Risk bloğu sırası: Karar (paket) → Risk olsun (post-rationalization) — A/B | Opus | A/B testi | Sıralama optimizasyonu |
| 23 | Marka logo izinlerini yazılı teyit (Knauf, Tekno, Dalmaçyalı, Filli Boya, Favori) | Opus | İdari süreç | Hukuki risk azaltma |
| 24 | "Gizli bayilik portalı" — saha satış admin terminali | Gemini | 1-2 hafta | İç verim |
| 25 | EKB regulatory pazarlamasını öne çıkaran içerik genişlemesi | Qwen | İçerik üretimi | Makro trend bineklik |

### ⚫ REDDEDİLENLER (Yapılmasına gerek yok)

| Reddedilen | Kaynak | Red gerekçesi |
|---|---|---|
| FAQPage JSON-LD ekle | Ben (yanlış alarm) | Codex doğruladı: zaten var |
| KVKK consent ekle (PDF modalı için) | Ben (yanlış alarm) | Codex doğruladı: PDF modalında zaten var. Sadece WhatsApp modalı eksik (→ #2'ye taşındı) |
| parseFloat launch-blocker | Ben (abartı) | Codex haklı: launch-blocker değil, teknik borç (→ #12) |
| Mobil topbar trust signal kayıp | Opus + ben | Codex doğruladı: mobile'de de "Fabrika Çıkışlı" + "İskonto" kalıyor; sorun yok |
| FAQ ilk cevap yarı görünür | Codex | Micro-detay; akordeon UX zaten doğru |
| Bütçeden ters hesap | Qwen + Codex (deney) | Mevcut akışı bozma riski; niş kullanım |
| WhatsApp e-imza katmanı | Kimi | Sektör gerçeğine uymuyor |
| AI fotoğraf metraj | Qwen + Kimi | Scope dışı |
| Hesap+katalog birleşimi | Qwen | İki ayrı görev |
| Marka adı rebrand | Kimi | SEO avantajı |
| Light mode | (audit dışı) | Codex doğru: premium-endüstriyel dil dark'ta güçlü |

---

## 6. Final Hüküm

**Codex'in raporu kod doğrulaması nedeniyle daha aksiyona hazır.** Benim raporumdaki 2 launch-blocker (FAQPage, KVKK) yanlış alarmdı — Codex çürüttü, kabul ediyorum. Ama Codex de programmatic SEO, bot rate-limit, Product/Offer schema ve funnel events gibi noktaları kaçırdı.

**Birleştirilmiş 3 kova özet:**
- **5 Kesin yapılacak:** Niyet → wizard, WhatsApp KVKK, risk birleşim, PDF tarih dili, CTA rol ayrımı
- **12 Yapılırsa iyi:** WhatsApp friction, public link, mobile hızlı, paket algı, schema, a11y, logo, rate-limit
- **8 Uzun vade:** Programmatic SEO matrisi, gauge altyapı, funnel dashboard, marka izinleri, regulatory içerik

**Tek cümle:** Codex haklı — bu sayfa "zayıf landing" değil, "son %15 karar mühendisliği" eksik. O %15'in en kritik 5'i yukarıdaki kırmızı kovada.
