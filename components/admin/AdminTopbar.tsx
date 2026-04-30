"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Home, User } from "lucide-react";

const SECTION_LABELS: Record<string, string> = {
    dashboard:    "Dashboard",
    quotes:       "Teklifler",
    analytics:    "Talep Analizi",
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
                <span className="text-[var(--nx-gold)] font-medium truncate">
                    {SECTION_LABELS[activeSection] ?? activeSection}
                </span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-sm hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--nx-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Ara..."
                        className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-[rgba(26,24,22,0.60)] border border-[rgba(72,65,52,0.35)] text-[var(--nx-text)] placeholder:text-[var(--nx-text-muted)] focus:outline-none focus:border-[var(--nx-border-accent)] focus:ring-2 focus:ring-[rgba(201,168,76,0.12)] backdrop-blur-md transition-all"
                    />
                </div>
            </div>

            {/* Right: time + actions */}
            <div className="ml-auto flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end leading-none">
                    <span className="font-mono text-xs text-[var(--nx-gold)] tracking-wider">{time}</span>
                    <span className="font-mono text-[10px] text-[var(--nx-text-muted)] mt-0.5">{date}</span>
                </div>

                <button className="relative w-9 h-9 rounded-xl border border-[rgba(72,65,52,0.35)] bg-[rgba(26,24,22,0.60)] flex items-center justify-center text-[var(--nx-text-soft)] hover:text-[var(--nx-gold)] hover:border-[var(--nx-border-accent)] backdrop-blur-md transition-all">
                    <Bell className="w-3.5 h-3.5" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--nx-gold)] shadow-[0_0_6px_rgba(201,168,76,0.6)]" />
                </button>

                <a
                    href="/"
                    className="h-9 px-3 rounded-xl border border-[rgba(72,65,52,0.35)] bg-[rgba(26,24,22,0.60)] flex items-center gap-1.5 text-xs text-[var(--nx-text-soft)] hover:text-[var(--nx-gold)] hover:border-[var(--nx-border-accent)] backdrop-blur-md transition-all"
                >
                    <Home className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ana Sayfa</span>
                </a>

                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                        background: "linear-gradient(135deg, rgba(201,168,76,0.22) 0%, rgba(184,115,51,0.22) 100%)",
                        border: "1px solid rgba(201,168,76,0.30)",
                    }}
                    aria-label="Profil"
                >
                    <User className="w-4 h-4 text-[var(--nx-gold)]" />
                </div>
            </div>
        </header>
    );
}
