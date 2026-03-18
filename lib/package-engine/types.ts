/**
 * lib/package-engine/types.ts
 *
 * Package Engine'e özgü TypeScript contract'ları.
 */

import type {
    Accessory,
    AccessoryType,
    Brand,
    LogisticsCapacity,
    PackageSlot,
    Plate,
    PlatePrice,
    QualityBand,
    ShippingDistrict,
    ShippingZone,
} from '@/lib/types';

// ==========================================
// HELPER TYPE ALIASES
// ==========================================

/** Wizard akışında üretilen 3 tier — 'special' dahil değil */
export type WizardTier = Exclude<QualityBand, 'special'>;

/**
 * Aksesuar slotları — 'plate' burada yer almaz.
 * Plate seçimi ayrı bir yol üzerinden yapılır (plate_prices-driven).
 * PackageSlot='plate' yalnızca engine output/contract seviyesinde ortaktır.
 */
export type AccessorySlot = Exclude<PackageSlot, 'plate'>;

// ==========================================
// INPUT / CONTEXT
// ==========================================

export interface PackageEngineInput {
    materialType: 'eps' | 'tasyunu';
    thicknessCm:  number;
    areaM2:       number;
    cityCode:     number;
    districtId?:  number;
}

export interface PackageEngineContext {
    plates:            Plate[];
    platePrices:       PlatePrice[];
    accessories:       Accessory[];
    accessoryTypes:    AccessoryType[];
    brands:            Brand[];
    logisticsCapacity: LogisticsCapacity[];
    shippingZone:      ShippingZone;
    shippingDistrict?: ShippingDistrict;
}

// ==========================================
// CANDIDATE POOLS
// ==========================================

export interface PlateCandidateItem {
    kind:        'plate';
    plate:       Plate;
    platePrice:  PlatePrice;
    brand:       Brand;
    qualityBand: WizardTier;
    priority:    number;
}

export interface AccessoryCandidateItem {
    kind:          'accessory';
    accessory:     Accessory;
    accessoryType: AccessoryType;
    brand:         Brand;
    qualityBand:   WizardTier;
    priority:      number;
}

/**
 * Levha adayları: tier → sıralı PlateCandidateItem listesi.
 * Plate seçimi plates + plate_prices üzerinden yapılır; aksesuar yolundan ayrıdır.
 */
export type TierPlatePools = Record<WizardTier, PlateCandidateItem[]>;

/**
 * Aksesuar adayları: tier → (aksesuar slotu → sıralı AccessoryCandidateItem listesi).
 * 'plate' slotu bu haritada yer almaz — kasıtlı.
 */
export type TierAccessoryPools = Record<WizardTier, Map<AccessorySlot, AccessoryCandidateItem[]>>;

/**
 * Aday havuzları — levha ve aksesuar yolları birbirinden ayrılmış.
 * PackageSlot='plate' birleşimi yalnızca SelectedRecipe / output contract'ında gerçekleşir.
 */
export interface TierCandidatePools {
    plates:      TierPlatePools;
    accessories: TierAccessoryPools;
}

// ==========================================
// SELECTED RECIPE
// ==========================================

export type RecipeSlot =
    | { kind: 'plate';     plate: Plate; platePrice: PlatePrice; brand: Brand }
    | { kind: 'accessory'; accessory: Accessory; accessoryType: AccessoryType; brand: Brand };

/** Bir tier için seçilmiş tam sistem — her slot bir ürün */
export type SelectedRecipe = Map<PackageSlot, RecipeSlot>;

/** Bir veya daha fazla slot doldurulamadığında döner */
export interface PackageUnavailableResult {
    unavailable:  true;
    tier:         WizardTier;
    missingSlots: PackageSlot[];
    reason:       string;
}

// ==========================================
// QUANTITY RESULT
// ==========================================

export interface SlotQuantity {
    slot:             PackageSlot;
    quantity:         number;
    unit:             string;
    actualCoveredM2?: number;
    consumptionRate?: number;
    rawConsumption?:  number;
}

export type VehicleType = 'none' | 'lorry' | 'truck' | 'multiple';

export interface QuantityResult {
    slots:                    SlotQuantity[];
    platePackageCount:        number;
    packageSizeM2:            number;
    vehicleType:              VehicleType;
    truckFillPct:             number;
    lorryFillPct:             number;
    packagesNeededForOptimal?: number;
    logCap?:                  LogisticsCapacity;
    logisticsWarnings:        string[];
}

// ==========================================
// PRICING RESULT
// ==========================================

/**
 * Nakliye durumu:
 *   included               — Nakliye fiyata dahil
 *   tir_discount           — TIR doluluk iskontosu uygulandı
 *   low_metrage_excluded   — Düşük metraj: nakliye hesaplanmadı, shippingCost=null, isPriceFinal=false
 *   multiple_review_required — Çoklu araç: fiyat netleştirilemedi, shippingCost=null, isPriceFinal=false
 */
export type ShippingMode =
    | 'included'
    | 'tir_discount'
    | 'low_metrage_excluded'
    | 'multiple_review_required';

export interface SlotPricingItem {
    slot:            PackageSlot;
    name:            string;
    shortName:       string;
    brandName:       string;
    quantity:        number;
    unit:            string;
    unitPriceNet:    number;
    unitPriceGross:  number;
    totalPriceNet:   number;
    totalPriceGross: number;
}

export interface PricingResult {
    items:             SlotPricingItem[];
    productTotalNet:   number;
    productTotalGross: number;
    /** null → nakliye bu hesap döngüsünde belirlenemedi (shippingMode ile birlikte yorumla) */
    shippingCost:      number | null;
    shippingMode:      ShippingMode;
    grandTotalNet:     number;
    grandTotalGross:   number;
    pricePerM2Net:     number;
    pricePerM2Gross:   number;
    vatAmount:         number;
    /**
     * false → fiyat nihai değil; shippingCost=null olduğunda her zaman false.
     * Frontend'de "Nakliye hariç — fiyat netleştirilmeli" uyarısı gösterilmeli.
     */
    isPriceFinal:      boolean;
    warnings:          string[];
}

// ==========================================
// PACKAGE CARD — Frontend Output Contract
// ==========================================

export interface PackageCardItem {
    slot:       PackageSlot;
    name:       string;
    shortName:  string;
    brandName:  string;
    quantity:   number;
    unit:       string;
    unitPrice:  number;
    totalPrice: number;
    isPlate:    boolean;
}

export interface PackageCardTotals {
    productTotal:    number;
    /** null → nakliye bu paket için netleştirilemedi */
    shippingCost:    number | null;
    shippingMode:    ShippingMode;
    grandTotal:      number;
    pricePerM2:      number;
    priceWithoutVat: number;
    vatAmount:       number;
    isPriceFinal:    boolean;
}

export interface PackageCardLogistics {
    platePackageCount:        number;
    packageSizeM2:            number;
    truckCapacityPackages:    number;
    lorryCapacityPackages:    number;
    truckFillPercentage:      number;
    lorryFillPercentage:      number;
    vehicleType:              VehicleType;
    isShippingIncluded:       boolean;
    packagesNeededForOptimal?: number;
    shippingWarning?:         string;
}

export interface PackageCard {
    tier:          WizardTier;
    title:         string;
    badge:         string | null;
    /**
     * Dinamik atama: balanced tier varsa o recommended; yoksa ilk available tier.
     * Unavailable tier asla recommended olamaz.
     */
    isRecommended: boolean;
    items:         PackageCardItem[];
    totals:        PackageCardTotals;
    logistics:     PackageCardLogistics;
    warnings:      string[];
    rationale:     string;
}

export interface PackageCardsResponse {
    cards:            PackageCard[];
    availableTiers:   WizardTier[];
    unavailableTiers: Array<{
        tier:         WizardTier;
        reason:       string;
        missingSlots: PackageSlot[];
    }>;
    generatedAt:      string;
}
