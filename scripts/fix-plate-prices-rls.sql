-- plate_prices tablosuna RLS izinlerini düzelt
-- Bu scripti Supabase SQL Editor'da çalıştırın

-- RLS'yi devre dışı bırak (development için)
ALTER TABLE plate_prices DISABLE ROW LEVEL SECURITY;

-- NOT: Production'da RLS'yi enable edip policy ekleyin:
-- ALTER TABLE plate_prices ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Enable read access for all users" ON plate_prices
-- FOR SELECT USING (true);
--
-- CREATE POLICY "Enable insert for authenticated users" ON plate_prices
-- FOR INSERT WITH CHECK (auth.role() = 'authenticated');
