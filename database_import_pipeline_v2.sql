-- ============================================================
-- Import Pipeline — v2 Migration
-- Bağımlılık: database_import_pipeline.sql (v1) çalışmış olmalı.
--
-- Değişiklikler:
--   1. raw_import_files.status → 'applying' ve 'rolling_back' eklendi
--   2. import_match_results.apply_batch_id kolonu eklendi
--   3. import_apply_logs tablosu oluşturuldu (snapshot JSONB dahil)
-- ============================================================


-- ============================================================
-- 1. raw_import_files — yeni status değerleri için CHECK güncelle
-- ============================================================

-- Mevcut CHECK constraint kaldırılıp genişletilmiş liste ile yeniden eklenir.
-- Constraint adı DB'ye göre farklı olabilir; önce mevcut adı bul, sonra sil.

DO $$
DECLARE
    constraint_name text;
BEGIN
    SELECT tc.constraint_name
    INTO   constraint_name
    FROM   information_schema.table_constraints tc
    WHERE  tc.table_name       = 'raw_import_files'
      AND  tc.constraint_type  = 'CHECK'
      AND  tc.constraint_name ILIKE '%status%'
    LIMIT 1;

    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE raw_import_files DROP CONSTRAINT %I', constraint_name);
    END IF;
END $$;

ALTER TABLE raw_import_files
    ADD CONSTRAINT raw_import_files_status_check
    CHECK (status IN (
        'parsed',
        'matched',
        'applying',      -- Apply lock tutulurken (race condition koruması)
        'applied',
        'rolling_back',  -- Rollback lock tutulurken
        'error'
    ));


-- ============================================================
-- 2. import_match_results — apply_batch_id kolonu
-- ============================================================

ALTER TABLE import_match_results
    ADD COLUMN IF NOT EXISTS apply_batch_id uuid NULL;

COMMENT ON COLUMN import_match_results.apply_batch_id IS
    'applyImportFile() çağrısına özgü UUID. Sadece gerçekten yazılan '
    '(success=true, no_op=false) satırlara atanır. Rollback bu değeri '
    'kullanarak batch satırlarını temizler.';

CREATE INDEX IF NOT EXISTS idx_import_match_results_batch
    ON import_match_results (apply_batch_id)
    WHERE apply_batch_id IS NOT NULL;


-- ============================================================
-- 3. import_apply_logs — yeni tablo
-- ============================================================

CREATE TABLE IF NOT EXISTS import_apply_logs (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    timestamptz NOT NULL    DEFAULT now(),

    file_id       uuid        NOT NULL REFERENCES raw_import_files(id) ON DELETE CASCADE,
    batch_id      uuid        NOT NULL UNIQUE,

    -- Özet sayaçlar
    total_rows    integer     NOT NULL DEFAULT 0,
    applied_count integer     NOT NULL DEFAULT 0,
    skipped_count integer     NOT NULL DEFAULT 0,
    error_count   integer     NOT NULL DEFAULT 0,
    no_op_count   integer     NOT NULL DEFAULT 0,

    -- Rollback için önceki durum anlık görüntüsü.
    -- Her eleman discriminated union:
    --   { "type": "plate_price_updated",  "id": 42,  "prevPrice": 1234.56, "prevKdvIncluded": false }
    --   { "type": "accessory_updated",    "id": 99,  "prevPrice": 450.00,  "prevKdvIncluded": true  }
    --   { "type": "plate_price_inserted", "plateId": 7, "thickness": 50 }
    snapshot      jsonb       NOT NULL DEFAULT '[]'::jsonb
);

COMMENT ON TABLE import_apply_logs IS
    'Her applyImportFile() çağrısının audit kaydı. '
    'snapshot kolonu snapshot-based rollback için önceki fiyat değerlerini saklar.';

CREATE INDEX IF NOT EXISTS idx_import_apply_logs_file
    ON import_apply_logs (file_id, created_at DESC);


-- ============================================================
-- 4. RLS — yeni tablolar için satır güvenliği (isteğe bağlı)
-- ============================================================

-- Supabase projesi service role key kullanıyorsa RLS bypass edilir.
-- Eğer anon/authenticated key ile çalışılacaksa aşağıdaki satırları etkinleştir:

-- ALTER TABLE import_apply_logs ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Service role full access" ON import_apply_logs
--     USING (auth.role() = 'service_role');


-- ============================================================
-- 5. Doğrulama sorguları (çalıştır, hata yoksa migration tamam)
-- ============================================================

-- SELECT column_name, data_type
-- FROM   information_schema.columns
-- WHERE  table_name = 'import_match_results'
--   AND  column_name = 'apply_batch_id';

-- SELECT column_name, data_type
-- FROM   information_schema.columns
-- WHERE  table_name = 'import_apply_logs';

-- SELECT conname, consrc
-- FROM   pg_constraint
-- WHERE  conrelid = 'raw_import_files'::regclass
--   AND  contype  = 'c';
