import type { MatchResult, NormalizedImportRow } from '../importTypes';
import type {
    MatchAccessoryRecord,
    MatchAccessoryTypeRecord,
    MatchBrandRecord,
} from '../importMatcher';
import {
    buildAccessoryMetadata,
    buildAccessoryCandidate,
    chooseStatusFromConfidence,
    compareMaterialScope,
    computeNameSimilarity,
    finalizeMatchResult,
    isMeasurementCompatible,
    isGenericVariantCanonical,
    normalizeSizeToken,
    normalizeTextForMatch,
    resolveBrandId,
} from './shared';

const ACCESSORY_CLASSES = new Set(['adhesive', 'render', 'mesh', 'coating', 'primer']);

// Özel sipariş terimleri: import'ta bu kelimeler varsa DB'de de aynısı olmalı.
// variantCanonical tek boyut taşır (texture OR kimya) — 'organic' + 'ince_tane' gibi
// çift-boyutlu ürünlerde organic kaybolabilir. Bu liste text-seviyesinde güvence sağlar.
const SPECIAL_ORDER_TERMS = [
    'organic', 'organik',
    'magic fine', 'magic quartz', 'magic organic',
    'carbonpower', 'carbonmax', 'carbonfine',
];

export function matchAccessoryRow(
    row: NormalizedImportRow,
    accessories: MatchAccessoryRecord[],
    brands: MatchBrandRecord[],
    accessoryTypes: MatchAccessoryTypeRecord[],
): MatchResult {
    const hintBrandId = resolveBrandId(row.brandCanonical, row.brandNameHint, brands);
    const accessoryTypesById = new Map(accessoryTypes.map(type => [type.id, type]));
    const rowSizeToken = normalizeSizeToken(row.measurement?.sizeToken);

    // Brand-aware ambiguous count: marka belli ise, farklı markaların aynı class/family
    // kaydı ambiguous sayımına girmesin. Dalmaçyalı Yapıştırıcı için Expert/Optimix
    // yapıştırıcıları sadece tie-breaker; rakip sayılmamalı.
    const brandedAccessoryIds = hintBrandId !== undefined
        ? new Set(accessories.filter(a => a.brand_id === hintBrandId).map(a => a.id))
        : undefined;

    // Text-level special-order flag (map dışında, row başına bir kez hesapla).
    const rowNormalized = normalizeTextForMatch(row.rawProductName);
    const rowHasSpecialOrder = SPECIAL_ORDER_TERMS.some(t => rowNormalized.includes(t));

    const candidates = accessories
        .map(accessory => {
            const targetText = [accessory.short_name, accessory.name].filter(Boolean).join(' ');
            const metadata = buildAccessoryMetadata(accessory, accessoryTypesById);
            const dbClass = metadata.productClass;
            let dbFamily = metadata.familyCanonical;
            const dbVariant = metadata.variantCanonical;
            const rowHasVariant = row.variantCanonical !== undefined;
            const dbHasGenericVariant = isGenericVariantCanonical(dbVariant);
            const classMatch = row.productClass !== 'unknown' && ACCESSORY_CLASSES.has(row.productClass) && dbClass === row.productClass;
            if (dbClass === 'primer' && dbFamily === 'kaplama') {
                dbFamily = 'astar';
            }
            const familyMatch = row.familyCanonical !== undefined && dbFamily === row.familyCanonical;
            const variantMatch = rowHasVariant
                ? dbVariant === row.variantCanonical
                : dbHasGenericVariant;
            const brandMatch = hintBrandId !== undefined && accessory.brand_id === hintBrandId;
            const materialMatch = compareMaterialScope(row.materialType, metadata.materialScope);
            const sizeMatch = rowSizeToken !== undefined && normalizeSizeToken(metadata.sizeToken) === rowSizeToken;
            const measurementMatch = isMeasurementCompatible(row.measurement, accessory);
            const nameSim = computeNameSimilarity(row.rawProductName, targetText);

            // Rule-first: canonical alanlar temel skoru belirler.
            // nameSim sadece tie-breaker (maks +0.05); similarity tek başına eşleşme üretmez.
            let confidence = 0.10 + nameSim * 0.05;
            let matchMethod: 'exact' | 'fuzzy' | 'brand_thickness' | 'name_only' = 'name_only';

            if (classMatch) {
                confidence += 0.30;
                matchMethod = 'fuzzy';
            }
            if (familyMatch) {
                confidence += 0.30;
                matchMethod = 'exact';
            }
            if (materialMatch === 'exact') {
                confidence += 0.12;
            } else if (materialMatch === 'mismatch') {
                confidence -= 0.45;
            }
            if (variantMatch && rowHasVariant) {
                confidence += 0.20;
                matchMethod = familyMatch ? 'exact' : 'fuzzy';
            } else if (rowHasVariant) {
                // Variant belirli ama DB'de eşleşmedi (organic/quartz vs mineral gibi):
                // -0.30 → brand+class+family match olsa bile 0.60'a iner → ambiguous.
                // Eski -0.20 → 0.70'de kalıp yanlış 'matched' üretiyordu.
                confidence -= 0.30;
            }
            if (brandMatch) {
                confidence += 0.20;
            } else if (hintBrandId !== undefined) {
                confidence -= 0.55;
            }
            if (rowSizeToken !== undefined) {
                if (sizeMatch) {
                    confidence += 0.18;
                } else if (row.productClass === 'coating') {
                    confidence -= 0.35;
                }
            }
            if (measurementMatch) {
                confidence += 0.06;
            } else if (row.measurement?.unitContent !== undefined) {
                confidence -= 0.20;
            }

            // Özel sipariş koruma: 'organic/magic/carbon*' import'ta var ama DB'de yok.
            // Kök neden: variantCanonical tek alan — texture ('ince_tane') öne geçince organic
            // kaybolur, brand-aware count=1 → yanlış matched. Text-level guard.
            const dbHasSpecialOrder = SPECIAL_ORDER_TERMS.some(t => normalizeTextForMatch(targetText).includes(t));
            if (rowHasSpecialOrder && !dbHasSpecialOrder) {
                confidence -= 0.40;
            }

            // Generic import vs özelleşmiş DB kaydı:
            // rowHasVariant=false ama DB'nin variant'ı var (örn: 'stonewool').
            // Mevcut variant branch (!rowHasVariant && !dbHasGenericVariant) için ceza eklemiyor.
            // "İsı Yalıtım Yapıştırıcısı" → "Stonewool Sistem Yapıştırıcısı" matched olmamalı.
            if (!rowHasVariant && !dbHasGenericVariant) {
                confidence -= 0.25;
            }

            if (!classMatch && row.productClass !== 'unknown' && dbClass !== undefined) {
                confidence -= 0.35;
            }
            if (!familyMatch && row.familyCanonical !== undefined && dbFamily !== undefined) {
                confidence -= 0.25;
            }

            return buildAccessoryCandidate(accessory, Math.max(0, Math.min(confidence, 0.98)), matchMethod);
        })
        .filter(candidate => candidate.confidence >= 0.20)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

    const best = candidates[0];
    const bestAccessory = best?.accessoryId !== undefined
        ? accessories.find(accessory => accessory.id === best.accessoryId)
        : undefined;
    const sameBrandCandidates = hintBrandId !== undefined
        ? candidates.filter(candidate => {
            const accessory = candidate.accessoryId !== undefined
                ? accessories.find(item => item.id === candidate.accessoryId)
                : undefined;
            return accessory?.brand_id === hintBrandId;
        })
        : [];
    const hasExactSameBrandVariantSize = sameBrandCandidates.some(candidate => {
        const accessory = candidate.accessoryId !== undefined
            ? accessories.find(item => item.id === candidate.accessoryId)
            : undefined;
        if (!accessory) {
            return false;
        }
        const metadata = buildAccessoryMetadata(accessory, accessoryTypesById);
        const variantMatch = row.variantCanonical !== undefined
            ? metadata.variantCanonical === row.variantCanonical
            : true;
        const sizeMatch = rowSizeToken !== undefined
            ? normalizeSizeToken(metadata.sizeToken) === rowSizeToken
            : true;

        return variantMatch && sizeMatch;
    });

    // Brand-aware ambiguous count:
    // best marka-eşleşmeli ise, sadece aynı markanın adaylarını say.
    // Farklı markalardan gelen aynı class/family kayıtları ambiguous üretmemeli.
    const topCandidates = candidates.filter(c => c.confidence >= 0.70);
    const ambiguousCandidateCount = (
        brandedAccessoryIds !== undefined &&
        best?.accessoryId !== undefined &&
        brandedAccessoryIds.has(best.accessoryId)
    )
        ? topCandidates.filter(c => c.accessoryId !== undefined && brandedAccessoryIds.has(c.accessoryId)).length
        : topCandidates.length;

    const baseStatus = chooseStatusFromConfidence(best, ambiguousCandidateCount, 'new_product');

    // Hard guard — score'dan bağımsız kesin engeller:
    //   1. productClass 'unknown' ise matched olamaz: ürün sınıfı belirsiz
    //   2. familyCanonical yoksa matched olamaz: ürün ailesi belirsiz, en fazla ambiguous
    //   NOT: Variant çakışması scoring'de -0.30 ceza alır → max confidence = 0.65 < 0.70 eşiği.
    //        Bu matematiksel olarak matched'ı engeller; kod düzeyinde ayrıca guard eklenmemiştir.
    let status = baseStatus === 'matched' && (
        row.productClass === 'unknown' || row.familyCanonical === undefined
    ) ? 'ambiguous' : baseStatus;

    const bestAccessoryIsOtherBrand = hintBrandId !== undefined && bestAccessory?.brand_id !== undefined && bestAccessory.brand_id !== hintBrandId;
    const hasExplicitVariantAccessory = (
        row.productClass === 'coating' ||
        row.productClass === 'mesh'
    ) && row.variantCanonical !== undefined;
    if (
        status === 'ambiguous' &&
        hasExplicitVariantAccessory &&
        bestAccessoryIsOtherBrand &&
        !hasExactSameBrandVariantSize
    ) {
        status = 'new_product';
    }
    if (
        status === 'ambiguous' &&
        row.productClass === 'mesh' &&
        row.variantCanonical !== undefined &&
        !hasExactSameBrandVariantSize
    ) {
        status = 'new_product';
    }

    return finalizeMatchResult(row, status, candidates, best);
}
