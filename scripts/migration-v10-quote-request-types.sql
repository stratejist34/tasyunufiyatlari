-- ============================================================
-- MIGRATION v10 - Quote Request Types
-- Tarih: 2026-03-18
--
-- Amaç:
-- - WhatsApp sipariş onayı ve PDF teklif üretimini ayırmak
-- - Admin panelde teklif türünü göstermek
-- ============================================================

BEGIN;

ALTER TABLE public.quotes
    ADD COLUMN IF NOT EXISTS request_type TEXT NOT NULL DEFAULT 'whatsapp_order',
    ADD COLUMN IF NOT EXISTS source_channel TEXT NOT NULL DEFAULT 'wizard';

CREATE INDEX IF NOT EXISTS idx_quotes_request_type_created_at
    ON public.quotes(request_type, created_at DESC);

COMMIT;
