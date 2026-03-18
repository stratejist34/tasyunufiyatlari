-- =====================================================
-- TÜM LEVHA VE FİYAT VERİLERİ - TAM LİSTE
-- =====================================================

-- 1. plate_prices tablosunu oluştur
CREATE TABLE IF NOT EXISTS plate_prices (
    id SERIAL PRIMARY KEY,
    plate_id INTEGER REFERENCES plates(id),
    thickness INTEGER NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(plate_id, thickness)
);

-- =====================================================
-- 2. EKSİK LEVHALARI EKLE
-- =====================================================

-- Expert EPS Beyaz
INSERT INTO plates (brand_id, category_id, material_type_id, name, short_name, thickness_options, package_m2, discount_1, discount_2) VALUES
((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='eps'),
 'Expert EPS Beyaz Isı Yalıtım Levhası', 'EPS Beyaz', '[2,3,4,5,6,7,8,9,10]', 5.0, 9, 8)
ON CONFLICT DO NOTHING;

-- Expert 035 EPS Beyaz
INSERT INTO plates (brand_id, category_id, material_type_id, name, short_name, thickness_options, package_m2, discount_1, discount_2) VALUES
((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='eps'),
 'Expert 035 EPS Beyaz Isı Yalıtım Levhası 20-22kg/m3', 'EPS 035 Beyaz', '[2,3,4,5,6,7,8,9,10]', 5.0, 9, 8)
ON CONFLICT DO NOTHING;

-- Expert Premium Taşyünü
INSERT INTO plates (brand_id, category_id, material_type_id, name, short_name, density, thickness_options, package_m2, discount_1, discount_2) VALUES
((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Expert Premium Taşyünü Isı Yalıtım Levhası', 'Premium', 120, '[5,6,7,8,9,10]', 3.6, 18, 8)
ON CONFLICT DO NOTHING;

-- Expert LD125 Taşyünü
INSERT INTO plates (brand_id, category_id, material_type_id, name, short_name, density, thickness_options, package_m2, discount_1, discount_2) VALUES
((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Expert LD125 Taşyünü Isı Yalıtım Levhası', 'LD125', 125, '[3,4,5,6,7,8,9,10]', 3.6, 18, 8)
ON CONFLICT DO NOTHING;

-- Expert VF80 Giydirme Cephe
INSERT INTO plates (brand_id, category_id, material_type_id, name, short_name, density, thickness_options, package_m2, discount_1, discount_2) VALUES
((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Expert VF80 Taşyünü Giydirme Cephe Levhası', 'VF80', 80, '[4,5,6,7,8,9,10]', 3.6, 18, 8)
ON CONFLICT DO NOTHING;

-- Expert RF150 Teras Çatı
INSERT INTO plates (brand_id, category_id, material_type_id, name, short_name, density, thickness_options, package_m2, discount_1, discount_2) VALUES
((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='cati'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Expert RF150 Taşyünü Teras Çatı Levhası', 'RF150', 150, '[4,5,6,7,8,9,10]', 3.6, 18, 8)
ON CONFLICT DO NOTHING;

-- Expert PW50 Ara Bölme
INSERT INTO plates (brand_id, category_id, material_type_id, name, short_name, density, thickness_options, package_m2, discount_1, discount_2) VALUES
((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='ara-bolme'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Expert PW50 Taşyünü Ara Bölme Levhası', 'PW50', 50, '[5,6,7,8,9,10]', 4.8, 18, 8)
ON CONFLICT DO NOTHING;

-- Dalmaçyalı CS60 Teras Çatı
INSERT INTO plates (brand_id, category_id, material_type_id, name, short_name, density, thickness_options, package_m2, discount_1, discount_2) VALUES
((SELECT id FROM brands WHERE name='Dalmaçyalı'), 
 (SELECT id FROM product_categories WHERE slug='cati'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Dalmaçyalı Stonewool CS60 Taşyünü Teras Çatı Levhası', 'CS60', 60, '[5,6,7,8,9,10]', 3.6, 18, 8)
ON CONFLICT DO NOTHING;

-- Dalmaçyalı Yangın Bariyeri
INSERT INTO plates (brand_id, category_id, material_type_id, name, short_name, density, thickness_options, package_m2, discount_1, discount_2) VALUES
((SELECT id FROM brands WHERE name='Dalmaçyalı'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Dalmaçyalı Stonewool Taşyünü Yangın Bariyeri Levhası', 'Yangın Bariyeri', 150, '[4,5,6,7,8]', 3.6, 9, 8)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. TÜM LEVHA FİYATLARINI EKLE (plate_prices)
-- =====================================================

-- Dalmaçyalı İdeal Carbon EPS (KDV DAHİL)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 2, 912.30 FROM plates WHERE short_name = 'İdeal Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 3, 796.22 FROM plates WHERE short_name = 'İdeal Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 796.18 FROM plates WHERE short_name = 'İdeal Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 829.32 FROM plates WHERE short_name = 'İdeal Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 796.22 FROM plates WHERE short_name = 'İdeal Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 812.78 FROM plates WHERE short_name = 'İdeal Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 796.18 FROM plates WHERE short_name = 'İdeal Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 746.40 FROM plates WHERE short_name = 'İdeal Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 829.38 FROM plates WHERE short_name = 'İdeal Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Dalmaçyalı Double Carbon EPS (KDV DAHİL)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 2, 1053.60 FROM plates WHERE short_name = 'Double Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 3, 919.68 FROM plates WHERE short_name = 'Double Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 919.58 FROM plates WHERE short_name = 'Double Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 957.96 FROM plates WHERE short_name = 'Double Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 919.58 FROM plates WHERE short_name = 'Double Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 938.78 FROM plates WHERE short_name = 'Double Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 919.58 FROM plates WHERE short_name = 'Double Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 862.14 FROM plates WHERE short_name = 'Double Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 957.90 FROM plates WHERE short_name = 'Double Carbon' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Dalmaçyalı SW035 Taşyünü (KDV HARİÇ * 1.20 = KDV DAHİL)
-- Excel: 3cm=1544.80, 4cm=1055.58, 5cm=1287.30, 6cm=1287.30, 7cm=1201.48, 8cm=1029.84, 9cm=1158.58, 10cm=1287.33
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 3, 1853.76 FROM plates WHERE short_name = 'SW035' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 1266.70 FROM plates WHERE short_name = 'SW035' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 1544.76 FROM plates WHERE short_name = 'SW035' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 1544.76 FROM plates WHERE short_name = 'SW035' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 1441.78 FROM plates WHERE short_name = 'SW035' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 1235.81 FROM plates WHERE short_name = 'SW035' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 1390.30 FROM plates WHERE short_name = 'SW035' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 1544.80 FROM plates WHERE short_name = 'SW035' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Dalmaçyalı CS60 Teras Çatı (KDV HARİÇ * 1.20)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 1992.96 FROM plates WHERE short_name = 'CS60' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 1992.96 FROM plates WHERE short_name = 'CS60' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 1860.14 FROM plates WHERE short_name = 'CS60' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 1594.40 FROM plates WHERE short_name = 'CS60' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 1793.70 FROM plates WHERE short_name = 'CS60' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 1993.00 FROM plates WHERE short_name = 'CS60' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Dalmaçyalı Yangın Bariyeri (KDV HARİÇ * 1.20)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 8867.52 FROM plates WHERE short_name = 'Yangın Bariyeri' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 8868.10 FROM plates WHERE short_name = 'Yangın Bariyeri' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 8868.48 FROM plates WHERE short_name = 'Yangın Bariyeri' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 8868.29 FROM plates WHERE short_name = 'Yangın Bariyeri' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 8868.96 FROM plates WHERE short_name = 'Yangın Bariyeri' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Expert EPS Karbonlu (KDV DAHİL)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 2, 865.80 FROM plates WHERE short_name = 'EPS Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 3, 755.71 FROM plates WHERE short_name = 'EPS Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 755.71 FROM plates WHERE short_name = 'EPS Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 787.20 FROM plates WHERE short_name = 'EPS Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 755.71 FROM plates WHERE short_name = 'EPS Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 771.46 FROM plates WHERE short_name = 'EPS Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 755.71 FROM plates WHERE short_name = 'EPS Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 708.48 FROM plates WHERE short_name = 'EPS Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 787.20 FROM plates WHERE short_name = 'EPS Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Expert EPS Beyaz (KDV DAHİL)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 2, 726.00 FROM plates WHERE short_name = 'EPS Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 3, 633.60 FROM plates WHERE short_name = 'EPS Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 633.60 FROM plates WHERE short_name = 'EPS Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 660.00 FROM plates WHERE short_name = 'EPS Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 633.60 FROM plates WHERE short_name = 'EPS Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 646.80 FROM plates WHERE short_name = 'EPS Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 633.60 FROM plates WHERE short_name = 'EPS Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 594.00 FROM plates WHERE short_name = 'EPS Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 660.00 FROM plates WHERE short_name = 'EPS Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Expert 035 EPS Beyaz (KDV DAHİL)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 2, 1267.20 FROM plates WHERE short_name = 'EPS 035 Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 3, 1105.92 FROM plates WHERE short_name = 'EPS 035 Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 1105.92 FROM plates WHERE short_name = 'EPS 035 Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 1152.00 FROM plates WHERE short_name = 'EPS 035 Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 1105.92 FROM plates WHERE short_name = 'EPS 035 Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 1128.96 FROM plates WHERE short_name = 'EPS 035 Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 1105.92 FROM plates WHERE short_name = 'EPS 035 Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 1036.80 FROM plates WHERE short_name = 'EPS 035 Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 1152.00 FROM plates WHERE short_name = 'EPS 035 Beyaz' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Expert HD150 Taşyünü (KDV HARİÇ * 1.20)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 3, 2068.08 FROM plates WHERE short_name = 'HD150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 1541.66 FROM plates WHERE short_name = 'HD150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 1880.06 FROM plates WHERE short_name = 'HD150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 1880.10 FROM plates WHERE short_name = 'HD150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 1754.74 FROM plates WHERE short_name = 'HD150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 1504.08 FROM plates WHERE short_name = 'HD150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 1692.07 FROM plates WHERE short_name = 'HD150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 1880.06 FROM plates WHERE short_name = 'HD150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Expert Premium Taşyünü (KDV HARİÇ * 1.20)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 1285.63 FROM plates WHERE short_name = 'Premium' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 1285.62 FROM plates WHERE short_name = 'Premium' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 1199.90 FROM plates WHERE short_name = 'Premium' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 1028.48 FROM plates WHERE short_name = 'Premium' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 1157.04 FROM plates WHERE short_name = 'Premium' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 1285.60 FROM plates WHERE short_name = 'Premium' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Expert LD125 Taşyünü (KDV HARİÇ * 1.20)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 3, 1914.24 FROM plates WHERE short_name = 'LD125' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 1308.10 FROM plates WHERE short_name = 'LD125' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 1595.23 FROM plates WHERE short_name = 'LD125' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 1595.22 FROM plates WHERE short_name = 'LD125' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 1488.91 FROM plates WHERE short_name = 'LD125' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 1276.20 FROM plates WHERE short_name = 'LD125' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 1435.72 FROM plates WHERE short_name = 'LD125' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 1595.23 FROM plates WHERE short_name = 'LD125' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Expert VF80 Giydirme Cephe (KDV HARİÇ * 1.20)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 824.83 FROM plates WHERE short_name = 'VF80' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 1005.91 FROM plates WHERE short_name = 'VF80' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 1005.90 FROM plates WHERE short_name = 'VF80' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 938.83 FROM plates WHERE short_name = 'VF80' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 804.71 FROM plates WHERE short_name = 'VF80' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 905.33 FROM plates WHERE short_name = 'VF80' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 1005.91 FROM plates WHERE short_name = 'VF80' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Expert RF150 Teras Çatı (KDV HARİÇ * 1.20)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 1541.66 FROM plates WHERE short_name = 'RF150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 1880.06 FROM plates WHERE short_name = 'RF150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 1880.10 FROM plates WHERE short_name = 'RF150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 1754.74 FROM plates WHERE short_name = 'RF150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 1504.08 FROM plates WHERE short_name = 'RF150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 1692.07 FROM plates WHERE short_name = 'RF150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 1880.06 FROM plates WHERE short_name = 'RF150' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Expert PW50 Ara Bölme (KDV HARİÇ * 1.20)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 955.68 FROM plates WHERE short_name = 'PW50' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 860.18 FROM plates WHERE short_name = 'PW50' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 669.02 FROM plates WHERE short_name = 'PW50' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 764.59 FROM plates WHERE short_name = 'PW50' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 860.16 FROM plates WHERE short_name = 'PW50' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 955.73 FROM plates WHERE short_name = 'PW50' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Optimix Karbonlu EPS (KDV DAHİL)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 2, 822.56 FROM plates WHERE short_name = 'Optimix Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 3, 717.87 FROM plates WHERE short_name = 'Optimix Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 717.87 FROM plates WHERE short_name = 'Optimix Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 747.78 FROM plates WHERE short_name = 'Optimix Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 717.87 FROM plates WHERE short_name = 'Optimix Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 732.82 FROM plates WHERE short_name = 'Optimix Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 717.87 FROM plates WHERE short_name = 'Optimix Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 673.00 FROM plates WHERE short_name = 'Optimix Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 747.78 FROM plates WHERE short_name = 'Optimix Karbonlu' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Optimix TR7.5 Taşyünü (KDV HARİÇ * 1.20)
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 4, 1252.74 FROM plates WHERE short_name = 'TR7.5' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 5, 1259.94 FROM plates WHERE short_name = 'TR7.5' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 6, 1259.94 FROM plates WHERE short_name = 'TR7.5' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 7, 1175.95 FROM plates WHERE short_name = 'TR7.5' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 8, 1007.95 FROM plates WHERE short_name = 'TR7.5' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 9, 1133.95 FROM plates WHERE short_name = 'TR7.5' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;
INSERT INTO plate_prices (plate_id, thickness, base_price) 
SELECT id, 10, 1259.94 FROM plates WHERE short_name = 'TR7.5' ON CONFLICT (plate_id, thickness) DO UPDATE SET base_price = EXCLUDED.base_price;

-- =====================================================
-- KONTROL SORGUSU
-- =====================================================
-- SELECT p.short_name, pp.thickness, pp.base_price 
-- FROM plate_prices pp 
-- JOIN plates p ON pp.plate_id = p.id 
-- ORDER BY p.short_name, pp.thickness;
