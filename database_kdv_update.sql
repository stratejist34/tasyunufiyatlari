-- =====================================================
-- KDV DURUMU SÜTUNLARI EKLEMESİ
-- =====================================================
-- Bu script plates, plate_prices ve accessories tablolarına
-- is_kdv_included sütunu ekler.
-- 
-- MANTIK:
-- - Taşyünü levhaları: KDV HARİÇ gelir (is_kdv_included = false)
-- - EPS levhaları: KDV DAHİL gelir (is_kdv_included = true)
-- - Toz grubu ürünleri: KDV DAHİL gelir (is_kdv_included = true)
-- =====================================================

-- 1. plates tablosuna is_kdv_included sütunu ekle
ALTER TABLE plates ADD COLUMN IF NOT EXISTS is_kdv_included BOOLEAN DEFAULT true;

-- 2. plate_prices tablosuna is_kdv_included sütunu ekle
ALTER TABLE plate_prices ADD COLUMN IF NOT EXISTS is_kdv_included BOOLEAN DEFAULT true;

-- 3. accessories tablosuna is_kdv_included sütunu ekle
ALTER TABLE accessories ADD COLUMN IF NOT EXISTS is_kdv_included BOOLEAN DEFAULT true;

-- =====================================================
-- TAŞYÜNÜ LEVHALARI İÇİN KDV HARİÇ OLARAK İŞARETLE
-- =====================================================

-- Taşyünü material_type_id'sini bul ve o levhaları KDV hariç olarak işaretle
UPDATE plates 
SET is_kdv_included = false 
WHERE material_type_id = (SELECT id FROM material_types WHERE slug = 'tasyunu');

-- plate_prices tablosunda da taşyünü levhalarını güncelle
UPDATE plate_prices 
SET is_kdv_included = false 
WHERE plate_id IN (
    SELECT id FROM plates 
    WHERE material_type_id = (SELECT id FROM material_types WHERE slug = 'tasyunu')
);

-- =====================================================
-- DOĞRULAMA SORGUSU
-- =====================================================
-- Bu sorguyu çalıştırarak sonuçları kontrol edebilirsiniz:
-- SELECT p.name, p.is_kdv_included, mt.name as material_type 
-- FROM plates p 
-- JOIN material_types mt ON p.material_type_id = mt.id;
