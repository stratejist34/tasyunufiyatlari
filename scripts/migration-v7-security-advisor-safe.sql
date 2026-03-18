-- ============================================================
-- MIGRATION v7 - Security Advisor Safe Fixes
-- Tarih: 2026-03-18
--
-- Amaç:
-- - Security Advisor'daki güvenli ve kırıcı olmayan maddeleri kapatmak
-- - Function search_path uyarılarını düzeltmek
-- - quotes.insert policy'sindeki "WITH CHECK (true)" uyarısını kaldırmak
--
-- NOT:
-- - RLS Disabled tablolar bu migration'da bilinçli olarak değiştirilmez.
-- - Sebep: uygulama şu an anon client ile hem frontend'de hem server route'larında
--   yazma yapıyor. RLS'yi sıkılaştırmak ayrı bir mimari adım gerektirir.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. Function search_path hardening
-- ------------------------------------------------------------
DO $$
DECLARE
    fn regprocedure;
BEGIN
    FOR fn IN
        SELECT p.oid::regprocedure
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
          AND p.proname IN (
              'update_logistics_capacity_updated_at',
              'update_quotes_updated_at',
              'calculate_sale_price'
          )
    LOOP
        EXECUTE format(
            'ALTER FUNCTION %s SET search_path = public, pg_temp;',
            fn
        );
    END LOOP;
END $$;

-- ------------------------------------------------------------
-- 2. quotes INSERT policy hardening
-- ------------------------------------------------------------
-- Eski policy büyük olasılıkla WITH CHECK (true) kullanıyor.
-- Bu policy public teklif formunu açık tutar ama en azından beklenen
-- zorunlu alanları ve temel domain kısıtlarını doğrular.

DROP POLICY IF EXISTS insert_quotes ON public.quotes;

CREATE POLICY insert_quotes
ON public.quotes
FOR INSERT
TO anon, authenticated
WITH CHECK (
    customer_name  IS NOT NULL AND length(btrim(customer_name)) >= 2 AND
    customer_email IS NOT NULL AND position('@' in customer_email) > 1 AND
    customer_phone IS NOT NULL AND customer_phone ~ '^05[0-9]{9}$' AND
    material_type  IN ('eps', 'tasyunu') AND
    brand_id       IS NOT NULL AND
    thickness_cm   IS NOT NULL AND thickness_cm > 0 AND
    area_m2        IS NOT NULL AND area_m2 > 0 AND
    city_code      IS NOT NULL AND length(btrim(city_code)) > 0 AND
    package_name   IS NOT NULL AND length(btrim(package_name)) > 0 AND
    total_price    IS NOT NULL AND total_price > 0 AND
    price_per_m2   IS NOT NULL AND price_per_m2 > 0 AND
    package_items  IS NOT NULL
);

COMMIT;
