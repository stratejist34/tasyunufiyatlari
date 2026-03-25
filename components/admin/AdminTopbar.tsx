"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Home } from "lucide-react";

const SECTION_LABELS: Record<string, string> = {
    dashboard:    "Dashboard",
    quotes:       "Teklifler",
    prices:       "Fiyatlar",
    logistics:    "Lojistik",
    discounts:    "İskontolar",
    products:     "Ürünler",
    "excel-import": "Excel Yükle",
    settings:     "Ayarlar",
};

interface Props {
    activeSection: string;
}

export function AdminTopbar({ activeSection }: Props) {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
            setDate(now.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" }));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <header className="nx-topbar">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm min-w-0">
                <span className="text-[var(--nx-text-muted)]">Admin</span>
                <span className="text-[var(--nx-text-muted)]">/</span>
                <span className="text-[var(--nx-cyan)] font-medium truncate">
                    {SECTION_LABELS[activeSection] ?? activeSection}
                </span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xs hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--nx-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Ara..."
                        className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-slate-800/50 border border-[var(--nx-border)] text-[var(--nx-text-soft)] placeholder:text-[var(--nx-text-muted)] focus:outline-none focus:border-[var(--nx-border-accent)] focus:ring-1 focus:ring-[rgba(23,208,255,0.15)] backdrop-blur-sm transition-all"
                    />
                </div>
            </div>

            {/* Right: time + actions */}
            <div className="ml-auto flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end leading-none">
                    <span className="font-mono text-xs text-[var(--nx-cyan)]">{time}</span>
                    <span className="font-mono text-[10px] text-[var(--nx-text-muted)] mt-0.5">{date}</span>
                </div>

                <button className="w-8 h-8 rounded-lg border border-[var(--nx-border)] bg-slate-800/40 flex items-center justify-center text-[var(--nx-text-soft)] hover:text-[var(--nx-text)] hover:border-[var(--nx-border-accent)] transition-all">
                    <Bell className="w-3.5 h-3.5" />
                </button>

                <a
                    href="/"
                    className="h-8 px-3 rounded-lg border border-[var(--nx-border)] bg-slate-800/40 flex items-center gap-1.5 text-xs text-[var(--nx-text-soft)] hover:text-[var(--nx-text)] hover:border-[var(--nx-border-accent)] transition-all"
                >
                    <Home className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ana Sayfa</span>
                </a>
            </div>
        </header>
    );
}
