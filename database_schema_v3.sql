-- ═══════════════════════════════════════════════════════════════
-- TAŞYÜNÜ PROJESİ - VERİTABANI ŞEMASI v3
-- Tarih: 10 Aralık 2025
-- Amaç: Kapsamlı ürün kategorileri, paket sistemi ve iskonto yapısı
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- ADIM 1: MARKALAR
-- ═══════════════════════════════════════════════════════════════

-- Mevcut brands tablosuna eksik kolonları ekle
ALTER TABLE brands ADD COLUMN IF NOT EXISTS tier VARCHAR(20);
ALTER TABLE brands ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Önce mevcut enum değerlerini kontrol et ve yenilerini ekle
-- Mevcut tier_level enum'una yeni değerler ekle (varsa atla)
DO $$ 
BEGIN
    -- 'mid' değerini ekle
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'mid' AND enumtypid = 'tier_level'::regtype) THEN
        ALTER TYPE tier_level ADD VALUE 'mid';
    END IF;
EXCEPTION WHEN others THEN
    NULL;
END $$;

-- Marka verileri - mevcut enum değerleri: eco, performance, premium
UPDATE brands SET tier = 'premium', description = 'En kaliteli, orijinal sistem' WHERE name = 'Dalmaçyalı';
UPDATE brands SET tier = 'performance', description = 'Kaliteli alternatif' WHERE name = 'Expert';
UPDATE brands SET tier = 'eco', description = 'Ekonomik performans' WHERE name = 'Optimix';
UPDATE brands SET tier = 'eco', description = 'Ekonomik performans' WHERE name = 'Fawori';

-- Yeni markaları ekle (yoksa) - eco tier kullan
INSERT INTO brands (name, tier, description) 
SELECT 'Kaspor', 'eco', 'En uygun fiyat'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Kaspor');

INSERT INTO brands (name, tier, description) 
SELECT 'OEM', 'eco', 'Markasız/Karışık ürünler'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'OEM');

-- ═══════════════════════════════════════════════════════════════
-- ADIM 2: ÜRÜN KATEGORİLERİ
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    requires_powder_group BOOLEAN DEFAULT false, -- Toz grubu gerekli mi?
    description TEXT
);

INSERT INTO product_categories (name, slug, requires_powder_group, description) VALUES
('Mantolama Levhaları', 'mantolama', true, 'EPS ve Taşyünü mantolama levhaları - toz grubu ile paket'),
('Çatı Levhaları', 'cati', false, 'Teras çatı levhaları - sadece levha'),
('Ara Bölme Levhaları', 'ara-bolme', false, 'Ara bölme levhaları - sadece levha')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ADIM 3: ÜRÜN ALT KATEGORİLERİ (Malzeme Tipi)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS material_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(20) NOT NULL UNIQUE,
    description TEXT
);

INSERT INTO material_types (name, slug, description) VALUES
('EPS (Strafor)', 'eps', 'Genleştirilmiş Polistiren köpük'),
('Taşyünü', 'tasyunu', 'Mineral yün bazlı yalıtım malzemesi')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ADIM 4: LEVHA ÜRÜNLERİ
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS plates (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER REFERENCES brands(id),
    category_id INTEGER REFERENCES product_categories(id),
    material_type_id INTEGER REFERENCES material_types(id),
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(100), -- Kısa gösterim adı
    density INTEGER, -- kg/m³ (Taşyünü için)
    thickness_options JSONB, -- [3,4,5,6,7,8,9,10] cm
    base_price_per_cm DECIMAL(10,2), -- cm başına baz fiyat
    package_m2 DECIMAL(5,2), -- Paket başına m²
    pallet_packages INTEGER, -- Palet başına paket
    consumption_rate DECIMAL(5,2) DEFAULT 1.0, -- m²/m² sarfiyat
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Dalmaçyalı Levhalar
INSERT INTO plates (brand_id, category_id, material_type_id, name, short_name, density, thickness_options, package_m2) VALUES
-- Dalmaçyalı EPS
((SELECT id FROM brands WHERE name='Dalmaçyalı'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='eps'),
 'Dalmaçyalı İdeal Carbon EPS Levha', 'İdeal Carbon', NULL, '[2,3,4,5,6,7,8,9,10]', 5.0),

((SELECT id FROM brands WHERE name='Dalmaçyalı'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='eps'),
 'Dalmaçyalı Double Carbon EPS Levha', 'Double Carbon', NULL, '[2,3,4,5,6,7,8,9,10]', 5.0),

-- Dalmaçyalı Taşyünü
((SELECT id FROM brands WHERE name='Dalmaçyalı'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Dalmaçyalı Stonewool SW035 Taşyünü Levha', 'SW035', 120, '[3,4,5,6,7,8,10,12]', 3.6),

-- Expert EPS
((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='eps'),
 'Expert EPS Karbonlu Isı Yalıtım Levhası', 'EPS Karbonlu', NULL, '[2,3,4,5,6,7,8,9,10]', 5.0),

((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='eps'),
 'Expert EPS Beyaz Isı Yalıtım Levhası', 'EPS Beyaz', NULL, '[2,3,4,5,6,7,8,9,10]', 5.0),

-- Expert Taşyünü
((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Expert Premium Taşyünü Isı Yalıtım Levhası', 'Premium', 120, '[5,6,7,8,10]', 3.6),

((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Expert LD125 Taşyünü Isı Yalıtım Levhası', 'LD125', 125, '[5,6,7,8,10]', 3.6),

((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Expert HD150 Taşyünü Isı Yalıtım Levhası', 'HD150', 150, '[5,6,7,8,10,12]', 3.6),

-- Expert Çatı/Ara Bölme (Toz grubu yok)
((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='cati'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Expert RF150 Taşyünü Teras Çatı Levhası', 'RF150 Çatı', 150, '[5,6,8,10]', 3.6),

((SELECT id FROM brands WHERE name='Expert'), 
 (SELECT id FROM product_categories WHERE slug='ara-bolme'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Expert PW50 Taşyünü Ara Bölme Levhası', 'PW50 Ara Bölme', 50, '[5,6,7,8,10]', 4.8),

-- Optimix/Fawori
((SELECT id FROM brands WHERE name='Optimix'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='eps'),
 'Fawori Optimix Isı Yalıtım Levhası Karbonlu', 'Optimix Karbonlu', NULL, '[2,3,4,5,6,7,8,9,10]', 5.0),

((SELECT id FROM brands WHERE name='Optimix'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='tasyunu'),
 'Optimix TR7.5 Taşyünü Isı Yalıtım Levhası', 'TR7.5', 120, '[5,6,8,10]', 3.6),

-- Kaspor (En ucuz)
((SELECT id FROM brands WHERE name='Kaspor'), 
 (SELECT id FROM product_categories WHERE slug='mantolama'),
 (SELECT id FROM material_types WHERE slug='eps'),
 'Kaspor EPS Isı Yalıtım Levhası', 'Kaspor EPS', NULL, '[3,4,5,6,7,8,10]', 5.0);

-- ═══════════════════════════════════════════════════════════════
-- ADIM 5: TOZ GRUBU ÜRÜNLERİ (Aksesuarlar)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS accessory_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    sort_order INTEGER,
    consumption_rate_eps DECIMAL(5,2), -- EPS için m² başına sarfiyat
    consumption_rate_tasyunu DECIMAL(5,2) -- Taşyünü için m² başına sarfiyat
);

INSERT INTO accessory_types (name, slug, sort_order, consumption_rate_eps, consumption_rate_tasyunu) VALUES
('Yapıştırıcı', 'yapistirici', 1, 4.0, 6.0), -- kg/m²
('Sıva', 'siva', 2, 4.0, 6.0), -- kg/m²
('Dübel', 'dubel', 3, 6.0, 6.0), -- adet/m²
('File', 'file', 4, 1.1, 1.1), -- m²/m²
('Fileli Köşe', 'fileli-kose', 5, 0.5, 0.5), -- mt/m²
('Astar', 'astar', 6, 0.2, 0.2), -- kg/m²
('Kaplama', 'kaplama', 7, 2.5, 2.5) -- kg/m²
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS accessories (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER REFERENCES brands(id),
    accessory_type_id INTEGER REFERENCES accessory_types(id),
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(100),
    unit VARCHAR(20), -- PKT, KOVA, KUTU, RULO
    unit_content DECIMAL(10,2), -- Birim içeriği (25kg, 600 adet, 55m² vs)
    base_price DECIMAL(10,2), -- KDV dahil liste fiyatı
    is_for_eps BOOLEAN DEFAULT true,
    is_for_tasyunu BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Dalmaçyalı Toz Grubu
INSERT INTO accessories (brand_id, accessory_type_id, name, short_name, unit, unit_content, base_price, is_for_eps, is_for_tasyunu) VALUES
-- Yapıştırıcı
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM accessory_types WHERE slug='yapistirici'),
 'Dalmaçyalı Isı Yalıtım Yapıştırıcısı 25kg', 'Yapıştırıcı', 'PKT', 25, 233.60, true, false),
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM accessory_types WHERE slug='yapistirici'),
 'Dalmaçyalı Stonewool Taşyünü Sistem Yapıştırıcısı 25kg', 'Taşyünü Yapıştırıcı', 'PKT', 25, 321.36, false, true),

-- Sıva
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM accessory_types WHERE slug='siva'),
 'Dalmaçyalı Isı Yalıtım Sıvası 25kg', 'Sıva', 'PKT', 25, 317.65, true, false),
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM accessory_types WHERE slug='siva'),
 'Dalmaçyalı Stonewool Taşyünü Sistem Sıvası 25kg', 'Taşyünü Sıva', 'PKT', 25, 349.18, false, true),

-- Dübel
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM accessory_types WHERE slug='dubel'),
 'Dalmaçyalı Standart Dübel 11,5cm Plastik Çivili 600 adet', 'Plastik Dübel', 'KUTU', 600, 2102.40, true, false),
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM accessory_types WHERE slug='dubel'),
 'Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet', 'Çelik Dübel', 'KUTU', 200, 1185.60, false, true),

-- File
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM accessory_types WHERE slug='file'),
 'Dalmaçyalı Donatı Filesi S160 55m²', 'File S160', 'RULO', 55, 2765.70, true, true),

-- Fileli Köşe
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM accessory_types WHERE slug='fileli-kose'),
 'Dalmaçyalı Fileli Köşe (PVC) 2,5m 50 adet 125m', 'Fileli Köşe', 'PKT', 125, 2760.00, true, true),

-- Astar
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM accessory_types WHERE slug='astar'),
 'Dalmaçyalı Kaplama Astarı 25kg', 'Astar', 'KOVA', 25, 1320.00, true, true),

-- Kaplama
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM accessory_types WHERE slug='kaplama'),
 'Dalmaçyalı Mineral Kaplama İnce Tane 25kg', 'Mineral Kaplama', 'PKT', 25, 475.24, true, true);

-- Expert Toz Grubu
INSERT INTO accessories (brand_id, accessory_type_id, name, short_name, unit, unit_content, base_price, is_for_eps, is_for_tasyunu) VALUES
((SELECT id FROM brands WHERE name='Expert'), (SELECT id FROM accessory_types WHERE slug='yapistirici'),
 'Expert Yapıştırma Harcı 25kg', 'Yapıştırıcı', 'PKT', 25, 214.45, true, true),
((SELECT id FROM brands WHERE name='Expert'), (SELECT id FROM accessory_types WHERE slug='siva'),
 'Expert Sıva Harcı 25kg', 'Sıva', 'PKT', 25, 285.52, true, true),
((SELECT id FROM brands WHERE name='Expert'), (SELECT id FROM accessory_types WHERE slug='dubel'),
 'Expert Plastik Dübel 11,5cm 600 adet', 'Plastik Dübel', 'KUTU', 600, 1324.80, true, false),
((SELECT id FROM brands WHERE name='Expert'), (SELECT id FROM accessory_types WHERE slug='dubel'),
 'Expert Çelik Çivili Taşyünü Dübeli 11,5cm 200 adet', 'Çelik Dübel', 'KUTU', 200, 1147.20, false, true),
((SELECT id FROM brands WHERE name='Expert'), (SELECT id FROM accessory_types WHERE slug='file'),
 'Expert Donatı Filesi F160 55m²', 'File F160', 'RULO', 55, 1808.10, true, true),
((SELECT id FROM brands WHERE name='Expert'), (SELECT id FROM accessory_types WHERE slug='fileli-kose'),
 'Expert Fileli Köşe Profili (PVC) 2,5m 50 adet 125m', 'Fileli Köşe', 'PKT', 125, 2655.00, true, true),
((SELECT id FROM brands WHERE name='Expert'), (SELECT id FROM accessory_types WHERE slug='astar'),
 'Expert Kaplama Astarı 25kg', 'Astar', 'KOVA', 25, 1272.00, true, true),
((SELECT id FROM brands WHERE name='Expert'), (SELECT id FROM accessory_types WHERE slug='kaplama'),
 'Expert Dekoratif Mineral Kaplama İnce Tane 25kg', 'Mineral Kaplama', 'PKT', 25, 392.44, true, true);

-- Optimix Toz Grubu
INSERT INTO accessories (brand_id, accessory_type_id, name, short_name, unit, unit_content, base_price, is_for_eps, is_for_tasyunu) VALUES
((SELECT id FROM brands WHERE name='Optimix'), (SELECT id FROM accessory_types WHERE slug='yapistirici'),
 'Fawori Optimix Isı Yalıtım Yapıştırma Harcı 25kg', 'Yapıştırıcı', 'PKT', 25, 205.18, true, true),
((SELECT id FROM brands WHERE name='Optimix'), (SELECT id FROM accessory_types WHERE slug='siva'),
 'Fawori Optimix Isı Yalıtım Sıva Harcı 25kg', 'Sıva', 'PKT', 25, 226.19, true, true),
((SELECT id FROM brands WHERE name='Optimix'), (SELECT id FROM accessory_types WHERE slug='dubel'),
 'Fawori Optimix Plastik Çivili Dübel 11,5cm 600 adet', 'Plastik Dübel', 'KUTU', 600, 1161.01, true, false),
((SELECT id FROM brands WHERE name='Optimix'), (SELECT id FROM accessory_types WHERE slug='dubel'),
 'Fawori Optimix Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet', 'Çelik Dübel', 'KUTU', 200, 1117.41, false, true),
((SELECT id FROM brands WHERE name='Optimix'), (SELECT id FROM accessory_types WHERE slug='file'),
 'Fawori Optimix Donatı Filesi F160 50m²', 'File F160', 'RULO', 50, 1532.79, true, true),
((SELECT id FROM brands WHERE name='Optimix'), (SELECT id FROM accessory_types WHERE slug='fileli-kose'),
 'Fawori Optimix Fileli Köşe (PVC) 2,5m 50 adet 125m', 'Fileli Köşe', 'PKT', 125, 2520.00, true, true),
((SELECT id FROM brands WHERE name='Optimix'), (SELECT id FROM accessory_types WHERE slug='astar'),
 'Fawori Optimix Kaplama Astarı 25kg', 'Astar', 'KOVA', 25, 1200.00, true, true),
((SELECT id FROM brands WHERE name='Optimix'), (SELECT id FROM accessory_types WHERE slug='kaplama'),
 'Fawori Optimix Mineral Kaplama İnce Tane 25kg', 'Mineral Kaplama', 'PKT', 25, 314.56, true, true);

-- OEM/Budget Toz Grubu (En ucuz - karışık markalar)
INSERT INTO accessories (brand_id, accessory_type_id, name, short_name, unit, unit_content, base_price, is_for_eps, is_for_tasyunu) VALUES
((SELECT id FROM brands WHERE name='OEM'), (SELECT id FROM accessory_types WHERE slug='yapistirici'),
 'Ekonomik Isı Yalıtım Yapıştırıcısı 25kg', 'Yapıştırıcı', 'PKT', 25, 180.00, true, true),
((SELECT id FROM brands WHERE name='OEM'), (SELECT id FROM accessory_types WHERE slug='siva'),
 'Ekonomik Isı Yalıtım Sıvası 25kg', 'Sıva', 'PKT', 25, 200.00, true, true),
((SELECT id FROM brands WHERE name='OEM'), (SELECT id FROM accessory_types WHERE slug='dubel'),
 '2.Kalite Plastik Dübel 11,5cm 500 adet', 'Plastik Dübel', 'KUTU', 500, 800.00, true, false),
((SELECT id FROM brands WHERE name='OEM'), (SELECT id FROM accessory_types WHERE slug='dubel'),
 '2.Kalite Çelik Dübel 11,5cm 200 adet', 'Çelik Dübel', 'KUTU', 200, 900.00, false, true),
((SELECT id FROM brands WHERE name='OEM'), (SELECT id FROM accessory_types WHERE slug='file'),
 '2.Kalite Donatı Filesi 50m²', 'File', 'RULO', 50, 1000.00, true, true),
((SELECT id FROM brands WHERE name='OEM'), (SELECT id FROM accessory_types WHERE slug='fileli-kose'),
 'Ekonomik Fileli Köşe (PVC) 2,5m 50 adet 125m', 'Fileli Köşe', 'PKT', 125, 2000.00, true, true),
((SELECT id FROM brands WHERE name='OEM'), (SELECT id FROM accessory_types WHERE slug='astar'),
 'Ekonomik Kaplama Astarı 25kg', 'Astar', 'KOVA', 25, 900.00, true, true),
((SELECT id FROM brands WHERE name='OEM'), (SELECT id FROM accessory_types WHERE slug='kaplama'),
 'Ekonomik Mineral Kaplama 25kg', 'Mineral Kaplama', 'PKT', 25, 250.00, true, true);

-- ═══════════════════════════════════════════════════════════════
-- ADIM 6: PAKET TANIMLARI
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS package_definitions (
    id SERIAL PRIMARY KEY,
    plate_brand_id INTEGER REFERENCES brands(id), -- Levha markası
    accessory_brand_id INTEGER REFERENCES brands(id), -- Toz grubu markası
    tier VARCHAR(20) NOT NULL, -- premium, balanced, budget
    name VARCHAR(100) NOT NULL,
    description TEXT,
    badge VARCHAR(50), -- "En Popüler", "En Uygun" vs
    sort_order INTEGER,
    is_active BOOLEAN DEFAULT true
);

-- Dalmaçyalı seçildiğinde gösterilecek paketler
INSERT INTO package_definitions (plate_brand_id, accessory_brand_id, tier, name, description, badge, sort_order) VALUES
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM brands WHERE name='Dalmaçyalı'), 
 'premium', '1. Kalite Paket', 'Full Dalmaçyalı orijinal sistem', 'Premium', 1),
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM brands WHERE name='Optimix'), 
 'balanced', 'Dengeli Paket', 'Dalmaçyalı levha + Optimix toz grubu', 'En Popüler', 2),
((SELECT id FROM brands WHERE name='Dalmaçyalı'), (SELECT id FROM brands WHERE name='OEM'), 
 'budget', 'Ekonomik Paket', 'Dalmaçyalı levha + Ekonomik aksesuarlar', 'En Uygun', 3);

-- Expert seçildiğinde gösterilecek paketler
INSERT INTO package_definitions (plate_brand_id, accessory_brand_id, tier, name, description, badge, sort_order) VALUES
((SELECT id FROM brands WHERE name='Expert'), (SELECT id FROM brands WHERE name='Expert'), 
 'premium', '1. Kalite Paket', 'Full Expert sistem', 'Premium', 1),
((SELECT id FROM brands WHERE name='Expert'), (SELECT id FROM brands WHERE name='Optimix'), 
 'balanced', 'Dengeli Paket', 'Expert levha + Optimix toz grubu', 'En Popüler', 2),
((SELECT id FROM brands WHERE name='Expert'), (SELECT id FROM brands WHERE name='OEM'), 
 'budget', 'Ekonomik Paket', 'Expert levha + Ekonomik aksesuarlar', 'En Uygun', 3);

-- Optimix seçildiğinde gösterilecek paketler
INSERT INTO package_definitions (plate_brand_id, accessory_brand_id, tier, name, description, badge, sort_order) VALUES
((SELECT id FROM brands WHERE name='Optimix'), (SELECT id FROM brands WHERE name='Optimix'), 
 'premium', '1. Kalite Paket', 'Full Optimix sistem', 'Premium', 1),
((SELECT id FROM brands WHERE name='Optimix'), (SELECT id FROM brands WHERE name='OEM'), 
 'balanced', 'Dengeli Paket', 'Optimix levha + Ekonomik toz grubu', 'Ekonomik', 2),
((SELECT id FROM brands WHERE name='Kaspor'), (SELECT id FROM brands WHERE name='OEM'), 
 'budget', 'En Ucuz Paket', 'Kaspor EPS + Ekonomik aksesuarlar', 'En Uygun', 3);

-- ═══════════════════════════════════════════════════════════════
-- ADIM 7: BÖLGE İSKONTOLARI
-- ═══════════════════════════════════════════════════════════════

-- shipping_zones tablosuna iskonto kolonları ekle
ALTER TABLE shipping_zones ADD COLUMN IF NOT EXISTS discount_kamyon DECIMAL(5,2) DEFAULT 0;
ALTER TABLE shipping_zones ADD COLUMN IF NOT EXISTS discount_tir DECIMAL(5,2) DEFAULT 0;

-- 81 İl için iskonto oranları (Ocak 2025)
UPDATE shipping_zones SET discount_kamyon = 3, discount_tir = 6 WHERE city_name = 'Adıyaman';
UPDATE shipping_zones SET discount_kamyon = 14, discount_tir = 18 WHERE city_name = 'Afyonkarahisar';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Ağrı';
UPDATE shipping_zones SET discount_kamyon = 8, discount_tir = 12 WHERE city_name = 'Amasya';
UPDATE shipping_zones SET discount_kamyon = 12, discount_tir = 16 WHERE city_name = 'Ankara';
UPDATE shipping_zones SET discount_kamyon = 14, discount_tir = 18 WHERE city_name = 'Antalya';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Artvin';
UPDATE shipping_zones SET discount_kamyon = 14, discount_tir = 18 WHERE city_name = 'Aydın';
UPDATE shipping_zones SET discount_kamyon = 19, discount_tir = 22 WHERE city_name = 'Balıkesir';
UPDATE shipping_zones SET discount_kamyon = 11, discount_tir = 19 WHERE city_name = 'Bilecik';
UPDATE shipping_zones SET discount_kamyon = 3, discount_tir = 5 WHERE city_name = 'Bingöl';
UPDATE shipping_zones SET discount_kamyon = 3, discount_tir = 5 WHERE city_name = 'Bitlis';
UPDATE shipping_zones SET discount_kamyon = 13, discount_tir = 17 WHERE city_name = 'Bolu';
UPDATE shipping_zones SET discount_kamyon = 15, discount_tir = 19 WHERE city_name = 'Burdur';
UPDATE shipping_zones SET discount_kamyon = 17, discount_tir = 21 WHERE city_name = 'Bursa';
UPDATE shipping_zones SET discount_kamyon = 11, discount_tir = 15 WHERE city_name = 'Çanakkale';
UPDATE shipping_zones SET discount_kamyon = 11, discount_tir = 15 WHERE city_name = 'Çankırı';
UPDATE shipping_zones SET discount_kamyon = 8, discount_tir = 12 WHERE city_name = 'Çorum';
UPDATE shipping_zones SET discount_kamyon = 15, discount_tir = 19 WHERE city_name = 'Denizli';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Diyarbakır';
UPDATE shipping_zones SET discount_kamyon = 11, discount_tir = 15 WHERE city_name = 'Edirne';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Elazığ';
UPDATE shipping_zones SET discount_kamyon = 3, discount_tir = 5 WHERE city_name = 'Erzincan';
UPDATE shipping_zones SET discount_kamyon = 3, discount_tir = 5 WHERE city_name = 'Erzurum';
UPDATE shipping_zones SET discount_kamyon = 15, discount_tir = 19 WHERE city_name = 'Eskişehir';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Gaziantep';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Giresun';
UPDATE shipping_zones SET discount_kamyon = 3, discount_tir = 5 WHERE city_name = 'Gümüşhane';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 5 WHERE city_name = 'Hakkari';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Hatay';
UPDATE shipping_zones SET discount_kamyon = 12, discount_tir = 16 WHERE city_name = 'Isparta';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 8 WHERE city_name = 'Mersin';
UPDATE shipping_zones SET discount_kamyon = 14, discount_tir = 18 WHERE city_name = 'İstanbul';
UPDATE shipping_zones SET discount_kamyon = 17, discount_tir = 21 WHERE city_name = 'İzmir';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Kars';
UPDATE shipping_zones SET discount_kamyon = 9, discount_tir = 13 WHERE city_name = 'Kastamonu';
UPDATE shipping_zones SET discount_kamyon = 8, discount_tir = 9 WHERE city_name = 'Kayseri';
UPDATE shipping_zones SET discount_kamyon = 10, discount_tir = 14 WHERE city_name = 'Kırklareli';
UPDATE shipping_zones SET discount_kamyon = 9, discount_tir = 13 WHERE city_name = 'Kırşehir';
UPDATE shipping_zones SET discount_kamyon = 14, discount_tir = 18 WHERE city_name = 'Kocaeli';
UPDATE shipping_zones SET discount_kamyon = 12, discount_tir = 16 WHERE city_name = 'Konya';
UPDATE shipping_zones SET discount_kamyon = 12, discount_tir = 20 WHERE city_name = 'Kütahya';
UPDATE shipping_zones SET discount_kamyon = 3, discount_tir = 6 WHERE city_name = 'Malatya';
UPDATE shipping_zones SET discount_kamyon = 12, discount_tir = 16 WHERE city_name = 'Manisa';
UPDATE shipping_zones SET discount_kamyon = 4, discount_tir = 8 WHERE city_name = 'Kahramanmaraş';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 5 WHERE city_name = 'Mardin';
UPDATE shipping_zones SET discount_kamyon = 11, discount_tir = 15 WHERE city_name = 'Muğla';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Muş';
UPDATE shipping_zones SET discount_kamyon = 11, discount_tir = 15 WHERE city_name = 'Nevşehir';
UPDATE shipping_zones SET discount_kamyon = 10, discount_tir = 14 WHERE city_name = 'Niğde';
UPDATE shipping_zones SET discount_kamyon = 10, discount_tir = 14 WHERE city_name = 'Ordu';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Rize';
UPDATE shipping_zones SET discount_kamyon = 15, discount_tir = 19 WHERE city_name = 'Sakarya';
UPDATE shipping_zones SET discount_kamyon = 6, discount_tir = 10 WHERE city_name = 'Samsun';
UPDATE shipping_zones SET discount_kamyon = 3, discount_tir = 5 WHERE city_name = 'Siirt';
UPDATE shipping_zones SET discount_kamyon = 8, discount_tir = 12 WHERE city_name = 'Sinop';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Sivas';
UPDATE shipping_zones SET discount_kamyon = 11, discount_tir = 15 WHERE city_name = 'Tekirdağ';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Tokat';
UPDATE shipping_zones SET discount_kamyon = 3, discount_tir = 5 WHERE city_name = 'Trabzon';
UPDATE shipping_zones SET discount_kamyon = 3, discount_tir = 5 WHERE city_name = 'Tunceli';
UPDATE shipping_zones SET discount_kamyon = 3, discount_tir = 5 WHERE city_name = 'Şanlıurfa';
UPDATE shipping_zones SET discount_kamyon = 15, discount_tir = 19 WHERE city_name = 'Uşak';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Van';
UPDATE shipping_zones SET discount_kamyon = 8, discount_tir = 12 WHERE city_name = 'Yozgat';
UPDATE shipping_zones SET discount_kamyon = 12, discount_tir = 16 WHERE city_name = 'Zonguldak';
UPDATE shipping_zones SET discount_kamyon = 10, discount_tir = 14 WHERE city_name = 'Aksaray';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Bayburt';
UPDATE shipping_zones SET discount_kamyon = 10, discount_tir = 14 WHERE city_name = 'Karaman';
UPDATE shipping_zones SET discount_kamyon = 10, discount_tir = 14 WHERE city_name = 'Kırıkkale';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Batman';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Şırnak';
UPDATE shipping_zones SET discount_kamyon = 10, discount_tir = 14 WHERE city_name = 'Bartın';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Ardahan';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Iğdır';
UPDATE shipping_zones SET discount_kamyon = 16, discount_tir = 20 WHERE city_name = 'Yalova';
UPDATE shipping_zones SET discount_kamyon = 16, discount_tir = 20 WHERE city_name = 'Karabük';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 9 WHERE city_name = 'Kilis';
UPDATE shipping_zones SET discount_kamyon = 5, discount_tir = 10 WHERE city_name = 'Osmaniye';
UPDATE shipping_zones SET discount_kamyon = 14, discount_tir = 18 WHERE city_name = 'Düzce';

-- ═══════════════════════════════════════════════════════════════
-- ADIM 8: FİYAT HESAPLAMA FONKSİYONU
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION calculate_sale_price(
    base_price DECIMAL,
    discount_rate DECIMAL,
    profit_margin DECIMAL DEFAULT 10
) RETURNS DECIMAL AS $$
BEGIN
    -- Liste fiyatından iskonto uygula
    -- KDV çıkar (/1.20)
    -- Kar ekle
    RETURN ROUND(base_price * (1 - discount_rate / 100) / 1.20 * (1 + profit_margin / 100), 2);
END;
$$ LANGUAGE plpgsql;

-- Örnek kullanım:
-- SELECT calculate_sale_price(214.45, 18, 10); -- İstanbul Tır için Expert Yapıştırıcı = 161.05 TL
