// ==========================================
// IMPORT PIPELINE — Tip Tanımları
// Staging-tabanlı import hattı için tüm tipler.
// DB yazma işlemi bu tiplere dahil değildir.
// ==========================================

export type ImportFileType = 'excel' | 'csv' | 'pdf';

/** KDV durumu — kaynak dosyadan tespit edilen */
export type KdvHint = 'kdv_dahil' | 'kdv_haric' | 'unknown';

/** Ürün tipi */
export type ProductType = 'plate' | 'accessory' | 'unknown';

/** Malzeme türü slugı */
export type MaterialTypeSlug = 'eps' | 'tasyunu' | 'unknown';

/** Rule-first matcher sınıfı */
export type ProductClass =
    | 'eps_plate'
    | 'tasyunu_plate'
    | 'adhesive'
    | 'render'
    | 'mesh'
    | 'coating'
    | 'primer'
    | 'dowel'
    | 'corner_profile'
    | 'fuga_profile'
    | 'pvc_profile'
    | 'unknown';

/** DB eşleşme durumu */
export type MatchStatus =
    | 'matched'          // plates/accessories tablosunda eşleşme bulundu
    | 'new_product'      // DB'de hiç yok
    | 'variant_missing'  // plate var ama bu kalınlık için plate_prices kaydı yok
    | 'ambiguous'        // birden fazla aday, güven skoru düşük
    | 'unmatched';       // eşleşme bulunamadı

/** Uyarı/hata seviyesi */
export type ImportSeverity = 'info' | 'warning' | 'error';

// ==========================================
// RAW LAYER — Parser çıktısı, normalize edilmemiş
// ==========================================

export interface RawImportRow {
    rowIndex: number;
    rawProductName: string;
    rawBrandHint?: string;    // ayrı sütunda marka bilgisi varsa
    rawPrice: string;         // "1.544,80 TL" olduğu gibi
    rawIsk1?: string;         // "9,00" olduğu gibi
    rawIsk2?: string;         // "8,00" olduğu gibi
    rawThickness?: string;    // "5cm", "50mm" olduğu gibi
    rawUnit?: string;         // "m²", "tüp", "torba" vb.
    rawKdvHint: KdvHint;      // sheet adı veya içerikten tespit edildi
    rawPackageM2?: string;    // kaynak dosyada paket metrajı varsa
    sourceSheetName?: string;
    parseWarnings: string[];
}

// ==========================================
// NORMALIZED LAYER — KDV hariç net fiyat, cm cinsinden kalınlık
// ==========================================

export interface NormalizedImportRow {
    rowIndex: number;
    rawProductName: string;
    brandNameHint?: string;

    // Sınıflandırma
    productType: ProductType;
    materialType: MaterialTypeSlug;
    thicknessCm?: number;           // daima cm cinsinden
    brandCanonical?: string;
    productClass: ProductClass;
    familyCanonical?: string;
    variantCanonical?: string;
    measurement?: CanonicalMeasurement;
    canonicalWarnings: string[];

    // Fiyat — daima KDV hariç net
    base_price_raw: number;         // string parse edilmiş, KDV normalize EDİLMEMİŞ
    base_price_net: number;         // KDV hariç net: kdv_dahil → /1.20, kdv_haric → aynı
    kdvSource: KdvHint;             // KDV kararının kaynağı

    // İskontolar (kaynak dosyadan)
    isk1Pct?: number;
    isk2Pct?: number;

    // Paketleme
    packageM2?: number;

    // Optimix gibi özel durumlar için ek meta
    metadata: Record<string, unknown>;

    // Biriken uyarılar
    warnings: ImportWarning[];
}

export interface CanonicalMeasurement {
    sizeToken?: string;
    lengthCm?: number;
    widthCm?: number;
    heightCm?: number;
    linearLengthM?: number;
    unit?: string;
    unitContent?: number;
}

// ==========================================
// MATCH LAYER — DB eşleştirme sonuçları
// ==========================================

export interface MatchCandidate {
    plateId?: number;
    platePriceId?: number;
    accessoryId?: number;
    confidence: number;                                            // 0.0–1.0
    matchMethod: 'exact' | 'fuzzy' | 'brand_thickness' | 'name_only';
    currentPrice?: number;         // DB'deki mevcut base_price
    currentKdvIncluded?: boolean;
}

export interface MatchResult {
    rowIndex: number;
    status: MatchStatus;
    candidates: MatchCandidate[];
    bestCandidate?: MatchCandidate;
    proposedPrice: number;         // NormalizedImportRow.base_price_net
    priceChangePct?: number;       // mevcut fiyata göre % değişim
    requiresReview: boolean;       // priceChangePct abs > 30 → true
}

// ==========================================
// WARNING / SUMMARY
// ==========================================

export interface ImportWarning {
    rowIndex?: number;
    severity: ImportSeverity;
    type:
        | 'kdv_ambiguous'
        | 'thickness_missing'
        | 'price_parse_error'
        | 'product_type_unknown'
        | 'material_type_unknown'
        | 'large_price_change'
        | 'new_product'
        | 'variant_missing'
        | 'unmatched'
        | 'parse_fallback'
        | 'optimix_isk2_flag';
    message: string;
}

export interface ImportSummary {
    totalRows: number;
    matchedCount: number;
    newProductCount: number;
    variantMissingCount: number;
    ambiguousCount: number;
    unmatchedCount: number;
    warningCount: number;
    errorCount: number;
    requiresReviewCount: number;
}

// ==========================================
// PREVIEW LAYER — UI için birleşik satır
// ==========================================

/**
 * API route'un döndürdüğü debug bloğu.
 * NormalizedImportRow'un tamamı değil; admin preview için gerekli tanı alanları.
 */
export interface ImportPreviewRowDebug {
    productType:       ProductType;
    materialType:      MaterialTypeSlug;
    thicknessCm:       number | null;
    productClass:      ProductClass;
    brandCanonical:    string | null;
    familyCanonical:   string | null;
    variantCanonical:  string | null;
    measurement:       CanonicalMeasurement | null;
    canonicalWarnings: string[];
    base_price_raw:    number;
    base_price_net:    number;
    warnings:          ImportWarning[];
}

export interface ImportPreviewRow {
    raw:   RawImportRow;
    debug: ImportPreviewRowDebug;
    match?: MatchResult;
}
