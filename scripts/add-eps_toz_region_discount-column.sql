-- shipping_zones tablosuna "Taşyünü HARİÇ (EPS + Toz grubu) Bölge İSK1" kolonu ekle
-- Bu scripti Supabase SQL Editor'da çalıştırın

ALTER TABLE shipping_zones
ADD COLUMN IF NOT EXISTS eps_toz_region_discount DECIMAL(5,2) DEFAULT 0;

COMMENT ON COLUMN shipping_zones.eps_toz_region_discount IS 'Taşyünü hariç (EPS + toz grubu) bölge iskontosu: Bölge1=9, Bölge2=7, Bölge3=5';


