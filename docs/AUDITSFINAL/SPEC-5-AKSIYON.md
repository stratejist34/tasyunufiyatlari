# Spec — 5 Kesin Yapılacak Aksiyon

**Kaynak:** `OPUS-vs-CODEX-KARSILASTIRMA.md` — kırmızı kova (must-do)
**Branch:** `main` (mevcut)
**Hedef:** issue/PR seviyesinde detaylı spec + implementation

---

## #1 — Niyet kartlarını wizard preset'ine bağla

### Sorun
`components/cro/SituationSelector.tsx` seçimde sadece `notifySituationSelected` event'i atıp `scrollIntoView` yapıyor. Wizard'a hiçbir state aktarmıyor → kart **placebo** seviyesinde.

### Çözüm
URL query param tabanlı preset + Zustand store kalıcı kayıt.

**Niyet → preset eşleşmesi**
| `situationKey` | `presetMaterial` | `presetThickness` | Gerekçe |
|---|---|---|---|
| `isi_yalitimi` | `tasyunu` | `6` | Türkiye ortalama orta-yüksek bölge için sweet spot |
| `ses_yalitimi` | `tasyunu` | `8` | Yoğunluk için kalın taşyünü |
| `cati_yalitimi` | `tasyunu` | `8` | Üst kat ısı + nem için kalın taşyünü |
| `emin_degilim` | (preset yok) | (preset yok) | `/iletisim`'e yönlendir (mevcut davranış) |

### Dosya değişiklikleri
- `lib/store/wizardStore.ts` — `presetSituation`, `presetMaterial`, `presetThickness` alanları + `setSituationPreset(key)` action + `consumeSituationPreset()` getter (preset'i okuyup temizler)
- `components/cro/SituationSelector.tsx` — onSelect içinde `setSituationPreset` çağır, hash navigasyonu sürdür
- `components/wizard/WizardCalculator.tsx` — mount effect'inde `consumeSituationPreset()` ile preset'i çekip `setSelectedMalzeme` / `setSelectedKalinlik` ile uygula

### Kabul kriterleri
- Kullanıcı "Isı kaybı" tıklar → wizard mount edildiğinde Taşyünü + 6cm preselected
- Sayfa reload sonrası preset 1 kez tüketilir, ikinci yüklemede uygulanmaz
- "Kararsızım" iletişim sayfasına yönlendirir (mevcut davranış korunur)

---

## #2 — QuoteModal'a PDF modal standardını eşitle

### Sorun
`components/modal/QuoteModal.tsx`:
- KVKK checkbox **YOK**
- E-posta **zorunlu** (gereksiz friction; "hızlı teklif" niyetinde anlamsız)
- Light theme (sayfanın geri kalanı dark — visual tutarsızlık)
- `quote.schema.ts` içinde KVKK alanı yok, e-posta zorunlu

PdfOfferModal: KVKK var, e-posta opsiyonel, dark theme.

### Çözüm
QuoteModal ve schema'yı PdfOfferModal seviyesine çıkar.

### Dosya değişiklikleri
- `lib/schemas/quote.schema.ts` — `customerEmail` opsiyonel yap, `kvkkConsent: z.boolean().refine(v => v === true)` ekle
- `components/modal/QuoteModal.tsx` — KVKK checkbox blok ekle (PdfOfferModal'daki ile birebir copy + link), email zorunlu yıldızı kaldır + opsiyonel etiketi, dark theme tokenlere geçir (`bg-fe-bg`, `border-fe-border`, `text-fe-text` vb.)

### Kabul kriterleri
- KVKK onayı işaretlenmeden submit engellenir
- E-posta boş bırakılarak submit edilebilir, telefon zorunlu kalır
- Modal görsel olarak PdfOfferModal ile aynı tonda (dark)

---

## #3 — RiskBlock + WrongDecisionBlock birleştir

### Sorun
İki ardışık negatif blok aynı korku alanını anlatıyor → semantic overlap, decision fatigue. Codex de doğruladı: `app/page.tsx:218-219` peş peşe render.

### Çözüm
Tek blok: **"Manuel hesapta sahada ortaya çıkan 4 kayıp — ve sistemin nasıl kapattığı"**

İki sütun layout: sol = "Sık yapılan hata", sağ = "Sistem nasıl kapatıyor". 4 satır.

### İçerik (4 satır × 2 sütun)
| # | Hata | Sistem nasıl kapatıyor |
|---|---|---|
| 01 | Kalınlığı sadece ucuzluğa göre seçmek | Niyet kartı + bölge bazlı kalınlık önerisi otomatik gelir |
| 02 | Sadece levha fiyatına bakmak (sıva, dübel, file unutulur) | 8 kalemli komple sistem tek tabloda, tek kalem unutulmaz |
| 03 | Nakliyeyi sonradan eklemek | Şehir + doluluk girer girmez nakliye dahil tutar görünür |
| 04 | Belge ve uygunluk istememek (TSE/CE, EKB) | Sistem sadece belgeli kalemlerle hesap yapar |

### Dosya değişiklikleri
- `components/cro/RiskMistakesBlock.tsx` (yeni) — birleşik component
- `app/page.tsx` — `<RiskBlock />` ve `<WrongDecisionBlock />` import + render satırlarını `<RiskMistakesBlock />` ile değiştir
- `components/cro/RiskBlock.tsx` — silinmek yerine bırak (orphan → ileride kaldırılabilir, ama şu an çağrılmıyorsa zarar yok). **Karar:** Sil, ölü kod olmasın
- `components/cro/WrongDecisionBlock.tsx` — Sil

### Kabul kriterleri
- Sayfa scroll'da iki ardışık negatif başlık yerine tek başlık görünür
- 4 hata + 4 sistem cevabı yan yana hizalı
- Mobile'de iki sütun stack olur (üstte hata, altta cevap)

---

## #4 — PDF teklif geçerlilik süresi tek dil

### Mevcut durum (kod denetimi)
- `lib/utils/packageHelpers.ts:7-17` `getOfferValidityDate()` → şimdi + 24 saat ✅
- `components/cro/TrustStrip.tsx:18` → "24 saat geçerli sabit fiyat ve referans no" ✅
- `components/cro/ProofBlock.tsx:44` → "24 saat geçerlilik" ✅
- `app/page.tsx:35` (FAQ) → "24 saat geçerli sabit fiyat" ✅
- ProofBlock görsel `public/images/...pdf-örnek.png` üzerinde **statik** "3 Mayıs 2026 01:18'e kadar" yazıyor → tarih geçtikçe **eskir**, kullanıcı bunu canlı bir tarih sanıp tutarsızlık hissedebilir

### Çözüm
ProofBlock copy'sine "tarih ve referans numarası gerçek teklifte sizin tarihinizle oluşur" netliği ekle. Görselin altına anonimleştirme + "örnek" ifadesini güçlendir.

### Dosya değişiklikleri
- `components/cro/ProofBlock.tsx` — copy güncelle: "Resmi başlık, kalem listesi, nakliye dahil tutar, referans numarası ve **24 saat geçerlilik**. Aşağıdaki **örnek** görsel anonimleştirilmiştir; tarih ve referans numarası sizin teklifinizde yenilenir."

### Kabul kriterleri
- Sayfada gösterilen geçerlilik dili **her yerde "24 saat"** — alternatif tarih formatı yok
- ProofBlock görseldeki sabit tarih "demo" olarak çerçevelenmiş, kullanıcı yanılmaz

---

## #5 — CTA rollerini dilsel ayrıştır

### Mevcut CTA'lar (ana sayfa)
| Yer | Mevcut metin | Sorun |
|---|---|---|
| Hero (line 162-167) | "Paket fiyatımı hesapla" | OK ama tekrar |
| Hero secondary (line 168-174) | "Önce ürünleri inceleyeyim" | Düşük niyet |
| Paket bölümü (line 341-344) | "Üç paketi de hesapla" | Niyet "karşılaştır", isim doğru |
| Final CTA (line 449-455) | "Paket fiyatımı hesapla" | Hero ile **tıpatıp aynı** = banner blindness |
| Final secondary (line 456-464) | "WhatsApp'tan danış" | OK |

### Çözüm — Rol bazlı dil
| Yer | Yeni metin | Rol |
|---|---|---|
| Hero | **"Hesabı başlat"** | Giriş niyeti |
| Hero secondary | "Önce ürünleri inceleyeyim" | (değişmez) |
| Paket | "Üç paketi karşılaştır" | Karşılaştırma niyeti |
| Final | **"Teklifi şimdi oluştur"** | Tamamlama niyeti |
| Final secondary | "WhatsApp'tan danış" | (değişmez) |

### Dosya değişiklikleri
- `app/page.tsx` — 3 metin değişimi (line 165, 342, 453)

### Kabul kriterleri
- 3 ana CTA'nın kelimeleri farklı; aynı fiil 2 kez tekrar etmez
- Tüm CTA'lar `#mantolama-hesaplayici` anchor'una gider (mevcut davranış korunur)

---

## Uygulama Sırası
1. #4 (en küçük — copy düzeltmesi, 5 dk)
2. #5 (3 metin değişimi, 5 dk)
3. #3 (yeni component + 2 silme, 30 dk)
4. #2 (schema + modal güncelleme, 45 dk)
5. #1 (store + selector + wizard mount effect, 60 dk)

## Doğrulama
- Build: `npx next build`
- Manuel: dev server aç, niyet kartlarına tıkla, modal'ları test et, scroll ile yeni risk bloğunu gör
