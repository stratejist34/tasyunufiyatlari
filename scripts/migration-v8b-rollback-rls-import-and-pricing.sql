-- ============================================================
-- MIGRATION v8b - Rollback RLS For Import And Pricing Tables
-- Tarih: 2026-03-18
--
-- Amaç:
-- - v8 migration'ı service role env hazır olmadan çalıştıysa
--   erişimi hızlıca eski haline döndürmek
-- ============================================================

BEGIN;

ALTER TABLE public.accessories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.plate_prices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessory_match_catalog DISABLE ROW LEVEL SECURITY;

ALTER TABLE public.raw_import_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_import_rows DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_match_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_apply_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.plate_prices_staging DISABLE ROW LEVEL SECURITY;

COMMIT;
