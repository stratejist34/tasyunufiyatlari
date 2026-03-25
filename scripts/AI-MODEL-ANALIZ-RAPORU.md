# AI Model Öneri Analizi — Karşılaştırmalı Değerlendirme Raporu

**Tarih:** 2026-03-23
**Analiz Edilen Modeller:** DeepSeek · Z.ai GLM 5 · Qwen 3.5 Plus · Gemini 3.1 Pro · Opus 4.6 · GPT 5.4
**Kaynak Belge:** `scripts/SISTEM-DOKUMANTASYONU.md`

---

## 1. Cross-Model Problem Frekans Tablosu

> Kaç model aynı problemi tespit etti? 6/6 = konsensüs, 1/6 = tekil görüş.

| # | Problem | DeepSeek | Z.ai | Qwen | Gemini | Opus | GPT | **Toplam** | Seviye |
|---|---------|:--------:|:----:|:----:|:------:|:----:|:---:|:----------:|--------|
| 1 | Admin monolit (2700+ satır) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **6/6** | 🔴 Kritik |
| 2 | Tier görünürlüğü / Hick's Law | ✅ | – | ✅ | ✅ | ✅ | ✅ | **5/6** | 🔴 Kritik |
| 3 | logistics_capacity cache yok | ✅ | ✅ | ✅ | ✅¹ | – | ✅ | **5/6** | 🔴 Kritik |
| 4 | getCatalogProduct double query | ✅ | ✅ | ✅ | – | – | ✅ | **4/6** | 🟠 Yüksek |
| 5 | PDF client-side riski | ✅ | – | ✅ | ✅ | – | ✅ | **4/6** | 🟠 Yüksek |
| 6 | Wizard UX (tek sayfa, step yok) | – | – | ✅ | ✅ | ✅ | ✅ | **4/6** | 🟠 Yüksek |
| 7 | PROFIT_MARGIN hardcoded | ✅ | ✅ | ✅ | – | – | – | **3/6** | 🟠 Yüksek |
| 8 | cm/mm birim dönüşümü implicit | ✅ | – | ✅ | – | – | ✅ | **3/6** | 🟠 Yüksek |
| 9 | revalidatePath entegre değil | ✅ | ✅ | ✅ | – | – | – | **3/6** | 🟡 Orta |
| 10 | image_gallery UI'da kullanılmıyor | – | ✅ | ✅ | – | – | – | **2/6** | 🔵 Düşük |

¹ Gemini doğrudan logistics_cache demedi; "caching stratejisi doğru kurulmadıysa sunucuyu yorabilir" + Redis önerisi ile ima etti.

---

## 2. Problem Detay Matrisi

Her problem için 6 modelin somut önerisi:

### 🔴 Problem 1 — Admin Monolit (6/6)

| Model | Öneri |
|-------|-------|
| DeepSeek | Sekme bazlı component split, Zustand veya context state yönetimi |
| Z.ai GLM 5 | Route-based split: `/ofis/dashboard`, `/ofis/quotes` |
| Qwen 3.5 Plus | `components/admin/` altına parçalama, 2-3 günlük iş |
| Gemini 3.1 Pro | Dolaylı — "veri yoğunluğu iyi yönetilmiş" dedi ama monolitlik sorunundan bahsetti |
| Opus 4.6 | "Teknik borç ileride seni yavaşlatacak, ama şu an acil değil" |
| GPT 5.4 | Route-based: `/admin/dashboard`, `/quotes`, `/analytics`, `/products` |

### 🔴 Problem 2 — Tier Görünürlüğü / Hick's Law (5/6)

| Model | Öneri |
|-------|-------|
| DeepSeek | Yan yana kartlar (grid), en avantajlı tier (TIR) vurgula, "+X m² → %Y indirim" daha görünür |
| Z.ai | – (özel madde yok) |
| Qwen 3.5 Plus | `ring-2 ring-cyan-400` + "🏆 En İyi Fiyat" badge en avantajlı tier'a |
| Gemini 3.1 Pro | "Framing Effect": Ortadaki paketin büyük/glow gösterimi, lojistik doluluk progress bar |
| Opus 4.6 | "Üç kart aynı ağırlıkta, hangisi en avantajlı ilk bakışta anlaşılmıyor" — banner daha dikkat çekici olmalı |
| GPT 5.4 | Sadece 1 öneri göster: "En avantajlı: TIR (₺X kazanç)", altına "Diğer seçenekleri gör" dropdown |

### 🔴 Problem 3 — logistics_capacity Cache (5/6)

| Model | Öneri |
|-------|-------|
| DeepSeek | `unstable_cache` veya `revalidate: 3600` ile fetch |
| Z.ai GLM 5 | `unstable_cache` veya `revalidate: 3600` |
| Qwen 3.5 Plus | `unstable_cache` ile 1h TTL, kod snippet bile verdi |
| Gemini 3.1 Pro | Redis'te hash tabloları — fiyat matriksini memory'de tut (overkill öneri) |
| Opus 4.6 | – (explicit değil) |
| GPT 5.4 | `unstable_cache(1h)` |

### 🟠 Problem 4 — getCatalogProduct Double Query (4/6)

| Model | Öneri |
|-------|-------|
| DeepSeek | URL'deki kategori segmentine (`/aksesuar`) göre doğrudan tablo sorgula |
| Z.ai GLM 5 | Kategori URL'den tablo seçimi |
| Qwen 3.5 Plus | Paralel query: plates + accessories aynı anda çalıştır, ilk sonucu döndür |
| Gemini 3.1 Pro | – |
| Opus 4.6 | – |
| GPT 5.4 | `/urunler/aksesuar` → direkt accessories tablosu seç |

### 🟠 Problem 5 — PDF Client-Side Riski (4/6)

| Model | Öneri |
|-------|-------|
| DeepSeek | html2canvas mobilde hata verebilir, Puppeteer veya hafif kütüphane denenebilir; fallback çalışıyorsa idare eder |
| Z.ai GLM 5 | – |
| Qwen 3.5 Plus | PdfOfferModal'a skeleton + progress bar, `html2canvas onclone` ile optimize et |
| Gemini 3.1 Pro | Asenkron PDF (Serverless/Lambda), "Hazırlanıyor" state, WebSocket/Polling ile link gönder |
| Opus 4.6 | – |
| GPT 5.4 | Hybrid model: Client → API → Server PDF → URL döndür. "Enterprise move." |

### 🟠 Problem 6 — Wizard UX (4/6)

| Model | Öneri |
|-------|-------|
| DeepSeek | Wizard'da hangi aksesuarlar ekleneceğini tooltip/modal ile göster |
| Z.ai GLM 5 | – |
| Qwen 3.5 Plus | `popstate` listener + `sessionStorage` cache, mobil floating "Fiyatı Gör" bar |
| Gemini 3.1 Pro | Aşağı kaydırdıkça sticky alt bar ile seçimleri göster |
| Opus 4.6 | Progress indicator yok, step wizard'a dönüştür → dönüşüm %15-25 artabilir |
| GPT 5.4 | 4 adım: Malzeme → Kalınlık → m² → Şehir (Miller: ideal 3-5 adım) |

### 🟠 Problem 7 — PROFIT_MARGIN Hardcoded (3/6)

| Model | Öneri |
|-------|-------|
| DeepSeek | `plates` tablosuna `profit_margin` kolonu (decimal, default 0.10) |
| Z.ai GLM 5 | `plates.profit_margin` kolonu, admin panelinde düzenlenebilir |
| Qwen 3.5 Plus | `PROFIT_MARGIN'i plates.profit_margin kolonuna taşı`, 1 günlük iş |
| Gemini 3.1 Pro | – |
| Opus 4.6 | – |
| GPT 5.4 | – |

### 🟠 Problem 8 — cm/mm Birim Dönüşümü (3/6)

| Model | Öneri |
|-------|-------|
| DeepSeek | `cmToMm()` yardımcı fonksiyon |
| Z.ai GLM 5 | – |
| Qwen 3.5 Plus | `convertThickness()` helper + unit test; "bus factor riski" |
| Gemini 3.1 Pro | – |
| Opus 4.6 | – |
| GPT 5.4 | DB'de tek birim: mm. UI'de convert et. "Bug çıkması kaçınılmaz" |

### 🟡 Problem 9 — revalidatePath Entegrasyonu (3/6)

| Model | Öneri |
|-------|-------|
| DeepSeek | Admin güncellemesinde `revalidatePath('/urunler/[kategori]/[slug]', 'page')` |
| Z.ai GLM 5 | On-demand ISR, admin güncelleme sonrası |
| Qwen 3.5 Plus | ISR 60s doğru, revalidatePath entegrasyonu bekleniyor |
| Gemini 3.1 Pro | – |
| Opus 4.6 | – |
| GPT 5.4 | – |

### 🔵 Problem 10 — image_gallery UI'da Yok (2/6)

| Model | Öneri |
|-------|-------|
| DeepSeek | – |
| Z.ai GLM 5 | Ürün detayında galeri bileşeni |
| Qwen 3.5 Plus | `ProductImage.tsx`'e lightbox + thumbnail carousel (Low Priority) |
| Gemini 3.1 Pro | – |
| Opus 4.6 | – |
| GPT 5.4 | – |

---

## 3. Model Score Cards

**Değerlendirme Kriterleri:**
- **Teknik Derinlik** — Somut ve doğru kod çözümleri, gerçekçi impl. detayı
- **Önceliklendirme** — Kritik/önemli/nice-to-have ayrımının isabeti
- **Format & Okunabilirlik** — Tablo, şema, scorecard kullanımı
- **Özgünlük** — Diğerlerinin söylemediği değerli insight
- **Pratiklik** — Mevcut stack (Next.js + Supabase, Redis/Lambda yok) ile hemen uygulanabilirlik

### Puanlama Tablosu

| Model | Teknik | Öncelik | Format | Özgünlük | Pratiklik | **ORTALAMA** |
|-------|:------:|:-------:|:------:|:--------:|:---------:|:-----------:|
| Qwen 3.5 Plus | 9.0 | 8.0 | 9.0 | 7.5 | 8.5 | **🥇 8.4** |
| GPT 5.4 | 8.0 | 8.5 | 7.5 | 9.5 | 8.0 | **🥈 8.3** |
| DeepSeek | 7.5 | 7.5 | 7.0 | 7.0 | 8.0 | **🥉 7.4** |
| Z.ai GLM 5 | 6.5 | 8.5 | 8.0 | 6.5 | 7.5 | **7.4** |
| Gemini 3.1 Pro | 5.5 | 6.0 | 8.0 | 8.5 | 4.5 | **6.5** |
| Opus 4.6 | 6.0 | 7.0 | 3.0 | 8.0 | 6.5 | **6.1** |

---

## 4. Model Karşılaştırma — Güçlü / Zayıf Yön Özeti

| Model | En Güçlü Yön | Zayıf Nokta | Stil |
|-------|-------------|------------|------|
| **Qwen 3.5 Plus** | Kod snippet'leri verdi, actionable detay | Bazı öneriler akademik (JWT öneri MVP'ye erken) | Senior architect raporu |
| **GPT 5.4** | CPQ çerçevesi, Hick/Miller/Von Restorff doğru kullanımı | Kısa açıklamalar, bazı fix'ler yüzeysel kaldı | Direct, bullet-heavy, sonuç odaklı |
| **DeepSeek** | Dengeli kapsam, hem backend hem UX dengede | Mermaid şemaları boş renderlanmış (dosyaya geçmedi) | Profesyonel, tablo odaklı |
| **Z.ai GLM 5** | 4 fazlı roadmap en somut timeline | Teknik çözüm detayı zayıf, öneri = başlık seviyesinde | Kısa, badge'li, roadmap odaklı |
| **Gemini 3.1 Pro** | Bilişsel psikoloji analizi (Fitts/Hick/Miller/Framing Effect) | Redis + Lambda + RabbitMQ — startup ölçeğinde overkill | Anlatımsal, duygusal, UX odaklı |
| **Opus 4.6** | CatalogProductView abstraction değerini en iyi o gördü | CSS animation kodu UI'ye renderlanmış — output bozuk/incomplete | Widget rendering hatası var |

---

## 5. Her Modelin Özgün "En İyi" Insight'ı

Bu bölüm, her modelin **sadece kendinin** tespit ettiği ya da en iyi ifade ettiği insight'ı gösterir:

| Model | Özgün Insight | Neden Değerli |
|-------|--------------|---------------|
| **DeepSeek** | Admin'e ISR durum göstergesi | Fiyat güncellemesi sonrası "hangi sayfalar ne zaman yayına giriyor" admin için şeffaflık sağlar |
| **Z.ai GLM 5** | 4 Fazlı haftacık roadmap | Sadece "yapılacak" değil, "ne kadar sürer" sorusunu cevaplayan tek model |
| **Qwen 3.5 Plus** | "Bus factor riski" kavramı | Implicit bilgi (cm/mm, hardcoded margin) yazılmadan başka biri sistemi anlayamaz → teknik risk |
| **Gemini 3.1 Pro** | Framing Effect — ortadaki paketin seçilme eğilimi | 3'lü tier sisteminde "Dengeli" olanı öne çıkarmak dönüşümü artırabilir (davranışsal ekonomi) |
| **Opus 4.6** | ProductRules abstraction "kırılmadan ölçeklenme" garantisi | Unified CatalogProductView tipinin uzun vadeli değerini diğer modellerin gözden kaçırdığı boyutuyla ele aldı |
| **GPT 5.4** | CPQ (Configure Price Quote) çerçevesi | Sistemi "basit e-ticaret değil, kurumsal CPQ" olarak adlandırmak → pitch'te, investor'da veya müşteride kullanılabilir kategori |

---

## 6. Konsensüs Aksiyon Planı

### Faz 1 — Acil (3+ model, en yüksek ROI)

| Öncelik | Görev | Model Konsensüsü | Tahmini Efor |
|---------|-------|:---------------:|:------------:|
| 🔴 1 | Admin monolit → route/component split | 6/6 | 2-3 gün |
| 🔴 2 | logistics_capacity → `unstable_cache(3600)` | 5/6 | 3 saat |
| 🔴 3 | Tier kartı: en avantajlı öne çık | 5/6 | 4 saat |
| 🟠 4 | getCatalogProduct double query fix | 4/6 | 2 saat |
| 🟠 5 | Wizard step flow (4 adım) | 4/6 | 1-2 gün |

### Faz 2 — Önemli (2-3 model)

| Öncelik | Görev | Model Konsensüsü | Tahmini Efor |
|---------|-------|:---------------:|:------------:|
| 🟠 6 | PDF → loading state + hata handling | 4/6 | 1 gün |
| 🟠 7 | PROFIT_MARGIN → `plates.profit_margin` DB kolonu | 3/6 | 1 gün |
| 🟠 8 | `convertThickness()` helper + unit test | 3/6 | 4 saat |
| 🟡 9 | revalidatePath → admin fiyat güncelleme sonrası | 3/6 | 2 saat |

### Faz 3 — Nice-to-have (1-2 model)

| Öncelik | Görev | Model Konsensüsü | Tahmini Efor |
|---------|-------|:---------------:|:------------:|
| 🔵 10 | image_gallery carousel UI | 2/6 | 1 gün |
| 🔵 11 | Kalınlık hover → fiyat preview | 1/6 (GPT) | 3 saat |
| 🔵 12 | Sosyal kanıt: "Son X saatte Y teklif" | 1/6 (GPT) | 2 saat |

---

## 7. Model Meta-Analizi: "Hangi Modeli Ne Zaman Kullanırdım?"

| Senaryo | Tercih Edilecek Model | Neden |
|---------|----------------------|-------|
| Teknik code review, bug tespiti | **Qwen 3.5 Plus** | En fazla somut kod çözümü ve unit test önerileri |
| Hızlı karar / öncelik listesi | **GPT 5.4** | Direkt, madde madde, noise az |
| UX/dönüşüm optimizasyonu | **GPT 5.4 + Gemini** | CPQ + bilişsel psikoloji yasaları |
| Proje roadmap / planlama | **Z.ai GLM 5** | Tek fazlı timeline veren model |
| Genel denge analizi | **DeepSeek** | Ne fazla ne az — hem backend hem UX dengeli |
| Mimari değerlendirme, ölçeklenme | **Opus 4.6** | Abstraction kararlarını en iyi anlayan model (output sorunu çözülürse) |

---

## 8. Genel Değerlendirme

Sisteme verilen genel puan ortalaması (6 modelin sistem puanı):

| Model | Verdiği Genel Puan |
|-------|:-----------------:|
| DeepSeek | ~7.8/10 (kategori ortalaması) |
| Z.ai GLM 5 | 7.5/10 |
| Qwen 3.5 Plus | 8.4/10 |
| Gemini 3.1 Pro | ~8.6/10 (alt puanlar ortalaması) |
| Opus 4.6 | ~8.5/10 (implicit) |
| GPT 5.4 | ~8.5/10 (skor kartı ortalaması) |
| **Konsensüs Ortalaması** | **~8.2/10** |

**Altı modelin hemfikir olduğu 3 nokta:**

1. **Sistem gerçek anlamda iyi kurgulanmış** — Hiçbir model "yeniden yaz" demedi. Hepsi "iyileştir" dedi.
2. **Admin monolit en acil teknik borç** — 6/6 konsensüs, ertelenecek bir şey değil.
3. **Fiyatlama motoru projenin en güçlü tarafı** — ISK1/ISK2/tier sistemi B2B için doğru model.

**6 modelin hiçbirinin söylemediği ama önemli olan:**
- `ThicknessSelector` iki kez render ediliyor (mobile + desktop) — ya duplicate state riski var ya da gereksiz DOM yükü
- `quote_funnel_events` tablosu var ama funnel drop-off analizi admin'de görünmüyor
- `meta_title / meta_description` DB'de var ama `accessories` için null geliyor → SEO kör noktası

---

*Rapor üretildi: 2026-03-23*
