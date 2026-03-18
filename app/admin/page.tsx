"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    LayoutDashboard, FileText, DollarSign, Truck, Tag, Package, Settings,
    ClipboardList, Wrench, CheckCircle2, XCircle, Flame, Snowflake,
    Info, TrendingUp, TrendingDown,
    Upload, FileSpreadsheet, AlertTriangle, CheckCircle, Database
} from "lucide-react";
import { Plate, PlatePrice, Accessory } from "@/lib/types";
import { ImportPreview } from "@/components/admin/ImportPreview";
import type { ImportPreviewRow, ImportSummary } from "@/lib/importTypes";

// Yardımcı Fonksiyonlar
const roundToKurus = (value: number): number => Math.round(value * 100) / 100;

const formatCurrency = (val: number) => {
    if (!val || isNaN(val)) return "-";
    return val.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
};

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<string>("dashboard");
    const [stats, setStats] = useState({
        plateCount: 0,
        accessoryCount: 0,
        priceCount: 0,
        cityCount: 0,
    });

    // İstatistikleri yükle
    useEffect(() => {
        async function loadStats() {
            const [platesRes, accessoriesRes, pricesRes, citiesRes] = await Promise.all([
                supabase.from("plates").select("id", { count: "exact", head: true }),
                supabase.from("accessories").select("id", { count: "exact", head: true }),
                supabase.from("plate_prices").select("id", { count: "exact", head: true }),
                supabase.from("shipping_zones").select("id", { count: "exact", head: true }),
            ]);

            setStats({
                plateCount: platesRes.count || 0,
                accessoryCount: accessoriesRes.count || 0,
                priceCount: pricesRes.count || 0,
                cityCount: citiesRes.count || 0,
            });
        }
        loadStats();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 shadow-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/30">
                                <span className="text-white font-bold text-xl">⚙️</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                                <p className="text-xs text-slate-400">TaşYünü Fiyatları Yönetim</p>
                            </div>
                        </div>
                        <a
                            href="/"
                            className="text-sm text-slate-300 hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <span>← Ana Sayfa</span>
                        </a>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Navigation */}
                <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 mb-6 overflow-hidden">
                    <div className="border-b border-slate-800/50">
                        <nav className="flex -mb-px overflow-x-auto">
                            {[
                                { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
                                { id: "quotes", label: "Teklifler", Icon: FileText },
                                { id: "prices", label: "Fiyatlar", Icon: DollarSign },
                                { id: "logistics", label: "Lojistik", Icon: Truck },
                                { id: "discounts", label: "İskontolar", Icon: Tag },
                                { id: "products", label: "Ürünler", Icon: Package },
                                { id: "excel-import", label: "Excel Fiyat Yükle", Icon: FileText },
                                { id: "settings", label: "Ayarlar", Icon: Settings },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        px-6 py-4 text-sm font-medium whitespace-nowrap flex items-center gap-2
                                        border-b-2 transition-all relative
                                        ${activeTab === tab.id
                                            ? "border-orange-500 text-orange-400 bg-slate-800/30"
                                            : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600"
                                        }
                                    `}
                                >
                                    <tab.Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {activeTab === "dashboard" && <DashboardTab stats={stats} onNavigate={setActiveTab} />}
                    {activeTab === "quotes" && <QuotesTab />}
                    {activeTab === "prices" && <PricesTab />}
                    {activeTab === "logistics" && <LogisticsTab />}
                    {activeTab === "discounts" && <DiscountsTab />}
                    {activeTab === "products" && <ProductsTab />}
                    {activeTab === "excel-import" && <ExcelImportTab />}
                    {activeTab === "settings" && <SettingsTab />}
                </div>
            </div>
        </div>
    );
}

// Dashboard Tab
function DashboardTab({ stats, onNavigate }: { stats: any; onNavigate: (tab: string) => void }) {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Levhalar"
                    value={stats.plateCount}
                    icon="📋"
                    color="blue"
                    onClick={() => onNavigate("products")}
                />
                <StatCard
                    title="Aksesuarlar"
                    value={stats.accessoryCount}
                    icon="🔧"
                    color="green"
                    onClick={() => onNavigate("products")}
                />
                <StatCard
                    title="Fiyat Kayıtları"
                    value={stats.priceCount}
                    icon="💰"
                    color="orange"
                    onClick={() => onNavigate("prices")}
                />
                <StatCard
                    title="Şehirler"
                    value={stats.cityCount}
                    icon="🗺️"
                    color="purple"
                    onClick={() => onNavigate("discounts")}
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <QuickActionButton
                        title="Excel'den Fiyat Yükle"
                        description="Güncel .xlsx listesinden fiyatları otomatik güncelle"
                        icon="📈"
                        onClick={() => onNavigate("excel-import")}
                    />
                    <QuickActionButton
                        title="Lojistik Yönetimi"
                        description="Paket kapasiteleri ve araç bilgileri"
                        icon="🚚"
                        onClick={() => onNavigate("logistics")}
                    />
                    <QuickActionButton
                        title="İskonto Ayarları"
                        description="Bölge bazlı iskonto oranları"
                        icon="🏷️"
                        onClick={() => onNavigate("discounts")}
                    />
                </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Son Güncellemeler</h2>
                <div className="space-y-3">
                    <UpdateItem
                        title="Admin paneli oluşturuldu"
                        time="Bugün, 18:00"
                        type="success"
                    />
                    <UpdateItem
                        title="68 fiyat kaydı güncellendi"
                        time="Bugün, 17:40"
                        type="success"
                    />
                    <UpdateItem
                        title="Lojistik kapasite tablosu oluşturuldu"
                        time="Bugün, 17:30"
                        type="info"
                    />
                    <UpdateItem
                        title="Frontend lojistik entegrasyonu tamamlandı"
                        time="Bugün, 17:20"
                        type="success"
                    />
                </div>
            </div>
        </div>
    );
}

// Quotes Tab
function QuotesTab() {
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        loadQuotes();
    }, [statusFilter]);

    async function loadQuotes() {
        setLoading(true);
        let query = supabase
            .from("quotes")
            .select("*")
            .order("created_at", { ascending: false });

        if (statusFilter !== "all") {
            query = query.eq("status", statusFilter);
        }

        const { data, error } = await query;

        if (!error && data) {
            setQuotes(data);
        }
        setLoading(false);
    }

    async function updateQuoteStatus(quoteId: number, newStatus: string) {
        const { error } = await supabase
            .from("quotes")
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq("id", quoteId);

        if (!error) {
            loadQuotes();
            if (selectedQuote?.id === quoteId) {
                setSelectedQuote({ ...selectedQuote, status: newStatus });
            }
        }
    }

    async function updateQuotePriority(quoteId: number, newPriority: string) {
        const { error } = await supabase
            .from("quotes")
            .update({ priority: newPriority, updated_at: new Date().toISOString() })
            .eq("id", quoteId);

        if (!error) {
            loadQuotes();
            if (selectedQuote?.id === quoteId) {
                setSelectedQuote({ ...selectedQuote, priority: newPriority });
            }
        }
    }

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            contacted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            quoted: "bg-purple-500/20 text-purple-400 border-purple-500/30",
            approved: "bg-green-500/20 text-green-400 border-green-500/30",
            rejected: "bg-red-500/20 text-red-400 border-red-500/30",
            completed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
        };

        const labels: Record<string, string> = {
            pending: "Bekliyor",
            contacted: "İletişimde",
            quoted: "Teklif Verildi",
            approved: "Onaylandı",
            rejected: "Reddedildi",
            completed: "Tamamlandı",
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
                {labels[status] || status}
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const styles: Record<string, string> = {
            low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
            normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
            urgent: "bg-red-500/20 text-red-400 border-red-500/30",
        };

        const labels: Record<string, string> = {
            low: "Düşük",
            normal: "Normal",
            high: "Yüksek",
            urgent: "Acil",
        };

        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[priority] || styles.normal}`}>
                {labels[priority] || priority}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Filters */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Teklif Talepleri</h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Toplam {quotes.length} teklif talebi
                        </p>
                    </div>
                    <button
                        onClick={loadQuotes}
                        className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-105"
                    >
                        🔄 Yenile
                    </button>
                </div>

                {/* Status Filters */}
                <div className="flex gap-2 flex-wrap">
                    {[
                        { value: "all", label: "Tümü" },
                        { value: "pending", label: "Bekliyor" },
                        { value: "contacted", label: "İletişimde" },
                        { value: "quoted", label: "Teklif Verildi" },
                        { value: "approved", label: "Onaylandı" },
                        { value: "rejected", label: "Reddedildi" },
                        { value: "completed", label: "Tamamlandı" },
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setStatusFilter(filter.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === filter.value
                                ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-600/30"
                                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quotes Table */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800/50">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tarih</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Müşteri</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Paket</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Malzeme</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Metraj</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Fiyat</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Durum</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Öncelik</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Detay</th>
                            </tr>
                        </thead>
                        <tbody className="bg-slate-900/50 divide-y divide-slate-800/50">
                            {quotes.map((quote) => (
                                <tr key={quote.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                        {new Date(quote.created_at).toLocaleDateString("tr-TR")}
                                        <div className="text-xs text-slate-500">
                                            {new Date(quote.created_at).toLocaleTimeString("tr-TR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-medium text-white">{quote.customer_name}</div>
                                        <div className="text-slate-400">{quote.customer_email}</div>
                                        <div className="text-slate-400">{quote.customer_phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-200">
                                        <div className="font-medium">{quote.package_name}</div>
                                        <div className="text-xs text-slate-500">{quote.brand_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                        {quote.material_type === "tasyunu" ? "Taşyünü" : "EPS"} {quote.thickness_cm}cm
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                                        {quote.area_m2} m²
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="font-semibold text-orange-400">
                                            {quote.total_price.toLocaleString("tr-TR")} ₺
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {quote.price_per_m2.toFixed(2)} ₺/m²
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={quote.status}
                                            onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                                            className="text-sm rounded-lg bg-slate-800 border-slate-700 text-slate-200 focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="pending">Bekliyor</option>
                                            <option value="contacted">İletişimde</option>
                                            <option value="quoted">Teklif Verildi</option>
                                            <option value="approved">Onaylandı</option>
                                            <option value="rejected">Reddedildi</option>
                                            <option value="completed">Tamamlandı</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={quote.priority}
                                            onChange={(e) => updateQuotePriority(quote.id, e.target.value)}
                                            className="text-sm rounded-lg bg-slate-800 border-slate-700 text-slate-200 focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="low">Düşük</option>
                                            <option value="normal">Normal</option>
                                            <option value="high">Yüksek</option>
                                            <option value="urgent">Acil</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => setSelectedQuote(quote)}
                                            className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                                        >
                                            Detay →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {quotes.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-400">Henüz teklif talebi bulunmamaktadır.</p>
                    </div>
                )}
            </div>

            {/* Quote Detail Modal */}
            {selectedQuote && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800">
                        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 rounded-t-2xl shadow-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Teklif Detayı #{selectedQuote.id}</h3>
                                    <p className="text-orange-100 text-sm">
                                        {new Date(selectedQuote.created_at).toLocaleString("tr-TR")}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedQuote(null)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Müşteri Bilgileri */}
                            <div className="bg-blue-600/20 rounded-xl p-4 border border-blue-500/30">
                                <h4 className="font-semibold text-blue-300 mb-3">👤 Müşteri Bilgileri</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-slate-400">Ad Soyad:</span>
                                        <div className="font-medium text-white">{selectedQuote.customer_name}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">E-posta:</span>
                                        <div className="font-medium text-white">{selectedQuote.customer_email}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Telefon:</span>
                                        <div className="font-medium text-white">{selectedQuote.customer_phone}</div>
                                    </div>
                                    {selectedQuote.customer_company && (
                                        <div>
                                            <span className="text-slate-400">Firma:</span>
                                            <div className="font-medium text-white">{selectedQuote.customer_company}</div>
                                        </div>
                                    )}
                                    {selectedQuote.customer_address && (
                                        <div className="col-span-2">
                                            <span className="text-slate-400">Adres:</span>
                                            <div className="font-medium text-white">{selectedQuote.customer_address}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sipariş Detayları */}
                            <div className="bg-orange-600/20 rounded-xl p-4 border border-orange-500/30">
                                <h4 className="font-semibold text-orange-300 mb-3">📦 Sipariş Detayları</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-slate-400">Paket:</span>
                                        <div className="font-medium text-white">{selectedQuote.package_name}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Marka:</span>
                                        <div className="font-medium text-white">{selectedQuote.brand_name}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Malzeme:</span>
                                        <div className="font-medium text-white">
                                            {selectedQuote.material_type === "tasyunu" ? "Taşyünü" : "EPS"} {selectedQuote.thickness_cm}cm
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Metraj:</span>
                                        <div className="font-medium text-white">{selectedQuote.area_m2} m²</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Şehir:</span>
                                        <div className="font-medium text-white">{selectedQuote.city_name}</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Paket Sayısı:</span>
                                        <div className="font-medium text-white">{selectedQuote.package_count} paket</div>
                                    </div>
                                </div>
                            </div>

                            {/* Fiyat Bilgileri */}
                            <div className="bg-green-600/20 rounded-xl p-4 border border-green-500/30">
                                <h4 className="font-semibold text-green-300 mb-3">💰 Fiyat Bilgileri</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-slate-400">KDV Hariç:</span>
                                        <div className="font-medium text-white">
                                            {selectedQuote.price_without_vat.toLocaleString("tr-TR")} ₺
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">KDV:</span>
                                        <div className="font-medium text-white">
                                            {selectedQuote.vat_amount.toLocaleString("tr-TR")} ₺
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Toplam:</span>
                                        <div className="font-bold text-green-400 text-lg">
                                            {selectedQuote.total_price.toLocaleString("tr-TR")} ₺
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">m² Fiyatı:</span>
                                        <div className="font-medium text-white">
                                            {selectedQuote.price_per_m2.toFixed(2)} ₺/m²
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lojistik Bilgileri */}
                            {selectedQuote.vehicle_type && (
                                <div className="bg-purple-600/20 rounded-xl p-4 border border-purple-500/30">
                                    <h4 className="font-semibold text-purple-300 mb-3">🚚 Lojistik Bilgileri</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-slate-400">Araç Tipi:</span>
                                            <div className="font-medium text-white">
                                                {selectedQuote.vehicle_type === "lorry" && "Kamyon"}
                                                {selectedQuote.vehicle_type === "truck" && "Tır"}
                                                {selectedQuote.vehicle_type === "multiple" && "Birden Fazla Araç"}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Paket Sayısı:</span>
                                            <div className="font-medium text-white">{selectedQuote.package_count} paket</div>
                                        </div>
                                        {selectedQuote.lorry_fill_percentage && (
                                            <div>
                                                <span className="text-slate-400">Kamyon Doluluk:</span>
                                                <div className="font-medium text-white">{selectedQuote.lorry_fill_percentage.toFixed(0)}%</div>
                                            </div>
                                        )}
                                        {selectedQuote.truck_fill_percentage && (
                                            <div>
                                                <span className="text-slate-400">Tır Doluluk:</span>
                                                <div className="font-medium text-white">{selectedQuote.truck_fill_percentage.toFixed(0)}%</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Prices Tab
function PricesTab() {
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
            // Note: Bu özellik için backend API endpoint gerekli
            // Şu an için kullanıcıyı terminal komutuna yönlendiriyoruz
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
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Fiyat Yönetimi</h2>

            <div className="space-y-6">
                {/* CSV Import */}
                <div className="border border-orange-500/30 bg-orange-600/10 rounded-xl p-4">
                    <h3 className="font-semibold text-orange-300 mb-2">📥 CSV'den Toplu İmport</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        tasyunu_maliyet.csv dosyasındaki güncel fiyatları veritabanına aktar
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleImport}
                            disabled={importing}
                            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 text-sm font-medium disabled:opacity-50 transition-all shadow-lg shadow-orange-600/30"
                        >
                            {importing ? "İşlem Devam Ediyor..." : "Import Talimatlarını Göster"}
                        </button>
                        <button
                            onClick={() => window.open("/tasyunu_maliyet.csv", "_blank")}
                            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-sm font-medium border border-slate-700 transition-all"
                        >
                            CSV Dosyasını Aç
                        </button>
                    </div>
                    {importMessage && (
                        <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-orange-500/30">
                            <pre className="text-xs text-slate-300 whitespace-pre-wrap">{importMessage}</pre>
                        </div>
                    )}
                </div>

                {/* Toplu İşlemler */}
                <div className="border border-slate-800/50 bg-slate-800/30 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-2">📊 Toplu İşlemler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Tüm Fiyatlara % Artış/İndirim
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Ör: 10"
                                    className="flex-1 px-3 py-2 border border-slate-700 bg-slate-900 text-white rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 text-sm transition-all shadow-lg shadow-blue-600/30">
                                    Uygula
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Pozitif: artış, Negatif: indirim</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Marka Bazlı Güncelleme
                            </label>
                            <select className="w-full px-3 py-2 border border-slate-700 bg-slate-900 text-white rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                                <option value="">Marka seçin...</option>
                                <option>Dalmaçyalı</option>
                                <option>Expert</option>
                                <option>Fawori</option>
                                <option>Optimix</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Son Fiyat Güncellemeleri */}
                <div>
                    <h3 className="font-semibold text-white mb-3">
                        Son Fiyat Güncellemeleri
                        <button
                            onClick={loadRecentPrices}
                            className="ml-3 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            🔄 Yenile
                        </button>
                    </h3>
                    {loading ? (
                        <p className="text-slate-400">Yükleniyor...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-800/50">
                                <thead className="bg-slate-800/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ürün</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Kalınlık</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Fiyat (KDV Hariç)</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Güncelleme</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-slate-900/50 divide-y divide-slate-800/50">
                                    {recentPrices.map((price) => (
                                        <tr key={price.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-white">
                                                {price.plates?.brands?.name} {price.plates?.short_name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-400">{price.thickness}cm</td>
                                            <td className="px-4 py-3 text-sm font-medium text-orange-400">
                                                {price.base_price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-500">
                                                {new Date(price.updated_at).toLocaleDateString("tr-TR")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {recentPrices.length === 0 && (
                                <p className="text-center text-slate-500 py-8">Fiyat kaydı bulunamadı</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Logistics Tab
function LogisticsTab() {
    const [logisticsData, setLogisticsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadLogistics() {
            const { data, error } = await supabase
                .from("logistics_capacity")
                .select("*")
                .order("thickness");

            if (!error && data) {
                setLogisticsData(data);
            }
            setLoading(false);
        }
        loadLogistics();
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 p-6">
                <p className="text-slate-400">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Lojistik Yönetimi</h2>
            <p className="text-slate-400 mb-6">
                Kalınlık bazlı paket bilgileri ve araç kapasiteleri
            </p>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800/50">
                    <thead className="bg-slate-800/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Kalınlık</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Paket İçi</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Paket m²</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Kamyon m² (paket)</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tır m² (paket)</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Popüler</th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-900/50 divide-y divide-slate-800/50">
                        {logisticsData.map((item) => (
                            <tr key={item.thickness} className={item.is_popular ? "bg-orange-600/10 border-l-4 border-orange-500" : "hover:bg-slate-800/50 transition-colors"}>
                                <td className="px-4 py-3 text-sm font-medium text-white">
                                    {item.thickness / 10} cm ({item.thickness}mm)
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-300">{item.items_per_package} adet</td>
                                <td className="px-4 py-3 text-sm text-slate-300">{item.package_size_m2} m²</td>
                                <td className="px-4 py-3 text-sm text-slate-300 font-medium">
                                    {(item.lorry_capacity_packages * item.package_size_m2).toFixed(1)} m² <span className="text-slate-500">({item.lorry_capacity_packages} paket)</span>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-300 font-medium">
                                    {(item.truck_capacity_packages * item.package_size_m2).toFixed(1)} m² <span className="text-slate-500">({item.truck_capacity_packages} paket)</span>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    {item.is_popular ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                            ⭐ Popüler
                                        </span>
                                    ) : (
                                        <span className="text-slate-500">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {logisticsData.length === 0 && (
                <p className="text-center text-slate-500 py-8">Lojistik verisi bulunamadı</p>
            )}
        </div>
    );
}

// Discounts Tab
function DiscountsTab() {
    const [zones, setZones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadZones() {
            const { data, error } = await supabase
                .from("shipping_zones")
                .select("*")
                .order("city_name");

            if (!error && data) {
                setZones(data);
            }
            setLoading(false);
        }
        loadZones();
    }, []);

    // Bölgelere göre şehirleri grupla
    const greenZone = zones.filter(z => z.zone === "green");
    const yellowZone = zones.filter(z => z.zone === "yellow");
    const redZone = zones.filter(z => z.zone === "red");

    if (loading) {
        return (
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 p-6">
                <p className="text-slate-400">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">İskonto Yönetimi</h2>
            <p className="text-sm text-slate-400 mb-6">
                Bölge ve şehir bazlı iskonto oranları ({zones.length} şehir)
            </p>

            <div className="space-y-6">
                {/* Bölge İskontoları */}
                <div>
                    <h3 className="font-semibold text-white mb-3">Bölge İskontoları</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border-2 border-green-500/30 bg-green-600/10 rounded-xl p-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-green-400">🟢 Yeşil Bölge</span>
                                <span className="text-sm text-green-300">{greenZone.length} şehir</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-3">
                                {greenZone.map(z => z.city_name).join(", ").substring(0, 60)}...
                            </p>
                            {greenZone.length > 0 && (
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">TIR İskonto:</span>
                                        <span className="font-medium text-green-300">{greenZone[0].discount_tir}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Kamyon İskonto:</span>
                                        <span className="font-medium text-green-300">{greenZone[0].discount_kamyon}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Optimix Toz:</span>
                                        <span className="font-medium text-green-300">{greenZone[0].optimix_toz_discount}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Optimix Levha:</span>
                                        <span className="font-medium text-green-300">{greenZone[0].optimix_levha_discount}%</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-2 border-yellow-500/30 bg-yellow-600/10 rounded-xl p-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-yellow-400">🟡 Sarı Bölge</span>
                                <span className="text-sm text-yellow-300">{yellowZone.length} şehir</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-3">
                                {yellowZone.map(z => z.city_name).join(", ").substring(0, 60)}...
                            </p>
                            {yellowZone.length > 0 && (
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">TIR İskonto:</span>
                                        <span className="font-medium text-yellow-300">{yellowZone[0].discount_tir}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Kamyon İskonto:</span>
                                        <span className="font-medium text-yellow-300">{yellowZone[0].discount_kamyon}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Optimix Toz:</span>
                                        <span className="font-medium text-yellow-300">{yellowZone[0].optimix_toz_discount}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Optimix Levha:</span>
                                        <span className="font-medium text-yellow-300">{yellowZone[0].optimix_levha_discount}%</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-2 border-red-500/30 bg-red-600/10 rounded-xl p-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-red-400">🔴 Kırmızı Bölge</span>
                                <span className="text-sm text-red-300">{redZone.length} şehir</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-3">
                                {redZone.map(z => z.city_name).join(", ").substring(0, 60)}...
                            </p>
                            {redZone.length > 0 && (
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">TIR İskonto:</span>
                                        <span className="font-medium text-red-300">{redZone[0].discount_tir}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Kamyon İskonto:</span>
                                        <span className="font-medium text-red-300">{redZone[0].discount_kamyon}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Optimix Toz:</span>
                                        <span className="font-medium text-red-300">{redZone[0].optimix_toz_discount}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Optimix Levha:</span>
                                        <span className="font-medium text-red-300">{redZone[0].optimix_levha_discount}%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Şehir Listesi */}
                <div>
                    <h3 className="font-semibold text-white mb-3">Tüm Şehirler</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-800/50">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Şehir</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Bölge</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">TIR İsk.</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Kamyon İsk.</th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-900/50 divide-y divide-slate-800/50">
                                {zones.slice(0, 10).map((zone, index) => (
                                    <tr key={`${zone.id}-${index}`} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-white">{zone.city_name}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${zone.zone === "green" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                                zone.zone === "yellow" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                                                    "bg-red-500/20 text-red-400 border-red-500/30"
                                                }`}>
                                                {zone.zone === "green" ? "🟢 Yeşil" : zone.zone === "yellow" ? "🟡 Sarı" : "🔴 Kırmızı"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-300">{zone.discount_tir}%</td>
                                        <td className="px-4 py-3 text-sm text-slate-300">{zone.discount_kamyon}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {zones.length > 10 && (
                            <p className="text-xs text-slate-500 text-center py-2">
                                İlk 10 şehir gösteriliyor. Toplam: {zones.length}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Products Tab
function ProductsTab() {
    const [activeProductTab, setActiveProductTab] = useState<"plates" | "accessories">("plates");
    const [plates, setPlates] = useState<any[]>([]);
    const [accessories, setAccessories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<"all" | "tasyunu" | "eps">("all");
    const [filterBrand, setFilterBrand] = useState<string>("all");
    const [selectedCityCode, setSelectedCityCode] = useState<number | null>(null);
    // Taşyünü levhada İSK1, şehir + araç tipine göre değişir. Admin'de metraj yok, o yüzden manuel seçtiriyoruz.
    const [tasyunuVehicle, setTasyunuVehicle] = useState<"tir" | "kamyon">("tir");
    const [shippingZones, setShippingZones] = useState<any[]>([]);
    const [logisticsData, setLogisticsData] = useState<any[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        // Önce plates, accessories, logistics_capacity ve shipping_zones'u çek
        const [platesRes, accessoriesRes, pricesRes, zonesRes, logisticsRes] = await Promise.all([
            supabase.from("plates").select(`
                *,
                brands:brand_id (name),
                material_types:material_type_id (name, slug)
            `).order("material_type_id", { ascending: false }).order("short_name"),
            supabase.from("accessories").select(`
                *,
                accessory_types:accessory_type_id (name, sort_order),
                brands:brand_id (name)
            `).order("name"),
            // Tüm fiyatları ayrı çek
            supabase.from("plate_prices").select("*"),
            // Şehirleri çek
            // Admin'de de tüm iller görünsün
            supabase.from("shipping_zones").select("*").order("city_name"),
            // Lojistik kapasiteleri çek
            supabase.from("logistics_capacity").select("*").order("thickness")
        ]);

        console.log("Admin Panel - Plates loaded:", platesRes.data?.length || 0);
        console.log("Admin Panel - Accessories loaded:", accessoriesRes.data?.length || 0);
        console.log("Admin Panel - Prices loaded:", pricesRes.data?.length || 0);
        console.log("Admin Panel - Plates data sample:", platesRes.data?.[0]);
        console.log("Admin Panel - Package m2 sample:", platesRes.data?.[0]?.package_m2);

        if (platesRes.error) console.error("Plates error:", platesRes.error);
        if (accessoriesRes.error) console.error("Accessories error:", accessoriesRes.error);
        if (pricesRes.error) console.error("Prices error:", pricesRes.error);

        // Fiyatları plate'lere manuel olarak ekle
        if (platesRes.data && pricesRes.data) {
            const platesWithPrices = platesRes.data.map(plate => ({
                ...plate,
                plate_prices: pricesRes.data.filter(price => price.plate_id === plate.id)
            }));
            console.log("Admin Panel - First plate with prices:", platesWithPrices[0]);
            setPlates(platesWithPrices);
        }

        if (accessoriesRes.data) setAccessories(accessoriesRes.data);
        if (zonesRes.data) {
            const PRIORITY_CITIES = ["İstanbul", "Kocaeli", "Bolu", "Sakarya", "Düzce", "Tekirdağ", "Yalova", "Bursa", "Balıkesir"];
            const priorityMap = new Map(
                PRIORITY_CITIES.map((name, idx) => [name.toLocaleLowerCase("tr-TR"), idx])
            );
            const sortedZones = [...zonesRes.data].sort((a: any, b: any) => {
                const aKey = String(a.city_name || "").toLocaleLowerCase("tr-TR");
                const bKey = String(b.city_name || "").toLocaleLowerCase("tr-TR");
                const ai = priorityMap.get(aKey);
                const bi = priorityMap.get(bKey);
                if (ai != null && bi != null) return ai - bi;
                if (ai != null) return -1;
                if (bi != null) return 1;
                return String(a.city_name || "").localeCompare(String(b.city_name || ""), "tr-TR");
            });
            setShippingZones(sortedZones);
            // İstanbul'u default seç (34). city_name yazımı farklı olabilir, o yüzden city_code öncelikli.
            const istanbul =
                zonesRes.data.find((z: any) => z.city_code === 34) ||
                zonesRes.data.find((z: any) => (z.city_name || "").toLowerCase() === "istanbul") ||
                zonesRes.data.find((z: any) => z.city_name === "İstanbul");
            if (istanbul) setSelectedCityCode(istanbul.city_code);
        }
        if (logisticsRes.data) setLogisticsData(logisticsRes.data);
        setLoading(false);
    }


    const calculateSalePrice = (
        basePrice: number,
        discount1: number,
        discount2: number,
        brandName: string,
        isKdvIncluded: boolean = false
    ): number => {
        const profitMargin = 10;
        const kdvHaricListe = isKdvIncluded ? basePrice / 1.20 : basePrice;
        const iskontoluFiyat = kdvHaricListe * (1 - discount1 / 100) * (1 - discount2 / 100);
        const karliKdvHaric = iskontoluFiyat * (1 + profitMargin / 100);
        const kdvDahilSatis = karliKdvHaric * 1.20;
        return roundToKurus(kdvDahilSatis);
    };

    // Levhaları filtrele ve grupla
    const filteredPlates = plates.filter(plate => {
        const materialSlug = plate.material_types?.slug;
        if (filterType !== "all" && materialSlug !== filterType) return false;
        if (filterBrand !== "all" && plate.brands?.name !== filterBrand) return false;
        return true;
    });

    // Debug console logs
    console.log("ProductsTab - Filter debug:", {
        totalPlates: plates.length,
        filteredPlates: filteredPlates.length,
        filterType,
        filterBrand,
        samplePlate: plates[0] ? {
            material_slug: plates[0].material_types?.slug,
            material_name: plates[0].material_types?.name,
            brand: plates[0].brands
        } : null
    });

    // Markalara göre grupla
    const platesByBrand = filteredPlates.reduce((acc, plate) => {
        const brand = plate.brands?.name || "Diğer";
        if (!acc[brand]) acc[brand] = [];
        acc[brand].push(plate);
        return acc;
    }, {} as Record<string, any[]>);

    // Benzersiz markalar
    const uniqueBrands = Array.from(new Set(plates.map(p => p.brands?.name).filter(Boolean)));

    // Aksesuarları tipe göre grupla
    const accessoriesByType = accessories.reduce((acc, acc_item) => {
        const type = acc_item.accessory_types?.name || "Diğer";
        if (!acc[type]) acc[type] = [];
        acc[type].push(acc_item);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Ürün Kataloğu</h2>

            {/* Product Type Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-700/50">
                <button
                    onClick={() => setActiveProductTab("plates")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeProductTab === "plates"
                        ? "border-orange-500 text-orange-400"
                        : "border-transparent text-slate-400 hover:text-slate-300"
                        }`}
                >
                    <ClipboardList className="w-4 h-4" />
                    Levhalar ({filteredPlates.length}/{plates.length})
                </button>
                <button
                    onClick={() => setActiveProductTab("accessories")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeProductTab === "accessories"
                        ? "border-orange-500 text-orange-400"
                        : "border-transparent text-slate-400 hover:text-slate-300"
                        }`}
                >
                    <Wrench className="w-4 h-4" />
                    Aksesuarlar ({accessories.length})
                </button>
            </div>

            {loading ? (
                <p className="text-slate-400">Yükleniyor...</p>
            ) : (
                <>
                    {/* Plates View */}
                    {activeProductTab === "plates" && (
                        <div className="space-y-4">
                            {/* Filtreler */}
                            <div className="flex gap-3 pb-4 border-b border-slate-700/50">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as any)}
                                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="all">Tüm Türler</option>
                                    <option value="tasyunu">🔥 Taşyünü</option>
                                    <option value="eps">❄️ EPS</option>
                                </select>
                                <select
                                    value={filterBrand}
                                    onChange={(e) => setFilterBrand(e.target.value)}
                                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="all">Tüm Markalar</option>
                                    {uniqueBrands.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                                <select
                                    value={selectedCityCode || ""}
                                    onChange={(e) => setSelectedCityCode(e.target.value ? parseInt(e.target.value) : null)}
                                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Şehir Seçin</option>
                                    {shippingZones.map((zone: any) => (
                                        <option key={zone.city_code} value={zone.city_code}>
                                            {zone.city_name} (Taşyünü: TIR %{zone.discount_tir} / Kamyon %{zone.discount_kamyon})
                                        </option>
                                    ))}
                                </select>
                                {filterType !== "eps" && (
                                    <select
                                        value={tasyunuVehicle}
                                        onChange={(e) => setTasyunuVehicle(e.target.value as any)}
                                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        title="Taşyünü levha için İSK1 (şehir/araç) seçimi"
                                    >
                                        <option value="tir">Taşyünü: Tır</option>
                                        <option value="kamyon">Taşyünü: Kamyon</option>
                                    </select>
                                )}
                            </div>

                            {/* Markalara Göre Gruplu Görünüm */}
                            {Object.entries(platesByBrand).map(([brand, brandPlates]) => (
                                <div key={brand} className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/50">
                                    <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/50">
                                        <h3 className="font-semibold text-white">
                                            {brand}
                                            <span className="ml-2 text-sm font-normal text-slate-400">
                                                ({(brandPlates as any[]).reduce((total: number, plate: any) => total + (plate.thickness_options?.length || 0), 0)} varyant)
                                            </span>
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full divide-y divide-slate-700/50" style={{ tableLayout: 'fixed' }}>
                                            <thead className="bg-slate-800/60">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ width: '200px' }}>Ürün</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ width: '100px' }}>Tip</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ width: '80px' }}>Kalınlık</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ width: '130px' }}>İskontolar</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ width: '100px' }}>Paket Metrajı</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-700/20" style={{ width: '160px' }}>Net Alış (KDV Hariç)</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider bg-green-500/10 text-green-400 border-x border-green-500/20" style={{ width: '160px' }}>m² Satış (Net + %10)</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ width: '100px' }}>Durum</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-slate-800/30 divide-y divide-slate-700/30">
                                                {(brandPlates as any[]).flatMap((plate: any) =>
                                                    (plate.thickness_options || []).map((thickness: any, idx: any) => {
                                                        // İlgili kalınlık için fiyatı bul
                                                        const priceData = plate.plate_prices?.find((p: any) => p.thickness === thickness);

                                                        // Paket m²'yi bul: Önce kalınlığa özel (priceData.package_m2), yoksa ürüne özel (plate.package_m2), en son lojistik varsayılanı
                                                        const thicknessMm = thickness * 10;
                                                        const logisticsInfo = logisticsData.find((l: any) => l.thickness === thicknessMm);
                                                        const packageM2 = priceData?.package_m2 || plate.package_m2 || logisticsInfo?.package_size_m2 || 0;

                                                        // base_price veritabanından al
                                                        const basePrice = priceData?.base_price || plate.base_price || (plate.base_price_per_cm || 0) * thickness;

                                                        // KDV durumu (DB flag)
                                                        const isKdvIncluded = priceData?.is_kdv_included ?? plate.is_kdv_included ?? false;

                                                        // CSV (taşyünü levha) Column 2: "KDV HARİÇ LİSTE FİYATI" pratikte PAKET liste fiyatı.
                                                        // Örn SW035 3cm: 1.544,80 (paket liste) / 6,00 (paket m²) = 257,47 (m² liste)
                                                        // EPS de aynı mantık: 787.20 (paket liste KDV dahil) / 1.20 / 5.0 = 131.13 (m² liste KDV hariç)
                                                        const basePriceKdvHaric = isKdvIncluded ? basePrice / 1.20 : basePrice;
                                                        const materialSlug = plate.material_types?.slug;

                                                        // m² liste fiyatı: HEM Taşyünü hem EPS için paket liste / paket m²
                                                        // base_price her iki malzeme için de PAKET fiyatıdır
                                                        const listPriceM2 = packageM2 > 0
                                                            ? basePriceKdvHaric / packageM2
                                                            : basePriceKdvHaric;

                                                        // İSKONTO MANTIĞI (senin anlattığın gibi):
                                                        // - Taşyünü levha: İSK1 = şehir + araç (TIR/Kamyon). İSK2 = ürün (genelde %8).
                                                        // - Optimix levha: şehir bazlı optimix_levha_discount (varsa) kullanılabilir.
                                                        const selectedCity = shippingZones.find((z: any) => z.city_code === selectedCityCode);
                                                        const brandName = plate.brands?.name || '';

                                                        let plateDiscount1 = 0;
                                                        let plateDiscount2 = (priceData?.discount_2 ?? plate.discount_2 ?? 0) as number;

                                                        // EPS için varsayılan indirim değerleri (eğer DB'de yoksa)
                                                        if (materialSlug === "eps" && plateDiscount1 === 0) {
                                                            // Şehir bazlı EPS bölge indirimi (genelde %9)
                                                            const cityIsk1 = selectedCity?.eps_toz_region_discount ?? 9;
                                                            plateDiscount1 = cityIsk1;
                                                        }
                                                        if (plateDiscount2 === 0) {
                                                            // Ürün bazlı sabit indirim (genelde %8)
                                                            plateDiscount2 = 8;
                                                        }

                                                        if (materialSlug === "tasyunu") {
                                                            // Taşyünü: İSK1 şehir/araçtan gelir (Ocak 2025 Taşyünü Nakliye İskontosu tablon)
                                                            if (selectedCity) {
                                                                plateDiscount1 =
                                                                    tasyunuVehicle === "tir"
                                                                        ? (selectedCity.discount_tir || 0)
                                                                        : (selectedCity.discount_kamyon || 0);
                                                            }
                                                            // İSK2 ürün bazlı sabit (CSV’de genelde 8)
                                                        } else {
                                                            // EPS vb: ürün bazlı
                                                            plateDiscount1 = (priceData?.discount_1 ?? plate.discount_1 ?? 0) as number;
                                                            // EPS/Toz bölge iskontosu (9/7/5) şehir bazlı uygulanır
                                                            if (selectedCity && (brandName === "Dalmaçyalı" || brandName === "Expert" || brandName === "Optimix")) {
                                                                const cityIsk1 = selectedCity.eps_toz_region_discount ?? 0;
                                                                if (cityIsk1 > 0) plateDiscount1 = cityIsk1;
                                                            }
                                                        }

                                                        // Optimix levha için şehir bazlı iskonto (shipping_zones.optimix_levha_discount)
                                                        if (brandName === 'Optimix' && selectedCity) {
                                                            // Optimix'te bazı ürünlerde İSK2 sabit %8, bazı ürünlerde şehir/bölgeye göre değişir.
                                                            // Ürün İSK2 >= 10 ise şehir tablosundaki optimix_levha_discount kullanılır.
                                                            if (plateDiscount2 >= 10) {
                                                                plateDiscount2 = selectedCity?.optimix_levha_discount || plateDiscount2;
                                                            }
                                                        }

                                                        // İskonto hesaplaması (sıralı): Liste × (1 - İSK1/100) × (1 - İSK2/100)
                                                        // SW035 3cm İstanbul örneği:
                                                        // m² liste: 1.544,80 / 6,00 = 257,47
                                                        // m² alış: 257,47 × 0,82 × 0,92 = 194,23
                                                        const m2Alis = listPriceM2 * (1 - plateDiscount1 / 100) * (1 - plateDiscount2 / 100);

                                                        // Paket alış (KDV hariç): m² alış × paket m² (paket m² yoksa hesap yapma)
                                                        const paketAlis = packageM2 > 0 ? m2Alis * packageM2 : 0;

                                                        // Satış fiyatları (+%10 kar + KDV)
                                                        const m2Satis = m2Alis * 1.10 * 1.20;
                                                        const paketSatis = paketAlis * 1.10 * 1.20;

                                                        return (
                                                            <tr key={`${plate.id}-${thickness}`} className={`hover:bg-slate-700/30 transition-colors ${!plate.is_active ? "opacity-50" : ""}`}>
                                                                <td className="px-4 py-3 text-sm font-medium text-slate-200">
                                                                    {plate.short_name} {thickness}cm
                                                                </td>
                                                                <td className="px-4 py-3 text-sm">
                                                                    {plate.material_types?.slug === "tasyunu" ? (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                                                            <Flame className="w-3 h-3" />
                                                                            Taşyünü
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                                            <Snowflake className="w-3 h-3" />
                                                                            EPS
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-slate-200 font-medium">{thickness} cm</td>
                                                                {/* İskontolar */}
                                                                <td className="px-4 py-3 text-sm">
                                                                    <div className="flex flex-col gap-1">
                                                                        {plateDiscount1 > 0 && (
                                                                            <span className="text-red-400 text-xs font-medium">İSK1: %{plateDiscount1}</span>
                                                                        )}
                                                                        {plateDiscount2 > 0 && (
                                                                            <span className="text-orange-400 text-xs font-medium">İSK2: %{plateDiscount2}</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                {/* Paket Metrajı */}
                                                                <td className="px-4 py-3 text-sm text-slate-400">
                                                                    {packageM2} m²
                                                                </td>
                                                                {/* Net Alış (KDV Hariç) */}
                                                                <td className="px-4 py-3 text-sm bg-slate-700/10">
                                                                    <div className="text-slate-200 font-medium">{formatCurrency(paketAlis)} /Pkt</div>
                                                                    <div className="text-slate-400 text-xs">{formatCurrency(m2Alis)} /m²</div>
                                                                </td>
                                                                {/* m² Satış (Net + %10) */}
                                                                <td className="px-4 py-3 text-sm bg-green-500/10 border-x border-green-500/10">
                                                                    <div className="text-green-300 font-semibold">{formatCurrency(paketAlis * 1.10)} /Pkt</div>
                                                                    <div className="text-green-500 font-bold text-base">{formatCurrency(m2Alis * 1.10)} /m²</div>
                                                                </td>
                                                                <td className="px-4 py-3 text-sm">
                                                                    {plate.is_active ? (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                                                                            <CheckCircle2 className="w-3 h-3" />
                                                                            Aktif
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-600/30 text-slate-400 border border-slate-600/50">
                                                                            <XCircle className="w-3 h-3" />
                                                                            Pasif
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}

                            {filteredPlates.length === 0 && (
                                <p className="text-center text-slate-500 py-8">Bu filtreyle eşleşen levha bulunamadı</p>
                            )}
                        </div>
                    )}

                    {/* Accessories View */}
                    {activeProductTab === "accessories" && (
                        <div className="space-y-4">
                            {/* Şehir seçimi (aksesuar iskontoları şehir/bölgeye göre değişebiliyor) */}
                            <div className="flex gap-3 pb-4 border-b border-slate-700/50">
                                <select
                                    value={selectedCityCode || ""}
                                    onChange={(e) => setSelectedCityCode(e.target.value ? parseInt(e.target.value) : null)}
                                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Şehir Seçin</option>
                                    {shippingZones.map((zone: any) => (
                                        <option key={zone.city_code} value={zone.city_code}>
                                            {zone.city_name} (EPS/Toz Bölge İSK: %{zone.eps_toz_region_discount ?? 0})
                                        </option>
                                    ))}
                                </select>
                                {selectedCityCode && (
                                    <span className="text-xs text-slate-400 self-center">
                                        Seçilen şehir için bölge/Optimix iskontoları uygulanır.
                                    </span>
                                )}
                            </div>

                            {accessories.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">Aksesuar bulunamadı</p>
                            ) : (
                                <>
                                    {/* Tiplere Göre Gruplu Görünüm */}
                                    {Object.entries(accessoriesByType).map(([type, typeAccessories]) => {
                                        return (
                                            <div key={type} className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/50">
                                                <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/50">
                                                    <h3 className="font-semibold text-white">
                                                        {type}
                                                        <span className="ml-2 text-sm font-normal text-slate-400">
                                                            ({(typeAccessories as any[]).length} ürün)
                                                        </span>
                                                    </h3>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full divide-y divide-slate-700/50" style={{ tableLayout: 'fixed' }}>
                                                        <thead className="bg-slate-800/60">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase" style={{ width: '380px' }}>Ürün Adı</th>
                                                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-400 uppercase" style={{ width: '150px' }}>Liste Fiyatı</th>
                                                                <th className="px-2 py-3 text-left text-xs font-medium text-slate-400 uppercase" style={{ width: '130px' }}>İskontolar</th>
                                                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-400 uppercase" style={{ width: '150px' }}>Satış Fiyatı</th>
                                                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-400 uppercase" style={{ width: '120px' }}>Paket</th>
                                                                <th className="px-3 py-3 text-left text-xs font-medium text-slate-400 uppercase" style={{ width: '100px' }}>Durum</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-slate-800/30 divide-y divide-slate-700/30">
                                                            {(typeAccessories as any[]).map((acc: any) => {
                                                                // Fiyat hesaplamaları
                                                                const listPrice = acc.base_price || 0;
                                                                const kdvRate = acc.is_kdv_included ? 1.20 : 1;
                                                                const priceWithoutKdv = listPrice / kdvRate;
                                                                const selectedCity = shippingZones.find((z: any) => z.city_code === selectedCityCode);
                                                                const brandName: string = acc.brands?.name || "";

                                                                // EPS/Toz (Taşyünü hariç) bölge iskontosu:
                                                                // - Dalmaçyalı/Expert/Optimix: İSK1 şehir bazlı bölge iskontosu (9/7/5)
                                                                // - İSK2 ürün bazlı (Optimix'te bazı ürünlerde 16 grubu var; o grupta şehir bazlı optimix_toz_discount kullanılır)
                                                                let isk1 = acc.discount_1 || 0;
                                                                let isk2 = acc.discount_2 || 0;

                                                                if (selectedCity && (brandName === "Dalmaçyalı" || brandName === "Expert" || brandName === "Optimix")) {
                                                                    const cityIsk1 = selectedCity.eps_toz_region_discount ?? 0;
                                                                    if (cityIsk1 > 0) isk1 = cityIsk1;
                                                                }

                                                                if (brandName === "Optimix" && (acc.discount_2 || 0) >= 10 && selectedCity) {
                                                                    isk2 = selectedCity.optimix_toz_discount ?? isk2;
                                                                }
                                                                const afterDiscount1 = priceWithoutKdv * (1 - isk1 / 100);
                                                                const afterDiscount2 = afterDiscount1 * (1 - isk2 / 100);
                                                                const withProfit = afterDiscount2 * 1.10; // %10 kar
                                                                const finalPrice = withProfit * 1.20; // KDV ekle

                                                                return (
                                                                    <tr key={acc.id} className={`hover:bg-slate-700/30 transition-colors ${!acc.is_active ? "opacity-50" : ""}`}>
                                                                        <td className="px-4 py-3 text-sm font-medium text-slate-200" title={acc.name || "-"}>
                                                                            <div className="flex flex-col">
                                                                                <div className="font-semibold text-white">
                                                                                    {acc.short_name || acc.name || "-"}
                                                                                </div>
                                                                                {acc.short_name && acc.name && acc.short_name !== acc.name && (
                                                                                    <div className="text-xs text-slate-400 truncate mt-0.5">
                                                                                        {acc.name}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-3 py-3 text-sm">
                                                                            <div className="flex flex-col">
                                                                                <span className="text-slate-300 font-medium">
                                                                                    {listPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                                                                                </span>
                                                                                <span className="text-xs text-slate-500">
                                                                                    {acc.is_kdv_included ? "KDV Dahil" : "KDV Hariç"}
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-2 py-3 text-sm">
                                                                            <div className="flex gap-1">
                                                                                {isk1 > 0 && (
                                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                                                                                        <TrendingDown className="w-3 h-3" />
                                                                                        %{isk1}
                                                                                    </span>
                                                                                )}
                                                                                {isk2 > 0 && (
                                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                                                                                        <TrendingDown className="w-3 h-3" />
                                                                                        %{isk2}
                                                                                    </span>
                                                                                )}
                                                                                {!isk1 && !isk2 && (
                                                                                    <span className="text-xs text-slate-500">-</span>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-3 py-3 text-sm">
                                                                            <div className="flex flex-col">
                                                                                <span className="text-green-300 font-semibold">
                                                                                    {finalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                                                                                </span>
                                                                                <span className="text-xs text-slate-500">
                                                                                    KDV Dahil + %10 Kar
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-3 py-3 text-sm">
                                                                            <span className="text-slate-300">
                                                                                {acc.unit_content || 1} {acc.unit || "PKT"}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-3 py-3 text-sm">
                                                                            {acc.is_active ? (
                                                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                                    Aktif
                                                                                </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-600/30 text-slate-400 border border-slate-600/50">
                                                                                    <XCircle className="w-3 h-3" />
                                                                                    Pasif
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    )}
                </>
            )
            }
        </div >
    );
}

// Settings Tab
function SettingsTab() {
    const [profitMargin, setProfitMargin] = useState(10);
    const [kdvRate, setKdvRate] = useState(20);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    const handleSave = () => {
        setSaving(true);
        setSaveMessage("Ayarlar kaydedildi! (Not: Bu özellik şu anda sadece yerel depolama kullanıyor)");

        // Yerel olarak sakla
        localStorage.setItem("admin_settings", JSON.stringify({
            profitMargin,
            kdvRate,
            updatedAt: new Date().toISOString()
        }));

        setTimeout(() => {
            setSaving(false);
            setTimeout(() => setSaveMessage(""), 3000);
        }, 500);
    };

    useEffect(() => {
        // Yerel depodan yükle
        const saved = localStorage.getItem("admin_settings");
        if (saved) {
            const settings = JSON.parse(saved);
            setProfitMargin(settings.profitMargin || 10);
            setKdvRate(settings.kdvRate || 20);
        }
    }, []);

    return (
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Sistem Ayarları</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Kar Marjı (%)
                    </label>
                    <input
                        type="number"
                        value={profitMargin}
                        onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
                        className="w-full md:w-64 px-3 py-2 border border-slate-700 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Fiyatlara eklenecek kar marjı yüzdesi
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        KDV Oranı (%)
                    </label>
                    <input
                        type="number"
                        value={kdvRate}
                        onChange={(e) => setKdvRate(parseFloat(e.target.value))}
                        className="w-full md:w-64 px-3 py-2 border border-slate-700 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Türkiye standart KDV oranı
                    </p>
                </div>

                <div className="pt-4 border-t border-slate-800/50">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 text-sm font-medium disabled:opacity-50 transition-all shadow-lg shadow-blue-600/30"
                    >
                        {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
                    </button>
                    {saveMessage && (
                        <p className="text-sm text-green-400 mt-2">{saveMessage}</p>
                    )}
                </div>

                <div className="pt-4 border-t border-slate-800/50">
                    <h3 className="font-semibold text-white mb-3">Sistem Bilgileri</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Next.js Versiyonu:</span>
                            <span className="font-medium text-white">16.0.8</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">React Versiyonu:</span>
                            <span className="font-medium text-white">19.2.1</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Supabase:</span>
                            <span className="font-medium text-green-400">Bağlı</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function StatCard({ title, value, icon, color, onClick }: any) {
    const colors: Record<string, string> = {
        blue: "bg-gradient-to-br from-blue-600/20 to-blue-500/10 text-blue-400 border-blue-500/30",
        green: "bg-gradient-to-br from-green-600/20 to-green-500/10 text-green-400 border-green-500/30",
        orange: "bg-gradient-to-br from-orange-600/20 to-orange-500/10 text-orange-400 border-orange-500/30",
        purple: "bg-gradient-to-br from-purple-600/20 to-purple-500/10 text-purple-400 border-purple-500/30",
    };

    return (
        <div
            className={`rounded-xl border-2 p-6 backdrop-blur-sm shadow-lg ${colors[color as string] || colors.blue} ${onClick ? 'cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium opacity-75 text-slate-300">{title}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                </div>
                <div className="text-4xl opacity-80">{icon}</div>
            </div>
        </div>
    );
}

function QuickActionButton({ title, description, icon, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="text-left p-4 border-2 border-slate-700/50 rounded-xl hover:border-orange-500/50 hover:bg-orange-600/10 bg-slate-800/30 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
            <p className="text-xs text-slate-400">{description}</p>
        </button>
    );
}

function UpdateItem({ title, time, type }: any) {
    const colors = {
        success: "bg-green-500/20 text-green-400 border-green-500/30",
        info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };

    return (
        <div className="flex items-center justify-between py-3 px-3 rounded-lg border border-slate-800/50 hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${type === 'success' ? 'bg-green-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`} />
                <span className="text-sm text-slate-200">{title}</span>
            </div>
            <span className="text-xs text-slate-400">{time}</span>
        </div>
    );
}
// Excel Import Tab — Staging Pipeline Entegrasyonu
// Akış: dosya seç → POST /api/import → ImportPreview → Apply → Rollback
function ExcelImportTab() {
    const [isUploading,   setIsUploading]   = useState(false);
    const [isApplying,    setIsApplying]    = useState(false);
    const [isRollingBack, setIsRollingBack] = useState(false);

    const [fileId,      setFileId]      = useState<string | null>(null);
    const [fileStatus,  setFileStatus]  = useState<'matched' | 'applied' | null>(null);
    const [fileName,    setFileName]    = useState('');
    const [summary,     setSummary]     = useState<ImportSummary | null>(null);
    const [previewRows, setPreviewRows] = useState<ImportPreviewRow[]>([]);
    const [statusMsg,   setStatusMsg]   = useState<{ msg: string; type: 'info' | 'success' | 'error' } | null>(null);

    // ---- Upload & Analiz ----
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setFileId(null);
        setFileStatus(null);
        setSummary(null);
        setPreviewRows([]);
        setIsUploading(true);
        setStatusMsg({ msg: 'Dosya yükleniyor ve analiz ediliyor...', type: 'info' });

        try {
            const form = new FormData();
            form.append('file', file);
            form.append('uploaded_by', 'admin');

            const res  = await fetch('/api/import', { method: 'POST', body: form });
            const data = await res.json();

            if (!res.ok || data.error) {
                setStatusMsg({ msg: data.error ?? 'Import hatası', type: 'error' });
                return;
            }

            setFileId(data.fileId);
            setFileStatus('matched');
            setSummary(data.summary);
            setPreviewRows(data.rows ?? []);
            setStatusMsg({
                msg: `${data.summary.totalRows} satır analiz edildi — ${data.summary.matchedCount} eşleşti, ${data.summary.newProductCount} yeni ürün, ${data.summary.variantMissingCount} varyant eksik.`,
                type: 'success',
            });
        } catch {
            setStatusMsg({ msg: 'Bağlantı hatası — tekrar deneyin.', type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    // ---- Apply ----
    const handleApply = async () => {
        if (!fileId) return;
        setIsApplying(true);
        setStatusMsg({ msg: 'Fiyatlar uygulanıyor...', type: 'info' });

        try {
            const res  = await fetch(`/api/import/${fileId}/apply`, { method: 'POST' });
            const data = await res.json();

            if (!data.ok) {
                setStatusMsg({ msg: data.error ?? 'Apply hatası', type: 'error' });
                return;
            }

            setFileStatus('applied');
            setStatusMsg({
                msg: `${data.result.appliedCount} fiyat güncellendi. Geri almak için "Geri Al" butonunu kullanın.`,
                type: 'success',
            });
        } catch {
            setStatusMsg({ msg: 'Apply bağlantı hatası', type: 'error' });
        } finally {
            setIsApplying(false);
        }
    };

    // ---- Rollback ----
    const handleRollback = async () => {
        if (!fileId) return;
        setIsRollingBack(true);
        setStatusMsg({ msg: 'Geri alınıyor...', type: 'info' });

        try {
            const res  = await fetch(`/api/import/${fileId}/rollback`, { method: 'POST' });
            const data = await res.json();

            if (!data.ok) {
                setStatusMsg({ msg: data.error ?? 'Rollback hatası', type: 'error' });
                return;
            }

            setFileStatus('matched');
            setStatusMsg({
                msg: `${data.result.reverted} kayıt geri alındı. Dosya tekrar "matched" durumuna döndü.`,
                type: 'success',
            });
        } catch {
            setStatusMsg({ msg: 'Rollback bağlantı hatası', type: 'error' });
        } finally {
            setIsRollingBack(false);
        }
    };

    const isBusy = isUploading || isApplying || isRollingBack;

    return (
        <div className="space-y-6">

            {/* Upload Kartı */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-800/50 p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                        <FileSpreadsheet className="text-blue-400 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Excel'den Fiyat Güncelle</h2>
                        <p className="text-sm text-slate-400">Güncel fiyat listesini (.xlsx) yükleyerek sistemi senkronize edin.</p>
                        <div className="mt-2 flex gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Kalem Bazında (KDV DAHİL)</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Taşyünü Listesi (KDV HARİÇ)</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Optimix Sayfası (KDV DAHİL)</span>
                        </div>
                    </div>
                </div>

                {/* Drop Zone */}
                <div className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-800/20 transition-all cursor-pointer relative ${
                    isBusy ? 'border-slate-700/30 opacity-60' : 'border-slate-700/50 hover:border-blue-500/50'
                }`}>
                    <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        disabled={isBusy}
                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <Upload className={`w-12 h-12 mb-4 ${isUploading ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`} />
                    <p className="text-slate-300 font-medium">
                        {isUploading ? 'Analiz ediliyor...' : fileName || 'Excel dosyasını buraya sürükleyin veya tıklayın'}
                    </p>
                    <p className="text-slate-500 text-xs mt-2">Maximum dosya boyutu: 10MB</p>
                </div>

                {/* Durum Mesajı */}
                {statusMsg && (
                    <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 border ${
                        statusMsg.type === 'error'   ? 'bg-red-500/10   border-red-500/30   text-red-400'   :
                        statusMsg.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                                                       'bg-blue-500/10  border-blue-500/30  text-blue-400'
                    }`}>
                        {statusMsg.type === 'error'
                            ? <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            : <CheckCircle   className="w-5 h-5 flex-shrink-0" />
                        }
                        <span className="text-sm font-medium">{statusMsg.msg}</span>
                    </div>
                )}

                {/* Aksiyon Butonları */}
                {fileId && (
                    <div className="mt-6 flex items-center gap-3 flex-wrap">
                        {/* Apply */}
                        <button
                            onClick={handleApply}
                            disabled={isBusy || fileStatus === 'applied'}
                            className="px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white transition-colors"
                        >
                            <Database className="w-4 h-4" />
                            {isApplying ? 'Uygulanıyor...' : fileStatus === 'applied' ? 'Uygulandı ✓' : 'Fiyatları Uygula'}
                        </button>

                        {/* Rollback — sadece applied durumunda görünür */}
                        {fileStatus === 'applied' && (
                            <button
                                onClick={handleRollback}
                                disabled={isBusy}
                                className="px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 bg-red-950/50 hover:bg-red-950/80 disabled:opacity-50 disabled:cursor-not-allowed text-red-300 border border-red-500/30 transition-colors"
                            >
                                {isRollingBack ? 'Geri alınıyor...' : '↩ Geri Al'}
                            </button>
                        )}

                        {/* Durum etiketi */}
                        <span className="text-xs text-slate-500 ml-1">
                            {fileStatus === 'matched'
                                ? '● Staging — production\'a henüz yazılmadı'
                                : fileStatus === 'applied'
                                ? '● Production\'a yazıldı'
                                : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* Analiz Sonucu */}
            <ImportPreview
                summary={summary}
                rows={previewRows}
                isLoading={isUploading}
            />

        </div>
    );
}
