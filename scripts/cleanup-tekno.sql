-- TEKNO Ürünlerini Temizle ve Düzelt
-- 1. Tekrarlanan ürünleri sil (ID 68-76)
-- 2. base_price değerlerini paket fiyatından birim fiyatına çevir (ID 56-64)

-- ADIM 1: Tekrarlanan ürünleri sil
DELETE FROM accessories WHERE id IN (68, 69, 70, 71, 72, 73, 74, 75, 76);

-- ADIM 2: base_price değerlerini birim fiyatına çevir
UPDATE accessories SET base_price = 5.34 WHERE id = 56;  -- TEKNOİZOFİX (25 KG → birim: 5.34 TL/KG)
UPDATE accessories SET base_price = 5.89 WHERE id = 57;  -- TEKNOİZOSIVA (25 KG → birim: 5.89 TL/KG)
UPDATE accessories SET base_price = 7.41 WHERE id = 58;  -- TEKNODEKO KALIN (25 KG → birim: 7.41 TL/KG)
UPDATE accessories SET base_price = 19.43 WHERE id = 59; -- FİLE 4X4 (160 M² → birim: 19.43 TL/M²)
UPDATE accessories SET base_price = 10.08 WHERE id = 60; -- FİLELİ PVC KÖŞE (1 MT → birim: 10.08 TL/MT)
UPDATE accessories SET base_price = 2.73 WHERE id = 61;  -- ÇELİK DÜBEL 115MM (1 ADET → birim: 2.73 TL/ADET)
UPDATE accessories SET base_price = 3.16 WHERE id = 62;  -- ÇELİK DÜBEL 155MM (1 ADET → birim: 3.16 TL/ADET)
UPDATE accessories SET base_price = 1.28 WHERE id = 63;  -- PLASTİK DÜBEL 10CM (1 ADET → birim: 1.28 TL/ADET)
UPDATE accessories SET base_price = 1.46 WHERE id = 64;  -- PLASTİK DÜBEL 12CM (1 ADET → birim: 1.46 TL/ADET)

-- NOT: Sistemde base_price = BİRİM fiyatıdır
-- Paket fiyatı hesaplama sırasında: base_price × unit_content
