-- ============================================================
-- MIGRATION v5 - Accessory Match Catalog
-- Tarih: 2026-03-18
--
-- Amaç:
-- - Import matcher için deterministik accessory metadata katmanı eklemek
-- - accessories tablosunu bozmadan kanonik ayrımı ayrı tabloda taşımak
-- - Package engine alanları prod'da olmasa bile import güvenliğini artırmak
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS accessory_match_catalog (
    accessory_id        integer PRIMARY KEY
        REFERENCES accessories(id) ON DELETE CASCADE,
    product_class       text NOT NULL
        CHECK (product_class IN (
            'adhesive', 'render', 'mesh', 'coating',
            'primer', 'dowel', 'corner_profile',
            'fuga_profile', 'pvc_profile'
        )),
    family_canonical    text NOT NULL,
    variant_canonical   text NULL,
    size_token          text NULL,
    material_scope      text NOT NULL DEFAULT 'unknown'
        CHECK (material_scope IN ('eps', 'tasyunu', 'both', 'unknown')),
    package_slot        text NULL,
    commercial_mode     text NOT NULL DEFAULT 'core',
    quality_band        text NULL,
    notes               text NULL,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE accessory_match_catalog IS
    'Import matcher için accessory kanonik metadata tablosu. '
    'accessories fiyat kaydı olmaya devam eder, eşleştirme mantığı bu tabloyla sertleşir.';

CREATE INDEX IF NOT EXISTS idx_accessory_match_catalog_class_family
    ON accessory_match_catalog (product_class, family_canonical, variant_canonical);

CREATE INDEX IF NOT EXISTS idx_accessory_match_catalog_material
    ON accessory_match_catalog (material_scope, product_class);

INSERT INTO accessory_match_catalog (
    accessory_id,
    product_class,
    family_canonical,
    variant_canonical,
    size_token,
    material_scope,
    package_slot,
    commercial_mode,
    quality_band,
    notes
)
SELECT
    a.id AS accessory_id,
    CASE at.slug
        WHEN 'yapistirici' THEN 'adhesive'
        WHEN 'siva' THEN 'render'
        WHEN 'dubel' THEN 'dowel'
        WHEN 'file' THEN 'mesh'
        WHEN 'fileli-kose' THEN 'corner_profile'
        WHEN 'astar' THEN 'primer'
        WHEN 'kaplama' THEN 'coating'
    END AS product_class,
    CASE at.slug
        WHEN 'yapistirici' THEN 'yapistirici'
        WHEN 'siva' THEN 'siva'
        WHEN 'dubel' THEN 'dubel'
        WHEN 'file' THEN 'donati_filesi'
        WHEN 'fileli-kose' THEN 'fileli_kose'
        WHEN 'astar' THEN 'astar'
        WHEN 'kaplama' THEN 'kaplama'
    END AS family_canonical,
    CASE
        WHEN at.slug = 'dubel' AND lower(a.name) LIKE '%plastik%' THEN 'plastik_civili'
        WHEN at.slug = 'dubel' AND (lower(a.name) LIKE '%celik%' OR lower(a.name) LIKE '%çelik%') THEN 'celik_civili'
        WHEN at.slug = 'file' AND lower(a.name) LIKE '%s340%' THEN 's340'
        WHEN at.slug = 'file' AND lower(a.name) LIKE '%s160%' THEN 's160'
        WHEN at.slug = 'file' AND lower(a.name) LIKE '%f160%' THEN 'f160'
        WHEN at.slug = 'file' AND lower(a.name) LIKE '%s110%' THEN 's110'
        WHEN at.slug = 'file' AND lower(a.name) LIKE '%s70%' THEN 's70'
        WHEN at.slug = 'kaplama' AND (
            lower(a.name) LIKE '%ince tane%' OR
            lower(a.name) LIKE '%1,5mm%' OR
            lower(a.name) LIKE '%1.5mm%' OR
            lower(a.name) LIKE '%1,2 mm%' OR
            lower(a.name) LIKE '%1.2 mm%'
        ) THEN 'ince_tane'
        WHEN at.slug = 'kaplama' AND (
            lower(a.name) LIKE '%tane doku%' OR
            lower(a.name) LIKE '%2 mm%' OR
            lower(a.name) LIKE '%2mm%' OR
            lower(a.short_name) LIKE '%kalin%'
        ) THEN 'tane_doku'
        WHEN at.slug = 'kaplama' AND (
            lower(a.name) LIKE '%cizgi%' OR
            lower(a.name) LIKE '%çizgi%'
        ) THEN 'cizgi_doku'
        ELSE NULL
    END AS variant_canonical,
    CASE
        WHEN at.slug = 'dubel' THEN
            CASE
                WHEN lower(a.name) LIKE '%9,5cm%' OR lower(a.name) LIKE '%9.5cm%' THEN '9.5cm'
                WHEN lower(a.name) LIKE '%11,5cm%' OR lower(a.name) LIKE '%11.5cm%' THEN '11.5cm'
                WHEN lower(a.name) LIKE '%13,5cm%' OR lower(a.name) LIKE '%13.5cm%' THEN '13.5cm'
                WHEN lower(a.name) LIKE '%15,5cm%' OR lower(a.name) LIKE '%15.5cm%' THEN '15.5cm'
                ELSE NULL
            END
        WHEN at.slug = 'kaplama' THEN
            CASE
                WHEN lower(a.name) LIKE '%1,5mm%' OR lower(a.name) LIKE '%1.5mm%' THEN '1.5mm'
                WHEN lower(a.name) LIKE '%1,2 mm%' OR lower(a.name) LIKE '%1.2 mm%' THEN '1.2mm'
                WHEN lower(a.name) LIKE '%2 mm%' OR lower(a.name) LIKE '%2mm%' THEN '2mm'
                WHEN lower(a.name) LIKE '%3 mm%' OR lower(a.name) LIKE '%3mm%' THEN '3mm'
                ELSE NULL
            END
        ELSE NULL
    END AS size_token,
    CASE
        WHEN a.is_for_eps = true AND a.is_for_tasyunu = true THEN 'both'
        WHEN a.is_for_eps = true THEN 'eps'
        WHEN a.is_for_tasyunu = true THEN 'tasyunu'
        ELSE 'unknown'
    END AS material_scope,
    CASE at.slug
        WHEN 'yapistirici' THEN 'adhesive'
        WHEN 'siva' THEN 'render'
        WHEN 'dubel' THEN 'dowel'
        WHEN 'file' THEN 'mesh'
        WHEN 'fileli-kose' THEN 'corner'
        WHEN 'astar' THEN 'primer'
        WHEN 'kaplama' THEN 'coating'
        ELSE NULL
    END AS package_slot,
    'core' AS commercial_mode,
    CASE
        WHEN b.name IN ('Dalmaçyalı', 'Expert') THEN 'premium'
        WHEN b.name IN ('Optimix', 'Fawori') THEN 'balanced'
        WHEN b.name IN ('OEM', 'TEKNO', 'Kaspor') THEN 'economic'
        ELSE NULL
    END AS quality_band,
    'Seeded from accessories + accessory_types' AS notes
FROM accessories a
JOIN accessory_types at ON at.id = a.accessory_type_id
LEFT JOIN brands b ON b.id = a.brand_id
WHERE at.slug IN ('yapistirici', 'siva', 'dubel', 'file', 'fileli-kose', 'astar', 'kaplama')
ON CONFLICT (accessory_id) DO UPDATE
SET product_class = EXCLUDED.product_class,
    family_canonical = EXCLUDED.family_canonical,
    variant_canonical = EXCLUDED.variant_canonical,
    size_token = EXCLUDED.size_token,
    material_scope = EXCLUDED.material_scope,
    package_slot = EXCLUDED.package_slot,
    commercial_mode = EXCLUDED.commercial_mode,
    quality_band = EXCLUDED.quality_band,
    notes = EXCLUDED.notes,
    updated_at = now();

COMMIT;
