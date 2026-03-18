-- ============================================================
-- Import Staging Pipeline — Migration
-- Versiyon : 1.0
-- Tarih    : 2026-03-16
--
-- Tablolar production tablolarına (plates, plate_prices,
-- accessories) dokunmaz. Pipeline tamamlanıp admin onayı
-- alındıktan sonra ayrı bir apply adımı çalışır.
-- ============================================================


-- ============================================================
-- 1. raw_import_files
--    Yüklenen her Excel/CSV dosyası için bir kayıt.
--    Dosya boyunca pipeline ilerledikçe status güncellenir.
-- ============================================================

CREATE TABLE IF NOT EXISTS raw_import_files (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_at  TIMESTAMPTZ NOT NULL    DEFAULT now(),
    uploaded_by  TEXT        NOT NULL,       -- kullanıcı e-posta veya id
    filename     TEXT        NOT NULL,
    row_count    INT,                         -- parse sonrası doldurulur
    status       TEXT        NOT NULL    DEFAULT 'uploaded',

    CONSTRAINT raw_import_files_status_check CHECK (
        status IN ('uploaded', 'parsed', 'normalized', 'matched', 'applied', 'error')
    )
);

COMMENT ON TABLE  raw_import_files            IS 'Yüklenen import dosyalarının meta kaydı';
COMMENT ON COLUMN raw_import_files.status     IS 'uploaded→parsed→normalized→matched→applied | error';
COMMENT ON COLUMN raw_import_files.uploaded_by IS 'İşlemi başlatan kullanıcı (email veya UUID)';


-- ============================================================
-- 2. raw_import_rows
--    Excel'den okunan her satırın ham hali.
--    Normalizer ve matcher bu kayıtları okur; buraya yazmaz.
-- ============================================================

CREATE TABLE IF NOT EXISTS raw_import_rows (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id            UUID        NOT NULL
                           REFERENCES raw_import_files(id) ON DELETE CASCADE,

    row_index          INT         NOT NULL,   -- orijinal satır sırası (0-bazlı)

    -- Ham alanlar — Excel'den olduğu gibi, temizlenmemiş
    raw_product_name   TEXT        NOT NULL,
    raw_brand_hint     TEXT,
    raw_price          TEXT,
    raw_kdv_hint       TEXT,                   -- 'kdv_dahil' | 'kdv_haric' | 'unknown'
    raw_thickness      TEXT,
    raw_isk1           TEXT,
    raw_isk2           TEXT,
    raw_package_m2     TEXT,

    -- Parser uyarıları — [{message: string}, ...]
    parse_warnings     JSONB       NOT NULL    DEFAULT '[]'::jsonb,

    created_at         TIMESTAMPTZ NOT NULL    DEFAULT now(),

    CONSTRAINT raw_import_rows_kdv_hint_check CHECK (
        raw_kdv_hint IS NULL OR
        raw_kdv_hint IN ('kdv_dahil', 'kdv_haric', 'unknown')
    ),
    -- Aynı dosyada aynı satır sırası iki kez yazılamaz
    CONSTRAINT raw_import_rows_file_row_unique UNIQUE (file_id, row_index)
);

COMMENT ON TABLE  raw_import_rows                 IS 'Excel satırlarının parse edilmemiş ham kopyası';
COMMENT ON COLUMN raw_import_rows.row_index       IS '0-bazlı satır sırası; UI gösteriminde +1 eklenir';
COMMENT ON COLUMN raw_import_rows.parse_warnings  IS 'Parser uyarıları: [{message: string}]';


-- ============================================================
-- 3. import_match_results
--    importNormalizer + importMatcher çıktısı.
--    Her raw_import_rows kaydı için en fazla 1 satır.
--    Apply adımı bu tabloyu okur, production tablolarına yazar.
-- ============================================================

CREATE TABLE IF NOT EXISTS import_match_results (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    row_id                  UUID        NOT NULL UNIQUE
                                REFERENCES raw_import_rows(id) ON DELETE CASCADE,

    -- Normalizer çıktıları
    product_type            TEXT,              -- 'plate' | 'accessory' | 'unknown'
    material_type           TEXT,              -- 'eps' | 'tasyunu' | 'unknown'
    thickness_cm            NUMERIC(6,2),      -- cm cinsinden, NULL = aksesuar veya tespit edilemedi

    base_price_raw          NUMERIC(12,2),     -- parse edilmiş ham fiyat (KDV normalize edilmemiş)
    base_price_net          NUMERIC(12,2),     -- daima KDV hariç net

    -- Matcher çıktıları
    match_status            TEXT        NOT NULL,
    confidence              NUMERIC(4,3),      -- 0.000 – 1.000

    matched_plate_id        INT,               -- plates.id — eşleşme varsa
    matched_plate_price_id  INT,               -- plate_prices.id — kalınlık eşleşmesi varsa
    matched_accessory_id    INT,               -- accessories.id — aksesuar eşleşmesi varsa

    price_change_pct        NUMERIC(7,2),      -- % değişim, NULL = mevcut fiyat yok veya yeni ürün
    requires_review         BOOLEAN     NOT NULL DEFAULT false,

    -- Normalizer + matcher uyarıları — [{severity, type, message, rowIndex?}]
    warnings                JSONB       NOT NULL DEFAULT '[]'::jsonb,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT import_match_results_status_check CHECK (
        match_status IN ('matched', 'new_product', 'variant_missing', 'ambiguous', 'unmatched')
    ),
    CONSTRAINT import_match_results_product_type_check CHECK (
        product_type IS NULL OR product_type IN ('plate', 'accessory', 'unknown')
    ),
    CONSTRAINT import_match_results_material_type_check CHECK (
        material_type IS NULL OR material_type IN ('eps', 'tasyunu', 'unknown')
    ),
    CONSTRAINT import_match_results_confidence_check CHECK (
        confidence IS NULL OR (confidence >= 0 AND confidence <= 1)
    ),
    -- Eşleşme tekliği: aynı anda en fazla 1 hedef referansı dolu olabilir
    CONSTRAINT import_match_results_single_target_check CHECK (
        (matched_plate_id        IS NOT NULL)::int +
        (matched_accessory_id    IS NOT NULL)::int <= 1
    )
);

COMMENT ON TABLE  import_match_results                    IS 'Normalizer + matcher pipeline çıktısı; apply adımı için staging';
COMMENT ON COLUMN import_match_results.base_price_raw     IS 'KDV normalize edilmemiş ham parse fiyat';
COMMENT ON COLUMN import_match_results.base_price_net     IS 'Her zaman KDV hariç net (kdv_dahil → /1.20)';
COMMENT ON COLUMN import_match_results.confidence         IS '0.0–1.0; matched için ≥0.70, ambiguous için 0.45–0.70';
COMMENT ON COLUMN import_match_results.price_change_pct   IS '((net_yeni - net_mevcut) / net_mevcut) * 100; abs > 30 → requires_review';
COMMENT ON COLUMN import_match_results.warnings           IS 'ImportWarning[]: [{severity, type, message, rowIndex?}]';


-- ============================================================
-- INDEXLER
-- ============================================================

-- raw_import_rows: file_id üzerinden toplu sorgular
CREATE INDEX IF NOT EXISTS idx_raw_import_rows_file_id
    ON raw_import_rows(file_id);

-- import_match_results: row_id join
CREATE INDEX IF NOT EXISTS idx_import_match_results_row_id
    ON import_match_results(row_id);

-- import_match_results: durum bazlı filtreleme (review UI, apply seçici)
CREATE INDEX IF NOT EXISTS idx_import_match_results_match_status
    ON import_match_results(match_status);

-- import_match_results: review gerektiren satırları hızlı çek
CREATE INDEX IF NOT EXISTS idx_import_match_results_requires_review
    ON import_match_results(requires_review)
    WHERE requires_review = true;


-- ============================================================
-- FOREIGN KEYS — production tablolarına referans
-- import_match_results.matched_* alanları gerçek kayıtlara bağlanır.
-- ON DELETE SET NULL: production kaydı silinirse staging satırı korunur,
-- alan NULL'a döner (apply adımı bunu hata olarak işaretleyebilir).
-- ============================================================

ALTER TABLE import_match_results
    ADD CONSTRAINT fk_match_plate
    FOREIGN KEY (matched_plate_id)
    REFERENCES plates(id)
    ON DELETE SET NULL;

ALTER TABLE import_match_results
    ADD CONSTRAINT fk_match_plate_price
    FOREIGN KEY (matched_plate_price_id)
    REFERENCES plate_prices(id)
    ON DELETE SET NULL;

ALTER TABLE import_match_results
    ADD CONSTRAINT fk_match_accessory
    FOREIGN KEY (matched_accessory_id)
    REFERENCES accessories(id)
    ON DELETE SET NULL;


-- ============================================================
-- ROW LEVEL SECURITY (opsiyonel — Supabase projelerinde önerilir)
-- Aktif etmek için aşağıdaki satırların başındaki '--' kaldırılır.
-- ============================================================

-- ALTER TABLE raw_import_files    ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE raw_import_rows     ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE import_match_results ENABLE ROW LEVEL SECURITY;
