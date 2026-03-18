-- ============================================================
-- MIGRATION v8 - Enable Real RLS For Import And Pricing Tables
-- Tarih: 2026-03-18
--
-- Ön koşul:
-- - API route'ları artık service role ile çalışıyor olmalı
-- - .env / deployment env içinde SUPABASE_SERVICE_ROLE_KEY tanımlı olmalı
--
-- Amaç:
-- - import/apply tablolarında public erişimi kapatmak
-- - accessories / plate_prices / accessory_match_catalog için public read bırakıp
--   browser üzerinden insert/update/delete yolunu kapatmak
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. accessories
-- ------------------------------------------------------------
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable delete for all users" ON public.accessories;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.accessories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.accessories;
DROP POLICY IF EXISTS "Enable read for all users" ON public.accessories;
DROP POLICY IF EXISTS "Enable update for all users" ON public.accessories;
DROP POLICY IF EXISTS public_read ON public.accessories;

CREATE POLICY accessories_public_read
ON public.accessories
FOR SELECT
TO anon, authenticated
USING (true);

-- ------------------------------------------------------------
-- 2. plate_prices
-- ------------------------------------------------------------
ALTER TABLE public.plate_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.plate_prices;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.plate_prices;
DROP POLICY IF EXISTS public_read ON public.plate_prices;

CREATE POLICY plate_prices_public_read
ON public.plate_prices
FOR SELECT
TO anon, authenticated
USING (true);

-- ------------------------------------------------------------
-- 3. accessory_match_catalog
-- ------------------------------------------------------------
ALTER TABLE public.accessory_match_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read ON public.accessory_match_catalog;

CREATE POLICY accessory_match_catalog_public_read
ON public.accessory_match_catalog
FOR SELECT
TO anon, authenticated
USING (true);

-- ------------------------------------------------------------
-- 4. Import pipeline tabloları
-- Browser'dan doğrudan erişilmemeli; service role bypass eder.
-- ------------------------------------------------------------
ALTER TABLE public.raw_import_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_import_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_apply_logs ENABLE ROW LEVEL SECURITY;

-- Staging/backup tabloları da public olmasın
ALTER TABLE public.plate_prices_staging ENABLE ROW LEVEL SECURITY;

COMMIT;
