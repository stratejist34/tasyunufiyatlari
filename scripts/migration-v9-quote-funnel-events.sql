-- ============================================================
-- MIGRATION v9 - Quote Funnel Events
-- Tarih: 2026-03-18
--
-- Amaç:
-- - Teklif funnel istatistikleri için temel event tablosu eklemek
-- - Hangi ürün/şehir/paket daha çok teklife dönüştü görmek
-- - İleride calculation/opened/submitted gibi event'leri biriktirmek
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.quote_funnel_events (
    id           BIGSERIAL PRIMARY KEY,
    event_type   TEXT NOT NULL,
    quote_id     BIGINT NULL REFERENCES public.quotes(id) ON DELETE SET NULL,
    material_type TEXT NULL,
    brand_id     BIGINT NULL,
    brand_name   TEXT NULL,
    model_name   TEXT NULL,
    thickness_cm NUMERIC(10,2) NULL,
    area_m2      NUMERIC(12,2) NULL,
    city_code    TEXT NULL,
    city_name    TEXT NULL,
    package_name TEXT NULL,
    total_price  NUMERIC(14,2) NULL,
    metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quote_funnel_events_event_type
    ON public.quote_funnel_events(event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quote_funnel_events_quote_id
    ON public.quote_funnel_events(quote_id);

CREATE INDEX IF NOT EXISTS idx_quote_funnel_events_brand_material
    ON public.quote_funnel_events(brand_name, material_type, created_at DESC);

ALTER TABLE public.quote_funnel_events ENABLE ROW LEVEL SECURITY;

COMMIT;
