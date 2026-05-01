-- ============================================================
-- WP'den ürün meta description import (skor bazlı eşleşme)
-- Tarih: 2026-05-01
-- Kapsam: meta_description boş olan satırlar yazılır;
--         dolu satırlar üzerine yazılmaz.
-- ============================================================

-- plates UPDATE: 0
-- accessories UPDATE: 9

-- ─── plates ─────────────────────────────────────────────────

-- ─── accessories ────────────────────────────────────────────
-- 2.Kalite Donatı Filesi 50m² ← "Optimix Donatı Filesi F160 50 m2" (skor: 80)
UPDATE accessories SET meta_description = 'Optimix Donatı Filesi 4x4 elek aralığında, alkali dayanımlı, özel kaplamalı cam iplik dokuma filesidir. Mekanik mukavemet' WHERE id = 51 AND (meta_description IS NULL OR meta_description = '');
-- Fawori Optimix PVC Fileli Fuga Profili 3*1,6cm 3 m ← "Fawori Optimix Pvc Fileli Fuga Profili 3*1,6cm 3 m (40 adet 120 m)" (skor: 90)
UPDATE accessories SET meta_description = 'İşçilik hatalarını önler. 1,6 cm derinlik ile 3 cm ve 5 cm olmak üzere iki farklı modeli mevcuttur. Ambalaj 3 cm’lik : 40 adet - 120 m 5 cm' WHERE id = 147 AND (meta_description IS NULL OR meta_description = '');
-- Fawori Optimix PVC Fileli Fuga Profili 5*1,6cm 3 m ← "Fawori Optimix Pvc Fileli Fuga Profili 5*1,6cm 3 m (40 adet 120 m)" (skor: 90)
UPDATE accessories SET meta_description = 'Isı yalıtım levhaları üzerinde açılmış olan fuga bölümlerinin geçişlerinde kullanılır. 3 m uzunluğunda PVC’den imal edilmiş fuga profillerdir.' WHERE id = 148 AND (meta_description IS NULL OR meta_description = '');
-- Fawori Optimix pvc Denizlik Uzatma Profili 5cm ← "Fawori Optimix pvc Denizlik Uzatma Profili 5cm ( 25 adet 75 m)" (skor: 90)
UPDATE accessories SET meta_description = 'Isı yalıtım uygulamalarında mevcut pencere denizliklerinin yeterli olmadığı yerlerde bu kısımları uzatarak yalıtım detaylarının uygulanabilmesine imkan veren…' WHERE id = 149 AND (meta_description IS NULL OR meta_description = '');
-- Fawori Optimix pvc Denizlik Uzatma Profili 8cm ← "Fawori Optimix pvc Denizlik Uzatma Profili 8cm ( 20 adet 60 m)" (skor: 90)
UPDATE accessories SET meta_description = 'Fawori pvc Denizlik Uzatma Profili Isı yalıtım uygulamalarında mevcut pencere denizliklerinin uygulanabilmesine imkan veren profillerdir.' WHERE id = 150 AND (meta_description IS NULL OR meta_description = '');
-- Dalmaçyalı Standart Dübel 17,5cm Plastik Çivili ← "Fawori Taşyünü dübelİ çelik çivili 11,5 cm 200 adet" (skor: 80)
UPDATE accessories SET meta_description = 'Dış cephe ısı yalıtım sistemlerinde, taşyünü levha uygulamalarında 9 cm’lik geniş kafa çapıyla basma alanını genişleterek mükemmel bir tutunma sağlar.' WHERE id = 107 AND (meta_description IS NULL OR meta_description = '');
-- Dalmaçyalı Kaplama Astarı 25kg ← "Dalmaçyalı Silikonlu Dış Cephe Boya Astarı" (skor: 80)
UPDATE accessories SET meta_description = 'Silikonlu Dış Cephe Boya Astarı, Silikon emülsiyon esaslı, su bazlı dış cephe boya astarıdır. Boya ile yüzey arasında bağlayıcı köprü görevi' WHERE id = 14 AND (meta_description IS NULL OR meta_description = '');
-- Dalmaçyalı Magic Fine Kaplama 15 KG ← "Dalmaçyalı Magic Fine Kaplama 15 KG" (skor: 100)
UPDATE accessories SET meta_description = 'Desen verilmeye uygun yapısı ile yüzeyde farklı dekoratif doku alternatifleri oluşturan, çimento esaslı, elyaf takviyeli, son kat özel efektli yüzey…' WHERE id = 105 AND (meta_description IS NULL OR meta_description = '');
-- Dalmaçyalı Magic Quartz ← "Dalmaçyalı Magic Quartz Dış Cephe Kaplama" (skor: 90)
UPDATE accessories SET meta_description = '%%title%% Parlak ve hafif olması sayesinde her tür boya üstüne püskürtme yöntemiyle uygulanabilen, özel efektli son kat malzemesidir.' WHERE id = 106 AND (meta_description IS NULL OR meta_description = '');
