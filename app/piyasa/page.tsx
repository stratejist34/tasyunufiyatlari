import MarketTicker from "@/components/dashboard/MarketTicker";
import VolumeChart from "@/components/dashboard/VolumeChart";
import { HOTSPOTS, MOCK_TRANSACTIONS, type Transaction, type Hotspot } from "@/lib/data/marketData";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export default function PiyasaPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white pt-24 pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-white mb-2">
          Piyasa Verileri
        </h1>
        <p className="text-slate-400">
          Türkiye geneli anlık yalıtım malzemesi talep endeksi ve bölgesel yoğunluk haritası.
        </p>
      </div>

      {/* Ticker */}
      <MarketTicker />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CHART SECTION (2/3 Genişlik) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800/60 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-heading font-semibold text-slate-200">Haftalık İşlem Hacmi</h2>
                <div className="text-3xl font-mono font-bold text-orange-500 mt-1">32.400 m²</div>
              </div>
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-sm">
                <TrendingUp size={16} />
                <span>%12.4 Artış</span>
              </div>
            </div>
            <VolumeChart />
          </div>

          {/* SON İŞLEMLER LİSTESİ */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800/60">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Son Fiyatlanan Projeler</h3>
            <div className="space-y-3">
              {MOCK_TRANSACTIONS.map((t: Transaction) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-orange-500">
                      <ArrowUpRight size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">{t.city}, {t.district}</div>
                      <div className="text-xs text-slate-500">{t.system} • {t.brand}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-orange-400 font-bold">{t.m2} m²</div>
                    <div className="text-xs text-slate-600">Teklif Verildi</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR (1/3 Genişlik) - Hotspots */}
        <div className="space-y-6">
           <div className="p-6 rounded-xl bg-slate-900 border border-slate-800/60">
            <h3 className="text-slate-200 font-bold mb-4">Bölgesel Yoğunluk</h3>
            <div className="space-y-4">
              {HOTSPOTS.map((h: Hotspot, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{h.city}</div>
                    <div className="text-xs text-slate-500">{h.region}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-500 text-sm font-bold">%{h.percent}</div>
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-orange-600" style={{ width: `${h.percent}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
           </div>
           
           {/* CTA KUTUSU */}
           <div className="p-6 rounded-xl bg-orange-600 text-white relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="font-heading font-bold text-xl mb-2">Sizin Projeniz?</h3>
               <p className="text-orange-100 text-sm mb-4">Bölgenizdeki sevkiyat avantajlarını kaçırmayın.</p>
               <button className="w-full bg-white text-orange-700 font-bold py-3 rounded-lg hover:bg-orange-50 transition shadow-lg">
                 Hemen Maliyet Hesapla
               </button>
             </div>
             {/* Background Decoration */}
             <div className="absolute -right-6 -bottom-6 text-orange-700 opacity-30">
                <TrendingUp size={120} />
             </div>
           </div>
        </div>

      </div>
    </main>
  );
}