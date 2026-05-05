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
    normalizeTextForMatch,
    normalizeSizeToken,
    findVariantCanonicalInText,
    resolveBrandId,
} from './shared';

const FASTENER_CLASSES = new Set(['dowel', 'corner_profile', 'fuga_profile', 'pvc_profile']);
const SPECIAL_FASTENER_TERMS = [
    'beton',
    'tugla',
    'osb',
    'pul',
    'vidasiz',
];

export function matchFastenerProfileRow(
    row: NormalizedImportRow,
    accessories: MatchAccessoryRecord[],
    brands: MatchBrandRecord[],
    accessoryTypes: MatchAccessoryTypeRecord[],
): MatchResult {
    const hintBrandId = resolveBrandId(row.brandCanonical, row.brandNameHint, brands);
    const sizeToken = row.measurement?.sizeToken;
    const accessoryTypesById = new Map(accessoryTypes.map(type => [type.id, type]));

    // Dowel sizeToken format uyumsuzluğu:
    // parseMeasurement → sizeToken = '11.5cm'
    // DB short_name → '11.5' (cm suffix yok)
    // targetText.includes('11.5cm') = false → sizeMatch kaçıyor.
    // Çözüm: dowel class için 'cm' suffix olmadan da dene.
    // Sadece dowel'a uygulanıyor; profil ölçüsü '3.0x1.6cm' gibi birimsiz check riskli.
    const sizeTokenLower = sizeToken?.toLowerCase() ?? '';
    const sizeTokenNumOnly = row.productClass === 'dowel'
        ? sizeTokenLower.replace(/cm$/, '').trim()
        : '';

    // Brand-aware ambiguous count: aynı markanın farklı SKU'ları (plastik vs çelik dübel)
    // sayılır; farklı markaların aynı class kaydı ambiguous tetiklememeli.
    const brandedAccessoryIds = hintBrandId !== undefined
        ? new Set(accessories.filter(a => a.brand_id === hintBrandId).map(a => a.id))
        : undefined;
    const rowNormalized = normalizeTextForMatch(row.rawProductName);
    const rowSpecialTerms = SPECIAL_FASTENER_TERMS.filter(term => rowNormalized.includes(term));
    const isSizeOptionalDowel = row.productClass === 'dowel' && rowSpecialTerms.includes('pul');

    const candidates = accessories
        .map(accessory => {
            const targetText = [accessory.short_name, accessory.name].filter(Boolean).join(' ');
            const targetLower = normalizeTextForMatch(targetText);
            const metadata = buildAccessoryMetadata(accessory, accessoryTypesById);
            const dbClass = metadata.productClass;
            const dbFamily = metadata.familyCanonical;
            const dbVariant = metadata.variantCanonical ?? findVariantCanonicalInText(targetText);
            const classMatch = row.productClass !== 'unknown' && FASTENER_CLASSES.has(row.productClass) && dbClass === row.productClass;
            const familyMatch = row.familyCanonical !== undefined && dbFamily === row.familyCanonical;
            const variantMatch = row.variantCanonical !== undefined && dbVariant === row.variantCanonical;
            const sizeMatch = sizeToken !== undefined && (
                normalizeSizeToken(metadata.sizeToken) === normalizeSizeToken(sizeToken) ||
                targetLower.includes(sizeTokenLower) ||
                targetLower.includes(sizeTokenLower.replace('x', '*')) ||
                // Dowel: DB'de '11.5' (cm suffixsiz) olabilir
                (sizeTokenNumOnly !== '' && sizeTokenNumOnly !== sizeTokenLower && targetLower.includes(sizeTokenNumOnly))
            );
            const brandMatch = hintBrandId !== undefined && accessory.brand_id === hintBrandId;
            const materialMatch = compareMaterialScope(row.materialType, metadata.materialScope);
            const measurementMatch = isMeasurementCompatible(row.measurement, accessory);
            const nameSim = computeNameSimilarity(row.rawProductName, targetText);

            // Size-first / Rule-first: sizeToken kritik; nameSim sadece tie-breaker.
            // Dübel 11.5cm vs 13.5cm ayrımı sizeToken ile yapılır.
            let confidence = 0.10 + nameSim * 0.04;
            let matchMethod: 'exact' | 'fuzzy' | 'brand_thickness' | 'name_only' = 'name_only';

            if (classMatch) {
                confidence += 0.28;
                matchMethod = 'fuzzy';
            }
            if (familyMatch) {
                confidence += 0.22;
            }
            if (materialMatch === 'exact') {
                confidence += 0.10;
            } else if (materialMatch === 'mismatch') {
                confidence -= 0.45;
            }
            if (sizeMatch) {
                // Ölçü eşleşti: belirleyici sinyal
                confidence += 0.35;
                matchMethod = 'exact';
            } else if (sizeToken !== undefined && row.productClass === 'dowel') {
                // Dübel: ölçü var ama eşleşmedi — sert ceza.
                // -0.50: sizeMatch(+0.35) + brandMatch(+0.20) + variantMatch(+0.20) olsa bile
                // farklı boyuttaki dübel 0.70 eşiğini aşmasın (brand-aware count'da sayılmasın).
                // Profil/köşe için uygulanmaz: DB'de çoğunlukla boyut yok, eşleşmemesi normal.
                confidence -= 0.50;
            }
            if (row.variantCanonical !== undefined) {
                if (variantMatch) {
                    // Doğru tip (plastik/çelik): bonus
                    confidence += 0.20;
                    matchMethod = matchMethod === 'name_only' ? 'fuzzy' : matchMethod;
                } else if (row.productClass === 'dowel') {
                    // Dübel tipi belirliyse farklı tipte dübelle eşleşme yasak.
                    // -0.50: sizeMatch(+0.35) ile beraber bile 0.70 eşiğini geçmesin.
                    // Önceki -0.30: Çelik 11.5 → Plastik 11.5 sizeMatch(+0.35) → 0.89 ≥ 0.70 → yanlış sayılıyordu.
                    confidence -= 0.50;
                }
            }
            if (brandMatch) {
                confidence += 0.20;
            } else if (hintBrandId !== undefined) {
                confidence -= 0.55;
            }
            if (rowSpecialTerms.length > 0) {
                const matchedSpecialTerms = rowSpecialTerms.filter(term => targetLower.includes(term));
                if (matchedSpecialTerms.length === 0) {
                    confidence -= 0.75;
                } else if (matchedSpecialTerms.length < rowSpecialTerms.length) {
                    confidence -= 0.30;
                } else {
                    confidence += 0.10;
                }
            }
            if (measurementMatch) {
                confidence += 0.05;
            } else if (row.measurement?.unitContent !== undefined) {
                confidence -= 0.20;
            }
            if (!classMatch && row.productClass !== 'unknown' && dbClass !== undefined) {
                confidence -= 0.35;
            }

            return buildAccessoryCandidate(accessory, Math.max(0, Math.min(confidence, 0.98)), matchMethod);
        })
        .filter(candidate => candidate.confidence >= 0.15)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

    const best = candidates[0];

    // Brand-aware ambiguous count:
    // best marka-eşleşmeli ise (brandedAccessoryIds içinde), sadece aynı markanın
    // adaylarını say. Dalmaçyalı Plastik Dübel 11.5 için Expert/Optimix dübelleri
    // ambiguous sayımına girmez.
    const topCandidates = candidates.filter(c => c.confidence >= 0.70);
    const ambiguousCandidateCount = (
        brandedAccessoryIds !== undefined &&
        best?.accessoryId !== undefined &&
        brandedAccessoryIds.has(best.accessoryId)
    )
        ? topCandidates.filter(c => c.accessoryId !== undefined && brandedAccessoryIds.has(c.accessoryId)).length
        : topCandidates.length;

    const baseStatus = chooseStatusFromConfidence(best, ambiguousCandidateCount, 'new_product');

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
    const bestAccessoryText = bestAccessory
        ? normalizeTextForMatch([bestAccessory.short_name, bestAccessory.name].filter(Boolean).join(' '))
        : '';
    const bestMissingSpecialTerms = rowSpecialTerms.length > 0 &&
        rowSpecialTerms.some(term => !bestAccessoryText.includes(term));
    const normalizedRowSizeToken = normalizeSizeToken(sizeToken);
    const hasExactSameBrandDowel = row.productClass === 'dowel' && sameBrandCandidates.some(candidate => {
        const accessory = candidate.accessoryId !== undefined
            ? accessories.find(item => item.id === candidate.accessoryId)
            : undefined;
        if (!accessory) {
            return false;
        }
        const metadata = buildAccessoryMetadata(accessory, accessoryTypesById);
        const variantMatch = row.variantCanonical !== undefined
            ? (metadata.variantCanonical ?? findVariantCanonicalInText([accessory.short_name, accessory.name].filter(Boolean).join(' '))) === row.variantCanonical
            : true;
        const sizeMatch = normalizedRowSizeToken !== undefined
            ? normalizeSizeToken(metadata.sizeToken) === normalizedRowSizeToken
            : true;

        return variantMatch && sizeMatch;
    });

    // Hard guard — score'dan bağımsız kesin engel:
    //   Dübel için: sizeToken yoksa matched olamaz — dübel boyutu bilinmeden eşleşme üretilmez.
    //   Profil/köşe/fuga için: boyut çoğu zaman DB'de yok; guard uygulanmaz.
    //   NOT: sizeToken var ama DB'de eşleşmedi → scoring'de -0.50 ceza → max confidence = 0.34 < 0.70.
    //        Bu matematiksel olarak matched'ı engeller; kod düzeyinde ayrıca guard eklenmemiştir.
    let status = baseStatus;
    if (status === 'matched' && row.productClass === 'dowel' && sizeToken === undefined && !isSizeOptionalDowel) {
        status = 'ambiguous';
    }
    if (status === 'matched' && bestMissingSpecialTerms) {
        status = 'new_product';
    }
    if (
        status === 'ambiguous' &&
        row.productClass === 'dowel' &&
        row.variantCanonical !== undefined &&
        normalizedRowSizeToken !== undefined &&
        !hasExactSameBrandDowel
    ) {
        status = 'new_product';
    }

    return finalizeMatchResult(row, status, candidates, best);
}
