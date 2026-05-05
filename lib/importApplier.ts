import type { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID }          from 'crypto';

// ==========================================
// TYPES
// ==========================================

export type ApplyReason =
    | 'status_ambiguous'
    | 'status_unmatched'
    | 'status_new_product'
    | 'status_unsupported'
    | 'requires_review'
    | 'has_error_warning'
    | 'no_target_id'
    | 'missing_plate_id'
    | 'missing_thickness';

export type ApplyAction =
    | 'updated_plate_price'
    | 'updated_accessory'
    | 'inserted_plate_price'
    | 'no_op'
    | 'skipped'
    | 'error';

/**
 * Rollback için önceki durumu saklar.
 * Discriminated union: her action türüne göre farklı alan seti.
 *
 * - plate_price_updated : UPDATE → prevPrice/prevKdvIncluded ile geri alınır
 * - accessory_updated   : UPDATE → prevPrice/prevKdvIncluded ile geri alınır
 * - plate_price_inserted: INSERT → (plate_id, thickness) ile DELETE yapılır
 */
export type SnapshotEntry =
    | { type: 'plate_price_updated';  id: number; prevPrice: number; prevKdvIncluded: boolean }
    | { type: 'accessory_updated';    id: number; prevPrice: number; prevKdvIncluded: boolean }
    | { type: 'plate_price_inserted'; plateId: number; thickness: number };

export interface ApplyRowResult {
    matchResultId: string;
    rawRowId?:     string;
    success:       boolean;
    action:        ApplyAction;
    reason?:       ApplyReason;
    error?:        string;
    /** Yalnızca gerçekten yazılan satırlarda (success=true, no_op değil) doldurulur. */
    snapshot?:     SnapshotEntry;
}

export interface ApplyResult {
    fileId:            string;
    batchId:           string;
    totalRows:         number;
    appliedCount:      number;
    skippedCount:      number;
    errorCount:        number;
    noOpCount:         number;
    fileStatusUpdated: boolean;
    finalStatus:       'applied' | 'matched' | 'no_applicable_rows';
    rows:              ApplyRowResult[];
}

export interface RollbackResult {
    fileId:      string;
    batchId:     string;
    reverted:    number;
    errors:      number;
    finalStatus: 'reverted' | 'partial';
}

// ==========================================
// DB ROW SHAPE — import_match_results
// ==========================================

interface MatchResultDbRow {
    id:                      string;
    row_id:                  string;
    match_status:            string;
    requires_review:         boolean;
    warnings:                Array<{ severity: string; type?: string; message: string }>;
    matched_plate_price_id:  number | null;
    matched_plate_id:        number | null;
    matched_accessory_id:    number | null;
    base_price_raw:          number | null;
    base_price_net:          number | null;
    price_change_pct:        number | null; // match layer'dan gelir (select('*') ile)
    thickness_cm:            number | null;
    product_type:            string | null;
    // raw_import_rows.raw_kdv_hint'ten inject edilir (apply adımında join yerine map)
    raw_kdv_hint?:           string | null;
}

// ==========================================
// CONSTANTS
// ==========================================

const PRICE_EPSILON = 0.001; // No-op guard: bu farktan küçükse yazma

// ==========================================
// HELPERS
// ==========================================

/**
 * KDV durumunu ve yazılacak fiyatı belirler.
 *
 * Öncelik sırası:
 *   1. rawKdvHint = 'kdv_dahil' → ham fiyat (raw) + is_kdv_included=true
 *   2. rawKdvHint = 'kdv_haric' → net fiyat + is_kdv_included=false
 *   3. rawKdvHint = 'unknown'/null → HEURISTIC: raw/net oranı ≈ 1.20 ise kdv_dahil
 *
 * Fallback: net fiyat, is_kdv_included=false. price=0 → caller hata yakalar.
 *
 * TODO: import_match_results'a raw_kdv_hint staging kolonu eklenince
 *       heuristic kaldırılabilir; bu fonksiyon sadece 1-2 branch'e iner.
 */
function deriveKdvStatus(
    raw:         number | null,
    net:         number | null,
    rawKdvHint?: string | null,
): { price: number; isKdvIncluded: boolean } {
    if (rawKdvHint === 'kdv_dahil') {
        const price = raw != null && raw > 0
            ? raw
            : (net != null && net > 0 ? net : 0);
        return { price, isKdvIncluded: true };
    }

    if (rawKdvHint === 'kdv_haric') {
        return { price: net != null && net > 0 ? net : 0, isKdvIncluded: false };
    }

    // HEURISTIC: 'unknown' veya null
    // Aralık kontrolü (1.18–1.22): tolerans yerine explicit bound.
    // ±%1'lik Math.abs yaklaşımından daha dar; iskonto/yuvarlama kaynaklı
    // false-positive'leri azaltır.
    if (raw != null && net != null && raw > 0 && net > 0) {
        const ratio = raw / net;
        if (ratio > 1.18 && ratio < 1.22) {
            return { price: raw, isKdvIncluded: true };
        }
    }

    return { price: net != null && net > 0 ? net : 0, isKdvIncluded: false };
}

function hasErrorWarning(warnings: Array<{ severity: string }>): boolean {
    return warnings.some(w => w.severity === 'error');
}

// ==========================================
// 1. PRE-APPLY SAFETY GUARD
// ==========================================

interface SafetyCheckResult {
    safe:     boolean;
    blockers: string[];
    warnings: string[];
}

interface ApplySafetyOptions {
    allowExtremeDeviation?: boolean;
}

export interface ApplyImportOptions {
    allowExtremeDeviation?: boolean;
}

/**
 * Apply başlamadan önce matchRows üzerinde güvenlik kontrolleri yapar.
 * Ek DB çağrısı yapmaz; sadece mevcut satır verisini kullanır (O(n)).
 *
 * HARD BLOCK:
 *   - requires_review=true + |price_change_pct| > 100 → "Extreme price deviation detected (>100%)"
 *   - herhangi bir satırda severity=error uyarısı     → "Rows with error severity present"
 *
 * WARNING (console.warn, throw yapmaz):
 *   - applicable satır / toplam > %70                 → "Large scale update (>70% rows affected)"
 *   - raw_kdv_hint='unknown' oranı > %30              → "High unknown KDV ratio (>30%)"
 *   - requires_review=true olan satır var              → "Manual review rows present"
 *
 * Defensive: price_change_pct yoksa veya sayı değilse o kural ignore edilir.
 */
function validateApplySafety(
    rows: MatchResultDbRow[],
    options: ApplySafetyOptions = {},
): SafetyCheckResult {
    const blockers: string[] = [];
    const warnings: string[] = [];

    if (rows.length === 0) {
        return { safe: true, blockers, warnings };
    }

    // ---- HARD BLOCK: yüksek fiyat sapması ----
    const hasExtremeDeviation = rows.some(r => {
        if (!r.requires_review) return false;
        const pct = r.price_change_pct;
        return typeof pct === 'number' && isFinite(pct) && Math.abs(pct) > 100;
    });
    if (hasExtremeDeviation && !options.allowExtremeDeviation) {
        blockers.push('Extreme price deviation detected (>100%)');
    }
    if (hasExtremeDeviation && options.allowExtremeDeviation) {
        warnings.push('Extreme price deviation override active');
    }

    // ---- HARD BLOCK: error severity uyarısı ----
    const hasErrorRows = rows.some(r => hasErrorWarning(r.warnings ?? []));
    if (hasErrorRows) {
        blockers.push('Rows with error severity present');
    }

    // ---- WARNING: geniş çaplı güncelleme ----
    // "applicable" = matched veya variant_missing (validate'den bağımsız hızlı sayım)
    const eligibleCount = rows.filter(
        r => r.match_status === 'matched' || r.match_status === 'variant_missing',
    ).length;
    if (eligibleCount > 0 && eligibleCount / rows.length > 0.7) {
        warnings.push('Large scale update (>70% rows affected)');
    }

    // ---- WARNING: bilinmeyen KDV oranı ----
    const unknownKdvCount = rows.filter(
        r => !r.raw_kdv_hint || r.raw_kdv_hint === 'unknown',
    ).length;
    if (unknownKdvCount / rows.length > 0.3) {
        warnings.push('High unknown KDV ratio (>30%)');
    }

    const reviewRowCount = rows.filter(r => r.requires_review).length;
    if (reviewRowCount > 0) {
        warnings.push(`Manual review rows present (${reviewRowCount})`);
    }

    return { safe: blockers.length === 0, blockers, warnings };
}

// ==========================================
// 2. VALIDATE
// ==========================================

export interface ValidateResult {
    applicableRows: MatchResultDbRow[];
    skippedRows:    Array<{ row: MatchResultDbRow; reasons: ApplyReason[] }>;
}

export function validateRowsForApply(rows: MatchResultDbRow[]): ValidateResult {
    const applicableRows: MatchResultDbRow[]                               = [];
    const skippedRows:    Array<{ row: MatchResultDbRow; reasons: ApplyReason[] }> = [];

    for (const row of rows) {
        const reasons: ApplyReason[] = [];

        if (row.match_status === 'ambiguous')   reasons.push('status_ambiguous');
        if (row.match_status === 'unmatched')   reasons.push('status_unmatched');
        if (row.match_status === 'new_product') reasons.push('status_new_product');

        if (hasErrorWarning(row.warnings)) reasons.push('has_error_warning');

        if (row.match_status === 'matched') {
            const hasTarget =
                row.matched_plate_price_id != null ||
                row.matched_accessory_id   != null;
            if (!hasTarget) reasons.push('no_target_id');
        }

        if (row.match_status === 'variant_missing') {
            if (row.matched_plate_id == null) reasons.push('missing_plate_id');
            if (row.thickness_cm     == null) reasons.push('missing_thickness');
        }

        if (reasons.length > 0) {
            skippedRows.push({ row, reasons });
        } else if (
            row.match_status === 'matched' ||
            row.match_status === 'variant_missing'
        ) {
            applicableRows.push(row);
        } else {
            skippedRows.push({ row, reasons: ['status_unsupported'] });
        }
    }

    return { applicableRows, skippedRows };
}

// ==========================================
// 2. APPLY MATCHED ROW
// ==========================================

export async function applyMatchedRow(
    supabase: SupabaseClient,
    row: MatchResultDbRow,
): Promise<ApplyRowResult> {
    const { price, isKdvIncluded } = deriveKdvStatus(
        row.base_price_raw, row.base_price_net, row.raw_kdv_hint,
    );

    if (row.matched_plate_price_id != null) {
        const { data: current, error: fetchErr } = await supabase
            .from('plate_prices')
            .select('base_price, is_kdv_included')
            .eq('id', row.matched_plate_price_id)
            .single();

        if (fetchErr || !current) {
            return {
                matchResultId: row.id, rawRowId: row.row_id,
                success: false, action: 'error',
                error: fetchErr?.message ?? `plate_prices id=${row.matched_plate_price_id} bulunamadı`,
            };
        }

        if (Math.abs(current.base_price - price) < PRICE_EPSILON) {
            return { matchResultId: row.id, rawRowId: row.row_id, success: true, action: 'no_op' };
        }

        const { error: updateErr } = await supabase
            .from('plate_prices')
            .update({ base_price: price, is_kdv_included: isKdvIncluded })
            .eq('id', row.matched_plate_price_id);

        if (updateErr) {
            return { matchResultId: row.id, rawRowId: row.row_id, success: false, action: 'error', error: updateErr.message };
        }

        return {
            matchResultId: row.id, rawRowId: row.row_id,
            success: true, action: 'updated_plate_price',
            snapshot: {
                type:            'plate_price_updated',
                id:              row.matched_plate_price_id,
                prevPrice:       current.base_price,
                prevKdvIncluded: current.is_kdv_included as boolean,
            },
        };
    }

    if (row.matched_accessory_id != null) {
        const { data: current, error: fetchErr } = await supabase
            .from('accessories')
            .select('base_price, is_kdv_included')
            .eq('id', row.matched_accessory_id)
            .single();

        if (fetchErr || !current) {
            return {
                matchResultId: row.id, rawRowId: row.row_id,
                success: false, action: 'error',
                error: fetchErr?.message ?? `accessories id=${row.matched_accessory_id} bulunamadı`,
            };
        }

        if (Math.abs(current.base_price - price) < PRICE_EPSILON) {
            return { matchResultId: row.id, rawRowId: row.row_id, success: true, action: 'no_op' };
        }

        const { error: updateErr } = await supabase
            .from('accessories')
            .update({ base_price: price, is_kdv_included: isKdvIncluded })
            .eq('id', row.matched_accessory_id);

        if (updateErr) {
            return { matchResultId: row.id, rawRowId: row.row_id, success: false, action: 'error', error: updateErr.message };
        }

        return {
            matchResultId: row.id, rawRowId: row.row_id,
            success: true, action: 'updated_accessory',
            snapshot: {
                type:            'accessory_updated',
                id:              row.matched_accessory_id,
                prevPrice:       current.base_price,
                prevKdvIncluded: current.is_kdv_included as boolean,
            },
        };
    }

    return {
        matchResultId: row.id, rawRowId: row.row_id,
        success: false, action: 'error', reason: 'no_target_id',
        error: 'matched_plate_price_id ve matched_accessory_id her ikisi de null',
    };
}

// ==========================================
// 3. APPLY VARIANT MISSING ROW
// ==========================================

export async function applyVariantMissingRow(
    supabase: SupabaseClient,
    row: MatchResultDbRow,
): Promise<ApplyRowResult> {
    if (row.matched_plate_id == null || row.thickness_cm == null) {
        return {
            matchResultId: row.id, rawRowId: row.row_id,
            success: false, action: 'error',
            reason:  row.matched_plate_id == null ? 'missing_plate_id' : 'missing_thickness',
            error:   'variant_missing insert için plate_id veya thickness_cm eksik',
        };
    }

    // plate_prices.thickness DB'de CM cinsinden tutulur.
    // Normalizer row.thickness_cm zaten cm üretir; burada *10 / /10 YAPILMAZ.
    const thicknessCm              = row.thickness_cm;
    const { price, isKdvIncluded } = deriveKdvStatus(
        row.base_price_raw, row.base_price_net, row.raw_kdv_hint,
    );

    if (price <= 0) {
        return {
            matchResultId: row.id, rawRowId: row.row_id,
            success: false, action: 'error',
            error: `Geçersiz fiyat: ${price}`,
        };
    }

    const { data: existing, error: checkErr } = await supabase
        .from('plate_prices')
        .select('id, base_price, is_kdv_included')
        .eq('plate_id', row.matched_plate_id)
        .eq('thickness', thicknessCm)   // cm, mm DEĞİL
        .maybeSingle();

    if (checkErr) {
        return { matchResultId: row.id, rawRowId: row.row_id, success: false, action: 'error', error: checkErr.message };
    }

    if (existing) {
        // Varyant zaten var → UPDATE olarak işle
        if (Math.abs(existing.base_price - price) < PRICE_EPSILON) {
            return { matchResultId: row.id, rawRowId: row.row_id, success: true, action: 'no_op' };
        }

        const { error: updateErr } = await supabase
            .from('plate_prices')
            .update({ base_price: price, is_kdv_included: isKdvIncluded })
            .eq('id', existing.id);

        if (updateErr) {
            return { matchResultId: row.id, rawRowId: row.row_id, success: false, action: 'error', error: updateErr.message };
        }

        return {
            matchResultId: row.id, rawRowId: row.row_id,
            success: true, action: 'updated_plate_price',
            snapshot: {
                type:            'plate_price_updated',
                id:              existing.id,
                prevPrice:       existing.base_price,
                prevKdvIncluded: existing.is_kdv_included as boolean,
            },
        };
    }

    // Yeni varyant INSERT — thickness cm cinsinden
    const { error: insertErr } = await supabase
        .from('plate_prices')
        .insert({
            plate_id:        row.matched_plate_id,
            thickness:       thicknessCm,   // cm, mm DEĞİL
            base_price:      price,
            is_kdv_included: isKdvIncluded,
            // package_m2: null — sonraki aşamada doldurulur
        });

    if (insertErr) {
        return { matchResultId: row.id, rawRowId: row.row_id, success: false, action: 'error', error: insertErr.message };
    }

    return {
        matchResultId: row.id, rawRowId: row.row_id,
        success: true, action: 'inserted_plate_price',
        snapshot: {
            type:      'plate_price_inserted',
            plateId:   row.matched_plate_id,
            thickness: thicknessCm,   // snapshot cm cinsinden; rollback .eq('thickness', ...) de cm bekler
        },
    };
}

// ==========================================
// 4. ORCHESTRATOR — APPLY
// ==========================================

/**
 * Staging satırlarını production tablolara uygular.
 *
 * Güvenlik katmanları:
 *   - Apply Lock: status='matched' → 'applying' (atomic conditional UPDATE)
 *     Başka bir işlem aynı anda apply yaparsa lock alınamaz, hata fırlatılır.
 *   - Batch ID: her apply turuna rastgele UUID atanır, match_results'a yazılır.
 *   - Snapshot: her yazılan satırın önceki değeri import_apply_logs.snapshot'a kaydedilir.
 *   - Apply Log: import_apply_logs'a özet + snapshot insert edilir (non-fatal).
 *   - Lock Revert: hata veya kısmi başarıda status tekrar 'matched'e çekilir.
 *
 * Transaction yoktur (Supabase JS client kısıtı).
 * Her satır bağımsız işlenir; hata diğer satırları durdurmaz.
 */
export async function applyImportFile(
    supabase: SupabaseClient,
    fileId: string,
    options: ApplyImportOptions = {},
): Promise<ApplyResult> {
    // ---- 1. APPLY LOCK ----
    // Atomic conditional UPDATE: sadece status='matched' ise 'applying'e geçer.
    const { data: lockResult, error: lockErr } = await supabase
        .from('raw_import_files')
        .update({ status: 'applying' })
        .eq('id', fileId)
        .eq('status', 'matched')
        .select('id');

    if (lockErr) {
        throw new Error(`Apply lock hatası: ${lockErr.message}`);
    }
    if (!lockResult || lockResult.length === 0) {
        throw new Error('File is not in matched state or already applying/applied');
    }

    // ---- 2. BATCH ID ----
    const batchId = randomUUID();

    try {
        // ---- 3. RAW ROWS — id + raw_kdv_hint ----
        const { data: rowData, error: rowErr } = await supabase
            .from('raw_import_rows')
            .select('id, raw_kdv_hint')
            .eq('file_id', fileId);

        if (rowErr) {
            throw new Error(`raw_import_rows çekilemedi (file_id=${fileId}): ${rowErr.message}`);
        }

        const rowIds    = (rowData ?? []).map(r => r.id as string);
        const rawKdvMap = new Map<string, string>(
            (rowData ?? []).map(r => [r.id as string, (r.raw_kdv_hint as string) ?? 'unknown']),
        );

        if (rowIds.length === 0) {
            await supabase.from('raw_import_files').update({ status: 'matched' }).eq('id', fileId);
            return {
                fileId, batchId,
                totalRows: 0, appliedCount: 0, skippedCount: 0,
                errorCount: 0, noOpCount: 0,
                fileStatusUpdated: false,
                finalStatus: 'no_applicable_rows',
                rows: [],
            };
        }

        // ---- 4. MATCH RESULTS ----
        const { data: matchData, error: matchErr } = await supabase
            .from('import_match_results')
            .select('*')
            .in('row_id', rowIds);

        if (matchErr) {
            throw new Error(`import_match_results çekilemedi: ${matchErr.message}`);
        }

        const matchRows = (matchData ?? []) as MatchResultDbRow[];

        // raw_kdv_hint inject: DB join yerine önceden çekilen map kullanılır
        for (const row of matchRows) {
            row.raw_kdv_hint = rawKdvMap.get(row.row_id) ?? 'unknown';
        }

        // ---- 5. PRE-APPLY SAFETY GUARD ----
        // raw_kdv_hint zaten inject edildi; safety check buradan geçmezse throw eder,
        // catch bloğu apply lock'u 'matched'e geri çeker.
        const safety = validateApplySafety(matchRows, {
            allowExtremeDeviation: options.allowExtremeDeviation,
        });

        if (safety.warnings.length > 0) {
            console.warn(`[applyImportFile] Safety warnings (file=${fileId}):`, safety.warnings.join(' | '));
        }

        if (!safety.safe) {
            throw new Error(`Apply blocked: ${safety.blockers.join(' | ')}`);
        }

        // ---- 6. VALIDATE ----
        const { applicableRows, skippedRows } = validateRowsForApply(matchRows);

        const results: ApplyRowResult[] = [];

        for (const { row, reasons } of skippedRows) {
            results.push({
                matchResultId: row.id,
                rawRowId:      row.row_id,
                success:       false,
                action:        'skipped',
                reason:        reasons[0],
            });
        }

        // ---- 7. APPLY ----
        let appliedCount = 0;
        let errorCount   = 0;
        let noOpCount    = 0;

        for (const row of applicableRows) {
            const result =
                row.match_status === 'matched'
                    ? await applyMatchedRow(supabase, row)
                    : await applyVariantMissingRow(supabase, row);

            results.push(result);

            if      (!result.success)               errorCount++;
            else if (result.action === 'no_op')     noOpCount++;
            else                                    appliedCount++;
        }

        // ---- 8. BATCH ID → import_match_results ----
        // Sadece gerçekten yazılan satırlar (success=true, no_op değil).
        // Hatalı / atlanan / no_op satırlar batch'e dahil edilmez → audit tutarlılığı.
        const appliedRowIds = results
            .filter(r => r.success && r.action !== 'no_op')
            .map(r => r.matchResultId);

        if (appliedRowIds.length > 0) {
            await supabase
                .from('import_match_results')
                .update({ apply_batch_id: batchId })
                .in('id', appliedRowIds);
            // Non-fatal: başarısız olsa da apply sonucu değişmez
        }

        // ---- 9. FINAL STATUS ----
        let finalStatus: 'applied' | 'matched' | 'no_applicable_rows';

        if (applicableRows.length === 0) {
            finalStatus = 'no_applicable_rows';
        } else if (errorCount === 0) {
            finalStatus = 'applied';
        } else {
            finalStatus = 'matched';
        }

        // ---- 10. FILE STATUS UPDATE ----
        // 'applied' → başarı; diğer durumlarda lock'u geri al ('matched')
        let fileStatusUpdated = false;

        if (finalStatus === 'applied') {
            const { error: statusErr } = await supabase
                .from('raw_import_files')
                .update({ status: 'applied' })
                .eq('id', fileId);
            fileStatusUpdated = !statusErr;
        } else {
            await supabase
                .from('raw_import_files')
                .update({ status: 'matched' })
                .eq('id', fileId);
        }

        // ---- 11. APPLY LOG + SNAPSHOT ----
        // Snapshot: yalnızca gerçekten yazılan satırların önceki değerleri.
        // JSON array olarak saklanır; rollback bu diziyi okur.
        const snapshots: SnapshotEntry[] = results
            .filter((r): r is ApplyRowResult & { snapshot: SnapshotEntry } =>
                r.snapshot != null,
            )
            .map(r => r.snapshot);

        await supabase
            .from('import_apply_logs')
            .insert({
                file_id:       fileId,
                batch_id:      batchId,
                total_rows:    matchRows.length,
                applied_count: appliedCount,
                skipped_count: skippedRows.length,
                error_count:   errorCount,
                no_op_count:   noOpCount,
                snapshot:      snapshots,
            });
        // Non-fatal: log başarısız olursa apply sonucu etkilenmez

        return {
            fileId,
            batchId,
            totalRows:    matchRows.length,
            appliedCount,
            skippedCount: skippedRows.length,
            errorCount,
            noOpCount,
            fileStatusUpdated,
            finalStatus,
            rows:         results,
        };

    } catch (err) {
        // Beklenmeyen exception'da lock'u geri al
        try {
            await supabase
                .from('raw_import_files')
                .update({ status: 'matched' })
                .eq('id', fileId);
        } catch { /* ignore */ }

        throw err;
    }
}

// ==========================================
// 5. ROLLBACK
// ==========================================

/**
 * En son apply işlemini geri alır (batch undo).
 *
 * Akış:
 *   1. Lock: status='applied' → 'rolling_back' (aynı conditional UPDATE pattern)
 *      Başka bir işlem rollback yapıyorsa hata fırlatılır.
 *   2. En son import_apply_logs kaydından batch_id + snapshot alınır.
 *   3. Her SnapshotEntry için:
 *      - plate_price_updated → plate_prices UPDATE (prevPrice, prevKdvIncluded)
 *      - accessory_updated   → accessories UPDATE (prevPrice, prevKdvIncluded)
 *      - plate_price_inserted → plate_prices DELETE (plate_id + thickness)
 *   4. import_match_results.apply_batch_id temizlenir (bu batch'e ait satırlar).
 *   5. File status → 'matched' (her durumda: tam veya kısmi rollback)
 *
 * Exception'da lock 'applied'a geri çekilir.
 */
export async function rollbackImportFile(
    supabase: SupabaseClient,
    fileId: string,
): Promise<RollbackResult> {
    // ---- 1. ROLLBACK LOCK ----
    const { data: lockResult, error: lockErr } = await supabase
        .from('raw_import_files')
        .update({ status: 'rolling_back' })
        .eq('id', fileId)
        .eq('status', 'applied')
        .select('id');

    if (lockErr) {
        throw new Error(`Rollback lock hatası: ${lockErr.message}`);
    }
    if (!lockResult || lockResult.length === 0) {
        throw new Error('File is not in applied state or already rolling back');
    }

    try {
        // ---- 2. EN SON LOG → batch_id + snapshot ----
        const { data: logData, error: logErr } = await supabase
            .from('import_apply_logs')
            .select('batch_id, snapshot')
            .eq('file_id', fileId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (logErr || !logData) {
            throw new Error(
                `import_apply_logs kaydı bulunamadı (file_id=${fileId}): ${logErr?.message ?? 'kayıt yok'}`,
            );
        }

        const batchId   = logData.batch_id as string;
        const snapshots = (logData.snapshot ?? []) as SnapshotEntry[];

        // ---- 3. REVERT EACH SNAPSHOT ENTRY ----
        let reverted = 0;
        let errors   = 0;

        for (const entry of snapshots) {
            try {
                if (entry.type === 'plate_price_updated') {
                    const { error } = await supabase
                        .from('plate_prices')
                        .update({
                            base_price:      entry.prevPrice,
                            is_kdv_included: entry.prevKdvIncluded,
                        })
                        .eq('id', entry.id);

                    if (error) throw error;
                    reverted++;

                } else if (entry.type === 'accessory_updated') {
                    const { error } = await supabase
                        .from('accessories')
                        .update({
                            base_price:      entry.prevPrice,
                            is_kdv_included: entry.prevKdvIncluded,
                        })
                        .eq('id', entry.id);

                    if (error) throw error;
                    reverted++;

                } else if (entry.type === 'plate_price_inserted') {
                    const { error } = await supabase
                        .from('plate_prices')
                        .delete()
                        .eq('plate_id',  entry.plateId)
                        .eq('thickness', entry.thickness);

                    if (error) throw error;
                    reverted++;
                }
            } catch (entryErr) {
                errors++;
                console.error('[rollbackImportFile] entry revert hatası:', entry, entryErr);
                // Bir entry başarısız olursa devam et (diğerleri geri alınmaya çalışılır)
            }
        }

        // ---- 4. BATCH ID TEMİZLE ----
        // apply_batch_id bu batch'e ait satırları NULL'a çek
        await supabase
            .from('import_match_results')
            .update({ apply_batch_id: null })
            .eq('apply_batch_id', batchId);
        // Non-fatal

        // ---- 5. FILE STATUS → 'matched' ----
        // Tam veya kısmi rollback olsun, her durumda matched'e döner
        await supabase
            .from('raw_import_files')
            .update({ status: 'matched' })
            .eq('id', fileId);

        return {
            fileId,
            batchId,
            reverted,
            errors,
            finalStatus: errors === 0 ? 'reverted' : 'partial',
        };

    } catch (err) {
        // Exception'da lock'u geri al → 'applied' durumuna bırak
        try {
            await supabase
                .from('raw_import_files')
                .update({ status: 'applied' })
                .eq('id', fileId);
        } catch { /* ignore */ }

        throw err;
    }
}
