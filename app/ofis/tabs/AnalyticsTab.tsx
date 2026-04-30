"use client";

import { useState, useEffect } from "react";
import type { CombinationMetrics } from "@/app/api/admin/combination-metrics/types";
import { formatAmount, formatM2 } from "@/lib/admin/utils";

export function AnalyticsTab() {
    const [metrics, setMetrics] = useState<CombinationMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch("/api/admin/combination-metrics")
            .then((r) => r.json())
            .then((d) => { if (d.ok) setMetrics(d.metrics); else setError(true); })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="space-y-3 text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mx-auto" />
                    <p className="text-sm text-slate-500">Analiz verileri yükleniyor…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-nexus-panel p-8 text-center">
                <p className="text-sm text-slate-400">Analitik veriler alınamadı.</p>
                <p className="mt-1 text-xs text-slate-600">RPC bağlantısını kontrol et.</p>
            </div>
        );
    }

    const epsCombos = (metrics?.top_cross_combinations_7d ?? []).filter(i => i.material === 'eps');
    const rockwoolCombos = (metrics?.top_cross_combinations_7d ?? []).filter(i => i.material === 'tasyunu');

    return (
        <div className="space-y-8">
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300/80">Talep Analizi</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-50">Marka & Kombinasyon Analizi</h2>
                <p className="mt-1 text-sm text-slate-400">Son 7 günlük teklif verisinden türetilmiştir.</p>
            </div>

            {/* Bölüm 1: Marka Sıralamaları — 3 tablo */}
            <div className="grid gap-6 xl:grid-cols-3">
                {/* EPS Markaları */}
                <div className="admin-nexus-panel p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">EPS Markaları <span className="text-slate-600">(7g)</span></p>
                    </div>
                    {(metrics?.eps_brands_7d ?? []).length > 0 ? (
                        <div>
                            <div className="grid grid-cols-[1.5rem_1fr_2.5rem_4rem_4rem] gap-x-2 px-1 pb-1.5 border-b border-slate-800">
                                <span className="text-[9px] uppercase text-slate-700">#</span>
                                <span className="text-[9px] uppercase text-slate-700">Marka</span>
                                <span className="text-[9px] uppercase text-slate-700 text-right">Teklif</span>
                                <span className="text-[9px] uppercase text-slate-700 text-right">m²</span>
                                <span className="text-[9px] uppercase text-slate-700 text-right">Tutar</span>
                            </div>
                            <div className="space-y-0.5 mt-1">
                                {metrics!.eps_brands_7d.map((item, i) => (
                                    <div key={item.brand} className="grid grid-cols-[1.5rem_1fr_2.5rem_4rem_4rem] gap-x-2 px-1 py-1.5 rounded hover:bg-slate-800/40 transition-colors">
                                        <span className="text-[10px] text-slate-600">{i + 1}</span>
                                        <span className="text-xs text-slate-200 font-medium truncate">{item.brand}</span>
                                        <span className="text-xs text-slate-300 text-right">{item.count}</span>
                                        <span className="text-[11px] text-amber-400/80 text-right">{formatM2(item.area_m2 ?? 0)}</span>
                                        <span className="text-[11px] text-amber-400/80 text-right">{formatAmount(item.amount ?? 0)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500">Son 7 günde EPS talebi yok.</p>
                    )}
                </div>

                {/* Taşyünü Markaları */}
                <div className="admin-nexus-panel p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Taşyünü Markaları <span className="text-slate-600">(7g)</span></p>
                    </div>
                    {(metrics?.rockwool_brands_7d ?? []).length > 0 ? (
                        <div>
                            <div className="grid grid-cols-[1.5rem_1fr_2.5rem_4rem_4rem] gap-x-2 px-1 pb-1.5 border-b border-slate-800">
                                <span className="text-[9px] uppercase text-slate-700">#</span>
                                <span className="text-[9px] uppercase text-slate-700">Marka</span>
                                <span className="text-[9px] uppercase text-slate-700 text-right">Teklif</span>
                                <span className="text-[9px] uppercase text-slate-700 text-right">m²</span>
                                <span className="text-[9px] uppercase text-slate-700 text-right">Tutar</span>
                            </div>
                            <div className="space-y-0.5 mt-1">
                                {metrics!.rockwool_brands_7d.map((item, i) => (
                                    <div key={item.brand} className="grid grid-cols-[1.5rem_1fr_2.5rem_4rem_4rem] gap-x-2 px-1 py-1.5 rounded hover:bg-slate-800/40 transition-colors">
                                        <span className="text-[10px] text-slate-600">{i + 1}</span>
                                        <span className="text-xs text-slate-200 font-medium truncate">{item.brand}</span>
                                        <span className="text-xs text-slate-300 text-right">{item.count}</span>
                                        <span className="text-[11px] text-amber-400/80 text-right">{formatM2(item.area_m2 ?? 0)}</span>
                                        <span className="text-[11px] text-amber-400/80 text-right">{formatAmount(item.amount ?? 0)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500">Son 7 günde Taşyünü talebi yok.</p>
                    )}
                </div>

                {/* Toz Grubu Markaları */}
                <div className="admin-nexus-panel p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Toz Grubu Markaları <span className="text-slate-600">(7g)</span></p>
                    </div>
                    {(metrics?.powder_brands_7d ?? []).length > 0 ? (
                        <div>
                            <div className="grid grid-cols-[1.5rem_1fr_2.5rem_4rem_4rem] gap-x-2 px-1 pb-1.5 border-b border-slate-800">
                                <span className="text-[9px] uppercase text-slate-700">#</span>
                                <span className="text-[9px] uppercase text-slate-700">Marka</span>
                                <span className="text-[9px] uppercase text-slate-700 text-right">Teklif</span>
                                <span className="text-[9px] uppercase text-slate-700 text-right">m²</span>
                                <span className="text-[9px] uppercase text-slate-700 text-right">Tutar</span>
                            </div>
                            <div className="space-y-0.5 mt-1">
                                {metrics!.powder_brands_7d.map((item, i) => (
                                    <div key={item.brand} className="grid grid-cols-[1.5rem_1fr_2.5rem_4rem_4rem] gap-x-2 px-1 py-1.5 rounded hover:bg-slate-800/40 transition-colors">
                                        <span className="text-[10px] text-slate-600">{i + 1}</span>
                                        <span className="text-xs text-slate-200 font-medium truncate">{item.brand}</span>
                                        <span className="text-xs text-slate-300 text-right">{item.count}</span>
                                        <span className="text-[11px] text-amber-400/80 text-right">{formatM2(item.area_m2 ?? 0)}</span>
                                        <span className="text-[11px] text-amber-400/80 text-right">{formatAmount(item.amount ?? 0)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500">Son 7 günde toz grubu verisi yok.</p>
                    )}
                </div>
            </div>

            {/* Bölüm 2 & 3: Kombinasyon Setleri */}
            <div className="grid gap-6 xl:grid-cols-2">
                {/* EPS Kombinasyonları */}
                <div className="admin-nexus-panel p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">E</span>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">EPS Kombinasyonları <span className="text-slate-600">(7g)</span></p>
                    </div>
                    <div className="space-y-2">
                        {epsCombos.length > 0 ? epsCombos.map((item, index) => (
                            <div key={`${item.plate_brand}-${item.model}-${item.powder_brand}`} className="admin-nexus-subtle px-3 py-2.5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="text-[10px] text-slate-600 w-4 flex-shrink-0">#{index + 1}</span>
                                        <p className="text-xs text-slate-200 truncate">
                                            <span className="font-medium">{item.plate_brand}</span>
                                            {item.model !== "—" && <span className="text-slate-400"> {item.model}</span>}
                                            <span className="mx-1.5 text-slate-600">×</span>
                                            <span className="text-amber-300/80">{item.powder_brand}</span>
                                        </p>
                                    </div>
                                    <span className="flex-shrink-0 text-sm font-semibold text-slate-50">{item.count}</span>
                                </div>
                                <div className="mt-1 ml-6 flex gap-2 text-[11px]">
                                    <span className="text-amber-400/80">{formatM2(item.area_m2 ?? 0)}</span>
                                    <span className="text-slate-700">·</span>
                                    <span className="text-amber-400/80">{formatAmount(item.amount ?? 0)}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500">Son 7 günde EPS kombinasyonu yok.</p>
                        )}
                    </div>
                </div>

                {/* Taşyünü Kombinasyonları */}
                <div className="admin-nexus-panel p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">T</span>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Taşyünü Kombinasyonları <span className="text-slate-600">(7g)</span></p>
                    </div>
                    <div className="space-y-2">
                        {rockwoolCombos.length > 0 ? rockwoolCombos.map((item, index) => (
                            <div key={`${item.plate_brand}-${item.model}-${item.powder_brand}`} className="admin-nexus-subtle px-3 py-2.5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="text-[10px] text-slate-600 w-4 flex-shrink-0">#{index + 1}</span>
                                        <p className="text-xs text-slate-200 truncate">
                                            <span className="font-medium">{item.plate_brand}</span>
                                            {item.model !== "—" && <span className="text-slate-400"> {item.model}</span>}
                                            <span className="mx-1.5 text-slate-600">×</span>
                                            <span className="text-purple-300/80">{item.powder_brand}</span>
                                        </p>
                                    </div>
                                    <span className="flex-shrink-0 text-sm font-semibold text-slate-50">{item.count}</span>
                                </div>
                                <div className="mt-1 ml-6 flex gap-2 text-[11px]">
                                    <span className="text-amber-400/80">{formatM2(item.area_m2 ?? 0)}</span>
                                    <span className="text-slate-700">·</span>
                                    <span className="text-amber-400/80">{formatAmount(item.amount ?? 0)}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500">Son 7 günde Taşyünü kombinasyonu yok.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
