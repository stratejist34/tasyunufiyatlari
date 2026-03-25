"use client";

import { useEffect, useState } from "react";

export function AdminLoadingScreen() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setVisible(false), 2200);
        return () => clearTimeout(t);
    }, []);

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
            style={{
                animation: visible ? "none" : "nx-fade-out 0.3s ease-out forwards",
            }}
        >
            {/* Spinning rings — Nexus signature */}
            <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
                {/* Outermost: ping pulse */}
                <span
                    className="absolute inline-flex rounded-full border-2 border-cyan-400/30"
                    style={{ width: 160, height: 160, animation: "nx-pulse-ring 2s ease-in-out infinite" }}
                />
                {/* Ring 1 */}
                <span
                    className="absolute rounded-full border-2 border-transparent border-t-cyan-400"
                    style={{ width: 136, height: 136, animation: "spin-slow 3s linear infinite" }}
                />
                {/* Ring 2 */}
                <span
                    className="absolute rounded-full border-2 border-transparent border-r-purple-500"
                    style={{ width: 112, height: 112, animation: "spin-slow 2s linear infinite reverse" }}
                />
                {/* Ring 3 */}
                <span
                    className="absolute rounded-full border-2 border-transparent border-b-blue-400"
                    style={{ width: 88, height: 88, animation: "spin-slower 6s linear infinite" }}
                />
                {/* Ring 4 */}
                <span
                    className="absolute rounded-full border border-transparent border-l-cyan-300/60"
                    style={{ width: 64, height: 64, animation: "spin-slow 1.5s linear infinite" }}
                />
                {/* Center dot */}
                <span className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_16px_4px_rgba(23,208,255,0.6)]" />
            </div>

            {/* Text */}
            <div className="mt-10 text-center space-y-2">
                <p className="font-mono text-sm tracking-[0.35em] text-cyan-400 uppercase">
                    Sistem Başlatılıyor
                </p>
                <p className="font-mono text-xs text-slate-600 tracking-[0.2em]">
                    TASYÜNÜ ADMİN v2.0
                </p>
            </div>

            {/* Scanning line */}
            <div
                className="absolute left-0 right-0 h-px"
                style={{
                    background: "linear-gradient(90deg, transparent, rgba(23,208,255,0.6), transparent)",
                    animation: "nx-scan-line 2.2s ease-in-out",
                    top: "40%",
                }}
            />

            <style>{`
                @keyframes nx-scan-line {
                    0%   { top: 0%; opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
