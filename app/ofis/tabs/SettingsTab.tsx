"use client";

import { useState, useEffect } from "react";

export function SettingsTab() {
    const [profitMargin, setProfitMargin] = useState(10);
    const [kdvRate, setKdvRate] = useState(20);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    const handleSave = () => {
        setSaving(true);
        setSaveMessage("Ayarlar kaydedildi! (Not: Bu özellik şu anda sadece yerel depolama kullanıyor)");
        localStorage.setItem("admin_settings", JSON.stringify({ profitMargin, kdvRate, updatedAt: new Date().toISOString() }));
        setTimeout(() => {
            setSaving(false);
            setTimeout(() => setSaveMessage(""), 3000);
        }, 500);
    };

    useEffect(() => {
        const saved = localStorage.getItem("admin_settings");
        if (saved) {
            const settings = JSON.parse(saved);
            setProfitMargin(settings.profitMargin || 10);
            setKdvRate(settings.kdvRate || 20);
        }
    }, []);

    return (
        <div className="admin-nexus-panel p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Sistem Ayarları</h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Kar Marjı (%)</label>
                    <input type="number" value={profitMargin} onChange={(e) => setProfitMargin(parseFloat(e.target.value))} className="admin-nexus-input w-full md:w-64 px-3 py-2" />
                    <p className="text-xs text-slate-500 mt-1">Fiyatlara eklenecek kar marjı yüzdesi</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">KDV Oranı (%)</label>
                    <input type="number" value={kdvRate} onChange={(e) => setKdvRate(parseFloat(e.target.value))} className="admin-nexus-input w-full md:w-64 px-3 py-2" />
                    <p className="text-xs text-slate-500 mt-1">Türkiye standart KDV oranı</p>
                </div>
                <div className="pt-4 border-t border-slate-800/50">
                    <button onClick={handleSave} disabled={saving}
                        className="rounded-xl bg-gradient-to-r from-amber-500/90 to-orange-500/90 px-6 py-2 text-sm font-semibold text-slate-950 transition-all shadow-[0_16px_34px_rgba(23,208,255,0.24)] hover:from-amber-400 hover:to-orange-400 disabled:opacity-50">
                        {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
                    </button>
                    {saveMessage && <p className="text-sm text-green-400 mt-2">{saveMessage}</p>}
                </div>
                <div className="pt-4 border-t border-slate-800/50">
                    <h3 className="font-semibold text-white mb-3">Sistem Bilgileri</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Next.js Versiyonu:</span><span className="font-medium text-white">16.0.8</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">React Versiyonu:</span><span className="font-medium text-white">19.2.1</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Supabase:</span><span className="font-medium text-green-400">Bağlı</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
