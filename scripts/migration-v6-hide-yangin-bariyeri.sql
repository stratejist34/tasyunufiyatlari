-- ============================================================
-- MIGRATION v6 - Hide Yangin Bariyeri From Live Flows
-- Tarih: 2026-03-18
--
-- Amaç:
-- - Yangın Bariyeri sistemde ve import/apply hattında kalsın
-- - fakat canlı site / wizard gibi is_active=true filtreli akışlarda görünmesin
-- ============================================================

BEGIN;

UPDATE plates
SET is_active = false
WHERE short_name = 'Yangın Bariyeri';

COMMIT;
