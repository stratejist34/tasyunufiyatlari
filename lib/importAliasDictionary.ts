import type { ProductClass } from './importTypes';

export interface AliasRule {
    canonical: string;
    patterns: string[];
}

export const BRAND_ALIAS_RULES: AliasRule[] = [
    // 'fawori optimix' önce: 'fawori' tek başına eşleşmesin
    { canonical: 'optimix',   patterns: ['fawori optimix', 'fawori  optimix', 'optimix'] },
    { canonical: 'fawori',    patterns: ['fawori'] },
    { canonical: 'dalmacyali',patterns: ['dalmacyali', 'dalmacyal', 'dalmac', 'stonewool sistem'] },
    { canonical: 'expert',    patterns: ['expert'] },
    { canonical: 'tekno',     patterns: ['tekno'] },
    // DB'de tanımlı ama daha önce alias'sız kalan markalar:
    { canonical: 'kaspor',    patterns: ['kaspor'] },
    { canonical: 'oem',       patterns: ['oem', 'ekonomik', '2.kalite', '2. kalite'] },
];

export const MATERIAL_ALIAS_RULES: AliasRule[] = [
    // Taşyünü: Türkçe varyantlar normalize ile zaten çözülüyor ('ş'→'s', 'ü'→'u')
    { canonical: 'tasyunu', patterns: ['tasyunu', 'tas yunu', 'stonewool', 'mineral yun', 'rockwool'] },
    { canonical: 'eps',     patterns: ['eps', '035 eps', 'eps 035', 'beyaz eps', 'karbonlu', 'carbon', 'isi yalitim levhasi'] },
];

export const FAMILY_ALIAS_RULES: AliasRule[] = [
    // ── Plate families ──────────────────────────────────────────────────────
    { canonical: 'ideal_carbon',     patterns: ['ideal carbon'] },
    { canonical: 'double_carbon',    patterns: ['double carbon'] },
    { canonical: 'eps_035',          patterns: ['035 eps', 'eps 035', 'eps 035 beyaz', '20-22kg/m3', '20 22kg/m3'] },
    { canonical: 'eps_beyaz',        patterns: ['eps beyaz', 'eps beyaz isi yalitim levhasi', 'beyaz eps'] },
    { canonical: 'eps_karbonlu',     patterns: ['eps karbonlu', 'karbonlu isi yalitim levhasi', 'karbonlu levha'] },
    // 'optimix isi yalitim levhasi karbonlu' → "Fawori Optimix Isı Yalıtım Levhası Karbonlu"
    // gibi uzun formatlarda 'optimix' ve 'karbonlu' arasına 'isi yalitim levhasi' girince
    // contiguous substring match başarısız oluyor. Bu pattern ek güvence sağlar.
    { canonical: 'optimix_karbonlu', patterns: [
        'optimix karbonlu',
        'fawori optimix karbonlu',
        'optimix isi yalitim levhasi karbonlu',
    ] },
    { canonical: 'optimix_beyaz', patterns: [
        'optimix beyaz',
        'fawori optimix beyaz',
        'optimix isi yalitim levhasi beyaz',
    ] },
    { canonical: 'sw035',            patterns: ['sw035'] },
    { canonical: 'cs60',             patterns: ['cs60'] },
    { canonical: 'hd150',            patterns: ['hd150'] },
    { canonical: 'ld125',            patterns: ['ld125'] },
    { canonical: 'vf80',             patterns: ['vf80'] },
    { canonical: 'rf150',            patterns: ['rf150'] },
    { canonical: 'pw50',             patterns: ['pw50'] },
    { canonical: 'tr7_5',            patterns: ['tr7.5', 'tr 7.5'] },
    { canonical: 'yangin_bariyeri',  patterns: [
        'yangin bariyeri',
        'tas yunu yangin bariyeri',
        'tasyunu yangin bariyeri',
        'stonewool yangin bariyeri',
    ] },
    // 'premium' Expert levhasına özgü; genel bir kelime olduğundan en sona
    { canonical: 'premium',          patterns: ['premium tasyunu', 'expert premium', 'premium'] },

    // ── Accessory families ──────────────────────────────────────────────────
    // Yapıştırıcı: Dalmaçyalı Stonewool Sistem Yapıştırıcısı da buraya girmeli
    { canonical: 'yapistirici', patterns: [
        'yapistirici', 'yapistirma harci', 'isi yalitim yapistiricisi',
        'stonewool sistem yapistiricisi', 'stonewool yapistiricisi',
        'sistem yapistiricisi',
    ]},
    // Sıva: Dalmaçyalı Stonewool Sistem Sıvası da buraya girmeli
    { canonical: 'siva', patterns: [
        'siva', 'siva harci', 'isi yalitim sivasi', 'isi yalitim sistem sivasi',
        'stonewool sistem sivasi', 'stonewool sivasi', 'sistem sivasi',
    ]},
    // Köşe profili — 'fileli' içeren tüm köşe ürünlerini yakala
    { canonical: 'fileli_kose', patterns: [
        'fileli kose profili', 'fileli kose', 'kose profili', 'kose bandi',
    ]},
    // Donatı filesi: mesh class ile eşleşen her şey
    { canonical: 'donati_filesi', patterns: [
        'donati filesi', 'donati file', 'filesi', 'file s', 'file f',
        'f160', 's160', 's110', 's70', 's340',
        // 'file' tek başına en sona: geniş match — köşe/profil pattern'larının önüne geçmesin
        'file',
    ]},
    { canonical: 'fuga_profili',  patterns: ['fuga profili', 'fuga profil', 'fuga'] },
    { canonical: 'dubel',         patterns: [
        'dubel', 'dubeli', 'beton dubeli', 'tugla dubeli', 'standart dubel',
        'tasyunu dubeli', 'plastik civili dubel', 'celik civili dubel',
    ]},
    // PVC/Denizlik/Dilatasyon — 'profil' tek başına son sıraya
    { canonical: 'pvc_profil', patterns: [
        'pvc profil', 'damlalik profili', 'denizlik uzatma profili',
        'subasman profili', 'dilatasyon profili', 'denizlik profili',
        'baslangic profili', 'bitis profili',
        'profil',   // geniş fallback — daha spesifik pattern'lar önce kontrol edildi
    ]},
    // Astar: 'kaplama astari' hem 'kaplama' hem 'astar' içeriyor — kaplama'dan ÖNCE gelmeli.
    // Aksi hâlde findFamilyCanonicalInText 'kaplama' geniş pattern'ına takılır.
    { canonical: 'astar', patterns: ['kaplama astari', 'astar'] },
    // Kaplama: Magic/Organic/Quartz sonraki satırlarda variantCanonical ile ayrıştırılır
    { canonical: 'kaplama', patterns: [
        'mineral kaplama', 'dekoratif mineral kaplama', 'silikonlu kaplama',
        'ince tane kaplama', 'tane doku kaplama', 'cizgi doku kaplama',
        'magic fine', 'magic quartz', 'magic organic',
        'organic kaplama', 'quartz kaplama',
        'kaplama',  // geniş fallback — önce spesifikler
    ]},
];

// ÖNEMLI: Sıralama öncelik belirler — findVariantCanonicalInText ilk eşleşmeyi döndürür.
//
// Mesh grade kodları (s340/s160/f160/s110/s70) EN ÜSTE alındı.
// Neden: "Dalmaçyalı Organik Donatı Filesi S110" gibi isimler hem 'organik' hem 's110'
// içeriyor. Eski sırada 'organic' önce geldiği için 's110' hiç yakalanmıyordu.
// Grade kodu (S110) DB eşleşmesinde birincil ayrıştırıcıdır; material türü (organic)
// ikincil — 'organic' DB'de ayrı kayıt oluşturmuyorsa grade yeterli.
//
// f160 ve s160 ayrıldı: farklı ürünler (F160=fileli, S160=standart).
//
// Dübel tipleri (plastik_civili/celik_civili) donatı kodlarından sonra,
// coating texture ve material variant'larından önce.
export const VARIANT_ALIAS_RULES: AliasRule[] = [
    // ── Mesh grade kodları — en üste, organic/stonewool'dan önce ──────────────
    { canonical: 's340', patterns: ['s340'] },
    { canonical: 's160', patterns: ['s160'] },
    { canonical: 'f160', patterns: ['f160'] },
    { canonical: 's110', patterns: ['s110'] },
    { canonical: 's70',  patterns: ['s70'] },

    // ── Dübel tipleri ────────────────────────────────────────────────────────
    { canonical: 'plastik_civili', patterns: ['plastik civili', 'plas.civili', 'plastik dubel', 'plastik dubeli'] },
    { canonical: 'celik_civili',   patterns: ['celik civili', 'celik dubel', 'celik dubeli'] },

    // ── Coating texture — mm ölçüsüyle eşleşme ───────────────────────────────
    // 'ince tane' ve '1.5mm' aynı canonical → 'tane doku' ve '2mm' önce gelirse
    // '1.5mm' olan ürün yanlış canonical alabilir; ince_tane önde daha güvenli.
    { canonical: 'ince_tane',        patterns: ['ince tane', '1.5mm', '1,5mm'] },
    { canonical: 'tane_doku',        patterns: ['tane doku', '2mm'] },
    { canonical: 'kum_doku',         patterns: ['kum doku', '1.00mm', '1,00mm'] },
    { canonical: 'cizgi_doku',       patterns: ['cizgi doku', '3mm'] },
    { canonical: 'kalin_cizgi_doku', patterns: ['kalin cizgi doku', '5mm'] },

    // ── Material / kimyasal varyantlar ────────────────────────────────────────
    { canonical: 'carbonpower', patterns: ['carbonpower'] },
    { canonical: 'carbonmax',   patterns: ['carbonmax'] },
    { canonical: 'carbonfine',  patterns: ['carbonfine'] },
    { canonical: 'stonewool',   patterns: ['stonewool'] },

    // ── Dekoratif / special_order — en alta ───────────────────────────────────
    // organic/magic_* çekirdek DB'de genellikle yok; ambiguous/new_product beklenir.
    // Bunlar mesh grade kodlarından sonra geldiği için "Organik Donatı Filesi S110"
    // artık 's110' canonical alır, 'organic' değil.
    { canonical: 'organic',      patterns: ['organic', 'organik'] },
    { canonical: 'uni',          patterns: ['uni'] },
    { canonical: 'magic_fine',   patterns: ['magic fine'] },
    { canonical: 'magic_quartz', patterns: ['magic quartz'] },
];

// ÖNEMLI: Sıralama öncelik belirler — üstteki kural önce eşleşir.
// Geniş pattern'lar (örn: 'profil', 'file') HERKESE sonra gelecek şekilde konumlanmıştır.
export const PRODUCT_CLASS_RULES: Array<{ productClass: ProductClass; patterns: string[] }> = [
    // 1. Dübel — 'dubeli' içeren ürünler 'dubel' pattern'ıyla yakalanır
    { productClass: 'dowel', patterns: [
        'dubel', 'dubeli', 'beton dubeli', 'tugla dubeli', 'standart dubel',
        'tasyunu dubeli', 'plastik civili dubel', 'celik civili dubel',
    ]},
    // 2. Fileli Köşe — 'file' içerdiği için mesh'ten ÖNCE gelmeli
    { productClass: 'corner_profile', patterns: ['fileli kose profili', 'fileli kose', 'kose profili'] },
    // 3. Fuga Profili
    { productClass: 'fuga_profile', patterns: ['fuga profili', 'fuga profil', 'fuga'] },
    // 4. PVC/Denizlik/Dilatasyon — 'profil' geniş pattern burada, corner/fuga'dan sonra
    { productClass: 'pvc_profile', patterns: [
        'damlalik', 'dilatasyon', 'subasman', 'denizlik', 'pvc profil',
        'baslangic profili', 'bitis profili',
        'profil',   // geniş fallback — corner ve fuga daha önce yakalandı
    ]},
    // 5. Mesh — 'fileli kose' corner_profile'da yakalandı; burada sadece donatı filesi
    { productClass: 'mesh', patterns: ['donati filesi', 'donati file', 'filesi', 'file'] },
    // 6. Primer — 'kaplama astari' coating'den önce gelmeli ('kaplama' içeriyor)
    { productClass: 'primer', patterns: ['kaplama astari', 'astar'] },
    // 7. Coating — 'kaplama' geniş; primer'dan sonra
    { productClass: 'coating', patterns: [
        'mineral kaplama', 'dekoratif mineral kaplama', 'silikonlu kaplama',
        'magic fine', 'magic quartz', 'magic organic', 'organic kaplama', 'quartz kaplama',
        'kaplama',
    ]},
    // 8. Yapıştırıcı
    { productClass: 'adhesive', patterns: [
        'yapistirici', 'yapistirma harci', 'isi yalitim yapistiricisi',
        'stonewool sistem yapistiricisi', 'sistem yapistiricisi',
    ]},
    // 9. Sıva
    { productClass: 'render', patterns: [
        'siva harci', 'isi yalitim sivasi', 'isi yalitim sistem sivasi',
        'stonewool sistem sivasi', 'sistem sivasi',
        'siva',     // geniş fallback — 'sivasi' içerenleri de yakalar
    ]},
];
