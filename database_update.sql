-- ═══════════════════════════════════════════════════════════════
-- TAŞYÜNÜ PROJESİ - VERİTABANI GÜNCELLEMESİ
-- Tarih: 10 Aralık 2025
-- Amaç: Reçete/Set sistemi için tablo güncellemeleri
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- ADIM 1: PRODUCTS TABLOSUNA YENİ KOLONLAR EKLE
-- ═══════════════════════════════════════════════════════════════

-- Ürün kategorisi (levha, yapıştırıcı, sıva, dübel, file, astar, kaplama, köşe)
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;

-- Sarfiyat oranı (kg/m², adet/m², mt/m², m²/m²)
ALTER TABLE products ADD COLUMN IF NOT EXISTS consumption_rate DECIMAL(10,4);

-- Paket içeriği (25kg, 200 adet, 55m², 125mt)
ALTER TABLE products ADD COLUMN IF NOT EXISTS package_content DECIMAL(10,4);

-- Birim (PKT, KUTU, RULO, KOVA, m2, MT)
ALTER TABLE products ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'PKT';

-- Hangi yalıtım tipiyle kullanılır (tasyunu, eps, both)
ALTER TABLE products ADD COLUMN IF NOT EXISTS insulation_type TEXT DEFAULT 'both';

-- Sarfiyat oranı EPS için farklıysa (örn: yapıştırıcı taşyünü=6, eps=4)
ALTER TABLE products ADD COLUMN IF NOT EXISTS consumption_rate_eps DECIMAL(10,4);

-- ═══════════════════════════════════════════════════════════════
-- ADIM 2: PAKET TANIMLARI TABLOSU
-- ═══════════════════════════════════════════════════════════════

-- Tier seviyesi için enum (zaten varsa atla)
-- Not: Eğer tier_level enum'u farklı değerlerle varsa, önce DROP etmemiz gerekebilir
-- DROP TYPE IF EXISTS tier_level CASCADE;
-- CREATE TYPE tier_level AS ENUM ('budget', 'balanced', 'premium');

-- Paket tanımları tablosu
CREATE TABLE IF NOT EXISTS package_definitions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE, -- URL için: 'en-ucuz', 'dengeli', 'birinci-kalite'
    tier TEXT NOT NULL, -- 'budget', 'balanced', 'premium'
    description TEXT,
    badge_text TEXT, -- "EN ÇOK TERCİH EDİLEN"
    warranty_years INT DEFAULT 2,
    display_order INT DEFAULT 1,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- ADIM 3: PAKET İÇERİKLERİ (REÇETE) TABLOSU
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS package_items (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    package_id BIGINT REFERENCES package_definitions(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    
    -- Bu ürün için özel sarfiyat oranı (NULL ise products tablosundaki kullanılır)
    custom_consumption_rate DECIMAL(10,4),
    
    -- Kartta ana ürün olarak mı gösterilsin?
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- Kullanıcı bu ürünü değiştirebilir mi?
    is_customizable BOOLEAN DEFAULT FALSE,
    
    -- Sıralama
    display_order INT DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(package_id, product_id)
);

-- ═══════════════════════════════════════════════════════════════
-- ADIM 4: VADE FARKI TABLOSU
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS payment_terms (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    term_days INT NOT NULL, -- 0, 30, 60, 90
    monthly_rate DECIMAL(5,4) NOT NULL, -- 0.04 = %4
    label TEXT, -- "Nakit", "30 Gün Vadeli"
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Varsayılan vade seçenekleri
INSERT INTO payment_terms (term_days, monthly_rate, label) VALUES
(0, 0, 'Nakit (En İyi Fiyat)'),
(30, 0.04, '30 Gün Vadeli (+%4)'),
(60, 0.04, '60 Gün Vadeli'),
(90, 0.04, '90 Gün Vadeli')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ADIM 5: 3 PAKET TANIMINI EKLE
-- ═══════════════════════════════════════════════════════════════

INSERT INTO package_definitions (name, slug, tier, description, badge_text, warranty_years, display_order, is_default) VALUES
('En Ucuz Kombinasyon', 'en-ucuz', 'budget', 'Bütçe dostu hibrit sistem. Marka levha + ekonomik toz grubu.', NULL, 2, 1, FALSE),
('Dengeli Sistem', 'dengeli', 'balanced', 'En çok tercih edilen. Marka levha + kaliteli toz grubu.', 'EN ÇOK TERCİH EDİLEN', 5, 2, TRUE),
('1. Kalite Paketi', 'birinci-kalite', 'premium', 'Full orijinal sistem. Tüm ürünler aynı marka.', NULL, 10, 3, FALSE)
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ADIM 6: TOZ GRUBU ÜRÜNLERİNİ EKLE (DALMACYALI)
-- ═══════════════════════════════════════════════════════════════

-- Önce mevcut levha ürünlerinin kategorisini güncelle
UPDATE products SET category = 'plate', unit = 'm2', consumption_rate = 1, insulation_type = 'tasyunu' 
WHERE category IS NULL;

-- Dalmaçyalı Toz Grubu Ürünleri
-- type kolonu 'plate' olarak kalacak (enum kısıtlaması), category ile ayırt edeceğiz
INSERT INTO products (brand_id, name, type, category, base_price, consumption_rate, consumption_rate_eps, package_content, unit, insulation_type, thickness) VALUES
-- Yapıştırıcı (Taşyünü: 6kg/m², EPS: 4kg/m², Torba: 25kg)
(1, 'Dalmaçyalı Isı Yalıtım Yapıştırıcısı 25 kg', 'plate', 'adhesive', 143.58, 6, 4, 25, 'PKT', 'both', NULL),

-- Sıva (Taşyünü: 6kg/m², EPS: 4kg/m², Torba: 25kg)
(1, 'Dalmaçyalı Isı Yalıtım Sıvası 25 kg', 'plate', 'plaster', 194.86, 6, 4, 25, 'PKT', 'both', NULL),

-- Fileli Köşe PVC (0.1 mt/m², Paket: 125mt)
(1, 'Dalmaçyalı Fileli Köşe (PVC) 2,5 Mt (50 adet 125 m)', 'plate', 'corner', 1582.65, 0.1, 0.1, 125, 'PKT', 'both', NULL),

-- Dübel Taşyünü (6 adet/m², Kutu: 200 adet) - 11.5cm çivili
(1, 'Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5 cm 200 adet', 'plate', 'dowel', 713.79, 6, NULL, 200, 'KUTU', 'tasyunu', NULL),

-- Dübel EPS (6 adet/m², Kutu: 200 adet) - plastik çivili
(1, 'Dalmaçyalı EPS Dübeli Plastik Çivili 200 adet', 'plate', 'dowel', 450.00, NULL, 6, 200, 'KUTU', 'eps', NULL),

-- Donatı Filesi (1.1 m²/m², Rulo: 55m²)
(1, 'Dalmaçyalı Donatı Filesi S160 - 55 m2', 'plate', 'mesh', 1702.13, 1.1, 1.1, 55, 'RULO', 'both', NULL),

-- Kaplama Astarı (0.219 kg/m², Kova: 25kg)
(1, 'Dalmaçyalı Kaplama Astarı 25 kg', 'plate', 'primer', 880.41, 0.219, 0.219, 25, 'KOVA', 'both', NULL),

-- Mineral Kaplama (2 kg/m², Paket: 25kg)
(1, 'Dalmaçyalı Mineral Kaplama (ince tane) 25 kg', 'plate', 'coating', 306.89, 2, 2, 25, 'PKT', 'both', NULL)

ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ADIM 7: FAWORİ TOZ GRUBU ÜRÜNLERİ
-- ═══════════════════════════════════════════════════════════════

INSERT INTO products (brand_id, name, type, category, base_price, consumption_rate, consumption_rate_eps, package_content, unit, insulation_type, thickness) VALUES
-- Fawori (brand_id = 3)
(3, 'Fawori Isı Yalıtım Yapıştırıcısı 25 kg', 'plate', 'adhesive', 125.00, 6, 4, 25, 'PKT', 'both', NULL),
(3, 'Fawori Isı Yalıtım Sıvası 25 kg', 'plate', 'plaster', 165.00, 6, 4, 25, 'PKT', 'both', NULL),
(3, 'Fawori Dübel Taşyünü 200 adet', 'plate', 'dowel', 580.00, 6, NULL, 200, 'KUTU', 'tasyunu', NULL),
(3, 'Fawori Donatı Filesi 160gr - 50 m2', 'plate', 'mesh', 1450.00, 1.1, 1.1, 50, 'RULO', 'both', NULL),
(3, 'Fawori Kaplama Astarı 25 kg', 'plate', 'primer', 720.00, 0.219, 0.219, 25, 'KOVA', 'both', NULL),
(3, 'Fawori Mineral Kaplama 25 kg', 'plate', 'coating', 260.00, 2, 2, 25, 'PKT', 'both', NULL)

ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ADIM 8: EKONOMİK MARKALAR (YAN SANAYİ)
-- ═══════════════════════════════════════════════════════════════

-- Önce yeni markaları ekle
INSERT INTO brands (name, tier) VALUES
('TEKNO', 'eco'),
('All Alçı', 'eco'),
('ENTEGRE', 'eco'),
('ONAT', 'eco'),
('Kaspor', 'eco')
ON CONFLICT DO NOTHING;

-- Not: Bu markaların ürünlerini daha sonra ekleyeceğiz
-- Şimdilik sadece marka tanımları eklendi

-- ═══════════════════════════════════════════════════════════════
-- ADIM 9: RLS (Row Level Security) POLİTİKALARI
-- ═══════════════════════════════════════════════════════════════

-- Herkesin okuyabilmesi için
ALTER TABLE package_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_terms ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON package_definitions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON package_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON payment_terms FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════════════════
-- BİTTİ! Şimdi frontend'de 3 paket kartı sistemini yapabiliriz.
-- ═══════════════════════════════════════════════════════════════
