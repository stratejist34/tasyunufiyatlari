-- TEKNO Ürünleri - DOĞRU Fiyatlarla Yeniden Ekleme
-- Önce mevcut yanlış kayıtları sil, sonra doğru fiyatlarla ekle

-- ADIM 1: Mevcut TEKNO ürünlerini sil
DELETE FROM accessories WHERE brand_id = 6;

-- ADIM 2: TEKNO ürünlerini DOĞRU fiyatlarla ekle
-- NOT: base_price = AMBALAJ FİYATI (paket fiyatı), unit_content = paket içeriği

-- 1. TEKNOİZOFİX - Yapıştırıcı (25 KG)
-- Liste: 220 TL/paket → İskontolu Satış: 133.58 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 1, 'TEKNOİZOFİX', 'Yapıştırıcı', 'KG', 25,
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
  6, 2, 'TEKNOİZOSIVA', 'Sıva', 'KG', 25,
  242.50, true, true, 40, 8,
  true, true
);

-- 3. TEKNODEKO İNCE (1,2 MM) - Dekoratif Sıva (25 KG)
-- Liste: 305 TL/paket → İskontolu Satış: 185.20 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 7, 'TEKNODEKO İNCE (1,2 MM)', 'Deko İnce', 'KG', 25,
  305.00, true, true, 40, 8,
  true, true, 1.2
);

-- 4. TEKNODEKO KALIN (2 MM) - Dekoratif Sıva (25 KG)
-- Liste: 305 TL/paket → İskontolu Satış: 185.20 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 7, 'TEKNODEKO KALIN (2 MM)', 'Deko Kalın', 'KG', 25,
  305.00, true, true, 40, 8,
  true, true, 2
);

-- 5. TEKNODEKO ÇİZGİLİ - Dekoratif Sıva (25 KG)
-- Liste: 350 TL/paket → İskontolu Satış: 212.52 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 7, 'TEKNODEKO ÇİZGİLİ', 'Deko Çizgili', 'KG', 25,
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
  6, 2, 'TEKNOİZOSIVA MAKİNE SIVASI', 'Makine Sıva', 'KG', 25,
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
  6, 4, 'FİLE 4X4 - 160 GR', 'File', 'M²', 50,
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
  6, 5, 'FİLELİ PVC KÖŞE PROFİLİ', 'Fileli Köşe', 'MT', 125,
  2075.00, true, true, 40, 8,
  true, true
);

-- 9. ÇELİK ÇİVİLİ DÜBEL 115 MM (500 ADET)
-- Liste: 2250 TL/paket → İskontolu Satış: 1366.20 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 3, 'ÇELİK ÇİVİLİ DÜBEL 115 MM', 'Çelik Dübel 11.5cm', 'ADET', 500,
  2250.00, true, true, 40, 8,
  true, true, 115
);

-- 10. ÇELİK ÇİVİLİ DÜBEL 155 MM (500 ADET)
-- Liste: 2600 TL/paket → İskontolu Satış: 1578.72 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 3, 'ÇELİK ÇİVİLİ DÜBEL 155 MM', 'Çelik Dübel 15.5cm', 'ADET', 500,
  2600.00, true, true, 40, 8,
  true, true, 155
);

-- 11. PLASTİK ÇİVİLİ DÜBEL 10 CM (500 ADET)
-- Liste: 1050 TL/paket → İskontolu Satış: 637.56 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 3, 'PLASTİK ÇİVİLİ DÜBEL 10 CM', 'Plastik Dübel 10cm', 'ADET', 500,
  1050.00, true, true, 40, 8,
  true, true, 100
);

-- 12. PLASTİK ÇİVİLİ DÜBEL 12 CM (500 ADET)
-- Liste: 1200 TL/paket → İskontolu Satış: 728.64 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 3, 'PLASTİK ÇİVİLİ DÜBEL 12 CM', 'Plastik Dübel 12cm', 'ADET', 500,
  1200.00, true, true, 40, 8,
  true, true, 120
);

-- 13. CHELFIX DEKORATİF SIVA (25 KG)
-- Liste: 266 TL/paket → İskontolu Satış: 161.52 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 7, 'CHELFIX DEKORATİF SIVA', 'Chelfix Deko', 'KG', 25,
  266.00, true, true, 40, 8,
  true, true
);

-- 14. CHELFIX DEKORATİF SIVA İNCE (25 KG)
-- Liste: 266 TL/paket → İskontolu Satış: 161.52 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 7, 'CHELFIX DEKORATİF SIVA İNCE', 'Chelfix Deko İnce', 'KG', 25,
  266.00, true, true, 40, 8,
  true, true
);

-- NOT: is_for_eps ve is_for_tasyunu değerleri şu an hepsi TRUE
-- Teklif dosyalarından kontrol edilip güncellenmeli
