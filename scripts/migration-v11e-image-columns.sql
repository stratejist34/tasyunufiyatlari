-- Migration v11e: plates + accessories tablolarına görsel kolonları ekle
-- Çalıştırma: Supabase SQL Editor'da bir kez çalıştır

ALTER TABLE plates
  ADD COLUMN IF NOT EXISTS image_cover   TEXT,
  ADD COLUMN IF NOT EXISTS image_gallery TEXT[];

ALTER TABLE accessories
  ADD COLUMN IF NOT EXISTS image_cover TEXT;

-- Kontrol
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name IN ('plates', 'accessories')
  AND column_name = 'image_cover';
