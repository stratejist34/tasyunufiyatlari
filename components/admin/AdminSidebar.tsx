"use client";

import {
    LayoutDashboard, FileText, DollarSign, Truck, Tag,
    Package, Upload, Settings, Zap, Circle, BarChart2,
} from "lucide-react";

const NAV_ITEMS = [
    { id: "dashboard",    label: "Dashboard",        Icon: LayoutDashboard },
    { id: "quotes",       label: "Teklifler",         Icon: FileText },
    { id: "analytics",    label: "Talep Analizi",     Icon: BarChart2 },
    { id: "prices",       label: "Fiyatlar",          Icon: DollarSign },
    { id: "logistics",    label: "Lojistik",          Icon: Truck },
    { id: "discounts",    label: "İskontolar",        Icon: Tag },
    { id: "products",     label: "Ürünler",           Icon: Package },
    { id: "excel-import", label: "Excel Yükle",       Icon: Upload },
    { id: "settings",     label: "Ayarlar",           Icon: Settings },
];

interface Props {
    active: string;
    onNavigate: (id: string) => void;
}

export function AdminSidebar({ active, onNavigate }: Props) {
    return (
        <nav className="nx-sidebar">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--nx-border)]">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25 flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-50 tracking-tight leading-none">TASYÜNÜ</p>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--nx-cyan)] mt-0.5 leading-none">Admin Paneli</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-3 py-4 space-y-1">
                <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--nx-text-muted)]">
                    Navigasyon
                </p>
                {NAV_ITEMS.map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        onClick={() => onNavigate(id)}
                        className={`nx-nav-item w-full text-left ${active === id ? "active" : ""}`}
                    >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1">{label}</span>
                        {active === id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--nx-cyan)] animate-nx-pulse" />
                        )}
                    </button>
                ))}
            </div>

            {/* Status footer */}
            <div className="px-3 py-4 border-t border-[var(--nx-border)]">
                <p className="px-1 mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--nx-text-muted)]">
                    Sistem Durumu
                </p>
                <div className="nx-card p-3 space-y-2">
                    <StatusLine label="Veritabanı" color="green" />
                    <StatusLine label="Teklif Akışı" color="cyan" />
                    <StatusLine label="Import API" color="green" />
                </div>
            </div>
        </nav>
    );
}

function StatusLine({ label, color }: { label: string; color: "green" | "cyan" | "amber" | "red" }) {
    const colors = {
        green: "bg-green-400",
        cyan: "bg-cyan-400",
        amber: "bg-amber-400",
        red: "bg-red-400",
    };
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--nx-text-soft)]">{label}</span>
            <span className={`w-2 h-2 rounded-full ${colors[color]} shadow-sm`} />
        </div>
    );
}
