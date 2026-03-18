import { Metadata } from 'next';
import { MOCK_TRANSACTIONS } from "@/lib/data/marketData";
import WizardCalculator from "@/components/wizard/WizardCalculator";

// DİKKAT: Params artık bir Promise
type Props = {
  params: Promise<{ sehir: string; ilce: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Params'ı önce bekliyoruz (await)
  const resolvedParams = await params;
  
  const city = resolvedParams.sehir.charAt(0).toUpperCase() + resolvedParams.sehir.slice(1);
  const district = resolvedParams.ilce.charAt(0).toUpperCase() + resolvedParams.ilce.slice(1);
  
  return {
    title: `${city} ${district} Taşyünü ve Mantolama Fiyatları | Lojistik Destekli`,
    description: `${city} ${district} bölgesi için güncel taşyünü fiyatları, tır bazlı sevkiyat avantajları.`,
  }
}

export default async function BolgePage({ params }: Props) {
  // Params'ı component içinde de bekliyoruz
  const resolvedParams = await params;

  const city = resolvedParams.sehir.charAt(0).toUpperCase() + resolvedParams.sehir.slice(1);
  const district = resolvedParams.ilce.charAt(0).toUpperCase() + resolvedParams.ilce.slice(1);

  // O bölgeye ait referansları filtrele
  const localRefs = MOCK_TRANSACTIONS.filter(t => 
    t.city.toLowerCase() === city.toLowerCase() || 
    t.district.toLowerCase() === district.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO ALANI */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide mb-4">
            📍 Bölgesel Lojistik Merkezi
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-white mb-4">
            {city}, {district} <span className="text-orange-600">Taşyünü Fiyatları</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {city} bölgesine özel haftalık sevkiyat planlaması ve 
            <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded mx-1">TIR İskontosu (%18)</span> 
            ile maliyetlerinizi düşürüyoruz.
          </p>
        </div>

        {/* WIZARD CALCULATOR - Otomatik Şehir Seçimi */}
        <div className="mb-16">
          <WizardCalculator preSelectedCityName={city} />
        </div>

        {/* YEREL REFERANSLAR */}
        {localRefs.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              {city} Bölgesindeki Son Hareketler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localRefs.map((t) => (
                <div key={t.id} className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">{t.timestamp.split('T')[0]}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{t.district} Projesi</div>
                  <div className="text-orange-600 font-mono text-sm">{t.m2} m² • {t.brand}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">
            Bu bölge için henüz listelenmiş güncel proje verisi yok.
          </div>
        )}
      </div>
    </main>
  );
}