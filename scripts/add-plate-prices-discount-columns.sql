-- plate_prices tablosuna iskonto ve CSV doğrulama kolonlarını ekle
-- Bu scripti Supabase SQL Editor'da çalıştırın

ALTER TABLE plate_prices
ADD COLUMN IF NOT EXISTS discount_1 DECIMAL(5,2);

ALTER TABLE plate_prices
ADD COLUMN IF NOT EXISTS discount_2 DECIMAL(5,2);

ALTER TABLE plate_prices
ADD COLUMN IF NOT EXISTS m2_discounted_price DECIMAL(10,2);

ALTER TABLE plate_prices
ADD COLUMN IF NOT EXISTS package_discounted_price DECIMAL(10,2);

COMMENT ON COLUMN plate_prices.discount_1 IS 'CSV Column 3: İSK1 (kalınlık satırından)';
COMMENT ON COLUMN plate_prices.discount_2 IS 'CSV Column 4: İSK2 (kalınlık satırından)';
COMMENT ON COLUMN plate_prices.m2_discounted_price IS 'CSV Column 10: KDV hariç iskontolu m² fiyatı';
COMMENT ON COLUMN plate_prices.package_discounted_price IS 'CSV Column 9: KDV hariç iskontolu paket fiyatı';


