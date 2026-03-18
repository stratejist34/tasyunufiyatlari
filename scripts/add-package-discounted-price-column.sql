-- plate_prices tablosuna package_discounted_price kolonu ekle
-- Bu scripti Supabase SQL Editor'da çalıştırın

ALTER TABLE plate_prices
ADD COLUMN IF NOT EXISTS package_discounted_price DECIMAL(10,2);

COMMENT ON COLUMN plate_prices.package_discounted_price IS 'CSV column 8: Zaten iskontolu paket fiyatı (KDV Hariç)';
