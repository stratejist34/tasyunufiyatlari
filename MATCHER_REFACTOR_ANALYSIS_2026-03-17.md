# Matcher Refactor Analysis

Tarih: 2026-03-17

Kapsam:
- Kaynak dosyalar: `2026 ŞUBAT EPS TOZ...xlsx`, `Toz Grubu Fiyatları.xlsx`, `TAŞYÜNÜ LEVHA KDV HARİÇ Fiyatları.xlsx`, `TAŞYÜNÜ LEVHA KDV HARİÇ TIR...xlsx`
- Canlı DB context: `plates`, `plate_prices`, `accessories`, `brands`, `material_types`
- Çalıştırılan akış: `parseExcelBuffer -> normalizeImportRow -> matchImportRow`

## Executive Summary

- Toplam analiz edilen satır: `468`
- `matched`: `66`
- `ambiguous`: `128`
- `variant_missing`: `249`
- `new_product`: `25`
- Güçlü bulgu: `variant_missing` satırlarının `224 / 249` adedi sahte. Neden: matcher `plate_prices.thickness` alanını mm sanıyor, DB ise cm tutuyor.
- Güçlü bulgu: accessory tarafında similarity generic class'a çöküyor. Varyant tokenları (`CarbonPower`, `Carbonmax`, `Organik`, `Tane Doku`, `Fileli Köşe Profili`) karar mekanizmasında korunmuyor.
- Güçlü bulgu: `productType=accessory` içinde dübel/profil/kaplama/file aynı scorer ile yarışıyor. Rule-first sınıf ayrımı yok.

## Kategori Özeti

### Ambiguous kümeleri
- `dubel_size`: `48`
- `kaplama_variant`: `24`
- `profile_measure`: `20`
- `plate_family`: `18`
- `mesh_family`: `11`
- `pvc_profile`: `4`
- `adhesive_family`: `2`
- `render_family`: `1`

### Variant missing kümeleri
- Sahte `variant_missing` (`thickness cm/mm bug`): `224`
- Gerçek `variant_missing` (`11-15 cm DB'de gerçekten yok`): `25`

### Güçlü yanlış eşleşme paterni
- Generic accessory collapse: `CarbonPower -> Yapıştırıcı`, `Carbonmax -> Sıva`, `Organic Kaplama -> Mineral Kaplama`
- Brand leak: `Expert Fileli Köşe Profili -> TEKNO Fileli Köşe`
- Variant leak: `Tane Doku -> İnce Tane`

## Yanlış Eşleşen 30 Satır

Not:
- `S` = güçlü false positive
- `M` = medium-risk; mevcut sistem `matched` dönüyor ama rule-first yapıda generic eşleşme engellenmeli
- Güçlü false positive sayısı veri setinde `18`; 30 örnek istenen havuzu tamamlamak için `12` medium-risk satır eklendi

1. `S` `2026-ŞUBAT` row `30`: `Dalmaçyalı CarbonPower Isı Yalıtım Yapıştırıcı` -> `Dalmaçyalı Yapıştırıcı`; neden: `carbonpower` varyantı generic adhesive'e düştü
2. `S` `2026-ŞUBAT` row `31`: `Dalmaçyalı Organik Isı Yalıtım Yapıştırıcısı` -> `Dalmaçyalı Yapıştırıcı`; neden: `organik` varyantı kayboldu
3. `S` `2026-ŞUBAT` row `34`: `Dalmaçyalı Carbonmax Isı Yalıtım Sistem Sıvası` -> `Dalmaçyalı Sıva`; neden: `carbonmax` varyantı kayboldu
4. `S` `2026-ŞUBAT` row `35`: `Dalmaçyalı Uni Isı Yalıtım Sıvası` -> `Dalmaçyalı Sıva`; neden: `uni` varyantı kayboldu
5. `S` `2026-ŞUBAT` row `36`: `Dalmaçyalı Organik Isı Yalıtım Sistem Sıvası` -> `Dalmaçyalı Sıva`; neden: `organik` varyantı kayboldu
6. `S` `2026-ŞUBAT` row `39`: `Dalmaçyalı Mineral kaplama (Tane Doku 2mm)` -> `Dalmaçyalı Mineral Kaplama İnce Tane`; neden: texture varyantı kayboldu
7. `S` `2026-ŞUBAT` row `44`: `Dalmaçyalı Organic Silikonlu Kaplama (İnce Tane)` -> `Dalmaçyalı Mineral Kaplama İnce Tane`; neden: family/variant collapse
8. `S` `2026-ŞUBAT` row `125`: `Expert Dekoratif Mineral Kaplama (Tane Doku 2mm)` -> `Expert Mineral Kaplama İnce Tane`; neden: texture varyantı kayboldu
9. `S` `2026-ŞUBAT` row `129`: `Expert Fileli Köşe Profili (PVC) 2,5 m` -> `TEKNO Fileli Köşe`; neden: brand mismatch
10. `S` `2026-ŞUBAT` row `160`: `Fawori Optimix Mineral Kaplama (Tane Doku 2mm)` -> `Optimix Mineral Kaplama İnce Tane`; neden: texture varyantı kayboldu
11. `S` `Toz Grubu` row `20`: `Dalmaçyalı CarbonPower Isı Yalıtım Yapıştırıcı` -> `Dalmaçyalı Yapıştırıcı`; neden: `carbonpower` varyantı kayboldu
12. `S` `Toz Grubu` row `21`: `Dalmaçyalı Organik Isı Yalıtım Yapıştırıcısı` -> `Dalmaçyalı Yapıştırıcı`; neden: `organik` varyantı kayboldu
13. `S` `Toz Grubu` row `24`: `Dalmaçyalı Carbonmax Isı Yalıtım Sistem Sıvası` -> `Dalmaçyalı Sıva`; neden: `carbonmax` varyantı kayboldu
14. `S` `Toz Grubu` row `25`: `Dalmaçyalı Uni Isı Yalıtım Sıvası` -> `Dalmaçyalı Sıva`; neden: `uni` varyantı kayboldu
15. `S` `Toz Grubu` row `26`: `Dalmaçyalı Organik Isı Yalıtım Sistem Sıvası` -> `Dalmaçyalı Sıva`; neden: `organik` varyantı kayboldu
16. `S` `Toz Grubu` row `29`: `Dalmaçyalı Mineral kaplama (Tane Doku 2mm)` -> `Dalmaçyalı Mineral Kaplama İnce Tane`; neden: texture varyantı kayboldu
17. `S` `Toz Grubu` row `34`: `Dalmaçyalı Organic Silikonlu Kaplama İnce Tane` -> `Dalmaçyalı Mineral Kaplama İnce Tane`; neden: family/variant collapse
18. `S` `Toz Grubu` row `100`: `Expert Dekoratif Mineral Kaplama Tane Doku 25 KG` -> `Expert Mineral Kaplama İnce Tane`; neden: texture varyantı kayboldu
19. `M` `2026-ŞUBAT` row `28`: `Dalmaçyalı Isı Yalıtım Yapıştırıcısı` -> `Dalmaçyalı Yapıştırıcı`; neden: class eşleşmesi doğru ama family canonical yok
20. `M` `2026-ŞUBAT` row `32`: `Dalmaçyalı Isı Yalıtım Sıvası` -> `Dalmaçyalı Sıva`; neden: generic short_name ile match
21. `M` `2026-ŞUBAT` row `38`: `Dalmaçyalı Mineral kaplama (İnce Tane 1,5mm)` -> `Dalmaçyalı Mineral Kaplama İnce Tane`; neden: ölçü `1,5mm` parse edilmiyor
22. `M` `2026-ŞUBAT` row `47`: `Dalmaçyalı Kaplama Astarı` -> `Dalmaçyalı Astar`; neden: generic family scorer
23. `M` `2026-ŞUBAT` row `50`: `Dalmaçyalı Standart Dübel 9,5cm Plastik Çivili` -> `Dalmaçyalı Plastik Dübel 9.5`; neden: `standart` family canonical yok
24. `M` `2026-ŞUBAT` row `51`: `Dalmaçyalı Standart Dübel 11,5cm Plastik Çivili` -> `Dalmaçyalı Plastik Dübel 11.5`; neden: `standart` family canonical yok
25. `M` `2026-ŞUBAT` row `52`: `Dalmaçyalı Standart Dübel 13,5cm Plastik Çivili` -> `Dalmaçyalı Plastik Dübel 13.5`; neden: `standart` family canonical yok
26. `M` `2026-ŞUBAT` row `53`: `Dalmaçyalı Standart Dübel 15,5cm Plastik Çivili` -> `Dalmaçyalı Plastik Dübel 15.5`; neden: `standart` family canonical yok
27. `M` `Toz Grubu` row `18`: `Dalmaçyalı Isı Yalıtım Yapıştırıcısı` -> `Dalmaçyalı Yapıştırıcı`; neden: generic short_name eşleşmesi
28. `M` `Toz Grubu` row `22`: `Dalmaçyalı Isı Yalıtım Sıvası` -> `Dalmaçyalı Sıva`; neden: generic short_name eşleşmesi
29. `M` `Toz Grubu` row `37`: `Dalmaçyalı Kaplama Astarı` -> `Dalmaçyalı Astar`; neden: generic family scorer
30. `M` `Toz Grubu` row `40`: `Dalmaçyalı Standart Dübel 9,5cm plas.çivili 600 adet` -> `Dalmaçyalı Plastik Dübel 9.5`; neden: synonym dictionary yok

### Yanlış eşleşme kök neden grupları
- `canonical_variant_missing`: `14` satır
- `kaplama_texture_not_parsed`: `4` satır
- `brand_mismatch_due_similarity`: `1` satır
- `generic_family_match_without_dictionary`: `11` satır

## Belirsiz Kalan 30 Satır

1. `2026-ŞUBAT` row `37`: `Dalmaçyalı Mineral Kaplama (Kum Doku 1,00mm)`; neden: `kaplama_variant`
2. `2026-ŞUBAT` row `40`: `Dalmaçyalı Mineral kaplama (Çizgi Doku 3mm)`; neden: `kaplama_variant`
3. `2026-ŞUBAT` row `41`: `Dalmaçyalı Mineral kaplama (Kalın Çizgi Doku 5mm)`; neden: `kaplama_variant`
4. `2026-ŞUBAT` row `42`: `Dalmaçyalı Stonewool Sistem Mineral Kaplama (1,5 mm)`; neden: `kaplama_variant`
5. `2026-ŞUBAT` row `43`: `Dalmaçyalı Carbonfine Kaplama (Tane Doku 2mm)`; neden: `kaplama_variant`
6. `2026-ŞUBAT` row `45`: `Dalmaçyalı Organic Silikonlu Kaplama (Tane Doku)`; neden: `kaplama_variant`
7. `2026-ŞUBAT` row `46`: `Dalmaçyalı Organic Silikonlu Kaplama (Çizgi Doku)`; neden: `kaplama_variant`
8. `2026-ŞUBAT` row `48`: `Dalmaçyalı Magic Fine Kaplama 15 KG`; neden: `kaplama_variant`
9. `2026-ŞUBAT` row `58`: `Dalmaçyalı Beton Dübeli çelik çivili 11,5 cm`; neden: `dubel_size`
10. `2026-ŞUBAT` row `59`: `Dalmaçyalı Beton Dübeli çelik çivili 13,5 cm`; neden: `dubel_size`
11. `2026-ŞUBAT` row `60`: `Dalmaçyalı Beton Dübeli çelik çivili 15,5 cm`; neden: `dubel_size`
12. `2026-ŞUBAT` row `63`: `Dalmaçyalı Taşyünü dübeli çelik çivili 11,5 cm`; neden: `dubel_size`
13. `2026-ŞUBAT` row `64`: `Dalmaçyalı Taşyünü dübeli çelik çivili 13,5 cm`; neden: `dubel_size`
14. `2026-ŞUBAT` row `65`: `Dalmaçyalı Taşyünü dübeli çelik çivili 15,5 cm`; neden: `dubel_size`
15. `2026-ŞUBAT` row `66`: `Dalmaçyalı Tuğla Dübeli Plastik çivili 13,5 cm`; neden: `dubel_size`
16. `2026-ŞUBAT` row `67`: `Dalmaçyalı Tuğla Dübeli Plastik çivili 15,5 cm`; neden: `dubel_size`
17. `2026-ŞUBAT` row `68`: `Dalmaçyalı Tuğla Dübeli Çelik çivili 13,5 cm`; neden: `dubel_size`
18. `2026-ŞUBAT` row `69`: `Dalmaçyalı Tuğla Dübeli Çelik çivili 15,5 cm`; neden: `dubel_size`
19. `2026-ŞUBAT` row `72`: `Dalmaçyalı Donatı Filesi S160`; neden: `mesh_family`
20. `2026-ŞUBAT` row `73`: `Dalmaçyalı Organik Donatı Filesi S110`; neden: `mesh_family`
21. `2026-ŞUBAT` row `74`: `Dalmaçyalı Fuga Donatı Filesi S70`; neden: `mesh_family`
22. `2026-ŞUBAT` row `75`: `Dalmaçyalı Panzer Donatı File S340`; neden: `mesh_family`
23. `2026-ŞUBAT` row `76`: `Dalmaçyalı Fileli Köşe (PVC) 2,5 Mt`; neden: `pvc_profile`
24. `2026-ŞUBAT` row `77`: `Dalmaçyalı Fileli Damlalık Profili (PVC) 2,5 Mt`; neden: `profile_measure`
25. `2026-ŞUBAT` row `78`: `Dalmaçyalı Fileli Fuga Profili 3*1,6cm 3 Mt`; neden: `profile_measure`
26. `2026-ŞUBAT` row `79`: `Dalmaçyalı Fileli Fuga Profili 5*1,6cm 3 Mt`; neden: `profile_measure`
27. `2026-ŞUBAT` row `80`: `Dalmaçyalı Fileli Dilatasyon profili 2,5 Mt`; neden: `profile_measure`
28. `2026-ŞUBAT` row `83`: `Dalmaçyalı Pvc Denizlik Uzatma Profili 5cm 3m`; neden: `profile_measure`
29. `2026-ŞUBAT` row `84`: `Dalmaçyalı Pvc Denizlik Uzatma Profili 8cm 3m`; neden: `profile_measure`
30. `2026-ŞUBAT` row `126`: `Expert Dekoratif Mineral Kaplama (Çizgi Doku 3mm)`; neden: `kaplama_variant`

### Ambiguous kök neden grupları
- `dowel_measurement_only`: dübel family aynı, ayırıcı sinyal sadece uzunluk ve çivi tipi
- `profile_dimension_only`: profile family aynı, ayırıcı sinyal kesit ölçüsü ve boy
- `coating_texture_variant`: kaplama family aynı, ayırıcı sinyal texture/tane/doku
- `mesh_subfamily_missing`: `S160/S110/S70/S340` ayrı canonical değil

## Variant Missing 30 Satır

Not:
- İlk `25` satır gerçek `variant_missing`
- Sonraki `5` satır sahte `variant_missing` örneği; aynı thickness DB'de var ama matcher cm/mm yüzünden kaçırıyor

1. `2026-ŞUBAT` row `9`: `Dalmaçyalı İdeal Carbon 11 cm levha`; DB thickness: `2..10`
2. `2026-ŞUBAT` row `10`: `Dalmaçyalı İdeal Carbon 12 cm levha`; DB thickness: `2..10`
3. `2026-ŞUBAT` row `11`: `Dalmaçyalı İdeal Carbon 13 cm levha`; DB thickness: `2..10`
4. `2026-ŞUBAT` row `12`: `Dalmaçyalı İdeal Carbon 14 cm levha`; DB thickness: `2..10`
5. `2026-ŞUBAT` row `13`: `Dalmaçyalı İdeal Carbon 15 cm levha`; DB thickness: `2..10`
6. `2026-ŞUBAT` row `23`: `Dalmaçyalı Double Carbon 11 cm levha`; DB thickness: `2..10`
7. `2026-ŞUBAT` row `24`: `Dalmaçyalı Double Carbon 12 cm levha`; DB thickness: `2..10`
8. `2026-ŞUBAT` row `25`: `Dalmaçyalı Double Carbon 13 cm levha`; DB thickness: `2..10`
9. `2026-ŞUBAT` row `26`: `Dalmaçyalı Double Carbon 14 cm levha`; DB thickness: `2..10`
10. `2026-ŞUBAT` row `27`: `Dalmaçyalı Double Carbon 15 cm levha`; DB thickness: `2..10`
11. `2026-ŞUBAT` row `94`: `Expert EPS Karbonlu 11cm`; DB thickness: `2..10`
12. `2026-ŞUBAT` row `95`: `Expert EPS Karbonlu 12cm`; DB thickness: `2..10`
13. `2026-ŞUBAT` row `96`: `Expert EPS Karbonlu 13cm`; DB thickness: `2..10`
14. `2026-ŞUBAT` row `97`: `Expert EPS Karbonlu 14cm`; DB thickness: `2..10`
15. `2026-ŞUBAT` row `98`: `Expert EPS Karbonlu 15cm`; DB thickness: `2..10`
16. `2026-ŞUBAT` row `108`: `Expert EPS (Beyaz) 11cm`; DB thickness: `2..10`
17. `2026-ŞUBAT` row `109`: `Expert EPS (Beyaz) 12cm`; DB thickness: `2..10`
18. `2026-ŞUBAT` row `110`: `Expert EPS (Beyaz) 13cm`; DB thickness: `2..10`
19. `2026-ŞUBAT` row `111`: `Expert EPS (Beyaz) 14cm`; DB thickness: `2..10`
20. `2026-ŞUBAT` row `112`: `Expert EPS (Beyaz) 15cm`; DB thickness: `2..10`
21. `2026-ŞUBAT` row `152`: `Fawori Optimix Karbonlu 11 cm`; DB thickness: `2..10`
22. `2026-ŞUBAT` row `153`: `Fawori Optimix Karbonlu 12 cm`; DB thickness: `2..10`
23. `2026-ŞUBAT` row `154`: `Fawori Optimix Karbonlu 13 cm`; DB thickness: `2..10`
24. `2026-ŞUBAT` row `155`: `Fawori Optimix Karbonlu 14 cm`; DB thickness: `2..10`
25. `2026-ŞUBAT` row `156`: `Fawori Optimix Karbonlu 15 cm`; DB thickness: `2..10`
26. `2026-ŞUBAT` row `0`: `Dalmaçyalı İdeal Carbon 2 cm levha`; DB'de `2` var, matcher kaçırıyor
27. `2026-ŞUBAT` row `1`: `Dalmaçyalı İdeal Carbon 3 cm levha`; DB'de `3` var, matcher kaçırıyor
28. `2026-ŞUBAT` row `14`: `Dalmaçyalı Double Carbon 2 cm levha`; DB'de `2` var, matcher kaçırıyor
29. `TAŞYÜNÜ Fiyatları` row `8`: `Dalmaçyalı Stonewool CS60 ... 5cm`; DB'de `5` var, matcher kaçırıyor
30. `TAŞYÜNÜ Fiyatları` row `19`: `Expert Premium Taşyünü ... 5 cm`; DB'de `5` var, matcher kaçırıyor

### Variant missing kök neden grupları
- `thickness_unit_bug`: `224` satır
- `real_out_of_range_thickness`: `25` satır

## Patch Plan

### 1. Yeni canonical fields

`NormalizedImportRow` içine doğrudan canonical alanlar eklenecek:
- `brandCanonical`
- `productClass`
- `familyCanonical`
- `variantCanonical`
- `materialType`
- `thicknessCm`
- `unit`
- `unitContent`

Ek parse meta:
- `measurement`: dübel/profil için `lengthCm`, `profileWidthCm`, `profileHeightCm`, `linearLengthM`, `sizeToken`
- `canonicalWarnings`: alias/variant parse fallback notları

Önerilen `productClass` değerleri:
- `eps_plate`
- `tasyunu_plate`
- `adhesive`
- `render`
- `mesh`
- `corner_profile`
- `fuga_profile`
- `dowel`
- `pvc_profile`
- `coating`
- `primer`
- `unknown`

### 2. Alias map yapısı

Yeni dosya:
- `lib/importAliasDictionary.ts`

Önerilen yapı:
- `brandAliases`
- `familyAliases`
- `variantAliases`
- `productClassRules`
- `materialAliases`

Minimum alias kapsamı:
- `Fawori Optimix -> Optimix`
- `Dalmaçyalı / Dalmacyali -> dalmacyali`
- `Taşyünü / Taş yünü / Tasyunu -> tasyunu`
- `Ideal Carbon`
- `Double Carbon`
- `EPS Beyaz`
- `035 EPS`
- `Yapıştırıcı / Yapıştırma Harcı`
- `Sıva / Sıva Harcı`
- `Donatı Filesi`
- `Fileli Köşe`
- `Fuga Profili`
- `Dübel`
- `PVC profil` ürünleri

### 3. Canonical parser katmanı

Yeni dosya:
- `lib/importCanonicalParser.ts`

Akış:
- `normalizeText` -> alias replacement -> class rule detection -> measurement parse -> canonical field output

Önemli kurallar:
- Plate dışındaki class'larda `thicknessCm` matcher için kullanılmayacak
- Accessory class'larında `materialType=unknown` fail sebebi olmayacak
- Dübel/profil için thickness yerine `measurement` parse edilecek
- Kaplama/file/dübel/profil ayrımı similarity ile değil class rule ile yapılacak

### 4. Matcher dispatch yapısı

`lib/importMatcher.ts` parçalanacak:
- `lib/importMatchers/matchEpsPlateRow.ts`
- `lib/importMatchers/matchTasyunuPlateRow.ts`
- `lib/importMatchers/matchAccessoryRow.ts`
- `lib/importMatchers/matchFastenerProfileRow.ts`
- `lib/importMatchers/index.ts`

Dispatch sırası:
1. `canonical parser` `productClass` üretir
2. `productClass` -> uygun matcher
3. Matcher önce dictionary/canonical equality arar
4. Similarity sadece tie-breaker olur

Matcher bazlı kural:
- `matchEpsPlateRow`: `brandCanonical + familyCanonical + thicknessCm`
- `matchTasyunuPlateRow`: `brandCanonical + familyCanonical + thicknessCm`
- `matchAccessoryRow`: `brandCanonical + productClass + familyCanonical + variantCanonical`
- `matchFastenerProfileRow`: `brandCanonical + productClass + familyCanonical + measurement.sizeToken`

### 5. Hangi dosyada ne değişecek

- `lib/importTypes.ts`
  - canonical alanlar ve `productClass` enum eklenecek
  - `MatchCandidate.matchMethod` rule-first yöntemleriyle genişletilecek

- `lib/importNormalizer.ts`
  - mevcut detection logic sadeleştirilecek
  - canonical parser çağrısı burada yapılacak veya burası ince wrapper olacak
  - accessory için `thicknessCm` nullification devam edecek ama `measurement` korunacak

- `lib/importMatcher.ts`
  - monolith kaldırılacak
  - sadece ortak helper ve dispatcher kalacak
  - `plate_prices.thickness` cm olarak eşlenecek

- `app/api/import/route.ts`
  - insert edilen `product_type/material_type/thickness_cm` yanında canonical debug alanları response içinde döndürülecek
  - mümkünse staging insert tarafında warnings daha açıklayıcı yazılacak

- `components/admin/ImportPreview.tsx`
  - canonical debug kolonları veya expandable debug blok eklenecek
  - `productClass`, `familyCanonical`, `variantCanonical` review UI'da görünmeli

- Yeni dosyalar
  - `lib/importAliasDictionary.ts`
  - `lib/importCanonicalParser.ts`
  - `lib/importMatchers/*`

### 6. Öncelik sırası

1. `plate_prices.thickness` cm bug fix
2. canonical parser + alias dictionary
3. matcher split + dispatch
4. fastener/profile measurement parser
5. admin preview debug alanları

### 7. Beklenen davranış değişimi

- Similarity skoru ana karar mekanizması olmaktan çıkacak
- `variant_missing` sayısı ilk adımda `249 -> yaklaşık 25`
- `ambiguous` içinde dübel/profil/kaplama kümeleri rule parse ile ciddi düşecek
- Generic accessory false positive'leri `matched` yerine `ambiguous` veya doğru class match'e dönecek
