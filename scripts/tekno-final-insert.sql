-- TEKNO Ürünleri - DOĞRU ve EKSİKSİZ Liste
-- Düzeltmeler:
-- 1. Dübel paket boyutu 600 adet (500 değil)
-- 2. Latex Astar eklendi
-- 3. Tüm ürünler hem EPS hem Taşyünü için kullanılabilir

-- ADIM 1: Mevcut TEKNO ürünlerini sil
DELETE FROM accessories WHERE brand_id = 6;

-- ADIM 2: TEKNO ürünlerini DOĞRU fiyatlarla ekle

-- 1. TEKNOİZOFİX - Yapıştırıcı (25 KG)
-- Liste: 220 TL/paket → İskontolu Satış: 133.58 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 1, 'TEKNOİZOFİX', 'Yapıştırıcı', 'PKT', 25,
  220.00, true, true, 40, 8,
  true, true
);

-- 2. TEKNOİZOSIVA - Sıva (25 KG)
-- Liste: 242.50 TL/paket → İskontolu Satış: 147.25 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 2, 'TEKNOİZOSIVA', 'Sıva', 'PKT', 25,
  242.50, true, true, 40, 8,
  true, true
);

-- 3. TEKNODEKO İNCE (1,2 MM) - Dekoratif Sıva (25 KG)
-- Liste: 305 TL/paket → İskontolu Satış: 185.20 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 7, 'TEKNODEKO İNCE (1,2 MM)', 'Deko İnce', 'PKT', 25,
  305.00, true, true, 40, 8,
  true, true
);

-- 4. TEKNODEKO KALIN (2 MM) - Dekoratif Sıva (25 KG)
-- Liste: 305 TL/paket → İskontolu Satış: 185.20 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 7, 'TEKNODEKO KALIN (2 MM)', 'Deko Kalın', 'PKT', 25,
  305.00, true, true, 40, 8,
  true, true
);

-- 5. TEKNODEKO ÇİZGİLİ - Dekoratif Sıva (25 KG)
-- Liste: 350 TL/paket → İskontolu Satış: 212.52 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 7, 'TEKNODEKO ÇİZGİLİ', 'Deko Çizgili', 'PKT', 25,
  350.00, true, true, 40, 8,
  true, true
);

-- 6. TEKNOİZOSIVA MAKİNE SIVASI - Makine Sıvası (25 KG)
-- Liste: 160 TL/paket → İskontolu Satış: 97.15 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 2, 'TEKNOİZOSIVA MAKİNE SIVASI', 'Makine Sıva', 'PKT', 25,
  160.00, true, true, 40, 8,
  true, true
);

-- 7. FİLE 4X4 - 160 GR - Mantolama Filesi (50 M²)
-- Liste: 1600 TL/paket → İskontolu Satış: 971.52 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 4, 'FİLE 4X4 - 160 GR', 'File', 'RULO', 50,
  1600.00, true, true, 40, 8,
  true, true
);

-- 8. FİLELİ PVC KÖŞE PROFİLİ - Köşe Profili (125 MT)
-- Liste: 2075 TL/paket → İskontolu Satış: 1259.94 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 5, 'FİLELİ PVC KÖŞE PROFİLİ', 'Fileli Köşe', 'PKT', 125,
  2075.00, true, true, 40, 8,
  true, true
);

-- 9. ÇELİK ÇİVİLİ DÜBEL 115 MM (600 ADET - DÜZELTİLDİ!)
-- Liste: 2250 TL/500 adet → 2700 TL/600 adet (tahmini)
-- NOT: Fiyat listesinde 500 adet ama gerçekte 600 adet satılıyor
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 3, 'ÇELİK ÇİVİLİ DÜBEL 115 MM', 'Çelik Dübel 11.5cm', 'PKT', 600,
  2700.00, true, true, 40, 8,
  true, true, 115
);

-- 10. ÇELİK ÇİVİLİ DÜBEL 155 MM (600 ADET - DÜZELTİLDİ!)
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 3, 'ÇELİK ÇİVİLİ DÜBEL 155 MM', 'Çelik Dübel 15.5cm', 'PKT', 600,
  3120.00, true, true, 40, 8,
  true, true, 155
);

-- 11. PLASTİK ÇİVİLİ DÜBEL 10 CM (600 ADET - DÜZELTİLDİ!)
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 3, 'PLASTİK ÇİVİLİ DÜBEL 10 CM', 'Plastik Dübel 10cm', 'PKT', 600,
  1260.00, true, true, 40, 8,
  true, true, 100
);

-- 12. PLASTİK ÇİVİLİ DÜBEL 12 CM (600 ADET - DÜZELTİLDİ!)
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 3, 'PLASTİK ÇİVİLİ DÜBEL 12 CM', 'Plastik Dübel 12cm', 'PKT', 600,
  1440.00, true, true, 40, 8,
  true, true, 120
);

-- 13. CHELFIX DEKORATİF SIVA (25 KG)
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 7, 'CHELFIX DEKORATİF SIVA', 'Chelfix Deko', 'PKT', 25,
  266.00, true, true, 40, 8,
  true, true
);

-- 14. CHELFIX DEKORATİF SIVA İNCE (25 KG)
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 7, 'CHELFIX DEKORATİF SIVA İNCE', 'Chelfix Deko İnce', 'PKT', 25,
  266.00, true, true, 40, 8,
  true, true
);

-- 15. TEKNOTHERM LATEX 400 KAPLAMA ASTARI (15 KG) - YENİ EKLENEN!
-- Tekliften tespit edildi, fiyat listesinde yok
-- Tahmini fiyat: 15 kg için ~200 TL (belirlenmeli)
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 6, 'TEKNOTHERM LATEX 400 KAPLAMA ASTARI', 'Latex Astar', 'KOVA', 15,
  200.00, true, true, 40, 8,
  true, true
);

-- NOTLAR:
-- 1. Tüm ürünler hem EPS hem Taşyünü için kullanılabilir
-- 2. Dübel paketleri 600 adet olarak güncellendi (500 değil)
-- 3. Latex Astar eklendi (fiyat belirlenmeli)
-- 4. Unit değerleri PKT, RULO, KOVA olarak düzeltildi
