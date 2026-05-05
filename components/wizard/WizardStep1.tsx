'use client';

import { motion } from "framer-motion";
import { useEffect } from "react";
import { Check, WhatsappLogo } from "@phosphor-icons/react";
import type { Brand } from "@/lib/types";
import { WHATSAPP_ORDER } from "@/lib/config";
import { notifyWhatsappIntent } from "@/lib/notifyWhatsappIntent";

const DIS_CEPHE_MODELLER = [
    'SW035', 'Premium', 'HD150', 'LD125', 'TR7.5',
    'İdeal Carbon', 'Double Carbon', 'EPS Karbonlu',
    'EPS Beyaz', 'EPS 035 Beyaz', 'Optimix Karbonlu',
];

const MARKA_LOGOLARI: Record<string, string> = {
    'Dalmaçyalı': '/images/markalogolar/dalmaçyalı-taşyünü- fiyatları.webp',
    'Expert':     '/images/markalogolar/fawori-taşyünü- fiyatları.webp',
    'Optimix':    '/images/markalogolar/fawori-taşyünü- fiyatları.webp',
    'Fawori':     '/images/markalogolar/fawori-taşyünü- fiyatları.webp',
    'Knauf':      '/images/markalogolar/Knauf Mineral yünleri.webp',
    'Tekno':      '/images/markalogolar/Tekno Taşyünü ve EPs Fiyatları.webp',
    'Filli Boya': '/images/markalogolar/filli-boya-mantolama.webp',
};

interface WizardStep1Props {
    selectedMalzeme: "tasyunu" | "eps";
    setSelectedMalzeme: (v: "tasyunu" | "eps") => void;
    selectedBrandId: number | null;
    setSelectedBrandId: (id: number | null) => void;
    brands: Brand[];
    selectedModel: string | null;
    setSelectedModel: (m: string | null) => void;
    availableModels: string[];
}

export function WizardStep1({
    selectedMalzeme, setSelectedMalzeme,
    selectedBrandId, setSelectedBrandId, brands,
    selectedModel, setSelectedModel, availableModels,
}: WizardStep1Props) {
    useEffect(() => {
        if (selectedBrandId && availableModels.length > 0 && !selectedModel) {
            const filtered = availableModels.filter(m => DIS_CEPHE_MODELLER.includes(m));
            if (filtered.length > 0) setSelectedModel(filtered[0]);
        }
    }, [selectedBrandId, availableModels, selectedModel, setSelectedModel]);

    const filteredModels = availableModels.filter(m => DIS_CEPHE_MODELLER.includes(m));

    const helpHref = `https://wa.me/${WHATSAPP_ORDER}?text=${encodeURIComponent(
        'Merhaba, hesaplayıcıda ne seçeceğimden emin değilim, yardımcı olur musunuz?'
    )}`;

    return (
        <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
        >
            {/* Erken yardım kapısı — kararsız kullanıcı için kaçış kapısı */}
            <a
                href={helpHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => notifyWhatsappIntent({ source: 'wizard_help_step1' })}
                className="mb-4 flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border border-[#25D366]/25 bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors"
            >
                <span className="text-xs sm:text-sm text-fe-text/85 leading-snug">
                    <span className="font-medium text-white">Ne seçeceğinizi bilmiyor musunuz?</span>{' '}
                    <span className="text-fe-muted">WhatsApp&apos;tan yardımcı olalım.</span>
                </span>
                <span className="inline-flex items-center gap-1 shrink-0 text-[#25D366] text-xs font-semibold">
                    <WhatsappLogo weight="fill" size={16} />
                    <span className="hidden sm:inline">Yardım</span>
                </span>
            </a>

            {/* Malzeme Tipi */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-white mb-3">Malzeme Tipi</label>
                <p className="mt-2 text-sm text-fe-muted leading-relaxed">
                    Taşyünü ısıya ve sese karşı daha güçlü; EPS daha hafif ve ekonomik. Marka seçimi paket fiyatını ±%10 değiştirir, sistem aynıdır.
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {([
                        { value: "tasyunu", label: "Taşyünü", sub: "Yüksek Yangın Dayanımı", img: "/images/ikonlar/tas-yunu-levha.webp" },
                        { value: "eps",     label: "EPS",     sub: "Uygun Fiyat",             img: "/images/ikonlar/EPS Levha.webp" },
                    ] as const).map(({ value, label, sub, img }) => (
                        <button
                            key={value}
                            onClick={() => { setSelectedMalzeme(value); setSelectedModel(null); }}
                            className={`relative p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                                selectedMalzeme === value
                                    ? "bg-fe-raised border-brand-500 shadow-lg shadow-brand-500/20"
                                    : "bg-fe-surface border-fe-border hover:border-fe-muted/50"
                            }`}
                        >
                            <img src={img} alt={label} className="w-9 h-9 object-contain" />
                            <div className="text-left">
                                <div className={`font-bold text-sm leading-tight ${selectedMalzeme === value ? "text-white" : "text-fe-text"}`}>{label}</div>
                                <div className="text-[11px] text-fe-muted leading-tight">{sub}</div>
                            </div>
                            {selectedMalzeme === value && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Marka */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-white mb-3">Levha Markası</label>
                <div className="grid grid-cols-3 gap-3">
                    {brands
                        .filter(b => ['Dalmaçyalı', 'Expert', 'Optimix'].includes(b.name))
                        .map(brand => (
                            <button
                                key={brand.id}
                                onClick={() => setSelectedBrandId(brand.id)}
                                className={`relative p-2 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center h-16 bg-fe-bg/40 ${
                                    selectedBrandId === brand.id
                                        ? "border-brand-500 ring-2 ring-brand-500/20"
                                        : "border-fe-border hover:border-fe-muted/50"
                                }`}
                            >
                                {MARKA_LOGOLARI[brand.name] ? (
                                    <img src={MARKA_LOGOLARI[brand.name]} alt={brand.name} className="h-7 w-auto object-contain" />
                                ) : (
                                    <span className="font-bold text-white text-sm">{brand.name}</span>
                                )}
                                <span className="mt-0.5 text-[11px] font-semibold text-fe-text">{brand.name}</span>
                                {selectedBrandId === brand.id && (
                                    <div className="absolute -top-2 -right-2 bg-brand-500 text-[#1a0f08] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                                        <Check size={12} weight="bold" />
                                    </div>
                                )}
                            </button>
                        ))}
                </div>
            </div>

            {/* Model — her zaman render edilir, boş iken de alan rezerve edilir */}
            <div className="min-h-[72px]">
                {filteredModels.length >= 1 && (
                    <div>
                        <label className="block text-sm font-semibold text-white mb-3">Levha Modeli</label>
                        <div className="grid grid-cols-3 gap-2">
                            {filteredModels.map(model => (
                                <button
                                    key={model}
                                    onClick={() => setSelectedModel(model)}
                                    className={`px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                                        selectedModel === model
                                            ? "bg-fe-surface border-brand-500 text-white shadow-lg shadow-brand-500/10"
                                            : "bg-fe-surface border-fe-border text-fe-text hover:border-fe-muted/50"
                                    }`}
                                >
                                    {model}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-center justify-center">
                <a
                    href="/iletisim"
                    className="text-xs text-fe-muted underline underline-offset-4 hover:text-fe-text transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded"
                >
                    Emin değilim, benimle iletişime geçin
                </a>
            </div>
        </motion.div>
    );
}
