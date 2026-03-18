-- ═══════════════════════════════════════════════════════════════
-- MIGRATION v4 — Package Engine Metadata
-- Tarih    : 2025-03
-- Bağımlılık: database_schema_v3.sql + tüm önceki migration'lar
-- Hedef    : accessories + plates tablolarına paket motoru alanları
-- Strateji : Additive-only — mevcut kolonlara, kısıtlara, verilere
--            dokunulmaz. Mevcut mimarinin üstüne ekleme yapılır.
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- ────────────────────────────────────────────────────────────────
-- BÖLÜM 1: accessories — Yeni kolonlar
-- ────────────────────────────────────────────────────────────────

--  package_slot  : Bu ürün 8-slot sisteminin hangi pozisyonunda
--                  kullanılır? accessories için 'plate' değeri
--                  beklenmez; plates tablosuna yönelik değil.
--                  Profil türleri (fuga, pvc, denizlik) için NULL.
--
--  commercial_mode: Ticari görünürlük ve akış:
--                   core          → standart toz grubu — her zaman pakete girer
--                   optional      → pakete girmez, wizard'da seçilebilir
--                   special_order → Magic/Organic/Quartz gibi özel ürünler
--                   hidden        → sistem içi / arşivlenmiş
--
--  quality_band  : Paket motoru seçim katmanı. Marka ekseninde belirlenir.
--                  NULL kabul edilebilir (henüz sınıflandırılmamış ürünler).
--
--  wizard_visible: false → frontend'de gösterilmez, backoffice'te görünür.
--
--  is_package_eligible: Package engine bu alanı filtre olarak kullanır.
--                       DEFAULT false — yeni eklenen ürün, admin onayı
--                       olmadan pakete girmez. (Güvenli default.)
--
--  brand_tier    : brands.tier denormalizasyonu. Hız için. Nullable.
--                  Trigger YOK — brands güncellendiğinde manuel sync
--                  veya periyodik backfill çalıştırılmalıdır.
--
--  sales_priority: Küçük sayı = daha öncelikli. Package engine,
--                  aynı slot + quality_band içinde ORDER BY sales_priority
--                  kullanarak LIMIT 1 alır.

ALTER TABLE accessories
    ADD COLUMN IF NOT EXISTS package_slot       TEXT
        CHECK (package_slot IN (
            'adhesive', 'render', 'dowel', 'mesh',
            'corner', 'primer', 'coating', 'plate'
        )),
    ADD COLUMN IF NOT EXISTS commercial_mode    TEXT
        NOT NULL DEFAULT 'core'
        CHECK (commercial_mode IN (
            'core', 'optional', 'special_order', 'hidden'
        )),
    ADD COLUMN IF NOT EXISTS quality_band       TEXT
        CHECK (quality_band IN (
            'premium', 'balanced', 'economic', 'special'
        )),
    ADD COLUMN IF NOT EXISTS wizard_visible     BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS is_package_eligible BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS brand_tier         TEXT,
    ADD COLUMN IF NOT EXISTS sales_priority     INTEGER NOT NULL DEFAULT 100;

-- ────────────────────────────────────────────────────────────────
-- BÖLÜM 2: plates — Minimal yeni kolonlar
-- ────────────────────────────────────────────────────────────────
--
--  plates tablosuna package_slot EKLENMEDİ:
--    → Plates her zaman 'plate' slotuna girer.
--    → Bu sabittir; gereksiz kolon eklemek veri tutarsızlığı riski.
--    → Package engine "plates tablosu = plate slot" varsayımıyla çalışır.
--
--  wizard_visible EKLENMEDİ:
--    → Plates görünürlüğü category_id (mantolama / cati / ara-bolme)
--      zaten kontrol ediyor. Çift kontrol gereksiz.
--
--  commercial_mode EKLENMEDİ:
--    → Plates tamamı mantolama kategorisinde 'core' davranır.
--    → İleride gerekirse ayrı migration'da eklenebilir.

ALTER TABLE plates
    ADD COLUMN IF NOT EXISTS quality_band        TEXT
        CHECK (quality_band IN (
            'premium', 'balanced', 'economic', 'special'
        )),
    ADD COLUMN IF NOT EXISTS is_package_eligible BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS brand_tier          TEXT,
    ADD COLUMN IF NOT EXISTS sales_priority      INTEGER NOT NULL DEFAULT 100;

-- ────────────────────────────────────────────────────────────────
-- BÖLÜM 3: Index'ler
-- ────────────────────────────────────────────────────────────────

-- Accessory package engine ana sorgu path:
--   WHERE commercial_mode    = 'core'    ← birincil filtre
--     AND is_package_eligible = true     ← admin override koruması
--     AND wizard_visible      = true
--     AND package_slot        = $slot
--     AND quality_band        = $band
--     AND (is_for_eps OR is_for_tasyunu)
--   ORDER BY sales_priority
--   LIMIT 1
CREATE INDEX IF NOT EXISTS idx_acc_pkg_engine
    ON accessories (package_slot, quality_band, sales_priority)
    WHERE commercial_mode     = 'core'
      AND is_package_eligible = true
      AND wizard_visible      = true;

-- Wizard ek sorgu path (optional ürünler: kullanıcıya gösterilir ama
-- pakete otomatik girmez — is_package_eligible = false)
CREATE INDEX IF NOT EXISTS idx_acc_commercial_mode
    ON accessories (commercial_mode, package_slot)
    WHERE wizard_visible = true;

-- Malzeme uyumluluğu + slot sorgusu (is_for_eps / is_for_tasyunu join yerine)
CREATE INDEX IF NOT EXISTS idx_acc_material_slot
    ON accessories (package_slot, is_for_eps, is_for_tasyunu)
    WHERE commercial_mode = 'core' AND is_active = true;

-- Plate package engine ana sorgu path:
--   WHERE is_package_eligible = true
--     AND material_type_id = $material
--     AND quality_band = $band
--   ORDER BY sales_priority
--   LIMIT 1
CREATE INDEX IF NOT EXISTS idx_plates_pkg_engine
    ON plates (material_type_id, quality_band, sales_priority)
    WHERE is_package_eligible = true;

-- Brand bazlı priority sorgusu (Premium: same brand önce seç)
CREATE INDEX IF NOT EXISTS idx_acc_brand_priority
    ON accessories (brand_id, package_slot, sales_priority)
    WHERE is_package_eligible = true;

CREATE INDEX IF NOT EXISTS idx_plates_brand_priority
    ON plates (brand_id, sales_priority)
    WHERE is_package_eligible = true;

COMMIT;


-- ═══════════════════════════════════════════════════════════════
-- BACKFILL: Mevcut kayıtları yeni alanlarla doldur
-- Bu bölüm ayrı bir transaction'da çalıştırılabilir.
-- Güvenli: sadece NULL olan / default kalan değerleri günceller.
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- ──────────────────────────────────────────
-- BACKFILL 1: accessories.package_slot
-- accessory_types.slug → package_slot
--
-- Bu mapping değişmez. accessory_types.slug
-- sabittir (CHECK constraint var).
-- ──────────────────────────────────────────

UPDATE accessories AS a
SET package_slot = CASE at.slug
    WHEN 'yapistirici'  THEN 'adhesive'
    WHEN 'siva'         THEN 'render'
    WHEN 'dubel'        THEN 'dowel'
    WHEN 'file'         THEN 'mesh'
    WHEN 'fileli-kose'  THEN 'corner'
    WHEN 'astar'        THEN 'primer'
    WHEN 'kaplama'      THEN 'coating'
    ELSE NULL   -- Bilinmeyen slug → NULL (güvenli)
END
FROM accessory_types at
WHERE a.accessory_type_id = at.id
  AND a.package_slot IS NULL;  -- Yalnızca henüz set edilmemiş kayıtlar

-- ──────────────────────────────────────────
-- BACKFILL 2: accessories.quality_band
-- Kural: brand.name → quality_band
--   Dalmaçyalı → premium  (orijinal sistem, en yüksek tier)
--   Expert     → premium  (premium pakette levha olarak kullanılıyor)
--   Optimix    → balanced (dengeli paket ana aksesuar markası)
--   Fawori     → balanced (Optimix alias, aynı kuralı alır)
--   OEM        → economic (en ucuz paket için)
--   Kaspor     → economic (levha markası ama future-proof)
--   TEKNO      → economic (ekonomik paket toz grubu)
-- ──────────────────────────────────────────

UPDATE accessories AS a
SET quality_band = CASE b.name
    WHEN 'Dalmaçyalı'  THEN 'premium'
    WHEN 'Expert'      THEN 'premium'
    WHEN 'Optimix'     THEN 'balanced'
    WHEN 'Fawori'      THEN 'balanced'
    WHEN 'OEM'         THEN 'economic'
    WHEN 'Kaspor'      THEN 'economic'
    WHEN 'TEKNO'       THEN 'economic'
    ELSE NULL           -- Yeni marka geldiğinde admin belirler
END
FROM brands b
WHERE a.brand_id = b.id
  AND a.quality_band IS NULL;

-- ──────────────────────────────────────────
-- BACKFILL 3: accessories.commercial_mode
-- Mevcut tüm kayıtlar standart toz grubu ürünleri.
-- Kural: standard slug → 'core'
-- Şu an accessories tablosunda Magic/Organic/Quartz/profil ürünü YOK.
-- Gelecekte eklenirse admin panelden ayarlanacak.
-- DEFAULT zaten 'core' olduğu için bu adım explicit confirmation içindir.
-- ──────────────────────────────────────────

UPDATE accessories
SET commercial_mode = 'core'
WHERE commercial_mode = 'core'  -- default'u koru, değiştirme
  AND package_slot IS NOT NULL;  -- slot atanmış = bilinen ürün türü

-- ──────────────────────────────────────────
-- BACKFILL 4: accessories.is_package_eligible
--
-- NİHAİ KURAL:
--   core          → true   (package engine aday havuzu)
--   optional      → false  (wizard'da seçilebilir ama pakete girmez)
--   special_order → false  (Magic/Organic/Quartz: talep üzerine)
--   hidden        → false  (arşivlenmiş / sistem içi)
--
-- PACKAGE ENGINE NOT:
--   Engine aday havuzunu şu şekilde filtreler:
--     commercial_mode = 'core'       → bu flag tek başına yeterli DEĞİL
--     is_package_eligible = true     → ZORUNLU çift kontrol
--   İki koşul ayrı ayrı değişebilir (admin override için esneklik).
--   Engine her ikisini birden kontrol etmek ZORUNDA.
-- ──────────────────────────────────────────

UPDATE accessories
SET is_package_eligible = true
WHERE package_slot IS NOT NULL
  AND is_active       = true
  AND commercial_mode = 'core';   -- YALNIZCA core → eligible

-- optional/special_order/hidden için explicit false (default zaten false,
-- ama yeniden çalıştırma güvenliği için):
UPDATE accessories
SET is_package_eligible = false
WHERE commercial_mode IN ('optional', 'special_order', 'hidden');

-- ──────────────────────────────────────────
-- BACKFILL 5: accessories.brand_tier (denormalize)
-- brands.tier değerlerini kopyala.
-- ──────────────────────────────────────────

UPDATE accessories AS a
SET brand_tier = b.tier
FROM brands b
WHERE a.brand_id  = b.id
  AND a.brand_tier IS NULL;

-- ──────────────────────────────────────────
-- BACKFILL 6: accessories.sales_priority
-- Küçük sayı = package engine bu markayı önce seçer.
-- Premium paket: Dalmaçyalı önce (10), sonra Expert (20)
-- Balanced paket: Optimix önce (30)
-- Economic paket: TEKNO (70), OEM (90)
-- ──────────────────────────────────────────

UPDATE accessories AS a
SET sales_priority = CASE b.name
    WHEN 'Dalmaçyalı'  THEN 10
    WHEN 'Expert'      THEN 20
    WHEN 'Optimix'     THEN 30
    WHEN 'Fawori'      THEN 35
    WHEN 'TEKNO'       THEN 70
    WHEN 'OEM'         THEN 90
    ELSE 100
END
FROM brands b
WHERE a.brand_id = b.id;

-- ──────────────────────────────────────────
-- BACKFILL 7: plates.quality_band
-- Kural: brand.name → quality_band (accessories ile aynı mantık)
-- ──────────────────────────────────────────

UPDATE plates AS p
SET quality_band = CASE b.name
    WHEN 'Dalmaçyalı'  THEN 'premium'
    WHEN 'Expert'      THEN 'premium'
    WHEN 'Optimix'     THEN 'balanced'
    WHEN 'Fawori'      THEN 'balanced'
    WHEN 'Kaspor'      THEN 'economic'
    ELSE NULL
END
FROM brands b
WHERE p.brand_id = b.id
  AND p.quality_band IS NULL;

-- ──────────────────────────────────────────
-- BACKFILL 8: plates.is_package_eligible
-- Kural: YALNIZCA mantolama kategorisi pakete girer.
-- Çatı levhası (cati) ve Ara bölme levhası (ara-bolme)
-- toz grubu almadığı için pakete GİRMEZ → false kalır.
-- ──────────────────────────────────────────

UPDATE plates AS p
SET is_package_eligible = true
FROM product_categories pc
WHERE p.category_id = pc.id
  AND pc.slug       = 'mantolama'
  AND p.is_active   = true;

-- ──────────────────────────────────────────
-- BACKFILL 9: plates.brand_tier + plates.sales_priority
-- ──────────────────────────────────────────

UPDATE plates AS p
SET brand_tier     = b.tier,
    sales_priority = CASE b.name
        WHEN 'Dalmaçyalı'  THEN 10
        WHEN 'Expert'      THEN 20
        WHEN 'Optimix'     THEN 30
        WHEN 'Fawori'      THEN 35
        WHEN 'Kaspor'      THEN 80
        ELSE 100
    END
FROM brands b
WHERE p.brand_id = b.id;

COMMIT;


-- ═══════════════════════════════════════════════════════════════
-- DOĞRULAMA SORGULARI (çalıştırmadan önce gözden geçirin)
-- ═══════════════════════════════════════════════════════════════

-- 1. Slot dağılımı
-- SELECT package_slot, commercial_mode, quality_band, COUNT(*)
-- FROM accessories
-- GROUP BY 1, 2, 3
-- ORDER BY 1, 2, 3;

-- 2. NULL slot kalan aksesuar var mı?
-- SELECT a.name, at.slug
-- FROM accessories a
-- JOIN accessory_types at ON at.id = a.accessory_type_id
-- WHERE a.package_slot IS NULL AND a.is_active = true;

-- 3. Eligible plate dağılımı
-- SELECT pc.slug, p.quality_band, COUNT(*) eligible_count
-- FROM plates p
-- JOIN product_categories pc ON pc.id = p.category_id
-- WHERE p.is_package_eligible = true
-- GROUP BY 1, 2;

-- 4. Package engine simülasyonu — EPS + premium slot başına 1 ürün
-- SELECT package_slot, name, brand_tier, quality_band, sales_priority
-- FROM accessories
-- WHERE is_package_eligible = true
--   AND wizard_visible = true
--   AND quality_band   = 'premium'
--   AND is_for_eps     = true
--   AND commercial_mode = 'core'
-- ORDER BY package_slot, sales_priority;
