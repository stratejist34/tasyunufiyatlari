🎯 PROJE TANIMI (NETLEŞTİRİLMİŞ)
Sistem = 3 Katmanlı Makine
1. Data Engine (Import Pipeline)

Excel/PDF → normalize → match → staging → apply

2. Product Intelligence Layer

Ürün = sadece veri değil
→ ticari anlamı olan nesne

3. Offer Engine (Wizard)

→ 3 paket üretir
→ deterministic + rule-based
→ satışa dönüştürür

🔥 KRİTİK KARAR (PROJENİN OMURGASI)

Bunu kilitliyoruz:

❗ Sistem “ürün listeleme sistemi” değil
❗ Sistem “paket üretim motoru”

Bu karar:

UX’i sadeleştirir (Hick)

dönüşümü artırır (Von Restorff)

teknik karmaşıklığı azaltır

🧠 CORE MİMARİ (YENİ)
1. PRODUCT ≠ PRODUCT

Ürün artık şöyle:

Product {
  id
  name

  // teknik
  class            // adhesive, render, mesh vs
  material_type    // eps | tasyunu | both

  // ticari
  package_slot     // adhesive, render, dowel, mesh, corner, primer, coating
  commercial_mode  // core | optional | special_order | hidden

  // seçim motoru
  quality_band     // premium | balanced | economic | special
  brand_tier       // premium | mid | low
  is_package_eligible: boolean
  wizard_visible: boolean

  // performans
  priority_score
}

👉 BU YAPI = PROJENİN KALBİ

⚙️ 2. PACKAGE ENGINE (ASIL MOTOR)
Girdi:

material: EPS / Taşyünü

thickness

m²

city

Çıktı:

Premium

Dengeli

Ekonomik

🔁 SELECTION ALGORITHM
for each package_type:
  for each slot in 8_slots:
    candidates = filter(products,
      is_package_eligible &&
      wizard_visible &&
      package_slot == slot &&
      material matches &&
      package_type allowed
    )

    selected = pick_by_rules(candidates, package_type)
🎯 RULES
Premium

aynı marka öncelik

highest quality_band

price ikinci planda

Dengeli

approved balanced brands

fiyat/kalite optimum

Ekonomik

approved economic pool

EN UCUZ DEĞİL

stabil ürün

🧱 3. 8 SLOT (DEĞİŞMEYECEK)

levha

yapıştırıcı

sıva

dübel

file

fileli köşe

astar

kaplama

👉 Bu sabit → sistem stabil olur (Miller)

🚫 NEYİ KESİYORUZ
❌ Magic / Organic / Quartz

→ sistemden SİLMİYORUZ
→ wizard’dan ÇIKARIYORUZ

commercial_mode = special_order

👉 dönüşüm artar
👉 karar yükü azalır

📦 4. ECONOMIC MODEL (KRİTİK)

Şunu asla yapma:

❌ “en ucuz ürünü getir”

Şunu yap:

✅ “approved economic pool”

economic_pool = [
  TEKNO,
  X marka,
  Y marka
]

👉 stabilite
👉 güven
👉 fiyat tutarlılığı

🔗 5. WORDPRESS → WIZARD FUNNEL
Ürün sayfası:
ANA CTA:

👉 “Paket Fiyatı Al”

ALT METİN:

tekli satış yok

minimum 200–300 m²

nakliye maliyeti açıklaması

👉 bu kullanıcıyı rahatlatır
👉 çıkışı azaltır

🧨 6. EN KRİTİK BUG (ŞU AN)
thickness conversion

Şu an:

thickness_cm * 10

❌ HATALI

👉 DB zaten cm

FIX:
thickness = thickness_cm

👉 Bu düzelmeden sistem = risk

🧩 7. IMPORT SYSTEM GELİŞTİRME
EKLENMESİ GEREKENLER
1. Alias Dictionary (zorunlu)

yapıştırıcı → adhesive

sıva → render

file → mesh

2. Canonical Parser

brand normalize

family normalize

variant normalize

3. Reject Rules
if commercial_mode != core:
  ignore for package
🎯 8. UX STRATEJİ (KRİTİK)
3 kart → sabit
Paket	Rol
Premium	güven
Dengeli	seçim (default)
Ekonomik	fiyat

👉 ortadaki kart baskın (Von Restorff)

🧠 PSİKOLOJİK KARARLAR
Hick

→ seçenek = 3

Fitts

→ CTA büyük + ortada

Miller

→ 8 slot → ideal sınır

Von Restorff

→ Dengeli kart vurgulu

⚡ UYGULAMA PLANI (ADIM ADIM)
🔴 FAZ 1 — DATA MODEL (BUGÜN)

Claude’a ver:

Product model update

DB migration

new fields:

package_slot

commercial_mode

quality_band

wizard_visible

🟠 FAZ 2 — IMPORT FIX

thickness bug fix

canonical parser güçlendirme

alias dictionary genişletme

🟡 FAZ 3 — PACKAGE ENGINE

slot-based selection

rule engine

fallback logic

🟢 FAZ 4 — ADMIN PANEL

ürün edit:

“pakette kullanılsın mı?”

“hangi pakette?”

“quality band?”

🔵 FAZ 5 — FRONTEND

3 kart optimize

CTA güçlendir

ürün sayfası → funnel

🧠 SON KARAR (MÜHENDİS KARARI)

Senin sistemin:

❌ e-ticaret sitesi değil
❌ ürün katalog sistemi değil

✅ karar motoru
✅ paket üretim makinesi

