-- =====================================================
-- EPS FİYATLARI ACIL DÜZELTME SCRIPTI
-- Tarih: 2 Ocak 2026
-- Problem: plate_prices tablosunda EPS levhalar için fiyatlar NULL
-- Çözüm: complete_plate_data.sql'deki mevcut fiyatları kullan
-- =====================================================

-- Dalmaçyalı İdeal Carbon EPS (KDV DAHİL)
INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 2, 912.30, true FROM plates WHERE short_name = 'İdeal Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 3, 796.22, true FROM plates WHERE short_name = 'İdeal Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 4, 796.18, true FROM plates WHERE short_name = 'İdeal Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 5, 829.32, true FROM plates WHERE short_name = 'İdeal Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 6, 796.22, true FROM plates WHERE short_name = 'İdeal Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 7, 812.78, true FROM plates WHERE short_name = 'İdeal Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 8, 796.18, true FROM plates WHERE short_name = 'İdeal Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 9, 746.40, true FROM plates WHERE short_name = 'İdeal Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 10, 829.38, true FROM plates WHERE short_name = 'İdeal Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

-- Dalmaçyalı Double Carbon EPS (KDV DAHİL)
INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 2, 1053.60, true FROM plates WHERE short_name = 'Double Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 3, 919.68, true FROM plates WHERE short_name = 'Double Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 4, 919.58, true FROM plates WHERE short_name = 'Double Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 5, 957.96, true FROM plates WHERE short_name = 'Double Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 6, 919.58, true FROM plates WHERE short_name = 'Double Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 7, 938.78, true FROM plates WHERE short_name = 'Double Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 8, 919.58, true FROM plates WHERE short_name = 'Double Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 9, 862.14, true FROM plates WHERE short_name = 'Double Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 10, 957.90, true FROM plates WHERE short_name = 'Double Carbon' AND brand_id = 1 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

-- Expert EPS Karbonlu (KDV DAHİL)
INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 2, 865.80, true FROM plates WHERE short_name = 'EPS Karbonlu' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 3, 755.71, true FROM plates WHERE short_name = 'EPS Karbonlu' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 4, 755.71, true FROM plates WHERE short_name = 'EPS Karbonlu' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 5, 787.20, true FROM plates WHERE short_name = 'EPS Karbonlu' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 6, 755.71, true FROM plates WHERE short_name = 'EPS Karbonlu' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 7, 771.46, true FROM plates WHERE short_name = 'EPS Karbonlu' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 8, 755.71, true FROM plates WHERE short_name = 'EPS Karbonlu' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 9, 708.48, true FROM plates WHERE short_name = 'EPS Karbonlu' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 10, 787.20, true FROM plates WHERE short_name = 'EPS Karbonlu' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

-- Expert EPS Beyaz (KDV DAHİL)
INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 2, 726.00, true FROM plates WHERE short_name = 'EPS Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 3, 633.60, true FROM plates WHERE short_name = 'EPS Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 4, 633.60, true FROM plates WHERE short_name = 'EPS Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 5, 660.00, true FROM plates WHERE short_name = 'EPS Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 6, 633.60, true FROM plates WHERE short_name = 'EPS Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 7, 646.80, true FROM plates WHERE short_name = 'EPS Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 8, 633.60, true FROM plates WHERE short_name = 'EPS Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 9, 594.00, true FROM plates WHERE short_name = 'EPS Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 10, 660.00, true FROM plates WHERE short_name = 'EPS Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

-- Expert 035 EPS Beyaz (KDV DAHİL)
INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 2, 1267.20, true FROM plates WHERE short_name = 'EPS 035 Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 3, 1105.92, true FROM plates WHERE short_name = 'EPS 035 Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 4, 1105.92, true FROM plates WHERE short_name = 'EPS 035 Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 5, 1152.00, true FROM plates WHERE short_name = 'EPS 035 Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 6, 1105.92, true FROM plates WHERE short_name = 'EPS 035 Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 7, 1128.96, true FROM plates WHERE short_name = 'EPS 035 Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 8, 1105.92, true FROM plates WHERE short_name = 'EPS 035 Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 9, 1036.80, true FROM plates WHERE short_name = 'EPS 035 Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 10, 1152.00, true FROM plates WHERE short_name = 'EPS 035 Beyaz' AND brand_id = 2 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

-- Optimix Karbonlu EPS (KDV DAHİL)
INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 2, 822.56, true FROM plates WHERE short_name = 'Optimix Karbonlu' AND brand_id = 4 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 3, 717.87, true FROM plates WHERE short_name = 'Optimix Karbonlu' AND brand_id = 4 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 4, 717.87, true FROM plates WHERE short_name = 'Optimix Karbonlu' AND brand_id = 4 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 5, 747.78, true FROM plates WHERE short_name = 'Optimix Karbonlu' AND brand_id = 4 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 6, 717.87, true FROM plates WHERE short_name = 'Optimix Karbonlu' AND brand_id = 4 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 7, 732.82, true FROM plates WHERE short_name = 'Optimix Karbonlu' AND brand_id = 4 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 8, 717.87, true FROM plates WHERE short_name = 'Optimix Karbonlu' AND brand_id = 4 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 9, 673.00, true FROM plates WHERE short_name = 'Optimix Karbonlu' AND brand_id = 4 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

INSERT INTO plate_prices (plate_id, thickness, base_price, is_kdv_included) 
SELECT id, 10, 747.78, true FROM plates WHERE short_name = 'Optimix Karbonlu' AND brand_id = 4 
ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price, is_kdv_included = EXCLUDED.is_kdv_included;

-- =====================================================
-- DOĞRULAMA SORGUSU
-- =====================================================
-- Bu scripti çalıştırdıktan sonra kontrol edin:
SELECT p.short_name, p.brand_id, mt.slug, pp.thickness, pp.base_price, pp.is_kdv_included
FROM plates p
LEFT JOIN plate_prices pp ON p.id = pp.plate_id
LEFT JOIN material_types mt ON p.material_type_id = mt.id
WHERE mt.slug = 'eps'
ORDER BY p.short_name, pp.thickness;
