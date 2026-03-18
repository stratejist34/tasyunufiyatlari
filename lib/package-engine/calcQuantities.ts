/**
 * lib/package-engine/calcQuantities.ts
 *
 * Kullanıcının m² girdisini her slot için fiziksel sipariş birimine çevirir.
 *
 * Levha:
 *   package_m2 = PlatePrice.package_m2 ?? Plate.package_m2
 *   packages   = ceil(areaM2 / package_m2)
 *
 * Aksesuar:
 *   consumptionRate = AccessoryType.consumption_rate_{eps|tasyunu}  [birim/m²]
 *   rawConsumption  = areaM2 × consumptionRate
 *   units           = ceil(rawConsumption / Accessory.unit_content)
 *
 * Tüm sonuçlar yukarı yuvarlama (tam paket / tam kutu / tam rulo).
 * Lojistik kapasitesi (vehicleType, fill%) pricing'de iskonto seçimi için de kullanılır.
 */

import type { LogisticsCapacity, PackageSlot } from '@/lib/types';
import { LORRY_FILL_FLOOR_PCT, TIR_FILL_THRESHOLD_PCT } from './constants';
import type {
    PackageEngineInput,
    QuantityResult,
    RecipeSlot,
    SelectedRecipe,
    SlotQuantity,
    VehicleType,
} from './types';

// ==========================================
// PUBLIC API
// ==========================================

export function calculatePackageQuantities(
    recipe:            SelectedRecipe,
    input:             PackageEngineInput,
    logisticsCapacity: LogisticsCapacity[],
): QuantityResult {
    const slots:    SlotQuantity[] = [];
    const warnings: string[] = [];

    let platePackageCount = 0;
    let packageSizeM2     = 0;

    for (const [slot, recipeSlot] of recipe) {
        if (recipeSlot.kind === 'plate') {
            const qty = calcPlateQuantity(slot, recipeSlot, input);
            slots.push(qty);
            platePackageCount = qty.quantity;
            // Levha paket büyüklüğü: gerçekte kapladığı m² / paket sayısı
            packageSizeM2 = qty.actualCoveredM2! / qty.quantity;
        } else {
            slots.push(calcAccessoryQuantity(slot, recipeSlot, input));
        }
    }

    // Lojistik kapasitesi
    const logCap = logisticsCapacity.find(lc => lc.thickness === input.thicknessCm);
    if (!logCap && platePackageCount > 0) {
        warnings.push(
            `Kalınlık ${input.thicknessCm} cm için lojistik kapasitesi tanımlı değil. ` +
            `Araç tipi ve doluluk hesaplanamadı.`,
        );
    }

    const { vehicleType, truckFillPct, lorryFillPct, packagesNeededForOptimal } =
        resolveVehicleType(platePackageCount, logCap);

    return {
        slots,
        platePackageCount,
        packageSizeM2,
        vehicleType,
        truckFillPct,
        lorryFillPct,
        packagesNeededForOptimal,
        logCap,
        logisticsWarnings: warnings,
    };
}

// ==========================================
// PLATE QUANTITY
// ==========================================

function calcPlateQuantity(
    slot:       PackageSlot,
    recipeSlot: Extract<RecipeSlot, { kind: 'plate' }>,
    input:      PackageEngineInput,
): SlotQuantity {
    const { plate, platePrice } = recipeSlot;

    // PlatePrice.package_m2 öncelikli; yoksa Plate.package_m2
    const packageM2 = platePrice.package_m2 ?? plate.package_m2;

    // Guard: package_m2 <= 0 → bölme hatası ve anlamsız paket sayısı önlenir
    if (!packageM2 || packageM2 <= 0) {
        throw new Error(
            `[calcQuantities] Levha '${plate.short_name}' (id=${plate.id}) için ` +
            `package_m2=${packageM2} geçersiz. Lojistik verisi eksik veya hatalı.`,
        );
    }

    const quantity  = Math.ceil(input.areaM2 / packageM2);

    return {
        slot,
        quantity,
        unit:            'paket',
        actualCoveredM2: quantity * packageM2,
    };
}

// ==========================================
// ACCESSORY QUANTITY
// ==========================================

function calcAccessoryQuantity(
    slot:       PackageSlot,
    recipeSlot: Extract<RecipeSlot, { kind: 'accessory' }>,
    input:      PackageEngineInput,
): SlotQuantity {
    const { accessory, accessoryType } = recipeSlot;

    const consumptionRate = input.materialType === 'tasyunu'
        ? accessoryType.consumption_rate_tasyunu
        : accessoryType.consumption_rate_eps;

    const rawConsumption = input.areaM2 * consumptionRate;

    // unit_content = bir paketin/kutunun/rulonun içindeki birim sayısı
    const quantity = Math.ceil(rawConsumption / accessory.unit_content);

    return {
        slot,
        quantity,
        unit:            accessory.unit,
        consumptionRate,
        rawConsumption,
    };
}

// ==========================================
// VEHICLE TYPE & FILL
// ==========================================

/**
 * Levha paket sayısına göre araç tipi ve doluluk oranı hesaplar.
 *
 * Doluluk mantığı (mevcut getTruckMeterColor ile tutarlı):
 *   ≥ TIR_FILL_THRESHOLD_PCT → truck
 *   ≥ LORRY_FILL_FLOOR_PCT   → lorry
 *   < LORRY_FILL_FLOOR_PCT   → none (verimsiz)
 *   > truck kapasitesi        → multiple
 */
function resolveVehicleType(
    platePackageCount: number,
    logCap?:           LogisticsCapacity,
): {
    vehicleType:              VehicleType;
    truckFillPct:             number;
    lorryFillPct:             number;
    packagesNeededForOptimal?: number;
} {
    if (!logCap || platePackageCount === 0) {
        return { vehicleType: 'none', truckFillPct: 0, lorryFillPct: 0 };
    }

    const truckFillPct = (platePackageCount / logCap.truck_capacity_packages) * 100;
    const lorryFillPct = (platePackageCount / logCap.lorry_capacity_packages) * 100;

    let vehicleType: VehicleType;
    if (platePackageCount > logCap.truck_capacity_packages) {
        vehicleType = 'multiple';
    } else if (truckFillPct >= TIR_FILL_THRESHOLD_PCT) {
        vehicleType = 'truck';
    } else if (lorryFillPct >= LORRY_FILL_FLOOR_PCT) {
        vehicleType = 'lorry';
    } else {
        vehicleType = 'none';
    }

    // SmartAdvice: TIR doldurmak için gereken ek paket sayısı
    const packagesNeededForOptimal =
        platePackageCount < logCap.truck_capacity_packages
            ? logCap.truck_capacity_packages - platePackageCount
            : undefined;

    return {
        vehicleType,
        truckFillPct:  Math.min(truckFillPct, 100),
        lorryFillPct:  Math.min(lorryFillPct, 100),
        packagesNeededForOptimal,
    };
}
