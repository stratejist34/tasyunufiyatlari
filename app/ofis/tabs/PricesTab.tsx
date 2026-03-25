"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function PricesTab() {
    const [recentPrices, setRecentPrices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);
    const [importMessage, setImportMessage] = useState("");

    useEffect(() => {
        loadRecentPrices();
    }, []);

    async function loadRecentPrices() {
        const { data, error } = await supabase
            .from("plate_prices")
            .select(`
                *,
                plates:plate_id (
                    short_name,
                    brands:brand_id (name)
                )
            `)
            .order("updated_at", { ascending: false })
            .limit(10);

        if (!error && data) {
            setRecentPrices(data);
        }
        setLoading(false);
    }

    async function handleImport() {
        if (!confirm("CSV'den fiyatları import etmek istediğinizden emin misiniz? Mevcut fiyatlar güncellenecek.")) {
            return;
        }
        setImporting(true);
        setImportMessage("Import işlemi başlatılıyor...");
        try {
            setImportMessage(
                "CSV import için terminal'de şu komutu çalıştırın:\n\n" +
                "cd tasyunu-front && node import-to-supabase.js\n\n" +
                "Import tamamlandıktan sonra bu sayfayı yenileyin."
            );
        } catch (error) {
            setImportMessage("Import işlemi başarısız oldu: " + error);
        } finally {
            setImporting(false);
        }
    }

    return (
        <div className="admin-nexus-panel p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Fiyat Yönetimi</h2>
            <div className="space-y-6">
                <div className="admin-nexus-subtle p-4">
                    <h3 className="mb-2 font-semibold text-cyan-300">📥 CSV'den Toplu İmport</h3>
                    <p className="text-sm text-slate-400 mb-4">tasyunu_maliyet.csv dosyasındaki güncel fiyatları veritabanına aktar</p>
                    <div className="flex gap-3">
                        <button onClick={handleImport} disabled={importing}
                            className="rounded-xl bg-gradient-to-r from-cyan-500/90 to-blue-500/90 px-4 py-2 text-sm font-semibold text-slate-950 transition-all shadow-[0_16px_34px_rgba(23,208,255,0.24)] hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50">
                            {importing ? "İşlem Devam Ediyor..." : "Import Talimatlarını Göster"}
                        </button>
                        <button onClick={() => window.open("/tasyunu_maliyet.csv", "_blank")}
                            className="admin-nexus-button-secondary px-4 py-2 text-sm font-medium transition-all">
                            CSV Dosyasını Aç
                        </button>
                    </div>
                    {importMessage && (
                        <div className="mt-4 p-3 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05]">
                            <pre className="text-xs text-slate-300 whitespace-pre-wrap">{importMessage}</pre>
                        </div>
                    )}
                </div>
                <div className="admin-nexus-subtle p-4">
                    <h3 className="font-semibold text-white mb-2">📊 Toplu İşlemler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Tüm Fiyatlara % Artış/İndirim</label>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Ör: 10" className="admin-nexus-input flex-1 px-3 py-2 text-sm" />
                                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-slate-950 text-sm font-semibold transition-all shadow-[0_16px_34px_rgba(23,208,255,0.24)] hover:from-cyan-400 hover:to-blue-400">Uygula</button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Pozitif: artış, Negatif: indirim</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Marka Bazlı Güncelleme</label>
                            <select className="admin-nexus-input w-full px-3 py-2 text-sm">
                                <option value="">Marka seçin...</option>
                                <option>Dalmaçyalı</option>
                                <option>Expert</option>
                                <option>Fawori</option>
                                <option>Optimix</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-white mb-3">
                        Son Fiyat Güncellemeleri
                        <button onClick={loadRecentPrices} className="ml-3 text-xs text-blue-400 hover:text-blue-300 transition-colors">🔄 Yenile</button>
                    </h3>
                    {loading ? (
                        <p className="text-slate-400">Yükleniyor...</p>
                    ) : (
                        <div className="admin-nexus-table-wrap">
                            <table className="admin-nexus-table min-w-full">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ürün</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Kalınlık</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Fiyat (KDV Hariç)</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Güncelleme</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPrices.map((price) => (
                                        <tr key={price.id}>
                                            <td className="px-4 py-3 text-sm text-white">{(price.plates as any)?.brands?.name} {(price.plates as any)?.short_name}</td>
                                            <td className="px-4 py-3 text-sm text-slate-400">{price.thickness}cm</td>
                                            <td className="px-4 py-3 text-sm font-medium text-orange-400">{price.base_price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</td>
                                            <td className="px-4 py-3 text-sm text-slate-500">{new Date(price.updated_at).toLocaleDateString("tr-TR")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {recentPrices.length === 0 && <p className="text-center text-slate-500 py-8">Fiyat kaydı bulunamadı</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
