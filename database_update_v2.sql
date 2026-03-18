-- ═══════════════════════════════════════════════════════════════
-- TAŞYÜNÜ PROJESİ - VERİTABANI GÜNCELLEMESİ v2
-- Tarih: 10 Aralık 2025
-- Amaç: Marka yapısını düzelt, 3 paket için ürün grupları oluştur
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- ADIM 1: MARKALARI GÜNCELLE
-- Fawori yerine Expert ve Optimix ayrı markalar olacak
-- ═══════════════════════════════════════════════════════════════

-- Fawori'yi Optimix olarak güncelle (mevcut brand_id: 3)
UPDATE brands SET name = 'Optimix', tier = 'performance' WHERE id = 3;

-- Expert markasını ekle
INSERT INTO brands (name, tier) VALUES ('Expert', 'premium')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ADIM 2: MEVCUT FAWORİ ÜRÜNLERİNİ OPTİMİX OLARAK GÜNCELLE
-- ═══════════════════════════════════════════════════════════════

UPDATE products SET name = 'Optimix Isı Yalıtım Yapıştırıcısı 25 kg' 
WHERE name LIKE '%Fawori%Yapıştırıcı%' AND brand_id = 3;

UPDATE products SET name = 'Optimix Isı Yalıtım Sıvası 25 kg' 
WHERE name LIKE '%Fawori%Sıva%' AND brand_id = 3;

UPDATE products SET name = 'Optimix Dübel Taşyünü 200 adet' 
WHERE name LIKE '%Fawori%Dübel%' AND brand_id = 3;

UPDATE products SET name = 'Optimix Donatı Filesi 160gr - 50 m2' 
WHERE name LIKE '%Fawori%File%' AND brand_id = 3;

UPDATE products SET name = 'Optimix Kaplama Astarı 25 kg' 
WHERE name LIKE '%Fawori%Astar%' AND brand_id = 3;

UPDATE products SET name = 'Optimix Mineral Kaplama 25 kg' 
WHERE name LIKE '%Fawori%Mineral%' AND brand_id = 3;

-- ═══════════════════════════════════════════════════════════════
-- ADIM 3: TEKNO TOZ GRUBU ÜRÜNLERİ EKLE (EN UCUZ PAKET İÇİN)
-- ═══════════════════════════════════════════════════════════════

-- Önce TEKNO'nun brand_id'sini bul (daha önce eklenmişti)
-- TEKNO genellikle brand_id = 5 veya 6 olacak

-- TEKNO Toz Grubu Ürünleri (En Ucuz Paket için)
INSERT INTO products (brand_id, name, type, category, base_price, consumption_rate, consumption_rate_eps, package_content, unit, insulation_type, thickness) 
SELECT 
    b.id,
    'TEKNO Isı Yalıtım Yapıştırıcısı 25 kg',
    'plate',
    'adhesive',
    95.00, -- Daha ucuz fiyat
    6,
    4,
    25,
    'PKT',
    'both',
    NULL
FROM brands b WHERE b.name = 'TEKNO'
ON CONFLICT DO NOTHING;

INSERT INTO products (brand_id, name, type, category, base_price, consumption_rate, consumption_rate_eps, package_content, unit, insulation_type, thickness) 
SELECT 
    b.id,
    'TEKNO Isı Yalıtım Sıvası 25 kg',
    'plate',
    'plaster',
    105.00,
    6,
    4,
    25,
    'PKT',
    'both',
    NULL
FROM brands b WHERE b.name = 'TEKNO'
ON CONFLICT DO NOTHING;

INSERT INTO products (brand_id, name, type, category, base_price, consumption_rate, consumption_rate_eps, package_content, unit, insulation_type, thickness) 
SELECT 
    b.id,
    'TEKNO Dübel Taşyünü 200 adet',
    'plate',
    'dowel',
    420.00,
    6,
    NULL,
    200,
    'KUTU',
    'tasyunu',
    NULL
FROM brands b WHERE b.name = 'TEKNO'
ON CONFLICT DO NOTHING;

INSERT INTO products (brand_id, name, type, category, base_price, consumption_rate, consumption_rate_eps, package_content, unit, insulation_type, thickness) 
SELECT 
    b.id,
    'TEKNO Dübel EPS 200 adet',
    'plate',
    'dowel',
    350.00,
    NULL,
    6,
    200,
    'KUTU',
    'eps',
    NULL
FROM brands b WHERE b.name = 'TEKNO'
ON CONFLICT DO NOTHING;

INSERT INTO products (brand_id, name, type, category, base_price, consumption_rate, consumption_rate_eps, package_content, unit, insulation_type, thickness) 
SELECT 
    b.id,
    'TEKNO Donatı Filesi 145gr - 50 m2',
    'plate',
    'mesh',
    980.00,
    1.1,
    1.1,
    50,
    'RULO',
    'both',
    NULL
FROM brands b WHERE b.name = 'TEKNO'
ON CONFLICT DO NOTHING;

INSERT INTO products (brand_id, name, type, category, base_price, consumption_rate, consumption_rate_eps, package_content, unit, insulation_type, thickness) 
SELECT 
    b.id,
    'TEKNO Kaplama Astarı 25 kg',
    'plate',
    'primer',
    520.00,
    0.219,
    0.219,
    25,
    'KOVA',
    'both',
    NULL
FROM brands b WHERE b.name = 'TEKNO'
ON CONFLICT DO NOTHING;

INSERT INTO products (brand_id, name, type, category, base_price, consumption_rate, consumption_rate_eps, package_content, unit, insulation_type, thickness) 
SELECT 
    b.id,
    'TEKNO Mineral Kaplama 25 kg',
    'plate',
    'coating',
    185.00,
    2,
    2,
    25,
    'PKT',
    'both',
    NULL
FROM brands b WHERE b.name = 'TEKNO'
ON CONFLICT DO NOTHING;

INSERT INTO products (brand_id, name, type, category, base_price, consumption_rate, consumption_rate_eps, package_content, unit, insulation_type, thickness) 
SELECT 
    b.id,
    'TEKNO Fileli Köşe PVC 125 m',
    'plate',
    'corner',
    1100.00,
    0.1,
    0.1,
    125,
    'PKT',
    'both',
    NULL
FROM brands b WHERE b.name = 'TEKNO'
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ADIM 4: OPTİMİX FİYATLARINI GÜNCELLE (ORTA SEGMENT)
-- ═══════════════════════════════════════════════════════════════

-- Optimix fiyatları TEKNO'dan yüksek, Dalmaçyalı'dan düşük olmalı
UPDATE products SET base_price = 115.00 WHERE name LIKE 'Optimix%Yapıştırıcı%';
UPDATE products SET base_price = 155.00 WHERE name LIKE 'Optimix%Sıva%';
UPDATE products SET base_price = 520.00 WHERE name LIKE 'Optimix%Dübel%';
UPDATE products SET base_price = 1250.00 WHERE name LIKE 'Optimix%Filesi%';
UPDATE products SET base_price = 650.00 WHERE name LIKE 'Optimix%Astar%';
UPDATE products SET base_price = 230.00 WHERE name LIKE 'Optimix%Mineral%';

-- ═══════════════════════════════════════════════════════════════
-- ADIM 5: OPTİMİX FİLELİ KÖŞE EKLE (EKSİK)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO products (brand_id, name, type, category, base_price, consumption_rate, consumption_rate_eps, package_content, unit, insulation_type, thickness) 
VALUES (3, 'Optimix Fileli Köşe PVC 125 m', 'plate', 'corner', 1350.00, 0.1, 0.1, 125, 'PKT', 'both', NULL)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- KONTROL: Marka ve ürün listesi
-- ═══════════════════════════════════════════════════════════════

-- SELECT * FROM brands ORDER BY id;
-- SELECT b.name as brand, p.name, p.category, p.base_price FROM products p JOIN brands b ON p.brand_id = b.id WHERE p.category != 'plate' ORDER BY p.category, b.tier;

-- ═══════════════════════════════════════════════════════════════
-- BİTTİ!
-- 
-- PAKET YAPISI:
-- En Ucuz    → Dalmaçyalı Levha + TEKNO Toz Grubu
-- Dengeli    → Dalmaçyalı Levha + Optimix Toz Grubu  
-- 1. Kalite  → Dalmaçyalı Levha + Dalmaçyalı Toz Grubu
-- ═══════════════════════════════════════════════════════════════
