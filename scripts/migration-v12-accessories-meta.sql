-- ============================================================
-- Migration v12: accessories meta kolonları
-- accessories tablosu plates ile feature parity'ye getirilir.
-- meta_title / meta_description / catalog_description kolonları
-- katalog sayfalarında SEO için kullanılır.
-- ============================================================

ALTER TABLE accessories
  ADD COLUMN IF NOT EXISTS meta_title          TEXT,
  ADD COLUMN IF NOT EXISTS meta_description    TEXT,
  ADD COLUMN IF NOT EXISTS catalog_description TEXT;

-- ─── Notlar ─────────────────────────────────────────────────
-- catalog_description zaten erken migration'da eklenmiş olabilir
-- (IF NOT EXISTS koruması yeterli). meta_title ve meta_description
-- yeni alanlardır — admin panelinden veya import script'iyle
-- doldurulur.
