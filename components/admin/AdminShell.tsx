"use client";

import { ReactNode } from "react";
import { ParticleBackground } from "./ParticleBackground";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

interface Props {
    activeSection: string;
    onNavigate: (id: string) => void;
    children: ReactNode;
    quotes?: any[];
    stats?: { plateCount: number; accessoryCount: number; priceCount: number; cityCount: number };
}

export function AdminShell({ activeSection, onNavigate, children }: Props) {
    return (
        <div className="nx-shell">
            <ParticleBackground />

            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    background:
                        "radial-gradient(ellipse at top left, rgba(23,208,255,0.06) 0%, transparent 50%), " +
                        "radial-gradient(ellipse at bottom right, rgba(168,85,247,0.05) 0%, transparent 50%)",
                }}
            />

            <AdminSidebar active={activeSection} onNavigate={onNavigate} />

            <div className="relative z-10 flex flex-col" style={{ marginLeft: "240px" }}>
                <AdminTopbar activeSection={activeSection} />
                <main className="flex-1 p-6 min-w-0 animate-nx-fade-in">
                    <div className="max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
