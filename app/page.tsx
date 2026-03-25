"use client";

import Link from "next/link";
import WizardCalculator from "@/components/wizard/WizardCalculator";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-fe-bg">
            {/* TOP BAR */}
            <div className="bg-fe-surface border-b border-fe-border text-white text-center py-2 px-4 text-xs sm:text-sm">
                <span className="font-semibold">TIR BAZLI SATIŞ</span>
                <span className="mx-2 sm:mx-4">|</span>
                <span className="text-fe-muted">DEPO: İstanbul & Gebze</span>
                <span className="mx-2 sm:mx-4">|</span>
                <span className="text-brand-500 font-semibold">Bölgeye Göre İskonto</span>
            </div>

            {/* HEADER */}
            <header className="bg-fe-surface/80 backdrop-blur-md border-b border-fe-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">TY</span>
                            </div>
                            <span className="text-white font-bold text-xl hidden sm:block tracking-tight">
                                TaşYünü Fiyatları
                            </span>
                        </div>
                        <nav className="flex items-center gap-3">
                            <Link
                                href="/urunler"
                                className="text-fe-text hover:text-brand-400 transition-colors text-sm font-medium hidden sm:block"
                            >
                                Ürün Kataloğu
                            </Link>
                            <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-500 transition-colors">
                                Giriş Yap
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* WIZARD CALCULATOR COMPONENT */}
            <WizardCalculator />
        </div>
    );
}
