import type {
    ImportPreviewRow,
    ImportSummary,
    MatchResult,
    NormalizedImportRow,
} from './importTypes';
import { dispatchMatchImportRow } from './importMatchers';
import {
    computeNameSimilarity,
    normalizeTextForMatch,
} from './importMatchers/shared';

export interface MatchPlateRecord {
    id: number;
    brand_id: number;
    material_type_id: number;
    short_name: string;
}

export interface MatchPlatePriceRecord {
    id: number;
    plate_id: number;
    thickness: number; // DB'de cm tutuluyor
    base_price: number;
    is_kdv_included: boolean;
}

export interface MatchAccessoryRecord {
    id: number;
    brand_id: number;
    accessory_type_id?: number;
    short_name: string;
    name?: string;
    base_price: number;
    is_kdv_included?: boolean;
    unit?: string;
    unit_content?: number;
    is_for_eps?: boolean;
    is_for_tasyunu?: boolean;
    product_class?: string;
    family_canonical?: string;
    variant_canonical?: string;
    size_token?: string;
    material_scope?: 'eps' | 'tasyunu' | 'both' | 'unknown';
    commercial_mode?: string;
    quality_band?: string;
    package_slot?: string;
}

export interface MatchBrandRecord {
    id: number;
    name: string;
}

export interface MatchMaterialTypeRecord {
    id: number;
    slug: string;
}

export interface MatchAccessoryTypeRecord {
    id: number;
    slug: string;
}

export interface MatchContext {
    plates: MatchPlateRecord[];
    platePrices: MatchPlatePriceRecord[];
    accessories: MatchAccessoryRecord[];
    brands: MatchBrandRecord[];
    materialTypes: MatchMaterialTypeRecord[];
    accessoryTypes: MatchAccessoryTypeRecord[];
}

export {
    computeNameSimilarity,
    normalizeTextForMatch,
};

export {
    matchAccessoryRow,
    matchEpsPlateRow,
    matchFastenerProfileRow,
    matchTasyunuPlateRow,
} from './importMatchers';

export function matchPlateRow(
    row: NormalizedImportRow,
    plates: MatchPlateRecord[],
    platePrices: MatchPlatePriceRecord[],
    brands: MatchBrandRecord[],
    materialTypes: MatchMaterialTypeRecord[],
): MatchResult {
    return dispatchMatchImportRow(row, {
        plates,
        platePrices,
        accessories: [],
        brands,
        materialTypes,
        accessoryTypes: [],
    });
}

export function matchImportRow(
    row: NormalizedImportRow,
    ctx: MatchContext,
): MatchResult {
    return dispatchMatchImportRow(row, ctx);
}

export function buildImportSummary(rows: ImportPreviewRow[]): ImportSummary {
    let matchedCount = 0;
    let newProductCount = 0;
    let variantMissingCount = 0;
    let ambiguousCount = 0;
    let unmatchedCount = 0;
    let warningCount = 0;
    let errorCount = 0;
    let requiresReviewCount = 0;

    for (const row of rows) {
        const status = row.match?.status;

        switch (status) {
            case 'matched':         matchedCount++; break;
            case 'new_product':     newProductCount++; break;
            case 'variant_missing': variantMissingCount++; break;
            case 'ambiguous':       ambiguousCount++; break;
            default:                unmatchedCount++; break;
        }

        if (row.match?.requiresReview) requiresReviewCount++;

        for (const w of row.debug.warnings) {
            if (w.severity === 'error') errorCount++;
            if (w.severity === 'warning') warningCount++;
        }
    }

    return {
        totalRows: rows.length,
        matchedCount,
        newProductCount,
        variantMissingCount,
        ambiguousCount,
        unmatchedCount,
        warningCount,
        errorCount,
        requiresReviewCount,
    };
}
