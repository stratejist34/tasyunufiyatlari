-- ============================================================
-- Migration v11c: WP → DB eşleştirilmiş slug + meta güncelleme
-- Tarih: 2026-03-20
-- Yöntem: ID bazlı kesin güncelleme (isim eşleştirmesi script'te yapıldı)
-- ============================================================

-- plates: 38 eşleşme
-- accessories: 100 eşleşme
-- eşleşmeyen: 19

-- ─── PLATES ─────────────────────────────────────────────────
-- Expert EPS Beyaz ← "Fawori EPS Beyaz Isı Yalıtım Levhası" (skor: 80)
UPDATE plates SET slug = 'fawori-eps-beyaz-isi-yalitim-levhasi', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Fawori EPS Isı Yalıtım Levhası, TS EN 13163 nolu Isı Yalıtım Malzemeleri Standardı''na uygun olarak üretilen polistren esaslı bir ısı yalıtım levhasıdır.'
WHERE id = 40 AND slug IS NULL;

-- Expert EPS Karbonlu ← "Expert EPS Karbonlu Isı Yalıtım Levhası" (skor: 90)
UPDATE plates SET slug = 'expert-eps-karbonlu-isi-yalitim-levhasi', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Karbonlu EPS Isı Yalıtım Levhası, TS EN13163 no lu Isı Yalıtım Malzemeleri ve TS EN 13499 EPS Isı Yalıtım Sistem Standartlarına uygun olarak üretilen karbonlu polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 39 AND slug IS NULL;

-- Expert EPS Beyaz ← "Expert EPS (Beyaz) Isı Yalıtım Levhası" (skor: 90)
UPDATE plates SET slug = 'expert-eps-beyaz-isi-yalitim-levhasi', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'TS EN 13163 nolu Isı Yalıtım Malzemeleri Standardı''na uygun olarak üretilen polistiren esaslı ısı yalıtım levhasıdır. &nbsp;'
WHERE id = 40 AND slug IS NULL;

-- Expert EPS Beyaz ← "Expert 035 EPS (Beyaz) Isı Yalıtım Levhası 2cm 20-22kg/m3" (skor: 80)
UPDATE plates SET slug = 'expert-035-eps-beyaz-isi-yalitim-levhasi-2cm-20-22kg-m3', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Beyaz EPS Isı Yalıtım Levhası, 20-22 kg/m3 yoğunluğa sahip, polistiren esaslı, TS EN 13163 nolu Isı Yalıtım Malzemeleri Standardı''na uygun olarak üretilen bir ısı yalıtım levhasıdır. ÖZELLİKLER • Su emmeye karşı yüksek dirence sahiptir. • Darbe ve yüklere karşı dayanımı yüksektir.'
WHERE id = 40 AND slug IS NULL;

-- Expert EPS Beyaz ← "Expert 035 EPS (Beyaz) Isı Yalıtım Levhası 3cm 20-22kg/m3" (skor: 80)
UPDATE plates SET slug = 'expert-035-eps-beyaz-isi-yalitim-levhasi-3cm-20-22kg-m3', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Beyaz EPS Isı Yalıtım Levhası, 20-22 kg/m3 yoğunluğa sahip, polistiren esaslı, TS EN 13163 nolu Isı Yalıtım Malzemeleri Standardı''na uygun olarak üretilen bir ısı yalıtım levhasıdır. ÖZELLİKLER • Su emmeye karşı yüksek dirence sahiptir. • Darbe ve yüklere karşı dayanımı yüksektir.'
WHERE id = 40 AND slug IS NULL;

-- Expert EPS Beyaz ← "Expert 035 EPS (Beyaz) Isı Yalıtım Levhası 4cm 20-22kg/m3" (skor: 80)
UPDATE plates SET slug = 'expert-035-eps-beyaz-isi-yalitim-levhasi-4cm-20-22kg-m3', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Beyaz EPS Isı Yalıtım Levhası, 20-22 kg/m3 yoğunluğa sahip, polistiren esaslı, TS EN 13163 nolu Isı Yalıtım Malzemeleri Standardı''na uygun olarak üretilen bir ısı yalıtım levhasıdır. ÖZELLİKLER • Su emmeye karşı yüksek dirence sahiptir. • Darbe ve yüklere karşı dayanımı yüksektir.'
WHERE id = 40 AND slug IS NULL;

-- Expert EPS Beyaz ← "Expert 035 EPS (Beyaz) Isı Yalıtım Levhası 5cm 20-22kg/m3" (skor: 80)
UPDATE plates SET slug = 'expert-035-eps-beyaz-isi-yalitim-levhasi-5cm-20-22kg-m3', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Beyaz EPS Isı Yalıtım Levhası, 20-22 kg/m3 yoğunluğa sahip, polistiren esaslı, TS EN 13163 nolu Isı Yalıtım Malzemeleri Standardı''na uygun olarak üretilen bir ısı yalıtım levhasıdır. ÖZELLİKLER • Su emmeye karşı yüksek dirence sahiptir. • Darbe ve yüklere karşı dayanımı yüksektir.'
WHERE id = 40 AND slug IS NULL;

-- Expert EPS Beyaz ← "Expert 035 EPS (Beyaz) Isı Yalıtım Levhası 6cm 20-22kg/m3" (skor: 80)
UPDATE plates SET slug = 'expert-035-eps-beyaz-isi-yalitim-levhasi-6cm-20-22kg-m3', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Beyaz EPS Isı Yalıtım Levhası, 20-22 kg/m3 yoğunluğa sahip, polistiren esaslı, TS EN 13163 nolu Isı Yalıtım Malzemeleri Standardı''na uygun olarak üretilen bir ısı yalıtım levhasıdır. ÖZELLİKLER • Su emmeye karşı yüksek dirence sahiptir. • Darbe ve yüklere karşı dayanımı yüksektir.'
WHERE id = 40 AND slug IS NULL;

-- Expert EPS Beyaz ← "Expert 035 EPS (Beyaz) Isı Yalıtım Levhası 7cm 20-22kg/m3" (skor: 80)
UPDATE plates SET slug = 'expert-035-eps-beyaz-isi-yalitim-levhasi-7cm-20-22kg-m3', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Beyaz EPS Isı Yalıtım Levhası, 20-22 kg/m3 yoğunluğa sahip, polistiren esaslı, TS EN 13163 nolu Isı Yalıtım Malzemeleri Standardı''na uygun olarak üretilen bir ısı yalıtım levhasıdır. ÖZELLİKLER • Su emmeye karşı yüksek dirence sahiptir. • Darbe ve yüklere karşı dayanımı yüksektir.'
WHERE id = 40 AND slug IS NULL;

-- Expert EPS Beyaz ← "Expert 035 EPS (Beyaz) Isı Yalıtım Levhası 8cm 20-22kg/m3" (skor: 80)
UPDATE plates SET slug = 'expert-035-eps-beyaz-isi-yalitim-levhasi-8cm-20-22kg-m3', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Beyaz EPS Isı Yalıtım Levhası, 20-22 kg/m3 yoğunluğa sahip, polistiren esaslı, TS EN 13163 nolu Isı Yalıtım Malzemeleri Standardı''na uygun olarak üretilen bir ısı yalıtım levhasıdır. ÖZELLİKLER • Su emmeye karşı yüksek dirence sahiptir. • Darbe ve yüklere karşı dayanımı yüksektir.'
WHERE id = 40 AND slug IS NULL;

-- Expert EPS Beyaz ← "Expert 035 EPS (Beyaz) Isı Yalıtım Levhası 9cm 20-22kg/m3" (skor: 80)
UPDATE plates SET slug = 'expert-035-eps-beyaz-isi-yalitim-levhasi-9cm-20-22kg-m3', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Beyaz EPS Isı Yalıtım Levhası, 20-22 kg/m3 yoğunluğa sahip, polistiren esaslı, TS EN 13163 nolu Isı Yalıtım Malzemeleri Standardı''na uygun olarak üretilen bir ısı yalıtım levhasıdır. ÖZELLİKLER • Su emmeye karşı yüksek dirence sahiptir. • Darbe ve yüklere karşı dayanımı yüksektir.'
WHERE id = 40 AND slug IS NULL;

-- Expert EPS Beyaz ← "Expert 035 EPS (Beyaz) Isı Yalıtım Levhası 10cm 20-22kg/m3" (skor: 80)
UPDATE plates SET slug = 'expert-035-eps-beyaz-isi-yalitim-levhasi-10cm-20-22kg-m3', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Beyaz EPS Isı Yalıtım Levhası, 20-22 kg/m3 yoğunluğa sahip, polistiren esaslı, TS EN 13163 nolu Isı Yalıtım Malzemeleri Standardı''na uygun olarak üretilen bir ısı yalıtım levhasıdır. ÖZELLİKLER • Su emmeye karşı yüksek dirence sahiptir. • Darbe ve yüklere karşı dayanımı yüksektir.'
WHERE id = 40 AND slug IS NULL;

-- Dalmaçyalı Double Carbon ← "Dalmaçyalı Double Carbon 8 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-double-carbon-8-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Geliştirilmiş karbon teknolojisine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 38 AND slug IS NULL;

-- Dalmaçyalı Double Carbon ← "Dalmaçyalı Double Carbon 10 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-double-carbon-10-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Geliştirilmiş karbon teknolojisine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 38 AND slug IS NULL;

-- Dalmaçyalı İdeal Carbon ← "Dalmaçyalı İdeal Carbon Tek Fugalı Levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-ideal-carbon-tek-fugali-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yeni nesil hammaddeler ile ideal karbon dengesine sahip, polistiren esaslı, tek fugalı ısı yalıtım levhasıdır.'
WHERE id = 37 AND slug IS NULL;

-- Expert PW50 ← "6 cm Expert PW50 Taşyünü Ara Bölme Levhası" (skor: 90)
UPDATE plates SET slug = 'expert-pw50-tasyunu-ara-bolme-levhasi', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert PW50 Taşyünü Ara Bölme Levhası, bazalt, dolomit gibi volkanik kayaçların yüksek sıcaklıktaki potalarda ergitilmesi ve elyaf lifleri haline getirilmesi ile üretilen, bina komşu duvarları, merdiven ve asansör boşlukları, oteller, eğitim salonları, sinema, tiyatro ve konser salonlarında bölme duvar sistemlerinin ana bileşenleri olarak geliştirilmiş yalıtım levhalarıdır.'
WHERE id = 35 AND slug IS NULL;

-- Dalmaçyalı İdeal Carbon ← "Dalmaçyalı İdeal Carbon 2 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-ideal-carbon-2-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yeni nesil hammaddeler ile ideal karbon dengesine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 37 AND slug IS NULL;

-- Dalmaçyalı İdeal Carbon ← "Dalmaçyalı İdeal Carbon 3 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-ideal-carbon-3-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yeni nesil hammaddeler ile ideal karbon dengesine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 37 AND slug IS NULL;

-- Dalmaçyalı İdeal Carbon ← "Dalmaçyalı İdeal Carbon 4 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-ideal-carbon-4-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yeni nesil hammaddeler ile ideal karbon dengesine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 37 AND slug IS NULL;

-- Dalmaçyalı İdeal Carbon ← "Dalmaçyalı İdeal Carbon 5 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-ideal-carbon-5-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yeni nesil hammaddeler ile ideal karbon dengesine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 37 AND slug IS NULL;

-- Dalmaçyalı İdeal Carbon ← "Dalmaçyalı İdeal Carbon 6 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-ideal-carbon-6-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yeni nesil hammaddeler ile ideal karbon dengesine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 37 AND slug IS NULL;

-- Dalmaçyalı İdeal Carbon ← "Dalmaçyalı İdeal Carbon 7 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-ideal-carbon-7-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yeni nesil hammaddeler ile ideal karbon dengesine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 37 AND slug IS NULL;

-- Dalmaçyalı İdeal Carbon ← "Dalmaçyalı İdeal Carbon 8 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-ideal-carbon-8-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yeni nesil hammaddeler ile ideal karbon dengesine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 37 AND slug IS NULL;

-- Dalmaçyalı İdeal Carbon ← "Dalmaçyalı İdeal Carbon 9 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-ideal-carbon-9-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yeni nesil hammaddeler ile ideal karbon dengesine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 37 AND slug IS NULL;

-- Dalmaçyalı İdeal Carbon ← "Dalmaçyalı İdeal Carbon 10 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-ideal-carbon-10-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yeni nesil hammaddeler ile ideal karbon dengesine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 37 AND slug IS NULL;

-- Dalmaçyalı Double Carbon ← "Dalmaçyalı Double Carbon 2 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-double-carbon-2-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Geliştirilmiş karbon teknolojisine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 38 AND slug IS NULL;

-- Dalmaçyalı Double Carbon ← "Dalmaçyalı Double Carbon 3 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-double-carbon-3-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Geliştirilmiş karbon teknolojisine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 38 AND slug IS NULL;

-- Dalmaçyalı Double Carbon ← "Dalmaçyalı Double Carbon 4 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-double-carbon-4-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Geliştirilmiş karbon teknolojisine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 38 AND slug IS NULL;

-- Dalmaçyalı Double Carbon ← "Dalmaçyalı Double Carbon 5 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-double-carbon-5-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Geliştirilmiş karbon teknolojisine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 38 AND slug IS NULL;

-- Dalmaçyalı Double Carbon ← "Dalmaçyalı Double Carbon 6 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-double-carbon-6-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Geliştirilmiş karbon teknolojisine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 38 AND slug IS NULL;

-- Dalmaçyalı Double Carbon ← "Dalmaçyalı Double Carbon 7 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-double-carbon-7-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Geliştirilmiş karbon teknolojisine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 38 AND slug IS NULL;

-- Dalmaçyalı Double Carbon ← "Dalmaçyalı Double Carbon 9 cm levha" (skor: 90)
UPDATE plates SET slug = 'dalmacyali-double-carbon-9-cm-levha', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Geliştirilmiş karbon teknolojisine sahip, polistiren esaslı ısı yalıtım levhasıdır.'
WHERE id = 38 AND slug IS NULL;

-- Expert LD125 ← "Expert 5 cm LD125 Taşyünü Levha" (skor: 80)
UPDATE plates SET slug = 'expert-ld125-tasyunu-isi-yalitim-levhasi', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Taşyünü LD125 Isı Yalıtım Levhası, bazalt, dolomit gibi volkanik kayaçların yüksek sıcaklıktaki potalarda ergitilmesi ve elyaf lifleri haline getirilmesi ile üretilen, inorganik ısı yalıtım levhasıdır.'
WHERE id = 32 AND slug IS NULL;

-- Expert VF80 ← "Expert VF80 4 cm Taşyünü Levha" (skor: 90)
UPDATE plates SET slug = 'expert-vf80-tasyunu-giydirme-cephe-levhasi', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert VF80 Taşyünü Giydirme Cephe Levhası, bazalt, dolomit gibi volkanik kayaçların yüksek sıcaklıktaki potalarda ergitilmesi ve elyaf lifleri haline getirilmesi ile üretilen, kamu binası, konut ve otel cepheleri gibi her türlü giydirme cephe uygulamalarında kullanılmak için geliştirilmiş yalıtım levhalarıdır. &nbsp;'
WHERE id = 33 AND slug IS NULL;

-- Expert RF150 ← "4 cm Expert RF150 Taşyünü Teras Çatı Levhası" (skor: 90)
UPDATE plates SET slug = 'expert-rf150-tasyunu-teras-cati-levhasi', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert RF150 Taşyünü Teras Çatı Levhası, bazalt, dolomit gibi volkanik kayaçların yüksek sıcaklıktaki potalarda ergitilmesi ve elyaf lifleri haline getirilmesi ile üretilen, teras ve çatılar için geliştirilmiş inorganik bir levhadır. &nbsp; &nbsp; &nbsp;'
WHERE id = 34 AND slug IS NULL;

-- Expert Premium ← "Expert Premium 5 cm Taşyünü Levha" (skor: 90)
UPDATE plates SET slug = 'expert-premium-tasyunu-isi-yalitim-levhasi', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Taşyünü Premium Isı Yalıtım Levhası, bazalt, dolomit gibi volkanik kayaçların yüksek sıcaklıktaki potalarda ergitilmesi ve elyaf lifleri haline getirilmesi ile üretilen, inorganik ısı yalıtım levhasıdır.'
WHERE id = 30 AND slug IS NULL;

-- Expert HD150 ← "Expert 3 cm HD150 Taşyünü Levha" (skor: 80)
UPDATE plates SET slug = 'expert-hd150-tasyunu-isi-yalitim-levhasi', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Taşyünü HD150 Isı Yalıtım Levhası, bazalt, dolomit gibi volkanik kayaçların yüksek sıcaklıktaki potalarda ergitilmesi ve elyaf lifleri haline getirilmesi ile üretilen, inorganik ısı yalıtım levhasıdır. &nbsp;'
WHERE id = 31 AND slug IS NULL;

-- Dalmaçyalı SW035 ← "Dalmaçyalı 3 cm SW035 Taşyünü Levha" (skor: 80)
UPDATE plates SET slug = 'dalmacyali-stonewool-sw035-tasyunu-yalitim-levhasi', sales_mode = 'quote_only', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Volkanik kayaçların elyaf lifleri haline getirilmesi ile üretilen, inorganik ısı yalıtım levhasıdır.'
WHERE id = 27 AND slug IS NULL;


-- ─── ACCESSORIES ────────────────────────────────────────────
-- Fawori Optimix Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Fawori Beton Dübeli 11,5 cm çelik çivili 200 adet" (skor: 60)
UPDATE accessories SET slug = 'fawori-beton-dubeli-115-cm-celik-civili-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden'
WHERE id = 35 AND slug IS NULL;

-- Fawori Optimix Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Fawori Beton Dübeli 13,5 cm çelik çivili 200 adet" (skor: 60)
UPDATE accessories SET slug = 'fawori-beton-dubeli-135-cm-celik-civili-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden'
WHERE id = 35 AND slug IS NULL;

-- Fawori Optimix Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Fawori Beton Dübeli 15,5 cm çelik çivili 200 adet" (skor: 60)
UPDATE accessories SET slug = 'fawori-beton-dubeli-155-cm-celik-civili-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Fawori Isı Yalıtım Sisteminde, Fawori Isı Yalıtım Levhalarının yüzeylere sabitlenmesi ve rüzgâr vakumlama yüklerine karşı sistemin korunması amacı ile kullanılır.'
WHERE id = 35 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Fawori Donatı Filesi Extra S160 50 m2" (skor: 80)
UPDATE accessories SET slug = 'fawori-donati-filesi-extra-s160-50-m2', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Fawori Donatı Filesi S160 4x4 mm elek aralığında, yüksek alkali dayanımlı, çimento esaslı sıva uygulamalarında kullanılan, özel kaplamalı cam iplik dokuma filesidir.'
WHERE id = 51 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Optimix Donatı Filesi F160 50 m2" (skor: 80)
UPDATE accessories SET slug = 'optimix-donati-filesi-f160-50-m2', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Optimix Donatı Filesi: 4x4 elek aralığında, alkali dayanımlı, özel kaplamalı cam iplik dokuma filesidir.'
WHERE id = 51 AND slug IS NULL;

-- Dalmaçyalı Fileli Köşe (PVC) 2,5m 50 adet 125m ← "Fawori Optimix Fileli Köşe (PVC) 2,5 m (50 adet 125 m)" (skor: 80)
UPDATE accessories SET slug = 'fawori-fileli-kose-pvc-25-m-50-adet-125-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = '2,5 m uzunluğunda, PVC fileli köşe profilidir. Bina köşeleri, pencere, kapı kenarlarının olası mekanik hasarlara karşı korunması ve sıva katında düzgünlük sağlama amacıyla kullanılan profillerdir. 160 gr/m² yüksek alkali dayanımlı donatı filesi ile imal edilmektedir.'
WHERE id = 13 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Fawori Optimix Fileli Fuga Profili 3*1,6cm 3 m (10 adet 30 m)" (skor: 80)
UPDATE accessories SET slug = 'fawori-fileli-fuga-profili-316cm-3-m-10-adet-30-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = '3 m uzunluğunda PVC’den imal edilmiş fuga profillerdir. Isı yalıtım levhaları üzerinde açılmış olan fuga bölümlerinin geçişlerinde kullanılır. Profil üzerine yapıştırılmış donatı filesi ile işçilik ve zamandan tasarruf edilmesini sağlar, işçilik hatalarını önler. 1,6 cm derinlik ile 3 cm ve 5 cm olmak üzere iki farklı modeli mevcuttur.'
WHERE id = 51 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Fawori Optimix Fileli Fuga Profili 5*1,6cm 3 m (10 adet 30 m)" (skor: 80)
UPDATE accessories SET slug = 'fawori-fileli-fuga-profili-516cm-3-m-10-adet-30-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = '3 m uzunluğunda PVC’den imal edilmiş fuga profillerdir. Isı yalıtım levhaları üzerinde açılmış olan fuga bölümlerinin geçişlerinde kullanılır. İşçilik hatalarını önler. 1,6 cm derinlik ile 3 cm ve 5 cm olmak üzere iki farklı modeli mevcuttur.'
WHERE id = 51 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Fawori Optimix Pvc Fileli Fuga Profili 3*1,6cm 3 m (40 adet 120 m)" (skor: 80)
UPDATE accessories SET slug = 'fawori-pvc-fuga-profili-316cm-3-m-40-adet-120-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = '3 m uzunluğunda PVC’den imal edilmiş fuga profillerdir. Isı yalıtım levhaları üzerinde açılmış olan fuga bölümlerinin geçişlerinde kullanılır.'
WHERE id = 51 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Fawori Optimix Pvc Fileli Fuga Profili 5*1,6cm 3 m (40 adet 120 m)" (skor: 80)
UPDATE accessories SET slug = 'fawori-pvc-fuga-profili-516cm-3-m-40-adet-120-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Isı yalıtım levhaları üzerinde açılmış olan fuga bölümlerinin geçişlerinde kullanılır.'
WHERE id = 51 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Yapıştırıcısı 25kg ← "Fawori Isı Yalıtım Yapıştırıcısı 25 kg" (skor: 80)
UPDATE accessories SET slug = 'fawori-isi-yalitim-yapistiricisi-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Fawori Isı Yalıtım Sistem Yapıştırıcısı, iç ve dış mekanlarda beton, sıva, tuğla, gazbeton panel vb. mineral esaslı yüzeylerde, polistren esaslı ve taşyünü levhalar gibi ısı ve ses yalıtım malzemelerinin yapıştırılmasında kullanılan çimento esaslı özel yapıştırıcıdır.'
WHERE id = 1 AND slug IS NULL;

-- Fawori Optimix Isı Yalıtım Yapıştırma Harcı 25kg ← "Optimix Isı Yalıtım Yapıştırma Harcı 25 kg" (skor: 70)
UPDATE accessories SET slug = 'optimix-isi-yalitim-yapistirma-harci-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Optimix Isı Yalıtım Yapıştırma Harcı, iç ve dış mekanlarda beton, sıva, tuğla, gazbeton panel vb. mineral esaslı yüzeylerde, polistren esaslı ve taşyünü levhalar gibi ısı ve ses yalıtım malzemelerinin yapıştırılmasında kullanılan çimento esaslı özel yapıştırıcıdır.'
WHERE id = 29 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Sıvası 25kg ← "Fawori Isı Yalıtım Sıvası 25 kg" (skor: 80)
UPDATE accessories SET slug = 'fawori-isi-yalitim-sivasi-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Fawori Isı Yalıtım Sistem Sıvası, iç ve dış mekanlarda polistren esaslı ve taşyünü levhalar gibi ısı ve ses yalıtım malzemelerinin üzerine perdah sıvası yapılmasında kullanılan, aynı zamanda bu malzemelerin yapıştırılmasında da kullanılabilen, file uygulamasıyla yüzeyin mukavemetini arttıran, çimento esaslı, elyaf takviyeli özel bir sıvadır.'
WHERE id = 3 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Sıvası 25kg ← "Optimix Isı Yalıtım Sıva Harcı 25 kg" (skor: 80)
UPDATE accessories SET slug = 'optimix-isi-yalitim-siva-harci-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Optimix Isı Yalıtım Sıva Harcı, iç ve dış mekanlarda polistren esaslı ve taşyünü levhalar gibi ısı ve ses yalıtım malzemelerinin üzerine perdah sıvası yapılmasında kullanılan, file uygulamasıyla yüzeyin mukavemetini arttıran, çimento esaslı bir sıvadır.'
WHERE id = 3 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Fawori Mineral kaplama (ince tane)25 kg" (skor: 80)
UPDATE accessories SET slug = 'fawori-mineral-kaplama-ince-tane25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Çimento esaslı, hafif, yüzeyde doğal bir doku oluşturan, son kat iç ve dış yüzey kaplamasıdır.'
WHERE id = 15 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Optimix Mineral kaplama ( tane) 25 kg" (skor: 80)
UPDATE accessories SET slug = 'fawori-mineral-kaplama-tane-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Çimento esaslı, hafif, yüzeyde doğal bir doku oluşturan, son kat iç ve dış yüzey kaplamasıdır.'
WHERE id = 15 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Fawori Mineral kaplama (çizgi) 25 kg" (skor: 80)
UPDATE accessories SET slug = 'fawori-mineral-kaplama-cizgi-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Çimento esaslı, hafif, yüzeyde doğal bir doku oluşturan, son kat iç ve dış yüzey kaplamasıdır.'
WHERE id = 15 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Optimix Mineral Kaplama (ince tane) 25 kg" (skor: 80)
UPDATE accessories SET slug = 'optimix-mineral-kaplama-ince-tane-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Çimento esaslı, hafif, yüzeyde doğal bir doku oluşturan, son kat iç ve dış yüzey kaplamasıdır.'
WHERE id = 15 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Optimix Mineral Kaplama (çizgi) 25 kg" (skor: 80)
UPDATE accessories SET slug = 'optimix-mineral-kaplama-cizgi-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Çimento esaslı, hafif, yüzeyde doğal bir doku oluşturan, son kat iç ve dış yüzey kaplamasıdır.'
WHERE id = 15 AND slug IS NULL;

-- Dalmaçyalı Kaplama Astarı 25kg ← "Fawori Optimix Kaplama Astarı 25 kg" (skor: 80)
UPDATE accessories SET slug = 'fawori-kaplama-astari-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Fawori Dekoratif Mineral Kaplama Astarı yüksek aderans gücüne sahip, akrilik kopolimer emülsiyon esaslı, beyaz renkte özel bir astardır.'
WHERE id = 14 AND slug IS NULL;

-- Fawori Optimix Plastik Dübel 9,5cm 600 adet ← "Fawori Standart Dübel 9,5cm plas.çivili 600 adet" (skor: 44)
UPDATE accessories SET slug = 'fawori-standart-dubel-95cm-plas-civili-600-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Fawori Isı Yalıtım Sisteminde, Fawori Isı Yalıtım Levhalarının yüzeylere sabitlenmesi ve rüzgâr vakumlama yüklerine karşı sistemin korunması amacı ile kullanılır.'
WHERE id = 31 AND slug IS NULL;

-- Fawori Optimix Plastik Dübel 9,5cm 600 adet ← "Fawori Standart Dübel 11,5cm plas.çivili 600 adet" (skor: 44)
UPDATE accessories SET slug = 'fawori-standart-dubel-115cm-plas-civili-600-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Fawori Isı Yalıtım Sisteminde, Fawori Isı Yalıtım Levhalarının yüzeylere sabitlenmesi ve rüzgâr vakumlama yüklerine karşı sistemin korunması amacı ile kullanılır.'
WHERE id = 31 AND slug IS NULL;

-- Fawori Optimix Plastik Dübel 9,5cm 600 adet ← "Fawori Standart Dübel 13,5cm plas.çivili 600 adet" (skor: 44)
UPDATE accessories SET slug = 'fawori-standart-dubel-135cm-plas-civili-600-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Fawori Isı Yalıtım Sisteminde, Fawori Isı Yalıtım Levhalarının yüzeylere sabitlenmesi ve rüzgâr vakumlama yüklerine karşı sistemin korunması amacı ile kullanılır.'
WHERE id = 31 AND slug IS NULL;

-- Fawori Optimix Plastik Dübel 9,5cm 600 adet ← "Fawori Standart Dübel 15,5cm plas.çivili 600 adet" (skor: 44)
UPDATE accessories SET slug = 'fawori-standart-dubel-155cm-plas-civili-600-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Fawori Isı Yalıtım Sisteminde, Fawori Isı Yalıtım Levhalarının yüzeylere sabitlenmesi ve rüzgâr vakumlama yüklerine karşı sistemin korunması amacı ile kullanılır.'
WHERE id = 31 AND slug IS NULL;

-- Fawori Optimix Plastik Dübel 9,5cm 600 adet ← "Optimix Plastik Çivili Dübel 9,5 cm 600 adet" (skor: 58)
UPDATE accessories SET slug = 'optimix-plastik-civili-dubel-95-cm-600-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Optimix Isı Yalıtım Levhalarının yüzeylere sabitlenmesi ve rüzgar vakumlama yüklerine karşı sistemin korunması amacı ile kullanılır. Delikli tuğla, gaz beton ve dolu tuğlada kullanılabilir.'
WHERE id = 31 AND slug IS NULL;

-- Fawori Optimix Plastik Dübel 9,5cm 600 adet ← "Optimix Plastik Çivili Dübel 11,5 cm 600 adet" (skor: 58)
UPDATE accessories SET slug = 'optimix-plastik-civili-dubel-115-cm-600-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Optimix Isı Yalıtım Levhalarının yüzeylere sabitlenmesi ve rüzgar vakumlama yüklerine karşı sistemin korunması amacı ile kullanılır. Delikli tuğla, gaz beton ve dolu tuğlada kullanılabilir.'
WHERE id = 31 AND slug IS NULL;

-- Fawori Optimix Plastik Dübel 9,5cm 600 adet ← "Optimix Plastik Çivili Dübel 13,5 cm 600 adet" (skor: 58)
UPDATE accessories SET slug = 'optimix-plastik-civili-dubel-135-cm-600-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Optimix Isı Yalıtım Levhalarının yüzeylere sabitlenmesi ve rüzgar vakumlama yüklerine karşı sistemin korunması amacı ile kullanılır. Delikli tuğla, gaz beton ve dolu tuğlada kullanılabilir.'
WHERE id = 31 AND slug IS NULL;

-- Fawori Optimix Plastik Dübel 9,5cm 600 adet ← "Optimix Plastik Çivili Dübel 15,5 cm 600 adet" (skor: 58)
UPDATE accessories SET slug = 'optimix-plastik-civili-dubel-155-cm-600-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Optimix Isı Yalıtım Levhalarının yüzeylere sabitlenmesi ve rüzgar vakumlama yüklerine karşı sistemin korunması amacı ile kullanılır. Delikli tuğla, gaz beton ve dolu tuğlada kullanılabilir.'
WHERE id = 31 AND slug IS NULL;

-- Fawori Optimix Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Fawori Taşyünü dübelİ çelik çivili 11,5 cm 200 adet" (skor: 70)
UPDATE accessories SET slug = 'fawori-tasyunu-dubeli-celik-civili-115-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Dış cephe ısı yalıtım sistemlerinde, taşyünü levha uygulamalarında 9 cm’lik geniş kafa çapıyla basma alanını genişleterek mükemmel bir tutunma sağlar. Beton, dolu tuğla, delikli tuğla, gazbeton, hafif betondan mamul dolu ve boşluklu bloklarda kullanılır.'
WHERE id = 35 AND slug IS NULL;

-- Fawori Optimix Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Fawori taşyünü dübelİ çelik çivili 13,5 cm 200 adet" (skor: 70)
UPDATE accessories SET slug = 'fawori-tasyunu-dubeli-celik-civili-135-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'SARFİYAT Isı yalıtım levhalarının birleşim noktalarına ve ortaya iki adet gelecek şekilde ortalama m 2 ‘ye 6 adet dübel kullanılır. FAWORİ TAŞYÜNÜ DÜBELİ (ÇELİK ÇİVİLİ) – Dış cephe ısı yalıtım sistemlerinde, taşyünü levha uygulamalarında 13,5 cm’lik geniş kafa çapıyla basma alanını genişleterek mükemmel bir tutunma sağlar. Beton, dolu tuğla, delikli tuğla'
WHERE id = 35 AND slug IS NULL;

-- Fawori Optimix Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Fawori taşyünü dübeli çelik çivili 15,5 cm 200 adet" (skor: 70)
UPDATE accessories SET slug = 'fawori-tasyunu-dubeli-celik-civili-155-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Matkap ile dübelin çapına uygun olacak şekilde delikler açılır. Dübel kovanı açılan deliğe yalıtım levhasına bitişecek şekilde yerleştirilir, zeminin türüne göre plastik ya da çelik çivi yerine çakılır.'
WHERE id = 35 AND slug IS NULL;

-- Fawori Optimix Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Fawori Beton Dübeli 9,5 cm çelik çivili 200 adet" (skor: 60)
UPDATE accessories SET slug = 'fawori-beton-dubeli-95-cm-celik-civili-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'UYGULAMA Matkap ile dübelin çapına uygun olacak şekilde delikler açılır. Dübel kovanı açılan deliğe yalıtım levhasına bitişecek şekilde yerleştirilir, zeminin türüne göre plastik ya da çelik çivi yerine çakılır.'
WHERE id = 35 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Taşyünü Dübel Pulu 200 adet" (skor: 56)
UPDATE accessories SET slug = 'tasyunu-dubel-pulu-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Fawori Isı Yalıtım Sisteminde, Fawori Isı Yalıtım Levhalarının yüzeylere sabitlenmesi ve rüzgâr vakumlama yüklerine karşı sistemin korunması amacı ile kullanılır.'
WHERE id = 9 AND slug IS NULL;

-- Dalmaçyalı Kaplama Astarı 25kg ← "Dalmaçyalı Kaplama Astarı" (skor: 85)
UPDATE accessories SET slug = 'dalmacyali-kaplama-astari', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yüksek aderans gücüne sahip, akrilik kopolimer emülsiyon esaslı, beyaz renkte özel astardır. Isı yalıtım sistemlerinde ve boyalı/boyasız eski yüzeyler üzerinde kullanıma uygun Kaplama uygulamasında desen vermeyi kolaylaştırma <li class="textContent18 flexCo'
WHERE id = 14 AND slug IS NULL;

-- Dalmaçyalı Kaplama Astarı 25kg ← "Dalmaçyalı Silikonlu Dış Cephe Boya Astarı" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-silikonlu-dis-cephe-boya-astari', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Silikon emülsiyon esaslı, su bazlı dış cephe boya astarıdır. Boya ile yüzey arasında bağlayıcı köprü görevi <div class="MuiGrid-root MuiGrid-container MuiGrid-'
WHERE id = 14 AND slug IS NULL;

-- Dalmaçyalı Plastik Dübel 9,5cm 600 adet ← "Dalmaçyalı Standart Dübel 9,5cm plas.çivili 600 adet" (skor: 44)
UPDATE accessories SET slug = 'dalmacyali-standart-dubel-95cm-plas-civili-600-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Dolu tuğla, delikli tuğla, gaz beton, hafif betondan mamul dolu ve boşluklu bloklarda kullanılan dübellerdir.'
WHERE id = 5 AND slug IS NULL;

-- Dalmaçyalı Plastik Dübel 9,5cm 600 adet ← "Dalmaçyalı Standart Dübel 11,5cm plas.çivili 600 adet" (skor: 44)
UPDATE accessories SET slug = 'dalmacyali-standart-dubel-115cm-plas-civili-600-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Dolu tuğla, delikli tuğla, gaz beton, hafif betondan mamul dolu ve boşluklu bloklarda kullanılan dübellerdir.'
WHERE id = 5 AND slug IS NULL;

-- Dalmaçyalı Plastik Dübel 9,5cm 600 adet ← "Dalmaçyalı Standart Dübel 13,5cm plas.çivili 600 adet" (skor: 44)
UPDATE accessories SET slug = 'dalmacyali-standart-dubel-135cm-plas-civili-600-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Dolu tuğla, delikli tuğla, gaz beton, hafif betondan mamul dolu ve boşluklu bloklarda kullanılan dübellerdir.'
WHERE id = 5 AND slug IS NULL;

-- Dalmaçyalı Plastik Dübel 9,5cm 600 adet ← "Dalmaçyalı Standart Dübel 15,5cm plas.çivili 600 adet" (skor: 44)
UPDATE accessories SET slug = 'dalmacyali-standart-dubel-155cm-plas-civili-600-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Dolu tuğla, delikli tuğla, gaz beton, hafif betondan mamul dolu ve boşluklu bloklarda kullanılan dübellerdir. <div class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-'
WHERE id = 5 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı Beton Dübeli çelik çivili 9,5 cm 200 adet" (skor: 60)
UPDATE accessories SET slug = 'dalmacyali-beton-dubeli-celik-civili-95-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Beton, brüt beton, tünel beton, dolu tuğla, delikli tuğla, gaz beton, hafif betondan mamul dolu ve boşluklu bloklarda kullanan dübellerdir. TSEK belgesine sahiptir.'
WHERE id = 9 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı Beton Dübeli çelik çivili 11,5 cm 200 adet" (skor: 60)
UPDATE accessories SET slug = 'dalmacyali-beton-dubeli-celik-civili-115-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Beton, brüt beton, tünel beton, dolu tuğla, delikli tuğla, gaz beton, hafif betondan mamul dolu ve boşluklu bloklarda kullanan dübellerdir. TSEK belgesine sahiptir.'
WHERE id = 9 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı Beton Dübeli çelik çivili 13,5 cm 200 adet" (skor: 60)
UPDATE accessories SET slug = 'dalmacyali-beton-dubeli-celik-civili-135-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Beton, brüt beton, tünel beton, dolu tuğla, delikli tuğla, gaz beton, hafif betondan mamul dolu ve boşluklu bloklarda kullanan dübellerdir. TSEK belgesine sahiptir.'
WHERE id = 9 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı Beton Dübeli çelik çivili 15,5 cm 200 adet" (skor: 60)
UPDATE accessories SET slug = 'dalmacyali-beton-dubeli-celik-civili-155-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Beton, brüt beton, tünel beton, dolu tuğla, delikli tuğla, gaz beton, hafif betondan mamul dolu ve boşluklu bloklarda kullanan dübellerdir. TSEK belgesine sahiptir.'
WHERE id = 9 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı Taşyünü dübeli çelik çivili 11,5 cm 200 adet" (skor: 70)
UPDATE accessories SET slug = 'dalmacyali-tasyunu-dubeli-celik-civili-115-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Taşyünü levha uygulamaları için tasarlanmış, yüksek tutunma mukavemetine sahip, beton, dolu tuğla, delikli tuğla, gaz beton, hafif betondan mamul dolu ve boşluklu bloklarda kullanılan özel dübellerdir. TSEK belgesine sahiptir.'
WHERE id = 9 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı Taşyünü dübeli çelik çivili 13,5 cm 200 adet" (skor: 70)
UPDATE accessories SET slug = 'dalmacyali-tasyunu-dubeli-celik-civili-135-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Taşyünü levha uygulamaları için tasarlanmış, yüksek tutunma mukavemetine sahip, beton, dolu tuğla, delikli tuğla, gaz beton, hafif betondan mamul dolu ve boşluklu bloklarda kullanılan özel dübellerdir. TSEK belgesine sahiptir.'
WHERE id = 9 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı Taşyünü dübeli çelik çivili 15,5 cm 200 adet" (skor: 70)
UPDATE accessories SET slug = 'dalmacyali-tasyunu-dubeli-celik-civili-155-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Tuğla yüzeyler üzerine taşyünü uygulamalarında yüksek tutunma sağlayan dübellerdir. TSEK belgesine sahiptir.'
WHERE id = 9 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı Tuğla Dübeli Plastik çivili 13,5 cm 200 adet" (skor: 50)
UPDATE accessories SET slug = 'dalmacyali-tugla-dubeli-plastik-civili-135-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Delikli tuğla ve boşluklu blok yüzeylerde özel tırnaklı tasarımı ile daha fazla tutunma mukavemeti sağlayan dübellerdir.'
WHERE id = 9 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı Tuğla Dübeli Plastik çivili 15,5 cm 200 adet" (skor: 50)
UPDATE accessories SET slug = 'dalmacyali-tugla-dubeli-plastik-civili-155-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Delikli tuğla ve boşluklu blok yüzeylerde özel tırnaklı tasarımı ile daha fazla tutunma mukavemeti sağlayan dübellerdir.'
WHERE id = 9 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı Tuğla Dübeli Çelik çivili 13,5 cm 200 adet" (skor: 60)
UPDATE accessories SET slug = 'dalmacyali-tugla-dubeli-celik-civili-135-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Tuğla yüzeyler üzerine taşyünü uygulamalarında yüksek tutunma sağlayan dübellerdir. TSEK belgesine sahiptir.'
WHERE id = 9 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Dalmaçyalı Stonewool Sistem Mineral Kaplama 1,5 mm" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-stonewool-sistem-mineral-kaplama-15-mm', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Özellikle taşyünü ısı yalıtım sistemleri ile kullanıma uygun, ince tane dokuda doğal görüntüsüyle yüzeyde homojen bir desen oluşturan, çimento esaslı, elyaf takviyeli, son kat yüzey kaplamasıdır. Isı yalıtım sistemlerinde ve boyalı eski yüzeylerin yenilenmesinde kullanıma uygun'
WHERE id = 15 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Dalmaçyalı Organic Silikonlu Kaplama İnce Tane" (skor: 47)
UPDATE accessories SET slug = 'dalmacyali-organic-silikonlu-kaplama-ince-tane', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'İnce tane dokuda doğal görüntüsüyle yüzeyde homojen bir desen oluşturan, akrilik esaslı, elyaf ve silikon takviyeli, renklendirilmiş son kat yüzey kaplamasıdır. Kullanıma hazır, kendinden renkli'
WHERE id = 15 AND slug IS NULL;

-- Expert Çelik Çivili Taşyünü Dübeli 11,5cm 200 adet ← "Expert Çelik Çivili Taşyünü Dübeli 11,5 cm (200 adet)" (skor: 70)
UPDATE accessories SET slug = 'expert-celik-civili-tasyunu-dubeli-115-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Expert Taşyünü Dübeli (Çelik Çivili): Taşyünü levha uygulamaları için tasarlanmıştır. Özel tasarımı ve 9 cm çaplı başlığı sayesinde yüksek bir tutunma mukavemeti sağlar. Beton, dolu tuğla, delikli tuğla, gazbeton, hafif betondan mamul dolu ve boşluklu bloklarda kullanılır.'
WHERE id = 22 AND slug IS NULL;

-- Expert Çelik Çivili Taşyünü Dübeli 11,5cm 200 adet ← "Expert Çelik Çivili Taşyünü Dübeli 13,5 cm (200 adet)" (skor: 70)
UPDATE accessories SET slug = 'expert-celik-civili-tasyunu-dubeli-135-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Expert Taşyünü Dübeli (Çelik Çivili): Taşyünü levha uygulamaları için tasarlanmıştır. Özel tasarımı ve 9 cm çaplı başlığı sayesinde yüksek bir tutunma mukavemeti sağlar. Beton, dolu tuğla, delikli tuğla, gazbeton, hafif betondan mamul dolu ve boşluklu bloklarda kullanılır.'
WHERE id = 22 AND slug IS NULL;

-- Expert Çelik Çivili Taşyünü Dübeli 11,5cm 200 adet ← "Expert Çelik Çivili Taşyünü Dübeli 15,5 cm (200 adet)" (skor: 70)
UPDATE accessories SET slug = 'expert-celik-civili-tasyunu-dubeli-155-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden'
WHERE id = 22 AND slug IS NULL;

-- Expert Fileli Köşe Profili (PVC) 2,5m 50 adet 125m ← "Expert Subasman Profili (Alüminyum) 2,5 m 5 cm (10 adet 25 m)" (skor: 42)
UPDATE accessories SET slug = 'expert-subasman-profili-aluminyum-25-m-5-cm-10-adet-25-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Isı yalıtım sisteminin alt kenarında düzgünlüğü sağlamak ve gerektiğinde dikey bitişi oluşturmak amacıyla kullanılan subasman profilidir.'
WHERE id = 26 AND slug IS NULL;

-- Expert Fileli Köşe Profili (PVC) 2,5m 50 adet 125m ← "Expert Subasman Profili (Alüminyum) 2,5 m 6 cm (10 adet 25 m)" (skor: 42)
UPDATE accessories SET slug = 'expert-subasman-profili-aluminyum-25-m-6-cm-10-adet-25-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Isı yalıtım sisteminin alt kenarında düzgünlüğü sağlamak ve gerektiğinde dikey bitişi oluşturmak amacıyla kullanılan subasman profilidir.'
WHERE id = 26 AND slug IS NULL;

-- Expert Fileli Köşe Profili (PVC) 2,5m 50 adet 125m ← "Expert Subasman Profili (Alüminyum) 2,5 m 7 cm (10 adet 25 m)" (skor: 42)
UPDATE accessories SET slug = 'expert-subasman-profili-aluminyum-25-m-7-cm-10-adet-25-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Isı yalıtım sisteminin alt kenarında düzgünlüğü sağlamak ve gerektiğinde dikey bitişi oluşturmak amacıyla kullanılan subasman profilidir.'
WHERE id = 26 AND slug IS NULL;

-- Expert Fileli Köşe Profili (PVC) 2,5m 50 adet 125m ← "Expert Subasman Profili (Alüminyum) 2,5 m 8 cm (10 adet 25 m)" (skor: 42)
UPDATE accessories SET slug = 'expert-subasman-profili-aluminyum-25-m-8-cm-10-adet-25-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Isı yalıtım sisteminin alt kenarında düzgünlüğü sağlamak ve gerektiğinde dikey bitişi oluşturmak amacıyla kullanılan subasman profilidir.'
WHERE id = 26 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı Taşyünü Dübel Pulu 200 adet" (skor: 58)
UPDATE accessories SET slug = 'dalmacyali-tasyunu-dubel-pulu-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Taşyünü levha uygulamalarında tüm dübellere uygun olarak kullanılır ve dübellerin basma alanını genişleterek yüksek tutunma sağlar.'
WHERE id = 9 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı OSB Dübeli Vidasız 2,5cm 200 adet" (skor: 50)
UPDATE accessories SET slug = 'dalmacyali-osb-dubeli-vidasiz-25cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'OSB ve benzeri prefabrik yüzeylerde kullanılmak üzere özel olarak üretilmiş, vidasız dübellerdir.'
WHERE id = 9 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Dalmaçyalı Donatı Filesi S160 55 M2" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-donati-filesi-s160-55-m2', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Çimento esaslı sıva uygulamalarında kullanılan, özel kaplamalı cam iplik dokuma filesidir.'
WHERE id = 51 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Dalmaçyalı Organik Donatı Filesi S110 82,5 M2" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-organik-donati-filesi-s110-825-m2', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Dalmaçyalı Organic Isı Yalıtım Sıvası uygulamalarında kullanılan, özel kaplamalı cam iplik dokuma filesidir.'
WHERE id = 51 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Dalmaçyalı Fuga Donatı Filesi S70 50 M2" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-fuga-donati-filesi-s70-50-m2', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Isı yalıtım levhaları üzerinde açılmış olan fuga bölümlerinin geçişlerinde kullanılan, yüksek alkali dayanımlı donatı filesi ile üretilen profildir.'
WHERE id = 51 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Dalmaçyalı Panzer Donatı File S340 25 M2" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-panzer-donati-file-s340-25-m2', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Yüksek alkali ve darbe dayanımlı, özel kaplamalı cam iplik dokuma filesidir.'
WHERE id = 51 AND slug IS NULL;

-- Dalmaçyalı Fileli Köşe (PVC) 2,5m 50 adet 125m ← "Dalmaçyalı Fileli Köşe (PVC) 2,5 Mt (50 adet 125 m)" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-fileli-kose-pvc-25-mt-50-adet-125-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Bina köşeleri, pencere, kapı kenarlarının olası mekanik hasarlara karşı korunması ve sıva katında düzgünlük sağlama amacıyla kullanılan, yüksek alkali dayanımlı donatı filesi ile üretilen köşe profildir.'
WHERE id = 13 AND slug IS NULL;

-- Dalmaçyalı Fileli Köşe (PVC) 2,5m 50 adet 125m ← "Dalmaçyalı Köşe Profili (alüminyum) 2,5m (30 adet 75 m)" (skor: 42)
UPDATE accessories SET slug = 'dalmacyali-kose-profili-aluminyum-25m-30-adet-75-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Bina köşeleri, pencere, kapı kenarlarının olası mekanik hasarlara karşı korunması ve sıva katında düzgünlük sağlama amacıyla kullanılan köşe profilidir.'
WHERE id = 13 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Dalmaçyalı Fileli Damlalık Profili (PVC) 2,5 Mt (20 adet 50 m)" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-fileli-damlalik-profili-pvc-25-mt-20-adet-50-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Bina köşeleri, pencere, kapı kenarlarının olası mekanik hasarlara karşı korunması ve sıva katında düzgünlük sağlama amacıyla kullanılan köşe profilidir.'
WHERE id = 51 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Dalmaçyalı Fileli Fuga Profili 3*1,6cm 3 Mt (10 adet 30 m)" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-fileli-fuga-profili-316cm-3-mt-10-adet-30-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Isı yalıtım levhaları üzerinde açılmış olan fuga bölümlerinin geçişlerinde kullanılan, yüksek alkali dayanımlı donatı filesi ile üretilen profildir.'
WHERE id = 51 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Dalmaçyalı Fileli Fuga Profili 5*1,6cm 3 Mt (10 adet 30 m)" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-fileli-fuga-profili-516cm-3-mt-10-adet-30-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Isı yalıtım levhaları üzerinde açılmış olan fuga bölümlerinin geçişlerinde kullanılan, yüksek alkali dayanımlı donatı filesi ile üretilen profildir.'
WHERE id = 51 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Dalmaçyalı Fileli Dilatasyon profili 2,5 Mt (25 adet 62,5 m)" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-fileli-dilatasyon-profili-25-mt-25-adet-625-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Sıva üstü, yatay ve düşey derzlerde kullanılan, 3 cm''e kadar olan deplasmanları tolere eden, yüksek alkali dayanımlı donatı filesi ile üretilen profildir.'
WHERE id = 51 AND slug IS NULL;

-- Dalmaçyalı Plastik Dübel 9,5cm 600 adet ← "Dalmaçyalı Subasman Profili 5cm 2,5 Mt ( 10 adet 25 m)" (skor: 42)
UPDATE accessories SET slug = 'dalmacyali-subasman-profili-5cm-25-mt-10-adet-25-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Isı yalıtım sisteminin alt kenarında düzgünlüğü sağlamak ve gerektiğinde dikey bitişi oluşturmak amacıyla kullanılan subasman profilidir.'
WHERE id = 5 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Yapıştırıcısı 25kg ← "Dalmaçyalı Isı Yalıtım Yapıştırıcısı" (skor: 85)
UPDATE accessories SET slug = 'dalmacyali-isi-yalitim-yapistiricisi', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Mineral esaslı yüzeylere, EPS veya taşyünü ısı yalıtım levhalarının yapıştırılmasında kullanılan, çimento esaslı yapıştırıcıdır. Yüksek polimer oranı ile güçlü yapışma performansı'
WHERE id = 1 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Yapıştırıcısı 25kg ← "Dalmaçyalı CarbonPower Isı Yalıtım Yapıştırıcı" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-carbonpower-isi-yalitim-yapistirici', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'High-Tech Carbon bağlayıcılar ile güçlendirilmiş, mineral esaslı yüzeylere EPS veya taşyünü ısı yalıtım levhalarının yapıştırılmasında kullanılan, çimento esaslı özel yapıştırıcıdır. Özel polimer bağlayıcılar sayesinde yüksek tutunma kuvveti (≥100 kPa)'
WHERE id = 1 AND slug IS NULL;

-- Dalmaçyalı Stonewool Taşyünü Sistem Yapıştırıcısı 25kg ← "Dalmaçyalı Stonewool Taşyünü Sistem Yapıştırıcısı" (skor: 85)
UPDATE accessories SET slug = 'dalmacyali-stonewool-tasyunu-sistem-yapistiricisi', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Özellikle taşyünü ısı yalıtım levhalarının, mineral esaslı yüzeylere yapıştırılmasında kullanılan, çimento esaslı özel yapıştırıcıdır. Yüksek ve homojen polimer oranı ile güçlü yapışma performansı'
WHERE id = 2 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Yapıştırıcısı 25kg ← "Dalmaçyalı Organik Isı Yalıtım Yapıştırıcısı" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-organik-isi-yalitim-yapistiricisi', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Ahşap, prefabrik ve mineral esaslı yüzeylere, EPS veya taşyünü ısı yalıtım levhalarının yapıştırılmasında kullanılan, akrilik esaslı yapıştırıcıdır. Kullanıma hazır'
WHERE id = 1 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Sıvası 25kg ← "Dalmaçyalı Isı Yalıtım Sıvası" (skor: 85)
UPDATE accessories SET slug = 'dalmacyali-isi-yalitim-sivasi', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'EPS veya taşyünü ısı yalıtım levhalarının üzerine perdah sıvası yapılmasında kullanılan, yapıştırıcı olarak da kullanılabilen, çimento esaslı, elyaf takviyeli sıvadır. Yüksek polimer oranı ile levhalara güçlü tutunma• Yüksek polimer oranı ile levhalara güçlü tutunma'
WHERE id = 3 AND slug IS NULL;

-- Dalmaçyalı Stonewool Taşyünü Sistem Sıvası 25kg ← "Dalmaçyalı Stonewool Taşyünü Sistem Sıvası" (skor: 85)
UPDATE accessories SET slug = 'dalmacyali-stonewool-tasyunu-sistem-sivasi', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Özellikle taşyünü ısı yalıtım levhalarının üzerine perdah sıvası yapılmasında kullanılan, yapıştırıcı olarak da kullanılabilen, çimento esaslı, elyaf takviyeli özel sıvadır. Yüksek ve homojen polimer oranı ile güçlü tutunma performansı'
WHERE id = 4 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Sıvası 25kg ← "Dalmaçyalı Carbonmax Isı Yalıtım Sistem Sıvası" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-carbonmax-isi-yalitim-sistem-sivasi', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yüksek darbe dayanımına sahip, EPS veya taşyünü ısı yalıtım levhalarının üzerine perdah sıvası yapılmasında kullanılan, çimento esaslı, High-Tech Carbon elyaf takviyeli özel sıvadır. İlgili standarttan 5 kat fazla darbe dayanımı (10 Joule)'
WHERE id = 3 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Sıvası 25kg ← "Dalmaçyalı Uni Isı Yalıtım Sıvası" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-uni-isi-yalitim-sivasi', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'EPS veya taşyünü ısı yalıtım levhalarının üzerine perdah sıvası yapılmasında kullanılan, kaplamasız direkt boya uygulaması yapılabilen, çimento esaslı, elyaf takviyeli, çok amaçlı özel sıvadır. Standart sıvalara göre daha kalın uygulama imkanı'
WHERE id = 3 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Sıvası 25kg ← "Dalmaçyalı Organik Isı Yalıtım Sistem Sıvası" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-organik-isi-yalitim-sistem-sivasi', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'EPS veya taşyünü ısı yalıtım levhalarının üzerine perdah sıvası yapılmasında ve kendini taşıyabilecek durumdaki boya ve sıvaların yüzey düzeltmelerinde kullanılan, akrilik esaslı, elyaf takviyeli sıvadır. Kullanıma hazır'
WHERE id = 3 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Dalmaçyalı Mineral Kaplama (Kum Doku 1,00mm)(YENİ)" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-mineral-kaplama-kum-doku-100mmyeni', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Kum tanesine benzeyen dekoratif görüntüsüyle yüzeyde homojen bir desen oluşturan, çimento esaslı, elyaf takviyeli, son kat yüzey kaplamasıdır. Isı yalıtım sistemlerinde ve boyalı eski yüzeylerin yenilenmesinde kullanıma uygun'
WHERE id = 15 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Dalmaçyalı Mineral kaplama (ince tane)" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-mineral-kaplama-ince-tane', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'İnce tane dokuda doğal görüntüsüyle yüzeyde homojen bir desen oluşturan, çimento esaslı, elyaf takviyeli, son kat yüzey kaplamasıdır. Isı yalıtım sistemlerinde ve boyalı eski yüzeylerin yenilenmesinde kullanıma uygun'
WHERE id = 15 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Dalmaçyalı Mineral kaplama ( tane)" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-mineral-kaplama-tane', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Tane dokuda doğal görüntüsüyle yüzeyde homojen bir desen oluşturan, çimento esaslı, elyaf takviyeli, son kat yüzey kaplamasıdır. Isı yalıtım sistemlerinde ve boyalı eski yüzeylerin yenilenmesinde kullanıma uygun'
WHERE id = 15 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Dalmaçyalı Mineral kaplama (çizgi)" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-mineral-kaplama-cizgi', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yüzeyde yatay veya dikey uygulamayla dekoratif çizgi deseni oluşturan, çimento esaslı, elyaf takviyeli, son kat yüzey kaplamasıdır. Isı yalıtım sistemlerinde ve boyalı eski yüzeylerin yenilenmesinde kullanıma uygun'
WHERE id = 15 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Dalmaçyalı Mineral kaplama (5,0mmKALIN ÇİZGİ DOKU)(YENİ)" (skor: 80)
UPDATE accessories SET slug = 'dalmacyali-mineral-kaplama-50mmkalin-cizgi-dokuyeni', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Yüzeyde yatay veya dikey uygulamayla kalın çizgi deseni oluşturan, çimento esaslı, elyaf takviyeli, son kat yüzey kaplamasıdır. Isı yalıtım sistemlerinde ve boyalı eski yüzeylerin yenilenmesinde kullanıma uygun'
WHERE id = 15 AND slug IS NULL;

-- Dalmaçyalı Taşyünü Dübeli Çelik Çivili 11,5cm 200 adet ← "Dalmaçyalı Tuğla Dübeli Çelik çivili 15,5 cm 200 adet" (skor: 60)
UPDATE accessories SET slug = 'dalmacyali-tugla-dubeli-celik-civili-155-cm-200-adet', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Tuğla yüzeyler üzerine taşyünü uygulamalarında yüksek tutunma sağlayan dübellerdir.'
WHERE id = 9 AND slug IS NULL;

-- Expert Yapıştırma Harcı 25kg ← "Expert Yapıştırma Harcı 25 KG" (skor: 70)
UPDATE accessories SET slug = 'expert-yapistirma-harci-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Yapıştırma Harcı, iç ve dış mekanlarda beton, sıva, tuğla, gazbeton panel vb. mineral esaslı yüzeylerde, polistiren esaslı ve taşyünü levhalar gibi ısı ve ses yalıtım malzemelerinin yapıştırılmasında kullanılan çimento esaslı özel yapıştırıcıdır.'
WHERE id = 16 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Yapıştırıcısı 25kg ← "Expert PROrganic Yapıştırıcı 25 KG" (skor: 80)
UPDATE accessories SET slug = 'expert-prorganic-yapistirici-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert PROrganic Isı Yalıtım Sistem Yapıştırıcısı, polistiren esaslı ve taşyünü levhalar gibi ısı ve ses yalıtım malzemelerinin ideal bir şekilde ahşap ve prefabrik yüzeylere güvenle yapıştırılmasında kullanılan, akrilik esaslı, üstün yapıştırma ve su geçirimsiz özelliklere sahip, kullanıma hazır ısı yalıtım yapıştırıcısıdır.'
WHERE id = 1 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Expert Dekoratif Mineral Kaplama İnce Tane 25 KG" (skor: 80)
UPDATE accessories SET slug = 'expert-dekoratif-mineral-kaplama-ince-tane-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Çimento esaslı, elyaf takviyeli, hafif, yüzeyde doğal bir doku oluşturan, son kat iç ve dış yüzey kaplamasıdır.'
WHERE id = 15 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Expert Dekoratif Mineral Kaplama Çizgi Doku 25 KG" (skor: 80)
UPDATE accessories SET slug = 'expert-dekoratif-mineral-kaplama-cizgi-doku-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Çimento esaslı, elyaf takviyeli, hafif, yüzeyde doğal bir doku oluşturan, son kat iç ve dış yüzey kaplamasıdır.'
WHERE id = 15 AND slug IS NULL;

-- Expert Dekoratif Mineral Kaplama İnce Tane 25kg ← "Expert PROrganic Dekoratif Kaplama 1,5 mm 25 KG" (skor: 53)
UPDATE accessories SET slug = 'expert-prorganic-dekoratif-kaplama-15-mm-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'İnce sıva, düzgün yapılmış kaba sıva, beton, gaz beton veya kendini taşıyabilen silikat ya da akrilik esaslı eski boyaların üzerine yenilemek amacıyla ya da polistiren esaslı ve taşyünü levhalar gibi ısı ve ses yalıtım malzemelerinin üzerine güvenle uygulanır.'
WHERE id = 28 AND slug IS NULL;

-- Dalmaçyalı Kaplama Astarı 25kg ← "Expert Kaplama Astarı 25 KG" (skor: 80)
UPDATE accessories SET slug = 'expert-kaplama-astari-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Kaplama Astarı yüksek aderans gücüne sahip, akrilik kopolimer emülsiyon esaslı, beyaz renkte özel bir astardır.'
WHERE id = 14 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Expert Premium Donatı Filesi S160 55 M2" (skor: 80)
UPDATE accessories SET slug = 'expert-premium-donati-filesi-s160-55-m2', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Expert Premium Donatı Filesi S160 4x4mm elek aralığında, yüksek alkali dayanımlı, çimento esaslı sıva uygulamalarında kullanılan, özel kaplamalı cam iplik dokuma filesidir.'
WHERE id = 51 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Expert Donatı Filesi F160 55 M2" (skor: 80)
UPDATE accessories SET slug = 'expert-donati-filesi-f160-55-m2', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Expert Premium Donatı Filesi S160 4x4mm elek aralığında, yüksek alkali dayanımlı, çimento esaslı sıva uygulamalarında kullanılan, özel kaplamalı cam iplik dokuma filesidir.'
WHERE id = 51 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Sıvası 25kg ← "Expert Organik Sıva Filesi S110 82,5 M2" (skor: 80)
UPDATE accessories SET slug = 'expert-organik-siva-filesi-s110-825-m2', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Expert Organik Donatı Filesi S110 4x4 elek aralığında, alkali dayanımlı, Expert ProAkrilik Isı Yalıtım Sıvası uygulamalarında kullanılan, özel kaplamalı cam iplik dokuma filesidir.'
WHERE id = 3 AND slug IS NULL;

-- 2.Kalite Donatı Filesi 50m² ← "Expert Fuga Filesi 50 M2 F70" (skor: 80)
UPDATE accessories SET slug = 'expert-fuga-filesi-50-m2-f70', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Expert Fuga Filesi F70 Alkali dayanımlı, fuga detayları için tasarlanmış dokuma yapısına sahip, özel kaplamalı cam iplik dokuma filesidir.'
WHERE id = 51 AND slug IS NULL;

-- Dalmaçyalı Fileli Köşe (PVC) 2,5m 50 adet 125m ← "Expert Fileli Köşe Profili (PVC) 2,5 m (50 adet 125 m)" (skor: 80)
UPDATE accessories SET slug = 'expert-fileli-kose-profili-pvc-25-m-50-adet-125-m', sales_mode = 'system_only', pricing_visibility_mode = 'hidden',
  catalog_description = 'Expert PVC Fileli Köşe Profili : 2,5 m uzunluğunda, PVC fileli köşe profilidir. Bina köşeleri, pencere, kapı kenarlarının olası mekanik hasarlara karşı korunması ve sıva katında düzgünlük sağlama amacıyla kullanılan profillerdir. Yüksek alkali dayanımlı donatı filesi ile imal edilmektedir.'
WHERE id = 13 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Sıvası 25kg ← "Expert Sıva Harcı 25 KG" (skor: 80)
UPDATE accessories SET slug = 'expert-siva-harci-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert Sıva Harcı, iç ve dış mekanlarda polistren esaslı ve taşyünü levhalar gibi ısı ve ses yalıtım malzemelerinin üzerine perdah sıvası yapılmasında kullanılan, aynı zamanda bu malzemelerin yapıştırılmasında da kullanılabilen, file uygulamasıyla yüzeyin mukavemetini arttıran, çimento esaslı, elyaf takviyeli özel bir sıvadır.'
WHERE id = 3 AND slug IS NULL;

-- Dalmaçyalı Isı Yalıtım Sıvası 25kg ← "Expert PROrganic Sıva 20 KG" (skor: 80)
UPDATE accessories SET slug = 'expert-prorganic-siva-20-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Expert PROrganic Isı Yalıtım Sistem Sıvası, Organo Silikat esaslı hibrit emisyonlu, karbon teknolojisine sahip, EPS ve taşyünü levhalar gibi ısı ve ses yalıtım malzemelerinin üzerine perdah sıvası yapılmasında ve kendini taşıyabilecek durumdaki boya ve sıvaların yüzey düzeltilmesinde kullanılabilen, akrilik esaslı, yüksek darbe dayanımı ve su geçirimsiz özelliklere sahip, kullanıma hazır, ya'
WHERE id = 3 AND slug IS NULL;

-- Dalmaçyalı Mineral Kaplama İnce Tane 25kg ← "Expert Dekoratif Mineral Kaplama Tane Doku 25 KG" (skor: 80)
UPDATE accessories SET slug = 'expert-dekoratif-mineral-kaplama-tane-doku-25-kg', sales_mode = 'single_or_quote', pricing_visibility_mode = 'quote_required',
  catalog_description = 'Çimento esaslı, elyaf takviyeli, hafif, yüzeyde doğal bir doku oluşturan, son kat iç ve dış yüzey kaplamasıdır.'
WHERE id = 15 AND slug IS NULL;


-- ─── EŞLEŞMEYENLERİ (manuel kontrol gerekir) ────────────────
-- UNMATCHED: "Fawori Karbonlu Isı Yalıtım Levhası" (eps-levhalar) — en iyi skor: 14 → Expert EPS Karbonlu
-- UNMATCHED: "Fawori Köşe Profili (alüminyum) 2,5 m (50 adet 125 m)" (profiller) — en iyi skor: 35 → Expert Fileli Köşe Profili (PVC) 2,5m 50 adet 125m
-- UNMATCHED: "Fawori Optimix pvc Denizlik Uzatma Profili 5cm ( 25 adet 75 m)" (profiller) — en iyi skor: 35 → Fawori Optimix Plastik Dübel 9,5cm 600 adet
-- UNMATCHED: "Fawori Optimix pvc Denizlik Uzatma Profili 8cm ( 20 adet 60 m)" (profiller) — en iyi skor: 35 → Fawori Optimix Fileli Köşe (PVC) 2,5m 50 adet 125m
-- UNMATCHED: "Optimix Isı Yalıtım Levhası Karbonlu" (eps-levhalar) — en iyi skor: 28 → Optimix Optimix Karbonlu
-- UNMATCHED: "Dalmaçyalı Aktif Silikonlu Isı Yalıtım Sistemi Boyası" (boyalar) — en iyi skor: 30 → Dalmaçyalı Isı Yalıtım Yapıştırıcısı 25kg
-- UNMATCHED: "Dalmaçyalı Anti-Moss Isı Yalıtım Sistemi Boyası" (boyalar) — en iyi skor: 30 → Dalmaçyalı Isı Yalıtım Yapıştırıcısı 25kg
-- UNMATCHED: "Dalmaçyalı Carbonfine Kaplama 2mm" (kaplamalar) — en iyi skor: 35 → Dalmaçyalı Kaplama Astarı 25kg
-- UNMATCHED: "Dalmaçyalı Organic Silikonlu Kaplama Tane Doku" (kaplamalar) — en iyi skor: 35 → Dalmaçyalı Mineral Kaplama İnce Tane 25kg
-- UNMATCHED: "Dalmaçyalı Organic Silikonlu Kaplama Çizgi Doku" (kaplamalar) — en iyi skor: 23 → Dalmaçyalı Kaplama Astarı 25kg
-- UNMATCHED: "Dalmaçyalı Aktif Silikonlu Grenli Dış Cephe kaplaması" (kaplamalar) — en iyi skor: 10 → Dalmaçyalı Isı Yalıtım Yapıştırıcısı 25kg
-- UNMATCHED: "Dalmaçyalı Magic Fine Kaplama 15 KG" (kaplamalar) — en iyi skor: 35 → Dalmaçyalı Kaplama Astarı 25kg
-- UNMATCHED: "Dalmaçyalı Magic Quartz Dış Cephe Kaplama" (kaplamalar) — en iyi skor: 23 → Dalmaçyalı Kaplama Astarı 25kg
-- UNMATCHED: "Dalmaçyalı Subasman Profili 6cm 2,5 Mt ( 10 adet 25 m)" (profiller) — en iyi skor: 28 → Dalmaçyalı Plastik Dübel 9,5cm 600 adet
-- UNMATCHED: "Dalmaçyalı Denizlik Uzatma Profili 5cm 3m (10 adet 30 m)" (profiller) — en iyi skor: 35 → Dalmaçyalı Plastik Dübel 9,5cm 600 adet
-- UNMATCHED: "Dalmaçyalı Denizlik Uzatma Profili 8cm 3m (10 adet 30 m)" (profiller) — en iyi skor: 23 → Dalmaçyalı Plastik Dübel 9,5cm 600 adet
-- UNMATCHED: "Dalmaçyalı Su Sızdırmazlık Bandı 18m 5 Adet(90Metre)" (yardimci-urunler) — en iyi skor: 23 → Dalmaçyalı Plastik Dübel 9,5cm 600 adet
-- UNMATCHED: "Dalmaçyalı Poliüretan Mastik K1 0,280 ml 12 ADET kartuş" (yardimci-urunler) — en iyi skor: 23 → Dalmaçyalı Plastik Dübel 9,5cm 600 adet
-- UNMATCHED: "Dalmaçyalı 5 cm Taşyünü Yangın Bariyeri" (tasyunu-levhalar) — en iyi skor: 18 → Dalmaçyalı SW035