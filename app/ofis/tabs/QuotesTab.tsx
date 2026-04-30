"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { buildBrandRanking, formatCurrency } from "@/lib/admin/utils";

export function QuotesTab() {
    const [quotes, setQuotes] = useState<any[]>([]);
    const [quoteEventsById, setQuoteEventsById] = useState<Record<string, any[]>>({});
    const [funnelSummary, setFunnelSummary] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [requestTypeFilter, setRequestTypeFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadQuotes();
    }, []);

    async function loadQuotes() {
        setLoading(true);
        const res = await fetch(`/api/admin/quotes`, { cache: "no-store" });
        const payload = await res.json().catch(() => null);
        if (res.ok && payload?.ok) {
            setQuotes(payload.quotes ?? []);
            setQuoteEventsById(payload.eventsByQuoteId ?? {});
            setFunnelSummary(payload.funnelSummary ?? {});
        } else {
            setQuotes([]);
            setQuoteEventsById({});
            setFunnelSummary({});
        }
        setLoading(false);
    }

    async function deleteQuote(quoteId: number) {
        const res = await fetch(`/api/admin/quotes/${quoteId}`, { method: "DELETE" });
        const payload = await res.json().catch(() => null);
        if (res.ok && payload?.ok) {
            if (selectedQuote?.id === quoteId) setSelectedQuote(null);
            loadQuotes();
        }
    }

    async function updateQuoteStatus(quoteId: number, newStatus: string) {
        const res = await fetch(`/api/admin/quotes/${quoteId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        const payload = await res.json().catch(() => null);
        if (res.ok && payload?.ok) {
            loadQuotes();
            if (selectedQuote?.id === quoteId) {
                setSelectedQuote({ ...selectedQuote, status: newStatus });
            }
        }
    }

    async function updateQuotePriority(quoteId: number, newPriority: string) {
        const res = await fetch(`/api/admin/quotes/${quoteId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ priority: newPriority }),
        });
        const payload = await res.json().catch(() => null);
        if (res.ok && payload?.ok) {
            loadQuotes();
            if (selectedQuote?.id === quoteId) {
                setSelectedQuote({ ...selectedQuote, priority: newPriority });
            }
        }
    }

    const getRequestTypeBadge = (requestType: string) => {
        const style = requestType === "pdf_quote"
            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
            : "bg-green-500/20 text-green-400 border-green-500/30";
        const label = requestType === "pdf_quote" ? "Teklif Verildi" : "Sipariş Onayı";
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
                {label}
            </span>
        );
    };

    const getEventLabel = (eventType: string) => {
        const labels: Record<string, string> = {
            calculator_results_shown: "Sonuçlar Gösterildi",
            quote_modal_opened: "Teklif Formu Açıldı",
            quote_submitted: "Teklif Kaydı Oluştu",
            pdf_quote_requested: "PDF Teklifi İstendi",
            whatsapp_order_requested: "WhatsApp Sipariş Onayı",
            whatsapp_opened: "WhatsApp Açıldı",
            pdf_downloaded: "PDF İndirildi",
        };
        return labels[eventType] || eventType;
    };

    const quoteSummary = {
        total: quotes.length,
        pending: quotes.filter((q) => q.status === "pending").length,
        pdfQuote: quotes.filter((q) => q.request_type === "pdf_quote").length,
        whatsappOrder: quotes.filter((q) => q.request_type === "whatsapp_order").length,
    };

    const topQuoteBrands = buildBrandRanking(quotes, 4);
    const totalQuoteValue = quotes.reduce((sum, q) => sum + (Number(q.total_price) || 0), 0);
    const averageQuoteValue = quotes.length > 0 ? totalQuoteValue / quotes.length : 0;
    const todayQuoteCount = quotes.filter((q) => {
        const created = new Date(q.created_at);
        const now = new Date();
        return created.getFullYear() === now.getFullYear() &&
            created.getMonth() === now.getMonth() &&
            created.getDate() === now.getDate();
    }).length;
    const uniqueQuoteCities = new Set(quotes.map((q) => q.city_name).filter(Boolean)).size;
    const selectedQuoteEvents = selectedQuote ? (quoteEventsById[String(selectedQuote.id)] ?? []) : [];

    const filteredQuotes = quotes.filter((quote) => {
        const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
        const matchesRequestType = requestTypeFilter === "all" || quote.request_type === requestTypeFilter;
        const haystack = [quote.customer_name, quote.customer_email, quote.customer_phone, quote.brand_name, quote.package_name, quote.city_name, quote.quote_code]
            .filter(Boolean).join(" ").toLocaleLowerCase("tr-TR");
        const matchesSearch = searchTerm.trim().length === 0 || haystack.includes(searchTerm.trim().toLocaleLowerCase("tr-TR"));
        return matchesStatus && matchesRequestType && matchesSearch;
    });

    const approvedCount = quotes.filter((q) => q.status === "approved").length;
    const onayOrani = quoteSummary.total > 0 ? Math.round((approvedCount / quoteSummary.total) * 100) : 0;

    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - 5 + i);
        const y = d.getFullYear(), m = d.getMonth();
        return {
            label: d.toLocaleDateString("tr-TR", { month: "short" }),
            count: quotes.filter((q) => { const qd = new Date(q.created_at); return qd.getFullYear() === y && qd.getMonth() === m; }).length,
        };
    });
    const maxMonthly = Math.max(...last6Months.map((d) => d.count), 1);

    const urgencyStyle: Record<string, string> = {
        urgent: "border-red-400/30 bg-red-400/10 text-red-200",
        high:   "border-amber-400/30 bg-amber-400/10 text-amber-200",
        normal: "border-amber-400/30 bg-amber-400/10 text-amber-200",
        low:    "border-white/10 bg-white/5 text-slate-400",
    };
    const urgencyLabel: Record<string, string> = { urgent: "Acil", high: "Yüksek", normal: "Normal", low: "Düşük" };

    const topBrandToday = topQuoteBrands[0]?.[0] ?? null;
    const pdfRate = quoteSummary.total > 0 ? Math.round((quoteSummary.pdfQuote / quoteSummary.total) * 100) : 0;
    const insights = [
        topBrandToday ? `${topBrandToday} markası şu an talepler arasında liderliğini sürdürüyor.` : "Henüz marka verisi oluşmadı.",
        pdfRate > 50 ? `PDF teklif oranı yüksek seyrediyor (%${pdfRate}).` : `PDF teklif oranı %${pdfRate} — WhatsApp kanalı öne çıkıyor.`,
        uniqueQuoteCities > 1 ? `${uniqueQuoteCities} farklı şehirden talep geldi.` : "Teklifler henüz tek şehirde yoğunlaşıyor.",
    ];

    const kpis = [
        { label: "Toplam Talep", value: String(quoteSummary.total), sub: `Bugün ${todayQuoteCount} yeni`, accent: "from-amber-400/30 to-amber-500/5", border: "border-amber-400/30", glow: "shadow-amber-500/10", icon: "◈", pct: Math.min(100, quoteSummary.total * 4) },
        { label: "Bekleyen Kritik", value: String(quoteSummary.pending), sub: quoteSummary.pending > 0 ? `${quoteSummary.pending} teklif yanıt bekliyor` : "Bekleyen talep yok", accent: "from-amber-400/25 to-orange-500/5", border: "border-amber-400/30", glow: "shadow-amber-500/10", icon: "⧖", pct: quoteSummary.total > 0 ? Math.round((quoteSummary.pending / quoteSummary.total) * 100) : 0 },
        { label: "Toplam Ciro", value: totalQuoteValue >= 1_000_000 ? `₺${(totalQuoteValue / 1_000_000).toFixed(2)}M` : totalQuoteValue >= 1000 ? `₺${(totalQuoteValue / 1000).toFixed(1)}K` : formatCurrency(totalQuoteValue), sub: `Ort. ${formatCurrency(averageQuoteValue)} / teklif`, accent: "from-emerald-400/25 to-emerald-500/5", border: "border-emerald-400/30", glow: "shadow-emerald-500/10", icon: "⬢", pct: 68 },
        { label: "Onay Oranı", value: `%${onayOrani}`, sub: `${approvedCount} teklif onaylandı`, accent: "from-fuchsia-400/20 to-violet-500/5", border: "border-fuchsia-400/25", glow: "shadow-fuchsia-500/10", icon: "✦", pct: onayOrani },
    ];

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-[28px] border border-white/8 bg-slate-950/55 h-36 animate-pulse" />
                    ))}
                </div>
                <div className="rounded-[32px] border border-white/10 bg-slate-950/45 p-8 text-center text-slate-500">
                    Teklifler yükleniyor...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <div className="text-xs uppercase tracking-[0.26em] text-slate-500">Operasyon • Canlı</div>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">Teklif Komuta Merkezi</h1>
                    <p className="mt-1 text-sm text-slate-400 max-w-xl">
                        Teklif akışını, durum dağılımını ve kanal performansını tek ekrandan izleyin.
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    {todayQuoteCount > 0 && (
                        <span className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200 shadow-lg shadow-amber-500/10">
                            Bugün {todayQuoteCount} teklif
                        </span>
                    )}
                    <button onClick={loadQuotes} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/8 hover:text-white transition">
                        Yenile
                    </button>
                </div>
            </div>

            {/* KPI Kartlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map((item) => (
                    <div key={item.label} className={`relative overflow-hidden rounded-[28px] border ${item.border} bg-slate-950/55 p-5 shadow-2xl ${item.glow}`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.accent}`} />
                        <div className="relative z-10">
                            <div className="flex items-start justify-between">
                                <div className="text-[11px] uppercase tracking-[0.32em] text-slate-400">{item.label}</div>
                                <div className="text-xl text-white/70">{item.icon}</div>
                            </div>
                            <div className="mt-3 text-3xl font-semibold tracking-tight">{item.value}</div>
                            <div className="mt-4 text-xs text-slate-400">{item.sub}</div>
                            <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-white/70 to-amber-300" style={{ width: `${Math.max(4, item.pct)}%` }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Teklif Ritmi + Markalar */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5">
                <div className="rounded-[32px] border border-white/10 bg-slate-950/45 backdrop-blur-xl p-5 shadow-2xl shadow-black/20">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="text-xs uppercase tracking-[0.28em] text-amber-300/80">Canlı Görünüm</div>
                            <h2 className="mt-1.5 text-xl font-semibold">Teklif Ritmi</h2>
                        </div>
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">{quotes.length} toplam</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.9fr] gap-4">
                        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-slate-300">Aylık Teklif Hacmi</div>
                                <div className="text-xs text-slate-500">Son 6 ay</div>
                            </div>
                            <div className="h-40 flex items-end gap-3 px-1">
                                {last6Months.map((m, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full rounded-t-xl bg-gradient-to-t from-amber-500/30 via-amber-400/50 to-amber-300/90 border border-amber-300/20 shadow-lg shadow-amber-500/10 min-h-[6px]"
                                            style={{ height: `${Math.max(6, (m.count / maxMonthly) * 100)}%` }} />
                                        <span className="text-[10px] text-slate-500">{m.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                                <div className="text-sm text-slate-300 mb-3">Durum Akışı</div>
                                {[
                                    { label: "Bekliyor", value: quoteSummary.pending, gradient: "from-amber-300 to-orange-400" },
                                    { label: "Teklif Verildi", value: quotes.filter((q) => q.status === "quoted").length, gradient: "from-fuchsia-400 to-violet-500" },
                                    { label: "Onaylandı", value: approvedCount, gradient: "from-emerald-400 to-teal-400" },
                                    { label: "İletişimde", value: quotes.filter((q) => q.status === "contacted").length, gradient: "from-amber-400 to-amber-500" },
                                ].map(({ label, value, gradient }) => (
                                    <div key={label} className="mb-3 last:mb-0">
                                        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300">
                                            <span>{label}</span><span>{value}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                            <div className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                                                style={{ width: `${quoteSummary.total > 0 ? Math.max(value > 0 ? 6 : 0, Math.round((value / quoteSummary.total) * 100)) : 0}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                                <div className="text-sm text-slate-300 mb-3">Anlık İçgörü</div>
                                <div className="space-y-2">
                                    {insights.map((txt, i) => (
                                        <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-xs text-slate-400">{txt}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-[32px] border border-white/10 bg-slate-950/45 p-5">
                        <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Nabız</div>
                        <h3 className="mt-1.5 text-xl font-semibold">En Çok Talep Alan</h3>
                        <div className="mt-4 space-y-2">
                            {topQuoteBrands.length > 0 ? topQuoteBrands.map(([brand, count], i) => (
                                <div key={brand} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-7 w-7 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xs text-amber-200">{i + 1}</div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-100">{brand}</div>
                                                <div className="text-xs text-slate-500">Teklif sayısı</div>
                                            </div>
                                        </div>
                                        <div className="font-semibold text-slate-50">{count}</div>
                                    </div>
                                </div>
                            )) : (
                                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4 text-sm text-slate-500">Henüz marka verisi oluşmadı.</div>
                            )}
                        </div>
                    </div>
                    <div className="rounded-[32px] border border-white/10 bg-slate-950/45 p-5">
                        <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Kanal</div>
                        <h3 className="mt-1.5 text-xl font-semibold">Talep Türleri</h3>
                        <div className="mt-4 space-y-3">
                            {[
                                { label: "PDF Teklif", value: quoteSummary.pdfQuote, gradient: "from-fuchsia-400 to-violet-500" },
                                { label: "WhatsApp Onay", value: quoteSummary.whatsappOrder, gradient: "from-emerald-400 to-teal-400" },
                                { label: "PDF İndirme", value: funnelSummary.pdf_downloaded || 0, gradient: "from-amber-400 to-orange-500" },
                                { label: "WA Açılışı", value: funnelSummary.whatsapp_opened || 0, gradient: "from-green-400 to-emerald-500" },
                            ].map(({ label, value, gradient }) => (
                                <div key={label}>
                                    <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300"><span>{label}</span><span>{value}</span></div>
                                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                        <div className={`h-full rounded-full bg-gradient-to-r ${gradient}`} style={{ width: `${Math.max(4, Math.min(100, value * 8))}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Teklif Masası */}
            <div className="rounded-[32px] border border-white/10 bg-slate-950/45 p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <div>
                        <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Operasyon</div>
                        <h2 className="mt-1.5 text-xl font-semibold">Teklif Masası</h2>
                        <p className="mt-1 text-xs text-slate-500">{filteredQuotes.length} / {quotes.length} teklif gösteriliyor</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                        {[
                            { value: "all", label: "Tümü" },
                            { value: "pending", label: "Bekliyor" },
                            { value: "quoted", label: "Teklif Verildi" },
                            { value: "approved", label: "Onaylandı" },
                            { value: "rejected", label: "Reddedildi" },
                            { value: "completed", label: "Tamamlandı" },
                        ].map((f) => (
                            <button key={f.value} onClick={() => setStatusFilter(f.value)}
                                className={`rounded-full px-4 py-1.5 border text-xs font-medium transition ${statusFilter === f.value ? "bg-white text-slate-900 border-white" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/8 hover:text-white"}`}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid gap-3 md:grid-cols-[200px_1fr] mb-5">
                    <select value={requestTypeFilter} onChange={(e) => setRequestTypeFilter(e.target.value)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-amber-400/40">
                        <option value="all">Tüm Talep Türleri</option>
                        <option value="pdf_quote">PDF Teklif</option>
                        <option value="whatsapp_order">WhatsApp Onay</option>
                    </select>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Müşteri, marka, şehir veya paket ara..."
                            className="w-full rounded-2xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/40" />
                    </div>
                </div>
                <div className="space-y-3">
                    {filteredQuotes.length === 0 ? (
                        <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-8 text-center text-slate-500">Seçili filtrelerde teklif talebi bulunmuyor.</div>
                    ) : filteredQuotes.map((quote) => (
                        <div key={quote.id} className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-4 hover:bg-white/[0.05] transition">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-base font-semibold text-white">{quote.customer_name}</span>
                                        {quote.quote_code && (
                                            <span className="rounded-md px-2 py-0.5 text-xs font-mono bg-white/8 text-slate-400 border border-white/10">
                                                {quote.quote_code}
                                            </span>
                                        )}
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs border ${urgencyStyle[quote.priority] ?? urgencyStyle.normal}`}>
                                            {urgencyLabel[quote.priority] ?? "Normal"}
                                        </span>
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs border ${quote.request_type === "pdf_quote" ? "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"}`}>
                                            {quote.request_type === "pdf_quote" ? "PDF" : "WhatsApp"}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-sm text-slate-400 truncate">
                                        {quote.brand_name || "Marka yok"} • {quote.package_name || "Paket yok"} • {quote.material_type === "tasyunu" ? "Taşyünü" : "EPS"} {quote.thickness_cm}cm • {quote.area_m2} m² • {quote.city_name || "—"}
                                    </div>
                                    <div className="mt-0.5 text-xs text-slate-600">
                                        {new Date(quote.created_at).toLocaleDateString("tr-TR")} {new Date(quote.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 flex-shrink-0">
                                    <div className="text-right">
                                        <div className="text-xl font-semibold text-white">{quote.total_price.toLocaleString("tr-TR")} ₺</div>
                                        <div className="text-xs text-slate-500">{quote.price_per_m2.toFixed(2)} ₺/m²</div>
                                    </div>
                                    <select value={quote.status} onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400/40 min-w-[130px]">
                                        <option value="pending">Bekliyor</option>
                                        <option value="contacted">İletişimde</option>
                                        <option value="quoted">Teklif Verildi</option>
                                        <option value="approved">Onaylandı</option>
                                        <option value="rejected">Reddedildi</option>
                                        <option value="completed">Tamamlandı</option>
                                    </select>
                                    <select value={quote.priority} onChange={(e) => updateQuotePriority(quote.id, e.target.value)}
                                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400/40 min-w-[100px]">
                                        <option value="low">Düşük</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">Yüksek</option>
                                        <option value="urgent">Acil</option>
                                    </select>
                                    {quote.pdf_url && (
                                        <a
                                            href={quote.pdf_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-2xl border border-sky-400/25 bg-sky-400/10 px-3 py-2 text-xs text-sky-300 hover:bg-sky-400/15 transition whitespace-nowrap"
                                            title="PDF Görüntüle"
                                        >
                                            PDF
                                        </a>
                                    )}
                                    <button onClick={() => setSelectedQuote(quote)}
                                        className="rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-xs text-amber-200 hover:bg-amber-400/15 transition whitespace-nowrap">
                                        Detay →
                                    </button>
                                    <button onClick={() => { if (confirm(`"${quote.customer_name}" teklifini silmek istiyor musunuz?\nBu işlem geri alınamaz.`)) { deleteQuote(quote.id); } }}
                                        className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-2 text-red-400/60 hover:bg-red-500/15 hover:text-red-300 hover:border-red-500/35 transition" title="Teklifi sil">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quote Detail Modal */}
            {selectedQuote && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="admin-nexus-panel max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl">
                        <div className="sticky top-0 rounded-t-2xl border-b border-amber-400/20 bg-gradient-to-r from-amber-500/18 via-orange-500/14 to-slate-900 p-6 text-white shadow-[0_18px_34px_rgba(2,8,23,0.34)]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">
                                        Teklif Detayı #{selectedQuote.id}
                                        {selectedQuote.quote_code && (
                                            <span className="ml-3 text-base font-mono font-normal text-amber-300/80">{selectedQuote.quote_code}</span>
                                        )}
                                    </h3>
                                        <p className="text-orange-100 text-sm">{new Date(selectedQuote.created_at).toLocaleString("tr-TR")}</p>
                                    {selectedQuote.pdf_url && (
                                        <div className="flex gap-2 mt-3">
                                            <a
                                                href={selectedQuote.pdf_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-xl bg-sky-500/20 border border-sky-400/30 px-4 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/30 transition"
                                            >
                                                PDF Görüntüle
                                            </a>
                                            <a
                                                href={selectedQuote.pdf_url}
                                                download
                                                className="rounded-xl bg-white/8 border border-white/15 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/12 transition"
                                            >
                                                ↓ İndir
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setSelectedQuote(null)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="admin-nexus-subtle p-4">
                                <h4 className="font-semibold text-blue-300 mb-3">👤 Müşteri Bilgileri</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-slate-400">Ad Soyad:</span><div className="font-medium text-white">{selectedQuote.customer_name}</div></div>
                                    <div><span className="text-slate-400">E-posta:</span><div className="font-medium text-white">{selectedQuote.customer_email}</div></div>
                                    <div><span className="text-slate-400">Telefon:</span><div className="font-medium text-white">{selectedQuote.customer_phone}</div></div>
                                    {selectedQuote.customer_company && <div><span className="text-slate-400">Firma:</span><div className="font-medium text-white">{selectedQuote.customer_company}</div></div>}
                                    {selectedQuote.customer_address && <div className="col-span-2"><span className="text-slate-400">Adres:</span><div className="font-medium text-white">{selectedQuote.customer_address}</div></div>}
                                </div>
                            </div>
                            <div className="admin-nexus-subtle p-4">
                                <h4 className="font-semibold text-orange-300 mb-3">📦 Sipariş Detayları</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-slate-400">Paket:</span><div className="font-medium text-white">{selectedQuote.package_name}</div></div>
                                    <div><span className="text-slate-400">Marka:</span><div className="font-medium text-white">{selectedQuote.brand_name}</div></div>
                                    <div><span className="text-slate-400">Talep Türü:</span><div className="mt-1">{getRequestTypeBadge(selectedQuote.request_type)}</div></div>
                                    <div><span className="text-slate-400">Malzeme:</span><div className="font-medium text-white">{selectedQuote.material_type === "tasyunu" ? "Taşyünü" : "EPS"} {selectedQuote.thickness_cm}cm</div></div>
                                    <div><span className="text-slate-400">Metraj:</span><div className="font-medium text-white">{selectedQuote.area_m2} m²</div></div>
                                    <div><span className="text-slate-400">Şehir:</span><div className="font-medium text-white">{selectedQuote.city_name}</div></div>
                                    <div><span className="text-slate-400">Paket Sayısı:</span><div className="font-medium text-white">{selectedQuote.package_count} paket</div></div>
                                </div>
                            </div>
                            <div className="bg-green-600/20 rounded-xl p-4 border border-green-500/30">
                                <h4 className="font-semibold text-green-300 mb-3">💰 Fiyat Bilgileri</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-slate-400">KDV Hariç:</span><div className="font-medium text-white">{selectedQuote.price_without_vat.toLocaleString("tr-TR")} ₺</div></div>
                                    <div><span className="text-slate-400">KDV:</span><div className="font-medium text-white">{selectedQuote.vat_amount.toLocaleString("tr-TR")} ₺</div></div>
                                    <div><span className="text-slate-400">Toplam:</span><div className="font-bold text-green-400 text-lg">{selectedQuote.total_price.toLocaleString("tr-TR")} ₺</div></div>
                                    <div><span className="text-slate-400">m² Fiyatı:</span><div className="font-medium text-white">{selectedQuote.price_per_m2.toFixed(2)} ₺/m²</div></div>
                                </div>
                            </div>
                            {selectedQuote.vehicle_type && (
                                <div className="bg-purple-600/20 rounded-xl p-4 border border-purple-500/30">
                                    <h4 className="font-semibold text-purple-300 mb-3">🚚 Lojistik Bilgileri</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-slate-400">Araç Tipi:</span><div className="font-medium text-white">{selectedQuote.vehicle_type === "lorry" && "Kamyon"}{selectedQuote.vehicle_type === "truck" && "Tır"}{selectedQuote.vehicle_type === "multiple" && "Birden Fazla Araç"}</div></div>
                                        <div><span className="text-slate-400">Paket Sayısı:</span><div className="font-medium text-white">{selectedQuote.package_count} paket</div></div>
                                        {selectedQuote.lorry_fill_percentage && <div><span className="text-slate-400">Kamyon Doluluk:</span><div className="font-medium text-white">{selectedQuote.lorry_fill_percentage.toFixed(0)}%</div></div>}
                                        {selectedQuote.truck_fill_percentage && <div><span className="text-slate-400">Tır Doluluk:</span><div className="font-medium text-white">{selectedQuote.truck_fill_percentage.toFixed(0)}%</div></div>}
                                    </div>
                                </div>
                            )}
                            <div className="admin-nexus-subtle p-4">
                                <h4 className="mb-3 font-semibold text-amber-300">Akış Zaman Çizgisi</h4>
                                <div className="space-y-3">
                                    {selectedQuoteEvents.length > 0 ? selectedQuoteEvents.map((event) => (
                                        <div key={event.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-700/50 bg-slate-950/35 p-4">
                                            <div>
                                                <p className="font-medium text-slate-100">{getEventLabel(event.event_type)}</p>
                                                <p className="mt-1 text-xs text-slate-500">{event.brand_name || selectedQuote.brand_name || "Marka yok"} • {event.package_name || selectedQuote.package_name || "Paket yok"}</p>
                                                {event.metadata && Object.keys(event.metadata).length > 0 && (
                                                    <p className="mt-2 text-xs text-slate-500">Kanal: {event.metadata.sourceChannel || "bilinmiyor"}</p>
                                                )}
                                            </div>
                                            <div className="text-right text-xs text-slate-500">
                                                {new Date(event.created_at).toLocaleDateString("tr-TR")}
                                                <div className="mt-1">{new Date(event.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="rounded-2xl border border-slate-700/50 bg-slate-950/35 p-4 text-sm text-slate-500">Bu teklif için henüz funnel event kaydı görünmüyor.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
