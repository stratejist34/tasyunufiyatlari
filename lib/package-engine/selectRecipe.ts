/**
 * lib/package-engine/selectRecipe.ts
 *
 * Her tier için deterministik slot seçimi yapar.
 * Levha ve aksesuar seçimi ayrı fonksiyonlar üzerinden çalışır.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  FALLBACK KURALLARI                                                  │
 * │                                                                      │
 * │  Premium  → FALLBACK YOK. Premium havuzunda aday yoksa unavailable. │
 * │             Diğer tier'lara asla inen;                               │
 * │             "premium sistem" garantisi brand bütünlüğünü gerektirir. │
 * │                                                                      │
 * │  Balanced → economic (üste çıkılmaz; premium'a asla inen)           │
 * │  Economic → balanced (premium/special asla girmez)                  │
 * │                                                                      │
 * │  Her fallback kararı warnings'e yazılır — sessiz fallback YOKTUR.   │
 * └─────────────────────────────────────────────────────────────────────┘
 */

import type { PackageSlot } from '@/lib/types';
import { REQUIRED_SLOTS } from './constants';
import type {
    AccessoryCandidateItem,
    AccessorySlot,
    PackageUnavailableResult,
    PlateCandidateItem,
    RecipeSlot,
    SelectedRecipe,
    TierCandidatePools,
    WizardTier,
} from './types';

// ==========================================
// PUBLIC API
// ==========================================

/**
 * Verilen tier için tüm zorunlu slotları doldurur.
 * Herhangi bir slot doldurulamazsa PackageUnavailableResult döner.
 */
export function selectPackageRecipe(
    pools:    TierCandidatePools,
    tier:     WizardTier,
    warnings: string[],
): SelectedRecipe | PackageUnavailableResult {
    const recipe: SelectedRecipe    = new Map();
    const missingSlots: PackageSlot[] = [];

    for (const slot of REQUIRED_SLOTS) {
        let recipeSlot: RecipeSlot | null;

        if (slot === 'plate') {
            recipeSlot = resolvePlateSlot(tier, pools, warnings);
        } else {
            recipeSlot = resolveAccessorySlot(slot, tier, pools, warnings);
        }

        if (!recipeSlot) {
            missingSlots.push(slot);
        } else {
            recipe.set(slot, recipeSlot);
        }
    }

    if (missingSlots.length > 0) {
        return {
            unavailable:  true,
            tier,
            missingSlots,
            reason: `Şu slotlar için uygun aday bulunamadı: ${missingSlots.join(', ')}`,
        };
    }

    return recipe;
}

// ==========================================
// LEVHA SLOTU — ayrı seçim yolu
// ==========================================

function resolvePlateSlot(
    tier:     WizardTier,
    pools:    TierCandidatePools,
    warnings: string[],
): RecipeSlot | null {
    const primaryCandidates = pools.plates[tier];

    if (primaryCandidates.length > 0) {
        return plateCandidateToRecipeSlot(primaryCandidates[0]);
    }

    // Premium: fallback yok → direkt null
    if (tier === 'premium') {
        return null;
    }

    // Balanced / Economic: fallback
    const fallback = getPlateFallback(tier, pools);
    if (fallback) {
        warnings.push(
            `[plate] '${tier}' havuzunda levha adayı yok. ` +
            `Fallback: '${fallback.qualityBand}' bandından ${fallback.brand.name} seçildi.`,
        );
        return plateCandidateToRecipeSlot(fallback);
    }

    return null;
}

function getPlateFallback(
    tier:  WizardTier,
    pools: TierCandidatePools,
): PlateCandidateItem | null {
    for (const fallbackTier of PLATE_FALLBACK_ORDER[tier]) {
        const candidates = pools.plates[fallbackTier];
        if (candidates.length > 0) return candidates[0];
    }
    return null;
}

/**
 * Levha fallback sırası:
 *   premium  → [] (fallback yok)
 *   balanced → economic
 *   economic → balanced
 */
const PLATE_FALLBACK_ORDER: Record<WizardTier, WizardTier[]> = {
    premium:  [],
    balanced: ['economic'],
    economic: ['balanced'],
};

// ==========================================
// AKSESUAR SLOTLARI — ayrı seçim yolu
// ==========================================

function resolveAccessorySlot(
    slot:     AccessorySlot,
    tier:     WizardTier,
    pools:    TierCandidatePools,
    warnings: string[],
): RecipeSlot | null {
    const slotMap    = pools.accessories[tier];
    const candidates = slotMap.get(slot);

    if (candidates && candidates.length > 0) {
        const best = tier === 'premium'
            ? pickPremiumAccessory(slot, candidates, pools)
            : candidates[0];
        return accessoryCandidateToRecipeSlot(best);
    }

    // Premium: fallback yok
    if (tier === 'premium') {
        return null;
    }

    // Balanced / Economic: fallback
    const fallback = getAccessoryFallback(slot, tier, pools);
    if (fallback) {
        warnings.push(
            `[${slot}] '${tier}' havuzunda aday yok. ` +
            `Fallback: '${fallback.qualityBand}' bandından ${fallback.brand.name} seçildi.`,
        );
        return accessoryCandidateToRecipeSlot(fallback);
    }

    return null;
}

/**
 * Premium brand affinity: levha markasıyla aynı markadan aksesuar varsa o seçilir.
 * Eşleşme yoksa priority sıralaması (candidates[0]) geçerli.
 */
function pickPremiumAccessory(
    _slot:      AccessorySlot,
    candidates: AccessoryCandidateItem[],
    pools:      TierCandidatePools,
): AccessoryCandidateItem {
    const plateCandidates = pools.plates['premium'];
    if (plateCandidates.length === 0) return candidates[0];

    const plateBrandId = plateCandidates[0].plate.brand_id;
    return candidates.find(c => c.accessory.brand_id === plateBrandId) ?? candidates[0];
}

function getAccessoryFallback(
    slot:     AccessorySlot,
    tier:     WizardTier,
    pools:    TierCandidatePools,
): AccessoryCandidateItem | null {
    for (const fallbackTier of ACCESSORY_FALLBACK_ORDER[tier]) {
        const candidates = pools.accessories[fallbackTier]?.get(slot);
        if (candidates && candidates.length > 0) return candidates[0];
    }
    return null;
}

/**
 * Aksesuar fallback sırası:
 *   premium  → [] (fallback yok)
 *   balanced → economic
 *   economic → balanced
 */
const ACCESSORY_FALLBACK_ORDER: Record<WizardTier, WizardTier[]> = {
    premium:  [],
    balanced: ['economic'],
    economic: ['balanced'],
};

// ==========================================
// UTILITY
// ==========================================

function plateCandidateToRecipeSlot(item: PlateCandidateItem): RecipeSlot {
    return { kind: 'plate', plate: item.plate, platePrice: item.platePrice, brand: item.brand };
}

function accessoryCandidateToRecipeSlot(item: AccessoryCandidateItem): RecipeSlot {
    return {
        kind:          'accessory',
        accessory:     item.accessory,
        accessoryType: item.accessoryType,
        brand:         item.brand,
    };
}
