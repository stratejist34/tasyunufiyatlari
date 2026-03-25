-- =================================================================
-- Migration v11d: DB kaynağından deterministik slug + kural atama
-- Tarih: 2026-03-20
-- Yöntem: DB name/short_name/brand/type → slug üretimi (WP eşleştirme yok)
-- =================================================================

-- Sadece slug IS NULL olan satırlar güncellenir (idempotent)

-- ─── PLATES (15 kayıt) ────────────────────────────────────────
-- id=27: Dalmaçyalı SW035
UPDATE plates SET slug = 'dalmacyali-sw035-tasyunu', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 27 AND slug IS NULL;

-- id=28: Dalmaçyalı CS60
UPDATE plates SET slug = 'dalmacyali-cs60-tasyunu', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 28 AND slug IS NULL;

-- id=30: Expert Premium
UPDATE plates SET slug = 'expert-premium-tasyunu', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 30 AND slug IS NULL;

-- id=31: Expert HD150
UPDATE plates SET slug = 'expert-hd150-tasyunu', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 31 AND slug IS NULL;

-- id=32: Expert LD125
UPDATE plates SET slug = 'expert-ld125-tasyunu', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 32 AND slug IS NULL;

-- id=33: Expert VF80
UPDATE plates SET slug = 'expert-vf80-tasyunu', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 33 AND slug IS NULL;

-- id=34: Expert RF150
UPDATE plates SET slug = 'expert-rf150-tasyunu', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 34 AND slug IS NULL;

-- id=35: Expert PW50
UPDATE plates SET slug = 'expert-pw50-tasyunu', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 35 AND slug IS NULL;

-- id=36: Optimix TR7.5
UPDATE plates SET slug = 'optimix-tr7-5-tasyunu', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 36 AND slug IS NULL;

-- id=37: Dalmaçyalı İdeal Carbon
UPDATE plates SET slug = 'dalmacyali-ideal-carbon-eps', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 37 AND slug IS NULL;

-- id=38: Dalmaçyalı Double Carbon
UPDATE plates SET slug = 'dalmacyali-double-carbon-eps', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 38 AND slug IS NULL;

-- id=39: Expert EPS Karbonlu
UPDATE plates SET slug = 'expert-eps-karbonlu-eps', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 39 AND slug IS NULL;

-- id=40: Expert EPS Beyaz
UPDATE plates SET slug = 'expert-eps-beyaz-eps', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 40 AND slug IS NULL;

-- id=41: Expert EPS 035 Beyaz
UPDATE plates SET slug = 'expert-eps-035-beyaz-eps', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 41 AND slug IS NULL;

-- id=42: Optimix Optimix Karbonlu
UPDATE plates SET slug = 'optimix-optimix-karbonlu-eps', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required' WHERE id = 42 AND slug IS NULL;


-- ─── ACCESSORIES (69 kayıt) ──────────────────────────────────
-- id=1: Dalmaçyalı Isı Yalıtım Yapıştırıcısı 25kg
UPDATE accessories SET slug = 'dalmacyali-yapistirici', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 1 AND slug IS NULL;

-- id=2: Dalmaçyalı Stonewool Taşyünü Sistem Yapıştırıcısı 25kg
UPDATE accessories SET slug = 'dalmacyali-tasyunu-yapistirici', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 2 AND slug IS NULL;

-- id=3: Dalmaçyalı Isı Yalıtım Sıvası 25kg
UPDATE accessories SET slug = 'dalmacyali-siva', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 3 AND slug IS NULL;

-- id=4: Dalmaçyalı Stonewool Taşyünü Sistem Sıvası 25kg
UPDATE accessories SET slug = 'dalmacyali-tasyunu-siva', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 4 AND slug IS NULL;

-- id=5: Dalmaçyalı Plastik Dübel 9,5cm 600 adet
UPDATE accessories SET slug = 'dalmacyali-plastik-dubel-95mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 5 AND slug IS NULL;

-- id=6: Dalmaçyalı Plastik Dübel 11,5cm 600 adet
UPDATE accessories SET slug = 'dalmacyali-plastik-dubel-115mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 6 AND slug IS NULL;

-- id=7: Dalmaçyalı Plastik Dübel 13,5cm 600 adet
UPDATE accessories SET slug = 'dalmacyali-plastik-dubel-135mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 7 AND slug IS NULL;

-- id=8: Dalmaçyalı Plastik Dübel 15,5cm 600 adet
UPDATE accessories SET slug = 'dalmacyali-plastik-dubel-155mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 8 AND slug IS NULL;

-- id=9: Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet
UPDATE accessories SET slug = 'dalmacyali-celik-dubel-115mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 9 AND slug IS NULL;

-- id=10: Dalmaçyalı Taşyünü Dübeli Çelik Çivili 13,5cm 200 adet
UPDATE accessories SET slug = 'dalmacyali-celik-dubel-135mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 10 AND slug IS NULL;

-- id=11: Dalmaçyalı Taşyünü Dübeli Çelik Çivili 15,5cm 200 adet
UPDATE accessories SET slug = 'dalmacyali-celik-dubel-155mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 11 AND slug IS NULL;

-- id=12: Dalmaçyalı Donatı Filesi S160 55m²
UPDATE accessories SET slug = 'dalmacyali-file-s160', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 12 AND slug IS NULL;

-- id=13: Dalmaçyalı Fileli Köşe (PVC) 2,5m 50 adet 125m
UPDATE accessories SET slug = 'dalmacyali-fileli-kose', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 13 AND slug IS NULL;

-- id=14: Dalmaçyalı Kaplama Astarı 25kg
UPDATE accessories SET slug = 'dalmacyali-astar', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 14 AND slug IS NULL;

-- id=15: Dalmaçyalı Mineral Kaplama İnce Tane 25kg
UPDATE accessories SET slug = 'dalmacyali-mineral-kaplama', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 15 AND slug IS NULL;

-- id=16: Expert Yapıştırma Harcı 25kg
UPDATE accessories SET slug = 'expert-yapistirici', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 16 AND slug IS NULL;

-- id=17: Expert Sıva Harcı 25kg
UPDATE accessories SET slug = 'expert-siva', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 17 AND slug IS NULL;

-- id=18: Expert Plastik Dübel 9,5cm 600 adet
UPDATE accessories SET slug = 'expert-plastik-dubel-95mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 18 AND slug IS NULL;

-- id=19: Expert Plastik Dübel 11,5cm 600 adet
UPDATE accessories SET slug = 'expert-plastik-dubel-115mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 19 AND slug IS NULL;

-- id=20: Expert Plastik Dübel 13,5cm 600 adet
UPDATE accessories SET slug = 'expert-plastik-dubel-135mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 20 AND slug IS NULL;

-- id=21: Expert Plastik Dübel 15,5cm 600 adet
UPDATE accessories SET slug = 'expert-plastik-dubel-155mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 21 AND slug IS NULL;

-- id=22: Expert Çelik Çivili Taşyünü Dübeli 11,5cm 200 adet
UPDATE accessories SET slug = 'expert-celik-dubel-115mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 22 AND slug IS NULL;

-- id=23: Expert Çelik Çivili Taşyünü Dübeli 13,5cm 200 adet
UPDATE accessories SET slug = 'expert-celik-dubel-135mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 23 AND slug IS NULL;

-- id=24: Expert Çelik Çivili Taşyünü Dübeli 15,5cm 200 adet
UPDATE accessories SET slug = 'expert-celik-dubel-155mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 24 AND slug IS NULL;

-- id=25: Expert Donatı Filesi F160 55m²
UPDATE accessories SET slug = 'expert-file-f160', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 25 AND slug IS NULL;

-- id=26: Expert Fileli Köşe Profili (PVC) 2,5m 50 adet 125m
UPDATE accessories SET slug = 'expert-fileli-kose', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 26 AND slug IS NULL;

-- id=27: Expert Kaplama Astarı 25kg
UPDATE accessories SET slug = 'expert-astar', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 27 AND slug IS NULL;

-- id=28: Expert Dekoratif Mineral Kaplama İnce Tane 25kg
UPDATE accessories SET slug = 'expert-mineral-kaplama', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 28 AND slug IS NULL;

-- id=29: Fawori Optimix Isı Yalıtım Yapıştırma Harcı 25kg
UPDATE accessories SET slug = 'optimix-yapistirici', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 29 AND slug IS NULL;

-- id=30: Fawori Optimix Isı Yalıtım Sıva Harcı 25kg
UPDATE accessories SET slug = 'optimix-siva', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 30 AND slug IS NULL;

-- id=31: Fawori Optimix Plastik Dübel 9,5cm 600 adet
UPDATE accessories SET slug = 'optimix-plastik-dubel-95mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 31 AND slug IS NULL;

-- id=32: Fawori Optimix Plastik Dübel 11,5cm 600 adet
UPDATE accessories SET slug = 'optimix-plastik-dubel-115mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 32 AND slug IS NULL;

-- id=33: Fawori Optimix Plastik Dübel 13,5cm 600 adet
UPDATE accessories SET slug = 'optimix-plastik-dubel-135mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 33 AND slug IS NULL;

-- id=34: Fawori Optimix Plastik Dübel 15,5cm 600 adet
UPDATE accessories SET slug = 'optimix-plastik-dubel-155mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 34 AND slug IS NULL;

-- id=35: Fawori Optimix Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet
UPDATE accessories SET slug = 'optimix-celik-dubel-115mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 35 AND slug IS NULL;

-- id=36: Fawori Optimix Taşyünü Dübeli Çelik Çivili 13,5cm 200 adet
UPDATE accessories SET slug = 'optimix-celik-dubel-135mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 36 AND slug IS NULL;

-- id=37: Fawori Optimix Taşyünü Dübeli Çelik Çivili 15,5cm 200 adet
UPDATE accessories SET slug = 'optimix-celik-dubel-155mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 37 AND slug IS NULL;

-- id=38: Fawori Optimix Donatı Filesi F160 50m²
UPDATE accessories SET slug = 'optimix-file-f160', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 38 AND slug IS NULL;

-- id=39: Fawori Optimix Fileli Köşe (PVC) 2,5m 50 adet 125m
UPDATE accessories SET slug = 'optimix-fileli-kose', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 39 AND slug IS NULL;

-- id=40: Fawori Optimix Kaplama Astarı 25kg
UPDATE accessories SET slug = 'optimix-astar', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 40 AND slug IS NULL;

-- id=41: Fawori Optimix Mineral Kaplama İnce Tane 25kg
UPDATE accessories SET slug = 'optimix-mineral-kaplama', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 41 AND slug IS NULL;

-- id=42: Ekonomik Isı Yalıtım Yapıştırıcısı 25kg
UPDATE accessories SET slug = 'oem-yapistirici', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 42 AND slug IS NULL;

-- id=43: Ekonomik Isı Yalıtım Sıvası 25kg
UPDATE accessories SET slug = 'oem-siva', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 43 AND slug IS NULL;

-- id=44: 2.Kalite Plastik Dübel 9,5cm 500 adet
UPDATE accessories SET slug = 'oem-plastik-dubel-95mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 44 AND slug IS NULL;

-- id=45: 2.Kalite Plastik Dübel 11,5cm 500 adet
UPDATE accessories SET slug = 'oem-plastik-dubel-115mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 45 AND slug IS NULL;

-- id=46: 2.Kalite Plastik Dübel 13,5cm 500 adet
UPDATE accessories SET slug = 'oem-plastik-dubel-135mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 46 AND slug IS NULL;

-- id=47: 2.Kalite Plastik Dübel 15,5cm 500 adet
UPDATE accessories SET slug = 'oem-plastik-dubel-155mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 47 AND slug IS NULL;

-- id=48: 2.Kalite Çelik Dübel 11,5cm 200 adet
UPDATE accessories SET slug = 'oem-celik-dubel-115mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 48 AND slug IS NULL;

-- id=49: 2.Kalite Çelik Dübel 13,5cm 200 adet
UPDATE accessories SET slug = 'oem-celik-dubel-135mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 49 AND slug IS NULL;

-- id=50: 2.Kalite Çelik Dübel 15,5cm 200 adet
UPDATE accessories SET slug = 'oem-celik-dubel-155mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 50 AND slug IS NULL;

-- id=51: 2.Kalite Donatı Filesi 50m²
UPDATE accessories SET slug = 'oem-file', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 51 AND slug IS NULL;

-- id=52: Ekonomik Fileli Köşe (PVC) 2,5m 50 adet 125m
UPDATE accessories SET slug = 'oem-fileli-kose', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 52 AND slug IS NULL;

-- id=53: Ekonomik Kaplama Astarı 25kg
UPDATE accessories SET slug = 'oem-astar', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 53 AND slug IS NULL;

-- id=54: Ekonomik Mineral Kaplama 25kg
UPDATE accessories SET slug = 'oem-mineral-kaplama', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 54 AND slug IS NULL;

-- id=77: TEKNOİZOFİX
UPDATE accessories SET slug = 'tekno-yapistirici', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 77 AND slug IS NULL;

-- id=78: TEKNOİZOSIVA
UPDATE accessories SET slug = 'tekno-siva', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 78 AND slug IS NULL;

-- id=79: TEKNODEKO İNCE (1,2 MM)
UPDATE accessories SET slug = 'tekno-deko-ince', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 79 AND slug IS NULL;

-- id=80: TEKNODEKO KALIN (2 MM)
UPDATE accessories SET slug = 'tekno-deko-kalin', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 80 AND slug IS NULL;

-- id=81: TEKNODEKO ÇİZGİLİ
UPDATE accessories SET slug = 'tekno-deko-cizgili', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 81 AND slug IS NULL;

-- id=82: TEKNOİZOSIVA MAKİNE SIVASI
UPDATE accessories SET slug = 'tekno-makine-siva', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 82 AND slug IS NULL;

-- id=83: FİLE 4X4 - 160 GR
UPDATE accessories SET slug = 'tekno-file', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 83 AND slug IS NULL;

-- id=84: FİLELİ PVC KÖŞE PROFİLİ
UPDATE accessories SET slug = 'tekno-fileli-kose', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 84 AND slug IS NULL;

-- id=85: Çelik Çivili Dübel 115 mm (11,5 cm)
UPDATE accessories SET slug = 'tekno-celik-dubel-115mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 85 AND slug IS NULL;

-- id=86: Çelik Çivili Dübel 155 mm (15,5 cm)
UPDATE accessories SET slug = 'tekno-celik-dubel-155mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 86 AND slug IS NULL;

-- id=87: Plastik Çivili Dübel 10 cm
UPDATE accessories SET slug = 'tekno-plastik-dubel-10mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 87 AND slug IS NULL;

-- id=88: Plastik Çivili Dübel 12 cm
UPDATE accessories SET slug = 'tekno-plastik-dubel-12mm', sales_mode = 'system_only', pricing_visibility_mode = 'hidden' WHERE id = 88 AND slug IS NULL;

-- id=89: CHELFIX DEKORATİF SIVA
UPDATE accessories SET slug = 'tekno-chelfix-deko', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 89 AND slug IS NULL;

-- id=90: CHELFIX DEKORATİF SIVA İNCE
UPDATE accessories SET slug = 'tekno-chelfix-deko-ince', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 90 AND slug IS NULL;

-- id=91: TEKNOLATEX 400
UPDATE accessories SET slug = 'tekno-latex-astar', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required' WHERE id = 91 AND slug IS NULL;

-- Toplam: 15 plate + 69 accessory güncellendi