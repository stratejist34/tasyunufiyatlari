"use client";

import { useState, useEffect } from "react";
import { Upload, Tag, Truck, Database, Activity, Clock } from "lucide-react";

interface Props {
    quotes?: any[];
    stats?: { plateCount: number; accessoryCount: number; priceCount: number; cityCount: number };
    onNavigate?: (id: string) => void;
}

function getHourlyBuckets(quotes: any[]): number[] {
    const buckets = new Array(24).fill(0);
    const now = new Date();
    for (const q of quotes) {
        const diff = (now.getTime() - new Date(q.created_at).getTime()) / (1000 * 60 * 60);
        if (diff >= 0 && diff < 24) {
            const idx = Math.floor(diff);
            buckets[23 - idx]++;
        }
    }
    return buckets;
}

const QUICK_ACTIONS = [
    { label: "Excel Yükle",   Icon: Upload, id: "excel-import" },
    { label: "İskontolar",    Icon: Tag,    id: "discounts" },
    { label: "Lojistik",      Icon: Truck,  id: "logistics" },
];

export function AdminRightPanel({ quotes = [], stats, onNavigate }: Props) {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
            setDate(now.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" }));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const today = quotes.filter((q) => {
        const diff = Date.now() - new Date(q.created_at).getTime();
        return diff < 24 * 60 * 60 * 1000;
    });
    const todayTotal   = today.length;
    const todayPending = today.filter((q) => q.status === "pending").length;
    const todayApproved= today.filter((q) => q.status === "approved").length;

    const hourly = getHourlyBuckets(quotes);
    const maxHourly = Math.max(...hourly, 1);

    return (
        <aside
            className="hidden xl:flex flex-col gap-4 p-4 border-l border-[var(--nx-border)] bg-[rgba(6,11,20,0.60)] backdrop-blur-sm"
            style={{ width: 260, flexShrink: 0 }}
        >
            {/* Clock */}
            <div className="nx-card p-4 text-center">
                <p className="font-mono text-2xl font-bold text-[var(--nx-cyan)] tracking-wider">
                    {time}
                </p>
                <p className="mt-1 text-xs text-[var(--nx-text-muted)] capitalize">{date}</p>
            </div>

            {/* Today summary */}
            <div className="nx-card p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-3.5 h-3.5 text-[var(--nx-cyan)]" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--nx-text-muted)]">Bugünkü Özet</p>
                </div>
                <div className="space-y-2">
                    <SummaryRow label="Toplam Teklif"  value={todayTotal}    color="cyan" />
                    <SummaryRow label="Bekleyen"       value={todayPending}  color="amber" />
                    <SummaryRow label="Onaylanan"      value={todayApproved} color="green" />
                </div>
            </div>

            {/* 24h Activity chart */}
            <div className="nx-card p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-3.5 h-3.5 text-[var(--nx-cyan)]" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--nx-text-muted)]">Son 24 Saat</p>
                </div>
                <div className="flex items-end gap-px h-14">
                    {hourly.map((v, i) => (
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
                <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-[var(--nx-text-muted)]">24s önce</span>
                    <span className="text-[9px] text-[var(--nx-text-muted)]">Şimdi</span>
                </div>
            </div>

            {/* System status */}
            {stats && (
                <div className="nx-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Database className="w-3.5 h-3.5 text-[var(--nx-cyan)]" />
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--nx-text-muted)]">Veritabanı</p>
                    </div>
                    <div className="space-y-2.5">
                        <DbRow label="Levhalar"   value={stats.plateCount}     max={500}  color="cyan" />
                        <DbRow label="Aksesuarlar" value={stats.accessoryCount} max={100}  color="blue" />
                        <DbRow label="Fiyat Kydı" value={stats.priceCount}     max={2000} color="purple" />
                        <DbRow label="Şehir"      value={stats.cityCount}      max={100}  color="green" />
                    </div>
                </div>
            )}

            {/* Quick actions */}
            <div className="nx-card p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--nx-text-muted)] mb-3">Hızlı Erişim</p>
                <div className="space-y-1.5">
                    {QUICK_ACTIONS.map(({ label, Icon, id }) => (
                        <button
                            key={id}
                            onClick={() => onNavigate?.(id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[var(--nx-text-soft)] border border-[var(--nx-border)] bg-slate-800/20 hover:bg-slate-700/30 hover:text-[var(--nx-cyan)] hover:border-[var(--nx-border-accent)] transition-all"
                        >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
}

function SummaryRow({ label, value, color }: { label: string; value: number; color: string }) {
    const colors: Record<string, string> = {
        cyan:  "text-amber-300",
        amber: "text-amber-300",
        green: "text-green-300",
    };
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--nx-text-soft)]">{label}</span>
            <span className={`font-mono font-bold ${colors[color] ?? "text-slate-200"}`}>{value}</span>
        </div>
    );
}

function DbRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
    const pct = Math.min(100, Math.round((value / max) * 100));
    const barColors: Record<string, string> = {
        cyan:   "from-amber-500 to-orange-500",
        blue:   "from-orange-500 to-indigo-500",
        purple: "from-purple-500 to-pink-500",
        green:  "from-green-500 to-emerald-500",
    };
    return (
        <div>
            <div className="flex justify-between text-[10px] mb-1">
                <span className="text-[var(--nx-text-soft)]">{label}</span>
                <span className="font-mono text-[var(--nx-text-muted)]">{value}</span>
            </div>
            <div className="h-1 rounded-full bg-slate-800">
                <div
                    className={`h-1 rounded-full bg-gradient-to-r ${barColors[color]}`}
                    style={{ width: `${Math.max(4, pct)}%` }}
                />
            </div>
        </div>
    );
}
