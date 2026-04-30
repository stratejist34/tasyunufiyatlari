"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle, Database, Plus } from "lucide-react";
import { ImportPreview } from "@/components/admin/ImportPreview";
import type { ImportPreviewRow, ImportSummary } from "@/lib/importTypes";

export function ExcelImportTab() {
    const [isUploading,   setIsUploading]   = useState(false);
    const [isApplying,    setIsApplying]    = useState(false);
    const [isRollingBack, setIsRollingBack] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    const [fileId,      setFileId]      = useState<string | null>(null);
    const [fileStatus,  setFileStatus]  = useState<'matched' | 'applied' | null>(null);
    const [fileName,    setFileName]    = useState('');
    const [summary,     setSummary]     = useState<ImportSummary | null>(null);
    const [previewRows, setPreviewRows] = useState<ImportPreviewRow[]>([]);
    const [statusMsg,   setStatusMsg]   = useState<{ msg: string; type: 'info' | 'success' | 'error' } | null>(null);
    const [newCreated,  setNewCreated]  = useState<{ created: number; skipped_duplicates: number; skipped_not_accessory: number } | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setFileId(null); setFileStatus(null); setSummary(null); setPreviewRows([]); setNewCreated(null);
        setIsUploading(true);
        setStatusMsg({ msg: 'Dosya yükleniyor ve analiz ediliyor...', type: 'info' });
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('uploaded_by', 'admin');
            const res  = await fetch('/api/import', { method: 'POST', body: form });
            const data = await res.json();
            if (!res.ok || data.error) { setStatusMsg({ msg: data.error ?? 'Import hatası', type: 'error' }); return; }
            setFileId(data.fileId); setFileStatus('matched'); setSummary(data.summary); setPreviewRows(data.rows ?? []);
            setStatusMsg({ msg: `${data.summary.totalRows} satır analiz edildi — ${data.summary.matchedCount} eşleşti, ${data.summary.newProductCount} yeni ürün, ${data.summary.variantMissingCount} varyant eksik.`, type: 'success' });
        } catch {
            setStatusMsg({ msg: 'Bağlantı hatası — tekrar deneyin.', type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleApply = async () => {
        if (!fileId) return;
        setIsApplying(true);
        setStatusMsg({ msg: 'Fiyatlar uygulanıyor...', type: 'info' });
        try {
            const res  = await fetch(`/api/import/${fileId}/apply`, { method: 'POST' });
            const data = await res.json();
            if (!data.ok) { setStatusMsg({ msg: data.error ?? 'Apply hatası', type: 'error' }); return; }
            setFileStatus('applied');
            setStatusMsg({ msg: `${data.result.appliedCount} fiyat güncellendi. Geri almak için "Geri Al" butonunu kullanın.`, type: 'success' });
        } catch {
            setStatusMsg({ msg: 'Apply bağlantı hatası', type: 'error' });
        } finally {
            setIsApplying(false);
        }
    };

    const handleRollback = async () => {
        if (!fileId) return;
        setIsRollingBack(true);
        setStatusMsg({ msg: 'Geri alınıyor...', type: 'info' });
        try {
            const res  = await fetch(`/api/import/${fileId}/rollback`, { method: 'POST' });
            const data = await res.json();
            if (!data.ok) { setStatusMsg({ msg: data.error ?? 'Rollback hatası', type: 'error' }); return; }
            setFileStatus('matched');
            setStatusMsg({ msg: `${data.result.reverted} kayıt geri alındı. Dosya tekrar "matched" durumuna döndü.`, type: 'success' });
        } catch {
            setStatusMsg({ msg: 'Rollback bağlantı hatası', type: 'error' });
        } finally {
            setIsRollingBack(false);
        }
    };

    const handleCreateNew = async () => {
        if (!fileId || !summary?.newProductCount) return;
        if (!window.confirm(
            `${summary.newProductCount} yeni ürün accessories tablosuna eklenecek.\n\n` +
            `• Sadece aksesuarlar eklenir (levhalar atlanır)\n` +
            `• Zaten var olan ürünler tekrar eklenmez\n\nOnaylıyor musunuz?`,
        )) return;
        setIsCreatingNew(true);
        setStatusMsg({ msg: 'Yeni ürünler sisteme ekleniyor...', type: 'info' });
        try {
            const res  = await fetch(`/api/import/${fileId}/create-new-products`, { method: 'POST' });
            const data = await res.json();
            if (!data.ok) { setStatusMsg({ msg: data.error ?? 'Oluşturma hatası', type: 'error' }); return; }
            const r = data.result;
            setNewCreated({ created: r.created, skipped_duplicates: r.skipped_duplicates, skipped_not_accessory: r.skipped_not_accessory });
            setStatusMsg({ msg: `${r.created} yeni aksesuar oluşturuldu.` + (r.skipped_duplicates > 0 ? ` ${r.skipped_duplicates} zaten mevcuttu.` : '') + (r.skipped_not_accessory > 0 ? ` ${r.skipped_not_accessory} levha (atlandı).` : ''), type: 'success' });
        } catch {
            setStatusMsg({ msg: 'Bağlantı hatası', type: 'error' });
        } finally {
            setIsCreatingNew(false);
        }
    };

    const isBusy = isUploading || isApplying || isRollingBack || isCreatingNew;

    return (
        <div className="space-y-6">
            <div className="admin-nexus-panel p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                        <FileSpreadsheet className="text-orange-400 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Excel'den Fiyat Güncelle</h2>
                        <p className="text-sm text-slate-400">Güncel fiyat listesini (.xlsx) yükleyerek sistemi senkronize edin.</p>
                        <div className="mt-2 flex gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Kalem Bazında (KDV DAHİL)</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Taşyünü Listesi (KDV HARİÇ)</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Optimix Sayfası (KDV DAHİL)</span>
                        </div>
                    </div>
                </div>

                <div className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all ${isBusy ? 'border-slate-700/30 bg-slate-900/35 opacity-60' : 'border-amber-400/20 bg-slate-900/28 hover:border-amber-400/45 hover:bg-amber-400/[0.04]'}`}>
                    <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} disabled={isBusy} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                    <Upload className={`w-12 h-12 mb-4 ${isUploading ? 'text-orange-400 animate-pulse' : 'text-slate-500'}`} />
                    <p className="text-slate-300 font-medium">{isUploading ? 'Analiz ediliyor...' : fileName || 'Excel dosyasını buraya sürükleyin veya tıklayın'}</p>
                    <p className="text-slate-500 text-xs mt-2">Maximum dosya boyutu: 10MB</p>
                </div>

                {statusMsg && (
                    <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 border ${statusMsg.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : statusMsg.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'}`}>
                        {statusMsg.type === 'error' ? <AlertTriangle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                        <span className="text-sm font-medium">{statusMsg.msg}</span>
                    </div>
                )}

                {fileId && (
                    <div className="mt-6 flex items-center gap-3 flex-wrap">
                        <button onClick={handleApply} disabled={isBusy || fileStatus === 'applied'} className="px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 bg-blue-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white transition-colors">
                            <Database className="w-4 h-4" />
                            {isApplying ? 'Uygulanıyor...' : fileStatus === 'applied' ? 'Uygulandı ✓' : 'Fiyatları Uygula'}
                        </button>
                        {fileStatus === 'applied' && (
                            <button onClick={handleRollback} disabled={isBusy} className="px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 bg-red-950/50 hover:bg-red-950/80 disabled:opacity-50 disabled:cursor-not-allowed text-red-300 border border-red-500/30 transition-colors">
                                {isRollingBack ? 'Geri alınıyor...' : '↩ Geri Al'}
                            </button>
                        )}
                        {summary && summary.newProductCount > 0 && !newCreated && (
                            <button onClick={handleCreateNew} disabled={isBusy} className="px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 bg-emerald-950/50 hover:bg-emerald-900/60 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-300 border border-emerald-500/30 transition-colors">
                                <Plus className="w-4 h-4" />
                                {isCreatingNew ? 'Ekleniyor...' : `Yeni Ürünleri Ekle (${summary.newProductCount})`}
                            </button>
                        )}
                        {newCreated && newCreated.created > 0 && <span className="text-xs text-emerald-400 font-medium">✓ {newCreated.created} aksesuar oluşturuldu</span>}
                        <span className="text-xs text-slate-500 ml-1">
                            {fileStatus === 'matched' ? '● Staging — production\'a henüz yazılmadı' : fileStatus === 'applied' ? '● Production\'a yazıldı' : ''}
                        </span>
                    </div>
                )}
            </div>

            <ImportPreview summary={summary} rows={previewRows} isLoading={isUploading} />
        </div>
    );
}
