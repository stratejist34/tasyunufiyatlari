import {
    BRAND_ALIAS_RULES,
    FAMILY_ALIAS_RULES,
    MATERIAL_ALIAS_RULES,
    PRODUCT_CLASS_RULES,
    VARIANT_ALIAS_RULES,
} from './importAliasDictionary';
import type {
    CanonicalMeasurement,
    MaterialTypeSlug,
    ProductClass,
    ProductType,
} from './importTypes';

export interface CanonicalParseResult {
    brandCanonical?: string;
    productClass: ProductClass;
    familyCanonical?: string;
    variantCanonical?: string;
    measurement?: CanonicalMeasurement;
    canonicalWarnings: string[];
    inferredProductType?: ProductType;
    inferredMaterialType?: MaterialTypeSlug;
}

function normalizeCanonicalText(text: string): string {
    return text
        .replace(/ı/g, 'i')
        .replace(/İ/g, 'i')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^\w\s.,*]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function findCanonical(text: string, rules: Array<{ canonical: string; patterns: string[] }>): string | undefined {
    for (const rule of rules) {
        if (rule.patterns.some(pattern => text.includes(normalizeCanonicalText(pattern)))) {
            return rule.canonical;
        }
    }
    return undefined;
}

function detectProductClass(
    text: string,
    materialType: MaterialTypeSlug,
    thicknessCm?: number,
    productType?: ProductType,
): ProductClass {
    for (const rule of PRODUCT_CLASS_RULES) {
        if (rule.patterns.some(pattern => text.includes(normalizeCanonicalText(pattern)))) {
            return rule.productClass;
        }
    }

    // thicknessCm fallback: YALNIZCA aksesuar olduğu bilinmeyen ürünler için.
    // productType='accessory' ise (dübel 11.5cm, profil 2.5m gibi), plate sınıfına atama YAPMA.
    // Bu olmadan: "Dübel 11,5cm 600 adet" → thicknessCm=11.5 → yanlış 'tasyunu_plate' / 'eps_plate'.
    if (thicknessCm !== undefined && productType !== 'accessory') {
        return materialType === 'tasyunu' ? 'tasyunu_plate' : 'eps_plate';
    }

    return 'unknown';
}

function inferMaterialTypeFromClass(productClass: ProductClass, current: MaterialTypeSlug): MaterialTypeSlug {
    if (current !== 'unknown') return current;
    if (productClass === 'tasyunu_plate') return 'tasyunu';
    if (productClass === 'eps_plate') return 'eps';
    return 'unknown';
}

function parseMeasurement(text: string, productClass: ProductClass): CanonicalMeasurement | undefined {
    const measurement: CanonicalMeasurement = {};

    const cmMatches = [...text.matchAll(/(\d+(?:[.,]\d+)?)\s*cm/g)];
    const mMatches = [...text.matchAll(/(\d+(?:[.,]\d+)?)\s*m[t]?\b/g)];
    const qtyMatch = text.match(/(\d+)\s*(adet|kg|gr|torba|m2|m²)/);
    const profileMatch = text.match(/(\d+(?:[.,]\d+)?)\s*\*\s*(\d+(?:[.,]\d+)?)\s*cm/);

    if (productClass === 'dowel' && cmMatches[0]) {
        measurement.lengthCm = parseFloat(cmMatches[0][1].replace(',', '.'));
        measurement.sizeToken = `${measurement.lengthCm}cm`;
    }

    if (
        (productClass === 'pvc_profile' || productClass === 'corner_profile' || productClass === 'fuga_profile')
        && profileMatch
    ) {
        measurement.widthCm = parseFloat(profileMatch[1].replace(',', '.'));
        measurement.heightCm = parseFloat(profileMatch[2].replace(',', '.'));
        measurement.sizeToken = `${measurement.widthCm}x${measurement.heightCm}cm`;
    }

    if (
        (productClass === 'pvc_profile' || productClass === 'corner_profile' || productClass === 'fuga_profile')
        && mMatches[0]
    ) {
        measurement.linearLengthM = parseFloat(mMatches[0][1].replace(',', '.'));
        measurement.sizeToken = measurement.sizeToken
            ? `${measurement.sizeToken}_${measurement.linearLengthM}m`
            : `${measurement.linearLengthM}m`;
    }

    if (productClass === 'coating') {
        const mmMatch = text.match(/(\d+(?:[.,]\d+)?)\s*mm/);
        if (mmMatch) {
            measurement.sizeToken = `${parseFloat(mmMatch[1].replace(',', '.'))}mm`;
        }
    }

    if (qtyMatch) {
        measurement.unitContent = parseInt(qtyMatch[1], 10);
        measurement.unit = qtyMatch[2] === 'm²' ? 'm2' : qtyMatch[2];
    }

    return Object.keys(measurement).length > 0 ? measurement : undefined;
}

export function parseCanonicalFields(input: {
    rawProductName: string;
    materialType: MaterialTypeSlug;
    productType: ProductType;
    thicknessCm?: number;
}): CanonicalParseResult {
    const text = normalizeCanonicalText(input.rawProductName);
    const canonicalWarnings: string[] = [];

    const brandCanonical = findCanonical(text, BRAND_ALIAS_RULES);
    let familyCanonical = findCanonical(text, FAMILY_ALIAS_RULES);
    const variantCanonical = findCanonical(text, VARIANT_ALIAS_RULES);

    // Optimix brand-aware family post-processing.
    // Kök neden: FAMILY_ALIAS_RULES pattern'ları contiguous substring gerektirir.
    // "fawori optimix isi yalitim levhasi karbonlu" metninde
    // 'optimix karbonlu' pattern'ı substring değil → findCanonical null döner.
    // Brand zaten 'optimix' resolve oldu; metin 'karbonlu' / 'carbon' içeriyorsa family kesin.
    if (!familyCanonical && brandCanonical === 'optimix') {
        if (text.includes('karbonlu') || text.includes('carbon')) {
            familyCanonical = 'optimix_karbonlu';
        } else if (text.includes('beyaz') || text.includes('white')) {
            familyCanonical = 'optimix_beyaz';
        }
    }
    const materialCanonical = findCanonical(text, MATERIAL_ALIAS_RULES);

    const inferredMaterialType = materialCanonical === 'eps' || materialCanonical === 'tasyunu'
        ? materialCanonical
        : input.materialType;

    // productType'ı geç: aksesuar olduğu bilinen ürünlerin thicknessCm'den plate sınıfına
    // yanlış atanmasını engelle (bkz. detectProductClass içi yorum).
    let productClass = detectProductClass(text, inferredMaterialType, input.thicknessCm, input.productType);
    if (productClass === 'unknown' && input.productType === 'plate') {
        productClass = inferredMaterialType === 'tasyunu' ? 'tasyunu_plate' : 'eps_plate';
    }

    // familyCanonical auto-set: FAMILY_ALIAS_RULES'tan bulunamadıysa productClass'tan türet.
    // Bu 'family_canonical_missing' uyarılarını azaltır — özellikle corner/mesh/fuga/pvc profil için.
    if (!familyCanonical && productClass === 'coating')         familyCanonical = 'kaplama';
    if (!familyCanonical && productClass === 'primer')          familyCanonical = 'astar';
    if (!familyCanonical && productClass === 'dowel')           familyCanonical = 'dubel';
    if (!familyCanonical && productClass === 'adhesive')        familyCanonical = 'yapistirici';
    if (!familyCanonical && productClass === 'render')          familyCanonical = 'siva';
    if (!familyCanonical && productClass === 'mesh')            familyCanonical = 'donati_filesi';
    if (!familyCanonical && productClass === 'corner_profile')  familyCanonical = 'fileli_kose';
    if (!familyCanonical && productClass === 'fuga_profile')    familyCanonical = 'fuga_profili';
    if (!familyCanonical && productClass === 'pvc_profile')     familyCanonical = 'pvc_profil';

    const inferredProductType = productClass === 'eps_plate' || productClass === 'tasyunu_plate'
        ? 'plate'
        : productClass === 'unknown'
            ? input.productType
            : 'accessory';

    const resolvedMaterialType = inferMaterialTypeFromClass(productClass, inferredMaterialType);

    const measurement = parseMeasurement(text, productClass);

    if (!familyCanonical) {
        canonicalWarnings.push('family_canonical_missing');
    }
    if ((productClass === 'dowel' || productClass === 'pvc_profile' || productClass === 'fuga_profile') && !measurement?.sizeToken) {
        canonicalWarnings.push('measurement_missing');
    }

    return {
        brandCanonical,
        productClass,
        familyCanonical,
        variantCanonical,
        measurement,
        canonicalWarnings,
        inferredProductType,
        inferredMaterialType: resolvedMaterialType,
    };
}
