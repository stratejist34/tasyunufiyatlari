-- ═══════════════════════════════════════════════════════════════
-- LOJİSTİK KAPASİTE TABLOSU
-- ═══════════════════════════════════════════════════════════════
-- Kaynak: tasyunu_maliyet.csv
-- Tarih: 12 Aralık 2025
-- Amaç: Kalınlık bazlı tır/kamyon kapasiteleri ve paket bilgileri
-- ═══════════════════════════════════════════════════════════════

-- 1. Tabloyu oluştur
CREATE TABLE IF NOT EXISTS logistics_capacity (
  thickness INTEGER PRIMARY KEY,
  items_per_package INTEGER NOT NULL,
  package_size_m2 NUMERIC(10,2) NOT NULL,
  lorry_capacity_m2 NUMERIC(10,2) NOT NULL,
  truck_capacity_m2 NUMERIC(10,2) NOT NULL,
  lorry_capacity_packages INTEGER NOT NULL,
  truck_capacity_packages INTEGER NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tablo açıklaması ekle
COMMENT ON TABLE logistics_capacity IS 'Kalınlık bazlı lojistik kapasite bilgileri - Tır/Kamyon yükleme miktarları';
COMMENT ON COLUMN logistics_capacity.thickness IS 'Levha kalınlığı (mm cinsinden)';
COMMENT ON COLUMN logistics_capacity.items_per_package IS 'Bir pakette kaç adet levha var';
COMMENT ON COLUMN logistics_capacity.package_size_m2 IS 'Bir paketin toplam m² değeri';
COMMENT ON COLUMN logistics_capacity.lorry_capacity_m2 IS 'Kamyon kapasitesi (m² cinsinden)';
COMMENT ON COLUMN logistics_capacity.truck_capacity_m2 IS 'Tır kapasitesi (m² cinsinden)';
COMMENT ON COLUMN logistics_capacity.lorry_capacity_packages IS 'Kamyona kaç paket sığar';
COMMENT ON COLUMN logistics_capacity.truck_capacity_packages IS 'Tıra kaç paket sığar';
COMMENT ON COLUMN logistics_capacity.is_popular IS '10cm gibi popüler kalınlıklar için true';

-- 3. Verileri ekle (3cm - 10cm arası tüm kalınlıklar)
INSERT INTO logistics_capacity
  (thickness, items_per_package, package_size_m2, lorry_capacity_m2, truck_capacity_m2,
   lorry_capacity_packages, truck_capacity_packages, is_popular, notes)
VALUES
  -- 3 cm
  (30, 10, 6.0, 1344.00, 2496.00, 224, 416, false,
   'Levha boyutu: 600×1000mm, Paket içi: 10 adet'),

  -- 4 cm
  (40, 6, 3.6, 1008.00, 1872.00, 280, 520, false,
   'Levha boyutu: 600×1000mm, Paket içi: 6 adet'),

  -- 5 cm (Popüler)
  (50, 6, 3.6, 806.40, 1497.60, 224, 416, true,
   'Levha boyutu: 600×1000mm, Paket içi: 6 adet - Popüler kalınlık'),

  -- 6 cm
  (60, 5, 3.0, 672.00, 1248.00, 224, 416, false,
   'Levha boyutu: 600×1000mm, Paket içi: 5 adet'),

  -- 7 cm
  (70, 4, 2.4, 537.60, 998.40, 224, 416, false,
   'Levha boyutu: 600×1000mm, Paket içi: 4 adet'),

  -- 8 cm (Popüler)
  (80, 3, 1.8, 504.00, 936.00, 280, 520, true,
   'Levha boyutu: 600×1000mm, Paket içi: 3 adet - Popüler kalınlık'),

  -- 9 cm
  (90, 3, 1.8, 453.60, 842.40, 252, 468, false,
   'Levha boyutu: 600×1000mm, Paket içi: 3 adet'),

  -- 10 cm (EN POPÜLER!)
  (100, 3, 1.8, 403.20, 748.80, 224, 416, true,
   'Levha boyutu: 600×1000mm, Paket içi: 3 adet - EN POPÜLER kalınlık (Analytics: 15 ay)');

-- 4. Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_logistics_popular ON logistics_capacity(is_popular)
  WHERE is_popular = true;

-- 5. Trigger: updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_logistics_capacity_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_logistics_capacity_updated_at
  BEFORE UPDATE ON logistics_capacity
  FOR EACH ROW
  EXECUTE FUNCTION update_logistics_capacity_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- DOĞRULAMA SORGUSU
-- ═══════════════════════════════════════════════════════════════

-- Tüm verileri göster
SELECT
  thickness || ' mm' AS "Kalınlık",
  items_per_package AS "Paket İçi Adet",
  package_size_m2 || ' m²' AS "1 Paket",
  lorry_capacity_m2 || ' m²' AS "Kamyon",
  truck_capacity_m2 || ' m²' AS "Tır",
  lorry_capacity_packages || ' paket' AS "Kamyon Paket",
  truck_capacity_packages || ' paket' AS "Tır Paket",
  CASE WHEN is_popular THEN '⭐ Popüler' ELSE '' END AS "Durum"
FROM logistics_capacity
ORDER BY thickness;

-- Popüler kalınlıkları göster
SELECT
  thickness || ' mm' AS "Popüler Kalınlıklar",
  package_size_m2 || ' m²' AS "1 Paket",
  lorry_capacity_m2 || ' m²' AS "Kamyon Kapasitesi",
  truck_capacity_m2 || ' m²' AS "Tır Kapasitesi"
FROM logistics_capacity
WHERE is_popular = true
ORDER BY thickness;

-- ═══════════════════════════════════════════════════════════════
-- ÖRNEK KULLANIM SORGUSU
-- ═══════════════════════════════════════════════════════════════

-- Müşteri 500 m² 10cm levha istediğinde kaç paket gerekir?
SELECT
  thickness,
  package_size_m2,
  CEIL(500 / package_size_m2) AS "Gereken Paket",
  CEIL(500 / package_size_m2) * package_size_m2 AS "Toplam m²",
  CASE
    WHEN CEIL(500 / package_size_m2) <= lorry_capacity_packages THEN 'Kamyon yeterli'
    WHEN CEIL(500 / package_size_m2) <= truck_capacity_packages THEN 'Tır gerekli'
    ELSE 'Birden fazla araç gerekli'
  END AS "Araç Durumu"
FROM logistics_capacity
WHERE thickness = 100;

-- ═══════════════════════════════════════════════════════════════
-- NOTLAR
-- ═══════════════════════════════════════════════════════════════
--
-- Bu tablo şu bilgileri saklar:
-- 1. Kalınlık bazlı paket içi adet sayısı
-- 2. Bir paketin toplam m² değeri
-- 3. Kamyon ve Tır kapasiteleri (hem m² hem paket sayısı)
-- 4. Popüler kalınlıklar işaretlenir (5cm, 8cm, 10cm)
--
-- Frontend'de kullanım:
-- - Müşteri metraj girdiğinde kaç paket gerektiğini hesapla
-- - Lojistik bar için kamyon/tır doluluk oranını hesapla
-- - Minimum sipariş kontrolü yap
--
-- İlişkili tablolar:
-- - plates: Levha bilgileri
-- - plate_prices: Kalınlık bazlı fiyatlar
--
-- ═══════════════════════════════════════════════════════════════
