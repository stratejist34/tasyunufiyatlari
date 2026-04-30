"use client";

import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

type ColorVariant = "cyan" | "blue" | "purple" | "green" | "amber" | "red";

const COLOR_MAP: Record<ColorVariant, {
    icon: string;
    value: string;
    badge: string;
    glow: string;
}> = {
    cyan:   { icon: "from-amber-500/20 to-orange-500/20",     value: "text-amber-300",   badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",   glow: "shadow-[0_0_20px_rgba(23,208,255,0.12)]" },
    blue:   { icon: "from-orange-500/20 to-indigo-500/20",   value: "text-blue-300",   badge: "bg-orange-500/10 text-blue-300 border-orange-500/20",   glow: "shadow-[0_0_20px_rgba(51,136,255,0.12)]" },
    purple: { icon: "from-purple-500/20 to-pink-500/20",   value: "text-purple-300", badge: "bg-purple-500/10 text-purple-300 border-purple-500/20", glow: "shadow-[0_0_20px_rgba(168,85,247,0.12)]" },
    green:  { icon: "from-green-500/20 to-emerald-500/20", value: "text-green-300",  badge: "bg-green-500/10 text-green-300 border-green-500/20",  glow: "shadow-[0_0_20px_rgba(34,197,94,0.12)]" },
    amber:  { icon: "from-amber-500/20 to-orange-500/20",  value: "text-amber-300",  badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",  glow: "shadow-[0_0_20px_rgba(245,158,11,0.12)]" },
    red:    { icon: "from-red-500/20 to-rose-500/20",      value: "text-red-300",    badge: "bg-red-500/10 text-red-300 border-red-500/20",        glow: "shadow-[0_0_20px_rgba(239,68,68,0.12)]" },
};

interface MetricCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    color?: ColorVariant;
    trend?: "up" | "down" | "stable";
    trendLabel?: string;
    detail?: string;
    onClick?: () => void;
}

export function MetricCard({
    title,
    value,
    icon: Icon,
    color = "cyan",
    trend,
    trendLabel,
    detail,
    onClick,
}: MetricCardProps) {
    const c = COLOR_MAP[color];

    return (
        <div
            onClick={onClick}
            className={`nx-metric-card color-${color} ${c.glow} ${onClick ? "cursor-pointer" : ""} group`}
        >
            <div className="flex items-start justify-between gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.icon} flex items-center justify-center flex-shrink-0 border border-white/5`}>
                    <Icon className={`w-5 h-5 ${c.value}`} />
                </div>

                {/* Trend badge */}
                {trend && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${c.badge}`}>
                        {trend === "up"     && <TrendingUp className="w-3 h-3" />}
                        {trend === "down"   && <TrendingDown className="w-3 h-3" />}
                        {trend === "stable" && <Minus className="w-3 h-3" />}
                        {trendLabel}
                    </span>
                )}
            </div>

            {/* Value */}
            <div className="mt-3">
                <p className={`font-mono text-3xl font-bold ${c.value} leading-none tracking-tight`}>
                    {typeof value === "number" ? value.toLocaleString("tr-TR") : value}
                </p>
                <p className="mt-1.5 text-sm text-[var(--nx-text-soft)]">{title}</p>
                {detail && (
                    <p className="mt-1 text-xs text-[var(--nx-text-muted)]">{detail}</p>
                )}
            </div>
        </div>
    );
}
