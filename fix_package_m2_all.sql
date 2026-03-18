-- ═══════════════════════════════════════════════════════════════
-- PAKET METRAJLARINI DÜZELTME SCRIPTİ
-- ═══════════════════════════════════════════════════════════════

-- 1. plate_prices tablosuna package_m2 kolonu ekle
ALTER TABLE plate_prices ADD COLUMN IF NOT EXISTS package_m2 DECIMAL(10,2);

-- 2. EPS ÜRÜNLERİ İÇİN PAKET METRAJLARINI GÜNCELLE
-- (Tüm EPS modelleri için aynı standart geçerli)
UPDATE plate_prices pp
SET package_m2 = CASE 
    WHEN thickness = 2 THEN 12.5
    WHEN thickness = 3 THEN 8.0
    WHEN thickness = 4 THEN 6.0
    WHEN thickness = 5 THEN 5.0
    WHEN thickness = 6 THEN 4.0
    WHEN thickness = 7 THEN 3.5
    WHEN thickness = 8 THEN 3.0
    WHEN thickness = 9 THEN 2.5
    WHEN thickness = 10 THEN 2.5
    ELSE pp.package_m2
END
FROM plates p
JOIN material_types mt ON p.material_type_id = mt.id
WHERE pp.plate_id = p.id AND mt.slug = 'eps';

-- 3. TAŞYÜNÜ ÜRÜNLERİ İÇİN PAKET METRAJLARINI GÜNCELLE
-- (logistics_capacity tablosundaki standartlara göre)
UPDATE plate_prices pp
SET package_m2 = CASE 
    WHEN thickness = 3 THEN 6.0
    WHEN thickness = 4 THEN 3.6
    WHEN thickness = 5 THEN 3.6
    WHEN thickness = 6 THEN 3.0
    WHEN thickness = 7 THEN 2.4
    WHEN thickness = 8 THEN 1.8
    WHEN thickness = 9 THEN 1.8
    WHEN thickness = 10 THEN 1.8
    WHEN thickness = 12 THEN 1.2
    ELSE pp.package_m2
END
FROM plates p
JOIN material_types mt ON p.material_type_id = mt.id
WHERE pp.plate_id = p.id AND mt.slug = 'tasyunu';

-- 4.plates tablosundaki kafa karıştıran package_m2 kolonunu temizle (isteğe bağlı ama karışıklığı önler)
-- UPDATE plates SET package_m2 = NULL; 

-- DOĞRULAMA SORGUSU
-- SELECT p.short_name, mt.slug, pp.thickness, pp.package_m2, pp.base_price 
-- FROM plates p 
-- JOIN plate_prices pp ON p.id = pp.plate_id 
-- JOIN material_types mt ON p.material_type_id = mt.id
-- ORDER BY mt.slug, p.short_name, pp.thickness;
