"use client";

import { useState, useEffect } from "react";
import {
    FileText, Clock, MessageSquare, TrendingUp, TrendingDown,
} from "lucide-react";
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { MetricCard } from "@/components/admin/MetricCard";
import type { DashboardMetrics } from "@/app/api/admin/dashboard-metrics/types";
import { buildBrandRanking, formatCurrency, formatAmount, formatM2 } from "@/lib/admin/utils";

function StatCard({ title, value, icon, color, onClick }: any) {
    const colors: Record<string, string> = {
        blue: "from-cyan-500/14 to-cyan-500/4 text-cyan-300 border-cyan-400/20",
        green: "from-emerald-500/14 to-emerald-500/4 text-emerald-300 border-emerald-400/20",
        orange: "from-amber-500/14 to-amber-500/4 text-amber-300 border-amber-400/20",
        purple: "from-fuchsia-500/14 to-fuchsia-500/4 text-fuchsia-300 border-fuchsia-400/20",
    };
    return (
        <div
            className={`admin-nexus-card bg-gradient-to-br p-6 ${colors[color as string] || colors.blue} ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(2,8,23,0.46)] transition-all duration-300' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{title}</p>
                    <p className="text-3xl font-bold mt-2 text-slate-50">{value}</p>
                </div>
                <div className="text-4xl opacity-90">{icon}</div>
            </div>
        </div>
    );
}

export function DashboardTab({ stats, onNavigate }: { stats: any; onNavigate: (tab: string) => void }) {
    const totalCatalogItems = stats.plateCount + stats.accessoryCount;
    const [dashboardQuotes, setDashboardQuotes] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [metricsError, setMetricsError] = useState(false);

    useEffect(() => {
        async function loadDashboardQuotes() {
            const res = await fetch("/api/admin/quotes", { cache: "no-store" });
            const payload = await res.json().catch(() => null);
            if (res.ok && payload?.ok) {
                setDashboardQuotes(payload.quotes ?? []);
            }
        }
        loadDashboardQuotes();
    }, []);

    useEffect(() => {
        fetch("/api/admin/dashboard-metrics")
            .then((r) => r.json())
            .then((d) => { if (d.ok) setMetrics(d.metrics); else setMetricsError(true); })
            .catch(() => setMetricsError(true));
    }, []);

    const dashboardQuoteSummary = {
        total: dashboardQuotes.length,
        pending: dashboardQuotes.filter((quote) => quote.status === "pending").length,
        pdfQuote: dashboardQuotes.filter((quote) => quote.request_type === "pdf_quote").length,
        whatsappOrder: dashboardQuotes.filter((quote) => quote.request_type === "whatsapp_order").length,
        approved: dashboardQuotes.filter((quote) => quote.status === "approved").length,
    };
    const recentQuotes = [...dashboardQuotes]
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .slice(0, 4);
    const topQuoteBrands = buildBrandRanking(dashboardQuotes, 3);

    // Son 24 saat saatlik dağılım
    const hourlyBuckets = (() => {
        const buckets = new Array(24).fill(0);
        const now = Date.now();
        for (const q of dashboardQuotes) {
            const diff = (now - new Date(q.created_at).getTime()) / (1000 * 60 * 60);
            if (diff >= 0 && diff < 24) buckets[23 - Math.floor(diff)]++;
        }
        return buckets;
    })();
    const maxHourly = Math.max(...hourlyBuckets, 1);

    void totalCatalogItems;
    void topQuoteBrands;
    void metricsError;

    return (
        <div className="space-y-6">
            {/* Zaman Penceresi KPI Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bugün */}
                <div className="admin-nexus-panel p-6 border border-cyan-500/20">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Bugün</p>
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-nx-pulse" />
                    </div>
                    {metrics ? (
                        <>
                            <p className="text-4xl font-bold text-slate-50 leading-none">{metrics.daily_total}</p>
                            <p className="text-xs text-slate-500 mt-1">teklif</p>
                            <div className="mt-4 flex items-center gap-2 text-[11px]">
                                <span className="text-sky-400/80">{metrics.today_area_m2 > 0 ? formatM2(metrics.today_area_m2) : "—"}</span>
                                <span className="text-slate-700">·</span>
                                <span className="text-amber-400/80">{metrics.today_amount > 0 ? formatAmount(metrics.today_amount) : "—"}</span>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2 mt-1">
                            <div className="h-9 w-16 bg-slate-800 rounded animate-pulse" />
                            <div className="h-3 w-24 bg-slate-800 rounded animate-pulse mt-4" />
                        </div>
                    )}
                </div>

                {/* Bu Hafta */}
                <div className="admin-nexus-panel p-6 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Bu Hafta <span className="text-slate-700">/ 7g</span></p>
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                    </div>
                    {metrics ? (
                        <>
                            <p className="text-4xl font-bold text-slate-50 leading-none">{metrics.week_count}</p>
                            <p className="text-xs text-slate-500 mt-1">teklif</p>
                            <div className="mt-4 flex items-center gap-2 text-[11px]">
                                <span className="text-sky-400/80">{metrics.week_area_m2 > 0 ? formatM2(metrics.week_area_m2) : "—"}</span>
                                <span className="text-slate-700">·</span>
                                <span className="text-amber-400/80">{metrics.week_amount > 0 ? formatAmount(metrics.week_amount) : "—"}</span>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2 mt-1">
                            <div className="h-9 w-16 bg-slate-800 rounded animate-pulse" />
                            <div className="h-3 w-24 bg-slate-800 rounded animate-pulse mt-4" />
                        </div>
                    )}
                </div>

                {/* Bu Ay */}
                <div className="admin-nexus-panel p-6 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Bu Ay <span className="text-slate-700">/ 30g</span></p>
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                    </div>
                    {metrics ? (
                        <>
                            <p className="text-4xl font-bold text-slate-50 leading-none">{metrics.month_count}</p>
                            <p className="text-xs text-slate-500 mt-1">teklif</p>
                            <div className="mt-4 flex items-center gap-2 text-[11px]">
                                <span className="text-sky-400/80">{metrics.month_area_m2 > 0 ? formatM2(metrics.month_area_m2) : "—"}</span>
                                <span className="text-slate-700">·</span>
                                <span className="text-amber-400/80">{metrics.month_amount > 0 ? formatAmount(metrics.month_amount) : "—"}</span>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2 mt-1">
                            <div className="h-9 w-16 bg-slate-800 rounded animate-pulse" />
                            <div className="h-3 w-24 bg-slate-800 rounded animate-pulse mt-4" />
                        </div>
                    )}
                </div>
            </div>

            {/* Row 2: MetricCards */}
            <div className="grid gap-4 lg:grid-cols-4">
                <MetricCard
                    title="Bugünkü Teklif"
                    value={metrics?.daily_total ?? 0}
                    icon={FileText}
                    color="blue"
                    detail="Bugün İstanbul saatiyle"
                    onClick={() => onNavigate("quotes")}
                />
                <MetricCard
                    title="Bekleyen Talep"
                    value={metrics?.daily_pending_count ?? 0}
                    icon={Clock}
                    color="amber"
                    detail="Bugün bekleyen"
                    onClick={() => onNavigate("quotes")}
                />
                <MetricCard
                    title="PDF Talepleri"
                    value={metrics?.daily_pdf_count ?? 0}
                    icon={FileText}
                    color="purple"
                    detail="Bugün PDF talebi"
                    onClick={() => onNavigate("quotes")}
                />
                <MetricCard
                    title="WhatsApp Onayı"
                    value={metrics?.daily_whatsapp_count ?? 0}
                    icon={MessageSquare}
                    color="green"
                    detail="Bugün sipariş onayı"
                    onClick={() => onNavigate("quotes")}
                />
            </div>

            {/* Row 3: Son 24 Saat — full width */}
            <div className="nx-card p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-3.5 h-3.5 text-[var(--nx-cyan)]" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--nx-text-muted)]">Son 24 Saat</p>
                </div>
                <div className="flex items-end gap-px h-14">
                    {hourlyBuckets.map((v, i) => (
                        <div
                            key={i}
                            className="flex-1 rounded-sm transition-all"
                            style={{
                                height: `${Math.max(4, (v / maxHourly) * 100)}%`,
                                background: v > 0
                                    ? "linear-gradient(to top, rgba(23,208,255,0.8), rgba(51,136,255,0.4))"
                                    : "rgba(51,65,85,0.3)",
                            }}
                            title={`${v} teklif`}
                        />
                    ))}
                </div>
                <div className="flex justify-between mt-1.5">
                    <span className="text-[9px] text-[var(--nx-text-muted)]">24s önce</span>
                    <span className="text-[9px] text-[var(--nx-text-muted)]">Şimdi</span>
                </div>
            </div>

            {/* Row 4: 2-col main */}
            <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
                {/* Sol: Son Talep Akışı + Funnel */}
                <div className="space-y-6">
                    <div className="admin-nexus-panel p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Teklif Sinyalleri</p>
                                <h3 className="mt-2 text-xl font-semibold text-slate-50">Son Talep Akışı</h3>
                            </div>
                            <button
                                onClick={() => onNavigate("quotes")}
                                className="admin-nexus-button-secondary px-3 py-2 text-xs font-medium"
                            >
                                Tekliflere Git
                            </button>
                        </div>
                        <div className="mt-4 space-y-3">
                            {recentQuotes.length > 0 ? recentQuotes.map((quote) => (
                                <div key={quote.id} className="admin-nexus-subtle flex items-start justify-between gap-4 p-4">
                                    <div>
                                        <p className="font-medium text-slate-100">{quote.customer_name}</p>
                                        <p className="mt-1 text-sm text-slate-400">
                                            {quote.brand_name || "Markasız"} • {quote.package_name || "Paket yok"} • {quote.area_m2} m²
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {new Date(quote.created_at).toLocaleDateString("tr-TR")} {new Date(quote.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-cyan-300">
                                            {quote.request_type === "pdf_quote" ? "PDF" : "WhatsApp"}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">{formatCurrency(quote.total_price)}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="admin-nexus-subtle p-4 text-sm text-slate-500">
                                    Henüz teklif akışı görünmüyor. İlk kayıt geldiğinde burası canlı takip paneli gibi çalışacak.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="admin-nexus-panel p-6">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Funnel Özeti</p>
                        <div className="mt-4 space-y-4">
                            <div className="admin-nexus-subtle p-4">
                                <div className="flex items-center justify-between text-sm text-slate-300">
                                    <span>Onaylanan oran</span>
                                    <span className="font-semibold text-slate-50">
                                        %{dashboardQuoteSummary.total > 0 ? Math.round((dashboardQuoteSummary.approved / dashboardQuoteSummary.total) * 100) : 0}
                                    </span>
                                </div>
                                <div className="mt-3 h-2 rounded-full bg-slate-800">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                                        style={{
                                            width: `${dashboardQuoteSummary.total > 0 ? Math.max(6, Math.round((dashboardQuoteSummary.approved / dashboardQuoteSummary.total) * 100)) : 0}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="admin-nexus-subtle p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Bugün Ort. Fiyat / m²</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-50">
                                    {metrics?.avg_price_per_m2_today != null
                                        ? `₺${metrics.avg_price_per_m2_today.toLocaleString('tr-TR')}`
                                        : '—'}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {metrics?.avg_price_per_m2_today != null ? 'Fiyatlı tekliflerden' : 'Bugün henüz fiyatlı teklif yok'}
                                </p>
                            </div>
                            <div className="admin-nexus-subtle p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Kanal Dağılımı</p>
                                <div className="mt-3 space-y-3 text-sm">
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span>PDF teklif</span>
                                        <span className="font-semibold text-slate-50">{metrics?.daily_pdf_count ?? 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span>WhatsApp onay</span>
                                        <span className="font-semibold text-slate-50">{metrics?.daily_whatsapp_count ?? 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="admin-nexus-subtle p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Malzeme Dengesi <span className="text-slate-600">(30g)</span></p>
                                <div className="mt-3 space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                                            <span>EPS</span>
                                            <span className="text-slate-200 font-medium">%{metrics?.eps_ratio_30d ?? 0}</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-800">
                                            <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all" style={{ width: `${metrics?.eps_ratio_30d ?? 0}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                                            <span>Taşyünü</span>
                                            <span className="text-slate-200 font-medium">%{metrics?.rockwool_ratio_30d ?? 0}</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-800">
                                            <div className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all" style={{ width: `${metrics?.rockwool_ratio_30d ?? 0}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="admin-nexus-subtle p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">EPS Markaları <span className="text-slate-600">(7g)</span></p>
                                <div className="mt-3 space-y-2">
                                    {(metrics?.eps_brands_7d ?? []).length > 0 ? (metrics?.eps_brands_7d ?? []).map((item, index) => (
                                        <div key={item.brand} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 text-xs font-semibold text-cyan-200">
                                                    {index + 1}
                                                </span>
                                                <span className="text-slate-300">{item.brand}</span>
                                            </div>
                                            <span className="font-semibold text-slate-50">{item.count}</span>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-slate-500">Son 7 günde EPS talebi yok.</p>
                                    )}
                                </div>
                            </div>
                            <div className="admin-nexus-subtle p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Taşyünü Markaları <span className="text-slate-600">(7g)</span></p>
                                <div className="mt-3 space-y-2">
                                    {(metrics?.rockwool_brands_7d ?? []).length > 0 ? (metrics?.rockwool_brands_7d ?? []).map((item, index) => (
                                        <div key={item.brand} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-purple-400/20 bg-purple-500/10 text-xs font-semibold text-purple-200">
                                                    {index + 1}
                                                </span>
                                                <span className="text-slate-300">{item.brand}</span>
                                            </div>
                                            <span className="font-semibold text-slate-50">{item.count}</span>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-slate-500">Son 7 günde Taşyünü talebi yok.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sağ: Anlık Aktivite + Malzeme Dağılımı + Ürün Kırılımı */}
                <div className="space-y-6">
                    <div className="admin-nexus-panel p-6">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Anlık Aktivite</p>
                        <div className="mt-4 space-y-3">
                            <div className="admin-nexus-subtle p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500">Son 2 saat</p>
                                        <p className="mt-1 text-3xl font-semibold text-slate-50">{metrics?.recent_2h ?? 0}</p>
                                        <p className="mt-1 text-xs text-slate-500">teklif</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {metrics?.velocity_trend === 'up' && (
                                            <TrendingUp className="h-6 w-6 text-emerald-400" />
                                        )}
                                        {metrics?.velocity_trend === 'down' && (
                                            <TrendingDown className="h-6 w-6 text-red-400" />
                                        )}
                                        {metrics?.velocity_trend === 'stable' && (
                                            <div className="h-6 w-6 flex items-center justify-center">
                                                <span className="h-0.5 w-4 bg-amber-400 rounded-full" />
                                            </div>
                                        )}
                                        {metrics?.velocity_ratio != null && (
                                            <span className={`text-xs font-semibold ${
                                                metrics.velocity_trend === 'up' ? 'text-emerald-400' :
                                                metrics.velocity_trend === 'down' ? 'text-red-400' : 'text-amber-400'
                                            }`}>
                                                {metrics.velocity_trend === 'up' ? '+' : ''}{Math.round((metrics.velocity_ratio - 1) * 100)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="admin-nexus-subtle px-4 py-3 flex items-center justify-between text-xs text-slate-400">
                                <span>Önceki 2 saat</span>
                                <span className="text-slate-300 font-medium">{metrics?.prev_2h ?? 0} teklif</span>
                            </div>
                        </div>
                    </div>

                    <div className="admin-nexus-panel p-6">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Malzeme Dağılımı <span className="text-slate-600">(30g)</span></p>
                        <div className="mt-4">
                            {metrics && (metrics.eps_ratio_30d > 0 || metrics.rockwool_ratio_30d > 0) ? (
                                <div className="flex items-center gap-4">
                                    <ResponsiveContainer width={140} height={140}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'EPS', value: metrics.eps_ratio_30d },
                                                    { name: 'Taşyünü', value: metrics.rockwool_ratio_30d },
                                                ]}
                                                cx="50%" cy="50%"
                                                innerRadius={42} outerRadius={62}
                                                dataKey="value"
                                                paddingAngle={3}
                                            >
                                                <Cell fill="#17d0ff" />
                                                <Cell fill="#a855f7" />
                                            </Pie>
                                            <RechartsTooltip
                                                formatter={(v) => [`%${v}`, '']}
                                                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '11px' }}
                                                itemStyle={{ color: '#94a3b8' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="space-y-3 flex-1">
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 flex-shrink-0" />
                                                    <span className="text-xs font-medium text-slate-200">EPS</span>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-50">%{metrics.eps_ratio_30d}</span>
                                            </div>
                                            <div className="mt-1 ml-4.5 flex gap-2 text-[10px] text-slate-500">
                                                <span>{metrics.eps_count_30d} teklif</span>
                                                <span>·</span>
                                                <span>{formatM2(metrics.eps_area_m2_30d ?? 0)}</span>
                                                <span>·</span>
                                                <span>{formatAmount(metrics.eps_amount_30d ?? 0)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2.5 w-2.5 rounded-full bg-purple-400 flex-shrink-0" />
                                                    <span className="text-xs font-medium text-slate-200">Taşyünü</span>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-50">%{metrics.rockwool_ratio_30d}</span>
                                            </div>
                                            <div className="mt-1 ml-4.5 flex gap-2 text-[10px] text-slate-500">
                                                <span>{metrics.rockwool_count_30d} teklif</span>
                                                <span>·</span>
                                                <span>{formatM2(metrics.rockwool_area_m2_30d ?? 0)}</span>
                                                <span>·</span>
                                                <span>{formatAmount(metrics.rockwool_amount_30d ?? 0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">Son 30 günde veri yok.</p>
                            )}
                        </div>
                    </div>

                    <div className="admin-nexus-panel p-6">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Ürün Kırılımı <span className="text-slate-600">(7g)</span></p>
                        <div className="mt-4 space-y-2">
                            {(metrics?.product_breakdown_7d ?? []).length > 0 ? (metrics?.product_breakdown_7d ?? []).map((item) => (
                                <div key={`${item.brand}-${item.model}-${item.material}`} className="admin-nexus-subtle flex items-center justify-between gap-3 px-3 py-2.5">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[10px] font-bold ${item.material === 'eps' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'}`}>
                                            {item.material === 'eps' ? 'E' : 'T'}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-slate-200 truncate">{item.brand}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{item.model}</p>
                                        </div>
                                    </div>
                                    <span className="flex-shrink-0 text-sm font-semibold text-slate-50">{item.count}</span>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-500">Son 7 günde ürün verisi yok.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
