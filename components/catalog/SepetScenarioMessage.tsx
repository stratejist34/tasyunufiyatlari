"use client";

// SepetScenarioMessage
// SepetUI'ın 5 farklı senaryo mesaj kartını barındırır:
//   below_minimum / depot_optimal / tir_optimal / large_project / ara_metraj
// Saf görsel + dış callback'ler. State SepetUI'da kalır; bu bileşen sadece
// mevcut scenario'ya uygun mesajı render eder.
//
// React.memo: scenario veya ilgili türetilmiş değer değişmedikçe re-render yapmaz.

import { memo } from "react";
import type { SepetScenario } from "./SepetUI";

function fmt(v: number, d = 2) {
  return v.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });
}

interface OptimalCombo {
  kamyon: number;
  tir: number;
  totalM2: number;
  totalTL: number;
}

interface Props {
  scenario: SepetScenario;
  hideMinWarning?: boolean;
  // Sayısal/lojistik
  lorryM2: number;
  truckM2: number;
  lorryPrice: number | null;
  truckPrice: number | null;
  ihtiyac: number;
  minOrderM2: number;
  depotStock: number;
  // Türetilmiş durum
  kamyon: number;
  tir: number;
  truckLotM2: number;
  truckRoundedUp: boolean;
  optimalCombo: OptimalCombo | null;
  suggestionDiffersFromCurrent: boolean;
  // Callback'ler
  onSetIhtiyac?: (m2: number) => void;
  onGeriAl: () => void;
}

function SepetScenarioMessageImpl({
  scenario,
  hideMinWarning,
  lorryM2,
  truckM2,
  lorryPrice,
  truckPrice,
  ihtiyac,
  minOrderM2,
  depotStock,
  kamyon: _kamyon,
  tir,
  truckLotM2,
  truckRoundedUp,
  optimalCombo,
  suggestionDiffersFromCurrent,
  onSetIhtiyac,
  onGeriAl,
}: Props) {
  return (
    <div aria-live="polite">
      {/* Minimum altı — hideMinWarning: yazarken gizle, debounce yerleşince göster */}
      {scenario === "below_minimum" && !hideMinWarning && (
        <div className="rounded-xl border border-brand-600/30 bg-brand-950/25 p-4">
          <p className="text-sm font-semibold text-brand-200">
            Bu ürün için minimum sipariş {fmt(minOrderM2, 0)} m²&apos;dir.
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-brand-200/70">
            Girdiğiniz metraj teklif oluşturma sınırının altında. Devam etmek için metrajı{" "}
            {fmt(minOrderM2, 0)} m²&apos;ye tamamlayabilirsiniz.
          </p>
          {onSetIhtiyac && (
            <button
              type="button"
              onClick={() => onSetIhtiyac(minOrderM2)}
              className="mt-3 rounded-lg border border-brand-600/50 bg-brand-900/30 px-3 py-1.5 text-[11px] font-semibold text-brand-300 transition-colors hover:bg-brand-900/50"
            >
              {fmt(minOrderM2, 0)} m²&apos;ye tamamla
            </button>
          )}
        </div>
      )}

      {/* Depo uygun */}
      {scenario === "depot_optimal" && (
        <div className="rounded-xl border border-green-600/30 bg-green-950/25 p-4">
          <p className="text-sm font-semibold text-green-200">Tuzla Depo teslim için uygun</p>
          <p className="mt-1 text-[11px] leading-relaxed text-green-200/70">
            Bu metraj mevcut stoktan karşılanabilir. Hızlı teslim için WhatsApp üzerinden stok
            ve teslimat teyidi alabilirsiniz.
          </p>
        </div>
      )}

      {/* TIR seçenek */}
      {scenario === "tir_optimal" && (
        <div className="rounded-xl border border-brand-700/30 bg-brand-950/20 p-4">
          <p className="text-sm font-semibold text-brand-200">
            {tir === 1
              ? truckRoundedUp && depotStock === 0
                ? "Fabrika siparişi için minimum 1 TIR"
                : "1 TIR tam yükleme için uygun"
              : `${tir} TIR yüklemesi`}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-brand-200/70">
            {truckRoundedUp && depotStock === 0
              ? `Bu kalınlık fabrikadan minimum ${fmt(truckM2, 0)} m² (1 TIR) alınabilir. Girdiğiniz ${fmt(ihtiyac, 0)} m² için sipariş ${fmt(truckLotM2, 0)} m²'ye tamamlandı.`
              : tir === 1
                ? "Girdiğiniz metraj 1 TIR kapasitesine denk geliyor. Bu seçenek, yüksek metrajlı projeler için en avantajlı m² fiyatını sunar."
                : `${fmt(truckLotM2, 0)} m² TIR yüklemesi, yüksek metrajlı projelerde en düşük m² fiyatını sunar.`}
          </p>
          {suggestionDiffersFromCurrent && optimalCombo && (
            <button
              type="button"
              onClick={onGeriAl}
              className="mt-2 text-[11px] font-semibold text-brand-300 hover:text-brand-100 transition-colors"
            >
              {optimalCombo.tir} TIR seç →
            </button>
          )}
        </div>
      )}

      {/* Büyük proje: karışık veya çoklu yükleme */}
      {scenario === "large_project" && (
        <div className="rounded-xl border border-brand-700/30 bg-brand-950/20 p-4">
          <p className="text-sm font-semibold text-brand-200">
            Büyük metrajlı proje için özel teklif
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-brand-200/70">
            Bu metraj birden fazla yükleme planı gerektirebilir. Fiyat, sevkiyat ve teslim
            süresi proje detayına göre netleştirilir.
          </p>
          {suggestionDiffersFromCurrent && optimalCombo && (
            <button
              type="button"
              onClick={onGeriAl}
              className="mt-2 text-[11px] font-semibold text-brand-300 hover:text-brand-100 transition-colors"
            >
              Önerilen kombinasyonu uygula →
            </button>
          )}
        </div>
      )}

      {/* Ara metraj: seçim bekleniyor */}
      {scenario === "ara_metraj" && lorryPrice !== null && truckPrice !== null && (
        <div className="rounded-xl border border-fe-border/60 bg-fe-raised/30 p-4">
          <p className="text-sm font-semibold text-fe-text">
            {depotStock > 0
              ? "Ara metraj — stok kontrolü yapılıyor"
              : "Direkt alım için tam araç seçiniz"}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-fe-muted">
            {depotStock > 0
              ? `Bu metraj ${fmt(lorryM2, 0)} m² (Kamyon) ile ${fmt(truckM2, 0)} m² (TIR) arasında. Girdiğiniz ihtiyaç depo stoğuyla karşılanabilir.`
              : `Bu kalınlıkta depo stoğu yok. Direkt fabrika alımında siparişler tam Kamyon (${fmt(lorryM2, 0)} m²) veya tam TIR (${fmt(truckM2, 0)} m²) olarak oluşturulur.`}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => onSetIhtiyac?.(lorryM2)}
              className="flex-1 rounded-lg border border-fe-border bg-fe-raised px-2 py-2 text-[11px] font-semibold text-fe-text transition-colors hover:border-brand-500/40 hover:text-brand-300"
            >
              {fmt(lorryM2, 0)} m² yap
            </button>
            <button
              type="button"
              onClick={() => onSetIhtiyac?.(truckM2)}
              className="flex-1 rounded-lg border border-fe-border bg-fe-raised px-2 py-2 text-[11px] font-semibold text-fe-text transition-colors hover:border-brand-500/40 hover:text-brand-300"
            >
              {fmt(truckM2, 0)} m² yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const SepetScenarioMessage = memo(SepetScenarioMessageImpl);
export default SepetScenarioMessage;
