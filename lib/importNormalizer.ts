import type {
    ImportWarning,
    MaterialTypeSlug,
    NormalizedImportRow,
    ProductType,
    RawImportRow,
} from './importTypes';
import { parseCanonicalFields } from './importCanonicalParser';

export function parseCurrencyTR(raw: string): number {
    if (!raw) return 0;

    let cleaned = raw
        .replace(/TL/gi, '')
        .replace(/₺/g, '')
        .replace(/m²/gi, '')
        .replace(/m2/gi, '')
        .replace(/\s/g, '')
        .trim();

    if (!cleaned) return 0;

    const hasComma = cleaned.includes(',');
    const dotCount = (cleaned.match(/\./g) || []).length;

    if (hasComma && cleaned.includes('.')) {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else if (hasComma) {
        cleaned = cleaned.replace(',', '.');
    } else if (dotCount > 1) {
        const parts = cleaned.split('.');
        const lastPart = parts[parts.length - 1];
        cleaned = lastPart.length <= 2
            ? parts.slice(0, -1).join('') + '.' + lastPart
            : cleaned.replace(/\./g, '');
    }

    const value = parseFloat(cleaned);
    return Number.isNaN(value) ? 0 : value;
}

export function parsePercentageTR(raw: string): number {
    if (!raw) return 0;
    const value = parseFloat(raw.replace('%', '').replace(',', '.').trim());
    return Number.isNaN(value) ? 0 : value;
}

export function parseLooseNumberTR(raw: string): number | undefined {
    if (!raw || !raw.trim()) return undefined;

    let cleaned = raw
        .replace(/m²/gi, '')
        .replace(/m2/gi, '')
        .replace(/\s/g, '')
        .trim();

    if (!cleaned) return undefined;

    const hasComma = cleaned.includes(',');
    const dotCount = (cleaned.match(/\./g) || []).length;

    if (hasComma && cleaned.includes('.')) {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else if (hasComma) {
        cleaned = cleaned.replace(',', '.');
    } else if (dotCount > 1) {
        const parts = cleaned.split('.');
        const lastPart = parts[parts.length - 1];
        cleaned = lastPart.length <= 2
            ? parts.slice(0, -1).join('') + '.' + lastPart
            : cleaned.replace(/\./g, '');
    }

    const value = parseFloat(cleaned);
    return Number.isNaN(value) ? undefined : value;
}

export function extractThicknessCm(raw: string): number | undefined {
    if (!raw) return undefined;
    const normalized = raw.toLowerCase().trim();

    const cmMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*cm/);
    if (cmMatch) return parseFloat(cmMatch[1].replace(',', '.'));

    const mmMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*mm/);
    if (mmMatch) return parseFloat(mmMatch[1].replace(',', '.')) / 10;

    const numMatch = normalized.match(/^(\d+(?:[.,]\d+)?)$/);
    if (numMatch) {
        const value = parseFloat(numMatch[1].replace(',', '.'));
        return value >= 20 ? value / 10 : value;
    }

    return undefined;
}

function normalizeForDetection(text: string): string {
    return text
        .replace(/ı/g, 'i')
        .replace(/İ/g, 'i')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

const EPS_KEYWORDS = [
    'eps', 'karbonlu', 'carbon', 'isi yalitim levhasi', 'beyaz eps',
    'ideal carbon', 'double carbon',
];

const TASYUNU_KEYWORDS = [
    'tasyunu', 'tas yunu', 'mineral yun', 'rockwool',
    'sw035', 'rf150', 'hd150', 'ld125', 'pw50', 'tr7.5', 'tr 7.5',
    'tasyunu isi', 'tasyunu levha',
];

const ACCESSORY_KEYWORDS = [
    'yapistirici', 'yapistirma', 'harc', 'siva', 'dubel', 'pul',
    'file', 'astar', 'kaplama', 'kose profil', 'kose', 'profil',
    'toz', 'izolon', 'macun', 'penetrasyon', 'silikon', 'bant',
    'su yalitim', 'ankraj',
];

export function detectMaterialType(productName: string): MaterialTypeSlug {
    const lower = normalizeForDetection(productName);
    for (const kw of TASYUNU_KEYWORDS) {
        if (lower.includes(kw)) return 'tasyunu';
    }
    for (const kw of EPS_KEYWORDS) {
        if (lower.includes(kw)) return 'eps';
    }
    return 'unknown';
}

export function detectProductType(productName: string): ProductType {
    const lower = normalizeForDetection(productName);
    for (const kw of ACCESSORY_KEYWORDS) {
        if (lower.includes(kw)) return 'accessory';
    }
    if (/\d+\s*(cm|mm)/.test(lower)) return 'plate';
    return 'unknown';
}

function inferAccessoryMaterialType(
    productName: string,
    current: MaterialTypeSlug,
    productClass: NormalizedImportRow['productClass'],
    variantCanonical?: string,
): MaterialTypeSlug {
    if (current !== 'unknown') return current;

    const lower = normalizeForDetection(productName);

    if (lower.includes('stonewool') || lower.includes('tas yunu') || lower.includes('tasyunu')) {
        return 'tasyunu';
    }

    if (productClass === 'dowel') {
        if (variantCanonical === 'celik_civili') return 'tasyunu';
        if (variantCanonical === 'plastik_civili') return 'eps';
    }

    if (productClass === 'adhesive' || productClass === 'render') {
        if (lower.includes('isi yalitim')) return 'eps';
    }

    return current;
}

export function normalizeImportRow(raw: RawImportRow): NormalizedImportRow {
    const warnings: ImportWarning[] = [];

    const base_price_raw = parseCurrencyTR(raw.rawPrice);
    if (base_price_raw <= 0) {
        warnings.push({
            rowIndex: raw.rowIndex,
            severity: 'error',
            type: 'price_parse_error',
            message: `Fiyat parse edilemedi: "${raw.rawPrice}"`,
        });
    }

    let base_price_net = base_price_raw;
    if (raw.rawKdvHint === 'kdv_dahil') {
        base_price_net = base_price_raw > 0 ? Math.round((base_price_raw / 1.20) * 100) / 100 : 0;
    } else if (raw.rawKdvHint === 'unknown') {
        warnings.push({
            rowIndex: raw.rowIndex,
            severity: 'warning',
            type: 'kdv_ambiguous',
            message: `KDV durumu belirlenemedi, "kdv_haric" varsayıldı: "${raw.rawProductName}"`,
        });
    }

    const thicknessCm = raw.rawThickness
        ? extractThicknessCm(raw.rawThickness)
        : extractThicknessCm(raw.rawProductName);

    const isk1Pct = raw.rawIsk1 !== undefined ? parsePercentageTR(raw.rawIsk1) : undefined;
    const isk2Pct = raw.rawIsk2 !== undefined ? parsePercentageTR(raw.rawIsk2) : undefined;
    const packageM2 = raw.rawPackageM2 !== undefined ? parseLooseNumberTR(raw.rawPackageM2) : undefined;

    const detectedProductType = detectProductType(raw.rawProductName);
    const detectedMaterialType = detectMaterialType(raw.rawProductName);

    const canonical = parseCanonicalFields({
        rawProductName: raw.rawProductName,
        materialType: detectedMaterialType,
        productType: detectedProductType,
        thicknessCm,
    });

    const resolvedProductType = canonical.inferredProductType ?? detectedProductType;
    const resolvedMaterialType = inferAccessoryMaterialType(
        raw.rawProductName,
        canonical.inferredMaterialType ?? detectedMaterialType,
        canonical.productClass,
        canonical.variantCanonical,
    );

    if (resolvedProductType === 'unknown') {
        warnings.push({
            rowIndex: raw.rowIndex,
            severity: 'warning',
            type: 'product_type_unknown',
            message: `Ürün tipi tespit edilemedi: "${raw.rawProductName}"`,
        });
    }

    if (
        resolvedMaterialType === 'unknown' &&
        (resolvedProductType === 'plate' || canonical.productClass === 'eps_plate' || canonical.productClass === 'tasyunu_plate')
    ) {
        warnings.push({
            rowIndex: raw.rowIndex,
            severity: 'warning',
            type: 'material_type_unknown',
            message: `Malzeme türü tespit edilemedi: "${raw.rawProductName}"`,
        });
    }

    const finalThicknessCm = resolvedProductType === 'accessory' ? undefined : thicknessCm;

    if (resolvedProductType === 'plate' && finalThicknessCm === undefined) {
        warnings.push({
            rowIndex: raw.rowIndex,
            severity: 'warning',
            type: 'thickness_missing',
            message: `Levha için kalınlık bulunamadı: "${raw.rawProductName}"`,
        });
    }

    const metadata: Record<string, unknown> = {};
    if (isk2Pct !== undefined && isk2Pct >= 10) {
        metadata.optimix_isk2_flag = true;
        warnings.push({
            rowIndex: raw.rowIndex,
            severity: 'info',
            type: 'optimix_isk2_flag',
            message: `İSK2=%${isk2Pct} özel iskonto eşiğinde; marka bazlı override kontrolü gerekebilir.`,
        });
    }

    for (const pw of raw.parseWarnings) {
        warnings.push({
            rowIndex: raw.rowIndex,
            severity: 'warning',
            type: 'parse_fallback',
            message: pw,
        });
    }

    for (const cw of canonical.canonicalWarnings) {
        warnings.push({
            rowIndex: raw.rowIndex,
            severity: 'info',
            type: 'parse_fallback',
            message: `Canonical parser: ${cw}`,
        });
    }

    return {
        rowIndex: raw.rowIndex,
        rawProductName: raw.rawProductName,
        brandNameHint: raw.rawBrandHint,
        productType: resolvedProductType,
        materialType: resolvedMaterialType,
        thicknessCm: finalThicknessCm,
        brandCanonical: canonical.brandCanonical,
        productClass: canonical.productClass,
        familyCanonical: canonical.familyCanonical,
        variantCanonical: canonical.variantCanonical,
        measurement: canonical.measurement,
        canonicalWarnings: canonical.canonicalWarnings,
        base_price_raw,
        base_price_net,
        kdvSource: raw.rawKdvHint,
        isk1Pct,
        isk2Pct,
        packageM2,
        metadata,
        warnings,
    };
}
