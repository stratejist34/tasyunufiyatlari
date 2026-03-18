-- TEKNO Ürünleri - DOĞRU VE EKSİKSİZ Liste (FİNAL)
-- Düzeltmeler:
-- 1. Dübel paket boyutu 500 adet (600 DEĞİL!)
-- 2. Çelik dübelller SADECE TAŞYÜNÜ için
-- 3. Plastik dübelller SADECE EPS için
-- 4. Diğer ürünler hem EPS hem Taşyünü için

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

-- 9. ÇELİK ÇİVİLİ DÜBEL 115 MM (500 ADET) - SADECE TAŞYÜNÜ 3-6 CM
-- Liste: 2250 TL/paket → İskontolu Satış: 1366.20 TL/paket
-- Kullanım: 3-4-5-6 cm kalınlık TAŞYÜNÜ için
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 3, 'Çelik Çivili Dübel 115 mm (11,5 cm)', 'Çelik Dübel 11.5cm', 'PKT', 500,
  2250.00, false, true, 40, 8,
  true, true, 115
);

-- 10. ÇELİK ÇİVİLİ DÜBEL 155 MM (500 ADET) - SADECE TAŞYÜNÜ 7-10 CM
-- Liste: 2600 TL/paket → İskontolu Satış: 1578.72 TL/paket
-- Kullanım: 7-8-9-10 cm kalınlık TAŞYÜNÜ için
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 3, 'Çelik Çivili Dübel 155 mm (15,5 cm)', 'Çelik Dübel 15.5cm', 'PKT', 500,
  2600.00, false, true, 40, 8,
  true, true, 155
);

-- 11. PLASTİK ÇİVİLİ DÜBEL 10 CM (500 ADET) - SADECE EPS 3-6 CM
-- Liste: 1050 TL/paket → İskontolu Satış: 637.56 TL/paket
-- Kullanım: 3-4-5-6 cm kalınlık EPS için
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 3, 'Plastik Çivili Dübel 10 cm', 'Plastik Dübel 10cm', 'PKT', 500,
  1050.00, true, false, 40, 8,
  true, true, 100
);

-- 12. PLASTİK ÇİVİLİ DÜBEL 12 CM (500 ADET) - SADECE EPS 7-10 CM
-- Liste: 1200 TL/paket → İskontolu Satış: 728.64 TL/paket
-- Kullanım: 7-8-9-10 cm kalınlık EPS için
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active, dowel_length
) VALUES (
  6, 3, 'Plastik Çivili Dübel 12 cm', 'Plastik Dübel 12cm', 'PKT', 500,
  1200.00, true, false, 40, 8,
  true, true, 120
);

-- 13. CHELFIX DEKORATİF SIVA (25 KG)
-- Liste: 266 TL/paket → İskontolu Satış: 161.52 TL/paket
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
-- Liste: 266 TL/paket → İskontolu Satış: 161.52 TL/paket
INSERT INTO accessories (
  brand_id, accessory_type_id, name, short_name, unit, unit_content,
  base_price, is_for_eps, is_for_tasyunu, discount_1, discount_2,
  is_kdv_included, is_active
) VALUES (
  6, 7, 'CHELFIX DEKORATİF SIVA İNCE', 'Chelfix Deko İnce', 'PKT', 25,
  266.00, true, true, 40, 8,
  true, true
);

-- NOTLAR:
-- ✅ Dübel paketleri 500 adet (DOĞRU!)
-- ✅ Çelik Dübelller: SADECE TAŞYÜNÜ (is_for_eps = false, is_for_tasyunu = true)
-- ✅ Plastik Dübelller: SADECE EPS (is_for_eps = true, is_for_tasyunu = false)
-- ✅ Diğer tüm ürünler: HEM EPS HEM TAŞYÜNÜ (is_for_eps = true, is_for_tasyunu = true)
-- ✅ Hesaplama: (m² × 6 adet/m²) ÷ 500 adet/paket = paket sayısı
-- ⚠️ Latex Astar henüz eklenmedi (fiyat bilgisi gerekli)
