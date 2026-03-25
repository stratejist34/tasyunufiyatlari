// ==========================================
// Import Product Creator
//
// Excel import pipeline'ında "new_product" statüsündeki aksesuar satırlarını
// accessories tablosuna ekler.
//
// Güvenlik katmanları:
//   - Sadece aksesuar oluşturur (levha/plate atlanır — çok fazla eksik alan var)
//   - Duplicate koruma: name + brand_id çiftine göre kontrol
//   - Batch içi duplicate: aynı session'da iki kez eklemez
//   - Fiyat kontrolü: base_price_net <= 0 ise atlar
//   - Tüm insert hatası: tek satır başarısız olursa diğerleri etkilenmez
// ==========================================

import type { SupabaseClient } from '@supabase/supabase-js';
import { normalizeImportRow } from './importNormalizer';
import type { KdvHint, ProductClass, RawImportRow } from './importTypes';

// ─── Sabit Eşlemeler ──────────────────────────────────────────

/** productClass → accessory_types.id */
const CLASS_TO_TYPE_ID: Partial<Record<ProductClass, number>> = {
    adhesive:       1, // yapistirici
    render:         2, // siva
    dowel:          3, // dubel
    mesh:           4, // file
    corner_profile: 5, // fileli-kose
    primer:         6, // astar
    coating:        7, // kaplama
    // fuga_profile, pvc_profile → null (tabloda karşılığı yok, astar altına girmez)
};

// ─── Yardımcılar ─────────────────────────────────────────────

/** Ürün adından brand_id çıkar — brands tablosundaki id'ler ile uyumlu */
function inferBrandId(
    productName: string,
    brands: Array<{ id: number; name: string }>,
): number | null {
    const lower = productName.toLowerCase();

    // "Fawori Optimix" veya sadece "Optimix" → id=4
    if (lower.includes('optimix')) {
        return brands.find(b => b.name.toLowerCase() === 'optimix')?.id ?? null;
    }
    // Sadece "Fawori" (Optimix değil) → id=3
    if (lower.includes('fawori')) {
        return brands.find(b => b.name.toLowerCase() === 'fawori')?.id ?? null;
    }
    // Expert → id=2
    if (lower.includes('expert')) {
        return brands.find(b => b.name.toLowerCase() === 'expert')?.id ?? null;
    }
    // Dalmaçyalı → id=1
    if (lower.includes('dalmaçyalı') || lower.includes('dalmacyali')) {
        return brands.find(b =>
            b.name.toLowerCase().includes('dalmaçyalı') ||
            b.name.toLowerCase().includes('dalmacyali'),
        )?.id ?? null;
    }
    return null;
}

/** Ürün adı + sınıfından unit ve unit_content çıkar */
function inferUnit(
    productClass: ProductClass,
    productName: string,
): { unit: string; unit_content: number | null } {
    const lower = productName.toLowerCase();

    switch (productClass) {
        case 'adhesive':
        case 'render':
        case 'primer':
        case 'coating': {
            const kgMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*kg/);
            const kg = kgMatch ? parseFloat(kgMatch[1].replace(',', '.')) : 25;
            return { unit: 'kg', unit_content: kg };
        }
        case 'dowel': {
            const adetMatch = lower.match(/(\d+)\s*adet/);
            const adet = adetMatch ? parseInt(adetMatch[1], 10) : null;
            return { unit: 'adet', unit_content: adet };
        }
        case 'mesh': {
            const m2Match = lower.match(/(\d+)\s*m[²2]/);
            const m2 = m2Match ? parseFloat(m2Match[1]) : null;
            return { unit: 'm2', unit_content: m2 };
        }
        case 'corner_profile':
        case 'fuga_profile':
        case 'pvc_profile': {
            const mtMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*m(?:t\b|\b)/);
            const mt = mtMatch ? parseFloat(mtMatch[1].replace(',', '.')) : null;
            return { unit: 'm', unit_content: mt };
        }
        default:
            return { unit: 'adet', unit_content: null };
    }
}

/** Dübel ürünlerinde uzunluğu cm cinsinden çıkar: "9,5cm" → 9.5 */
function inferDowelLength(productName: string): number | null {
    const match = productName.toLowerCase().match(/(\d+(?:[.,]\d+)?)\s*cm/);
    if (match) return parseFloat(match[1].replace(',', '.'));
    return null;
}

// ─── Sonuç Tipi ──────────────────────────────────────────────

export interface CreateNewProductsResult {
    created:                 number;
    skipped_duplicates:      number;
    skipped_not_accessory:   number;
    skipped_no_price:        number;
    errors:                  string[];
    created_names:           string[];
}

// ─── Ana Fonksiyon ────────────────────────────────────────────

/**
 * Verilen fileId'ye ait "new_product" satırlarından aksesuar oluşturur.
 *
 * @param supabase   Server-side Supabase client (service role)
 * @param fileId     raw_import_files.id
 */
export async function createNewProductsFromFile(
    supabase: SupabaseClient,
    fileId: string,
): Promise<CreateNewProductsResult> {
    const result: CreateNewProductsResult = {
        created:                 0,
        skipped_duplicates:      0,
        skipped_not_accessory:   0,
        skipped_no_price:        0,
        errors:                  [],
        created_names:           [],
    };

    // ── 1. Dosyanın tüm raw satırlarını çek ──────────────────
    const { data: rawRows, error: rawErr } = await supabase
        .from('raw_import_rows')
        .select('id, row_index, raw_product_name, raw_brand_hint, raw_price, raw_kdv_hint, raw_thickness, raw_isk1, raw_isk2, raw_package_m2, parse_warnings')
        .eq('file_id', fileId);

    if (rawErr) throw new Error(`raw_import_rows okunamadı: ${rawErr.message}`);
    if (!rawRows || rawRows.length === 0) return result;

    const rawRowById = new Map<string, typeof rawRows[0]>(
        rawRows.map(r => [r.id as string, r]),
    );
    const rawRowIds = rawRows.map(r => r.id as string);

    // ── 2. Sadece new_product satırları ──────────────────────
    const { data: newProductRows, error: matchErr } = await supabase
        .from('import_match_results')
        .select('id, row_id, product_type')
        .eq('match_status', 'new_product')
        .in('row_id', rawRowIds);

    if (matchErr) throw new Error(`import_match_results okunamadı: ${matchErr.message}`);
    if (!newProductRows || newProductRows.length === 0) return result;

    // ── 3. Yardımcı veriler (brands + mevcut aksesuarlar) ────
    const [
        { data: brands,      error: brandErr },
        { data: existingAcc, error: accErr   },
    ] = await Promise.all([
        supabase.from('brands').select('id, name'),
        supabase.from('accessories').select('id, name, brand_id'),
    ]);

    if (brandErr) throw new Error(`brands okunamadı: ${brandErr.message}`);
    if (accErr)   throw new Error(`accessories okunamadı: ${accErr.message}`);

    // Duplicate kontrol seti: "brand_id:lower_name"
    const existingSet = new Set<string>(
        (existingAcc ?? []).map(a =>
            `${a.brand_id ?? 'null'}:${String(a.name).toLowerCase().trim()}`,
        ),
    );

    // ── 4. Her new_product satırı için aksesuar kaydı oluştur ─
    const toInsert: Record<string, unknown>[] = [];

    for (const mr of newProductRows) {
        const rawRow = rawRowById.get(mr.row_id as string);
        if (!rawRow) continue;

        // RawImportRow'u yeniden oluştur ve normalize et
        const rawImportRow: RawImportRow = {
            rowIndex:       rawRow.row_index as number,
            rawProductName: rawRow.raw_product_name as string,
            rawBrandHint:   rawRow.raw_brand_hint   as string | undefined,
            rawPrice:       rawRow.raw_price        as string,
            rawKdvHint:     (rawRow.raw_kdv_hint as string ?? 'unknown') as KdvHint,
            rawIsk1:        rawRow.raw_isk1         as string | undefined,
            rawIsk2:        rawRow.raw_isk2         as string | undefined,
            rawThickness:   rawRow.raw_thickness    as string | undefined,
            rawPackageM2:   rawRow.raw_package_m2   as string | undefined,
            parseWarnings:  (rawRow.parse_warnings  as string[] | null) ?? [],
        };

        const normalized = normalizeImportRow(rawImportRow);

        // Sadece aksesuar oluştur
        if (normalized.productType !== 'accessory') {
            result.skipped_not_accessory++;
            continue;
        }

        // Fiyat kontrolü
        if (!normalized.base_price_net || normalized.base_price_net <= 0) {
            result.skipped_no_price++;
            continue;
        }

        const brandId         = inferBrandId(normalized.rawProductName, brands ?? []);
        const accessoryTypeId = CLASS_TO_TYPE_ID[normalized.productClass] ?? null;

        // Duplicate kontrolü
        const dupKey = `${brandId ?? 'null'}:${normalized.rawProductName.toLowerCase().trim()}`;
        if (existingSet.has(dupKey)) {
            result.skipped_duplicates++;
            continue;
        }

        // Unit + uzunluk
        const { unit, unit_content } = inferUnit(normalized.productClass, normalized.rawProductName);
        const dowelLength = normalized.productClass === 'dowel'
            ? inferDowelLength(normalized.rawProductName)
            : null;

        // Malzeme kapsamı
        const isForEps     = normalized.materialType !== 'tasyunu'; // eps veya unknown → true
        const isForTasyunu = normalized.materialType !== 'eps';     // tasyunu veya unknown → true

        // ISK2: listeden gelen isk2 >= 10% ise (örn. Optimix levha grubu %16) o değeri kullan
        const discount2 = (normalized.isk2Pct != null && normalized.isk2Pct >= 10)
            ? normalized.isk2Pct
            : 8;

        const record: Record<string, unknown> = {
            brand_id:           brandId,
            accessory_type_id:  accessoryTypeId,
            name:               normalized.rawProductName,
            short_name:         normalized.familyCanonical ?? null,
            unit,
            unit_content,
            base_price:         normalized.base_price_net,
            is_kdv_included:    false,  // her zaman KDV hariç saklanır
            is_for_eps:         isForEps,
            is_for_tasyunu:     isForTasyunu,
            dowel_length:       dowelLength,
            discount_1:         9,
            discount_2:         discount2,
            is_active:          true,
        };

        toInsert.push(record);
        existingSet.add(dupKey); // batch içi duplicate'i önle
    }

    if (toInsert.length === 0) return result;

    // ── 5. Batch insert ──────────────────────────────────────
    const { data: inserted, error: insertErr } = await supabase
        .from('accessories')
        .insert(toInsert)
        .select('id, name');

    if (insertErr) {
        throw new Error(`Accessories insert hatası: ${insertErr.message}`);
    }

    result.created       = inserted?.length ?? 0;
    result.created_names = (inserted ?? []).map(r => r.name as string);

    return result;
}
