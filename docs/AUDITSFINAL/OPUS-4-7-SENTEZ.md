# 5 Model Audit Sentezi — Opus 4.7 Meta Analizi

**Tarih:** 2026-05-02
**Kapsam:** `docs/AUDITSFINAL/` altındaki 5 bağımsız audit'ın sentezi
**Modeller:** Gemini 3.1 Pro · GPT-5.5 · Kimi 2.6 · Opus 4.7 · Qwen Plus 3.6

## Özet
5 modelin aynı sayfa üzerinde yaptığı bağımsız audit'leri okudum. Bu rapor proje gerçeğine yakın olduğum için her öneriyi süzgeçten geçirir, sektör/teknik olarak uymayanları eler, gözden kaçmış olanları öne çıkarır.

---

## 1. Fayda Matrisi — 4 Kategori

### A. MUST-HAVE / Launch-Blocker — ★★★★★

| # | Aksiyon | Öneren | Neden hayati | Etki |
|---|---|---|---|---|
| A1 | KVKK consent checkbox + Aydınlatma metni form'a | Opus | Telefon+ad-soyad alıyor; KVKK madde 5/8 ihlali = idari para cezası | Hukuki |
| A2 | URL parseInt → parseFloat (decimal kalınlık) | Opus | 6.5cm/10.5cm değerlerinde sessiz tutar hatası → sahada ek nakliye | Operasyonel |
| A3 | Niyet kartlarına state-flow (URL param → wizard pre-fill) | Opus + GPT-5 + Gemini | Şu an placebo button olabilir; aktarmıyorsa "tıkla → boş" bounce | CRO %10-15 |
| A4 | PDF teklif geçerlilik süresi tek dil ("24 saat" VEYA "X tarihine kadar") | Opus | Sayfa "24 saat" derken PDF'te "3 Mayıs 01:18" → mikro-tutarsızlık güveni kırar | Tutarlılık |

### B. HIGH-VALUE / Sıçrama — ★★★★½ — ★★★★

| # | Aksiyon | Öneren | Faydası | Çaba |
|---|---|---|---|---|
| B1 | İki risk bölümünü ("Eksik hesap" + "4 hata") tek bloğa birleştir | Opus + GPT-5 | Semantic overlap; sayfa kısalır, bounce ↓ | 2-3 saat |
| B2 | Şehir bazlı landing matrisi (`/sehir/istanbul-tasyunu-fiyatlari`) | Opus | "Konum" stepi zaten var; programmatic SEO 81 il × kalınlık × paket | 1-2 hafta |
| B3 | FAQ → FAQPage JSON-LD schema | Opus | ChatGPT/Gemini cevaplarında doğrudan alıntı → AEO/AIO trafiği | 1 saat |
| B4 | CTA rollerini dilsel ayrıştır ("Hesabı başlat" / "Karşılaştır" / "PDF'i indir") | Opus + GPT-5 | "Paket fiyatımı hesapla" 3 yerde aynı = banner blindness | 1 saat |
| B5 | Hero'da TIR/Kamyon doluluk göstergesi (sticky widget) | Gemini + Opus | "TIR'a 142 m² var → tam dolduğunda %18 iskonto" anlık FOMO | 1-2 gün + A/B |
| B6 | PDF teklifi paylaşılabilir public link `/teklif/[ref]` | Opus | İnşaatçı patrona/müşteriye link gönderir → viral + brand exposure + OG SEO | 4-6 saat |
| B7 | Mobile hızlı hesap modu (Şehir + m² + kalınlık → hızlı sonuç) | GPT-5 + Kimi | Mobile dönüşüm en büyük belirsizlik; 4-step wizard mobilde ağır | 1-2 gün |
| B8 | Niyet kartı → kalınlık otomatik öneri (gerçek karar motoru) | GPT-5 + Gemini | "Isı kaybı" → 6cm + Taşyünü pre-select; sistem öneriyor, tooltip beklemiyor | 1 gün |

### C. NICE-TO-HAVE / Polish — ★★★½ — ★★★

| # | Aksiyon | Öneren | Yorum |
|---|---|---|---|
| C1 | "Önce ürünleri inceleyim" → "Örnek PDF teklifi gör" anchor | Opus | Düşük niyetten kanıt-odaklıya |
| C3 | Marka logo strip hover'da brand renklerine geç | Opus + Kimi + GPT-5 | Şu an grayscale ve cansız; trust signal eksik |
| C4 | Final CTA altına mikrocopy ("Stok ve teyide bağlıdır") | GPT-5 + Kimi | Hukuki + beklenti yönetimi |
| C5 | Footer iletişim üçlüsünü ayrı satırlara böl | Opus | Tek link gibi okunuyor; mobile tap için kritik |
| C6 | Mobil topbar (Fabrika çıkışlı / Depo / İskonto) doğrula | Opus | Trust signal mobile'de korunmalı |
| C7 | "Çalıştığımız markalar" → her birine ürün landing | Opus | Marka × ürün matrisi long-tail SEO |
| C8 | Risk bloğu sırası: Karar (paket) → Risk olsun (post-rationalization) | Opus | Şu an Risk → Karar; ters mantık. A/B test |
| C9 | WCAG kontrast + ARIA label denetimi | Kimi | Diğer 4 model erişilebilirliği konuşmadı |
| C10 | Hesaplayıcı submit endpoint rate-limit | Gemini | Rakip bot kazıma savunması |

### D. SKIP / Reddediyorum — ★★ — ★

| # | Reddedilen | Öneren | Red gerekçesi |
|---|---|---|---|
| D1 | "WhatsApp ≠ resmi sözleşme, e-imza ekleyin" | Kimi | Türkiye B2C inşaat sektöründe PDF + WhatsApp + ref no resmi yeterli. E-imza katmanı dönüşümü öldürür |
| D2 | "AI ile fotoğraf yükleyip metraj tahmini" | Qwen + Kimi | Scope dışı; metraj kullanıcının elinde. ROI negatif |
| D3 | "Bütçe slider'ı varsayılan kalınlık değiştirsin" | Qwen | UX karmaşası. Reverse mantığı sadece A/B testi olarak denenebilir |
| D4 | "Hesap makinesi + ürün kataloğu birleştir" | Qwen | İki ayrı görev — karar motoru ≠ SEO katalog. Şu an doğru ayrılmış |
| D5 | "Taksit / inşaat kredisi entegrasyonu" | Qwen | B2B mantolama satışında banka taksit anlamsız (KDV mahsubu, fatura mantığı farklı) |
| D6 | "Niyet kartlarını AI quiz'e çevir" | Opus (kendi önerisi) | Şu anki 4 kart zaten quiz; bir adım daha = gereksiz friction |
| D7 | "Marka adı jenerik, rebrand" | Kimi | "Tasyünü Fiyatları" SEO domini avantaj; jenerik = arama uyumlu. ÖZERGRUP zaten kurumsal alt katman |
| D8 | "Tek sayfa LCP riski" varsayımı | Opus + Kimi | Lighthouse ölçülmeden tahmin yürütülemez |
| D9 | "Lojistik vaadi marjı eritir" iş modeli eleştirisi | Kimi + Gemini | Audit kapsamı dışı; "yaklaşık" notu zaten yönetim mekanizması |

---

## 2. "Vaay" / Şaşırtan / Gözden Kaçmış Tespitler

### 🥇 Opus 4.7 — En değerli yakalar

| Tespit | Neden vaay? |
|---|---|
| **KVKK form öncesi consent eksikliği** | 5 audit içinde sadece 1 model fark etti = launch-blocker hukuki risk. Diğer 4 model güzel UX yorumu yapıp bu açığı atladı |
| **PDF geçerlilik tarih tutarsızlığı** | Sayfa "24 saat", PDF "3 Mayıs 01:18" — mikro-tutarsızlık ama güven kıran tip |
| **Programmatic SEO (81 il × paket × kalınlık)** | "Konum" step'inin zaten formda olmasını avantaja çevirme — sektörde nadir uygulanıyor |
| **PDF public link viralliği** | Sadece teklif değil, paylaşılabilir bir "proof artifact" — inşaatçı patrona link atarsa ücretsiz brand exposure |

### 🥈 GPT-5.5 — Sistematik bölüm puanlaması

| Tespit | Neden değerli? |
|---|---|
| **Niyet kartları → karar motoru bağı** | Tek başına bu fikir sayfayı "katalog"tan "decision engine"e taşır. Net SCAMPER/A formülasyonu |
| **"Aynı vaadi 3 kez söylüyor" tespiti** | Mesaj tekrarı (nakliye/PDF/8 kalem) — hiçbir model bu kadar net adlandırmadı. Decision fatigue kaynağı |
| **Bölüm-bölüm ayrı puan + gerekçe** | 20+ bölüm için ayrı puan = en kullanışlı revizyon roadmap'i |

### 🥉 Gemini 3.1 Pro — UX yasaları + oyunlaştırma

| Tespit | Neden değerli? |
|---|---|
| **TIR doluluk barı oyunlaştırma** | "TIR'ın dolmasına %15 kaldı, X m² eklerseniz nakliye sıfırlanır" — sepet ortalaması artırma silahı |
| **Bot/rakip rate limit önerisi** | Hesaplayıcı varyasyonlarını kazımak rakipler için saatlik iş; reel risk, tek model fark etti |
| **"Gizli bayilik portalı" admin terminal kurgusu** | Hesaplayıcının iç ekipte CRM aracı olarak ikinci kullanım — saha satışta WhatsApp+PDF teslim anlık |
| **UX yasası bazlı analiz (Hick, Fitts, Miller, Von Restorff)** | "İyi/kötü" yerine niye iyi/kötü olduğunu yasalarla isimlendirdi |

### Kimi 2.6 — Erişilebilirlik ve hukuki nüans

| Tespit | Neden değerli? |
|---|---|
| **WCAG kontrast / ARIA-label uyarısı** | Diğer 4 model erişilebilirliği hiç konuşmadı; engelli kullanıcı + ekran okuyucu testi şart |
| **Akaryakıt/kur fiyat değişim riski** | "Nakliye dahil" finansal risk; "fiyatlar X koşullarına göre güncellenir" mikrocopy gerekli |
| **Banka kredisi/hibe için "proje dosyası" formatı** | PDF teklifin ikinci kullanım hayatı — son tüketici enerji teşviklerinde belge olarak kullanır |

### Qwen Plus 3.6 — Stratejik bakış

| Tespit | Neden değerli? |
|---|---|
| **B2B müteahhit/mimar API/toplu sipariş modülü fırsatı** | Tek model B2B kanal genişlemesini açıkça gördü |
| **EKB (Enerji Kimlik Belgesi) zorunluluğu makro trend** | Ürünün regulatory kuyrukta neden büyüyeceğini doğru okuyor |

### ❌ Hiçbir modelin görmediği — Benim eklediklerim

5 model birlikte kaçırdı:

1. **Cache-key invalidation senaryosu** — Fiyat güncellendiğinde PDF referans no'lu kayıtlar eski mi yeni mi gösterir? "TY3925161" linkinin kalıcılığı vs. backend invalidation süreci tartışılmamış
2. **Form submission throttle** — Kimi rate-limit önerdi, ama submit endpoint için worker queue / debounce derinliğinde tartışılmadı
3. **`quote_funnel_events` tablosunun audit dışında bırakılması** — DB'de funnel event tablosu var; drop-off heatmap olmadan optimizasyon kör uçuş. Hiçbir model data-layer kullanımını sormadı
4. **Marka logo izinleri (Knauf, Tekno, Dalmaçyalı, Filli Boya, Favori) C&D mektubu** — Opus T1'de işaretledi ama "ihtimal düşük" geçti. ÖZERGRUP yetkili bayi sözleşmesi yazılı teyit edilmeli
5. **Schema.org Product / Offer eksikliği** — Opus FAQPage dedi, ama Product/Offer schema (fiyat aralığı, marka, availability) hiçbiri demedi. Google Rich Result kritik

---

## 3. Model Perspektifi Puanlaması

Üç boyut: **Doğruluk** (proje gerçeğine uygunluk), **Derinlik** (yüzeyin altına inme), **Aksiyonabilite** (uygulanabilir çıktı).

| Model | Doğruluk | Derinlik | Aksiyonabilite | Genel | ★ |
|---|---|---|---|---|---|
| **Opus 4.7** | 9.5 | 9.5 | 9.5 | **9.5/10** | ★★★★★ |
| **GPT-5.5** | 9.0 | 8.5 | 9.0 | **8.8/10** | ★★★★½ |
| **Gemini 3.1 Pro** | 8.5 | 9.0 | 7.5 | **8.3/10** | ★★★★ |
| **Kimi 2.6** | 8.0 | 8.0 | 7.5 | **7.8/10** | ★★★★ |
| **Qwen Plus 3.6** | 7.5 | 6.5 | 6.5 | **6.8/10** | ★★★½ |

### Detaylı gerekçeler

**Opus 4.7 — 9.5/10 ★★★★★**
- ✅ Proje hafızasını (parseFloat bug, KVKK form alanları, ÖZERGRUP) kullandı, generic değil
- ✅ Launch-blocker hierarşisi netti: hangi 4 madde olmadan yayınlanmasın direkt söyledi
- ✅ "Bilmediklerim" bölümü = entelektüel dürüstlük (mobil DOM, Lighthouse, marka izinleri)
- ✅ SCAMPER + 6 Şapka + SWOT + Risk = en hijyenik framework akışı
- ⚠ Tablolar bazı yerlerde markdown bozdu; çıktı kalitesi tek eksiği

**GPT-5.5 — 8.8/10 ★★★★½**
- ✅ 20+ bölüm için ayrı puan + gerekçe = en granular roadmap
- ✅ "Niyet kartları → karar motoru" tek cümlelik özet sayfanın evrim hedefi
- ✅ Mesaj tekrarı tespiti diğer modellerden net
- ⚠ KVKK, parseFloat gibi proje-spesifik açıkları yakalayamadı (proje hafızasına erişimsiz)
- ⚠ "Yayına çıkar mı? Evet" verdiği halde Opus'un 4 launch-blocker'ından bihaber

**Gemini 3.1 Pro — 8.3/10 ★★★★**
- ✅ Akademik UX yasaları (Hick, Fitts, Miller, Von Restorff) — niye iyi/kötü gerekçesi sağlam
- ✅ Oyunlaştırma fikri (TIR doluluk gauge) en yenilikçi öneri
- ✅ Bot/rate limit + admin CRM kullanımı = stratejik zoom
- ⚠ Aksiyonabilite zayıf: "şu yapılabilir" çok ama "şu adımla" az
- ⚠ Tablolar virgüllü tek satır; göz takibi zor

**Kimi 2.6 — 7.8/10 ★★★★**
- ✅ Erişilebilirlik (WCAG, ARIA) tek vurgulayan — değerli boşluk doldurdu
- ✅ Risk matrisi (olasılık × etki × önlem) en operasyonel format
- ✅ Banka/hibe PDF kullanımı orijinal niş
- ⚠ "WhatsApp yerine e-imza" sektör gerçeğine uymuyor
- ⚠ "Marka ismi jenerik, brand zayıf" — SEO avantajını anlamadı

**Qwen Plus 3.6 — 6.8/10 ★★★½**
- ✅ Makro regulatory trend (EKB) ve B2B kanal vizyonu doğru
- ⚠ Önerilerin çoğu generic AI ("AI metraj", "Bütçe slider", "Taksit") — sektör gerçeğine değmedi
- ⚠ Detay puanları gerekçesiz; "9.5" diyor neden 9.5 belirsiz
- ⚠ SCAMPER fikirleri rakiplerin yapacağı tipik öneriler; özgünlük az

---

## 4. Konsensüs vs. Tek-Model

### 🟢 KONSENSÜS (3+ model aynı şeyi söyledi → büyük ihtimal doğru)
1. Niyet kartlarının state aktarımı belirsiz → düzelt (Opus, GPT-5, Gemini)
2. Mobil wizard yorgunluğu riski (5/5)
3. PDF örneği + Depo fotoğrafı kanıt mimarisi mükemmel (5/5)
4. Doluluk eşikleri kart sistemi mükemmel (5/5)
5. Üç paket Hick yasası uygulaması doğru (5/5)
6. Marka logoları çok soluk (GPT-5, Opus, Kimi)
7. Premium tasarım = pahalı algısı, ekonomik paket erken görünür olmalı (GPT-5, Kimi)

### 🟡 TEK-MODEL ALTINI ÇİZ (görmezden gelme)
1. KVKK consent (Opus) → **launch-blocker**
2. parseFloat decimal bug (Opus) → **launch-blocker**
3. FAQPage JSON-LD (Opus) → AEO trafiği
4. Şehir bazlı programmatic SEO (Opus)
5. PDF public paylaşılabilir link (Opus)
6. WCAG kontrast / ARIA label (Kimi) → erişilebilirlik
7. Bot rate-limit (Gemini) → rakip kazıma savunması
8. TIR doluluk gauge oyunlaştırma (Gemini)
9. EKB regulatory trend (Qwen)

### 🔴 TEK-MODEL AMA YANLIŞ (kullanma)
1. WhatsApp → e-imza katmanı (Kimi)
2. AI fotoğraf metraj (Qwen, Kimi)
3. Bütçe slider varsayılan (Qwen)
4. Hesap+katalog birleşimi (Qwen)
5. Marka adı jenerik, rebrand (Kimi)

---

## 5. Önceliklendirilmiş Aksiyon Planı

| Sıra | Aksiyon | Kategori | Çaba | Etki | Kaynak |
|---|---|---|---|---|---|
| 1 | KVKK consent + Aydınlatma | A | 2 saat | Hukuki | Opus |
| 2 | parseFloat migration | A | 1-2 saat | Bug fix | Opus |
| 3 | Niyet kartı → wizard state-flow | A | 4-6 saat | CRO %10-15 | Opus, GPT-5, Gemini |
| 4 | PDF geçerlilik tarihi tek dil | A | 30 dk | Tutarlılık | Opus |
| 5 | İki risk bloğu birleştir | B | 2-3 saat | UX | Opus, GPT-5 |
| 6 | CTA roller dilsel ayrıştır | B | 1 saat | Decision fatigue | Opus, GPT-5 |
| 7 | FAQPage JSON-LD | B | 1 saat | AEO | Opus |
| 8 | Mobile hızlı hesap modu | B | 1-2 gün | Mobile CRO | GPT-5, Kimi |
| 9 | Niyet kartı → kalınlık otomatik öneri | B | 1 gün | Karar motoru | GPT-5, Gemini |
| 10 | TIR doluluk gauge sticky widget | B | 1-2 gün + A/B | FOMO | Gemini, Opus |
| 11 | PDF public link `/teklif/[ref]` | B | 4-6 saat | Viralite + SEO | Opus |
| 12 | Şehir bazlı landing matrisi | B | 1-2 hafta | Long-tail SEO | Opus |
| 13 | Marka logo hover renk | C | 2-3 saat | Trust | Opus, Kimi, GPT-5 |
| 14 | Footer iletişim split | C | 30 dk | A11y | Opus |
| 15 | WCAG/ARIA denetimi | C | 1 gün | A11y | Kimi |
| 16 | Hesaplayıcı submit rate-limit | C | 4-6 saat | Defansif | Gemini |
| 17 | Product/Offer schema (sentez ekleme) | C | 2 saat | Rich Result | (Opus meta) |
| 18 | quote_funnel_events drop-off heatmap | C | 1 gün | Optimizasyon datası | (Opus meta) |

**İlk 4 aksiyon (A grubu) tamamlanmadan launch'tan kaçının.**

---

## 6. Tek Cümle Sonuç

Sayfa **mimari olarak hazır**, copy ve trust signals **sektörün üstünde**, ama yayın öncesi **4 launch-blocker** (KVKK, parseFloat bug, niyet state-flow, PDF tarih tutarsızlığı) çözülmeden gitme — sonrası polish.
