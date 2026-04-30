"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";

// ─── Tipler ────────────────────────────────────────────────────────────────

export type SepetScenario =
  | 'empty'          // ihtiyac = 0
  | 'below_minimum'  // ihtiyac > 0 && ihtiyac < minOrderM2
  | 'depot_optimal'  // stok uygun ve daha ucuz
  | 'lorry_optimal'  // 1+ kamyon (tir = 0)
  | 'tir_optimal'    // 1+ tir (kamyon = 0)
  | 'large_project'  // karışık: tir + kamyon
  | 'ara_metraj';    // ihtiyac > 0 ama sepet boş (no auto-apply)

export interface SepetState {
  kamyon: number;
  tir: number;
  autoApplied: boolean;
  totalM2: number;
  effectivePrice: number | null;
  stokOnerisi: boolean;
  scenario: SepetScenario;
}

// Tek state nesnesi: render sırasında tek setState çağrısıyla güncellenir
type SepetInternal = {
  kamyon: number;
  tir: number;
  autoApplied: boolean;
  stokOnerisi: boolean;
};

interface Props {
  lorryM2: number;
  truckM2: number;
  lorryPrice: number | null;
  truckPrice: number | null;
  packageRefPrice: number | null;
  depotStock: number;
  depotPrice: number | null;
  depotMinM2: number;
  minOrderM2: number; // 0 = minimum yok
  ihtiyac: number;
  onChange: (state: SepetState) => void;
  onSetIhtiyac?: (m2: number) => void; // "300 m²'ye tamamla" butonu
  hideMinWarning?: boolean;            // yazarken geçici below_minimum kutusunu gizle
}

type OptimalResult = {
  kamyon: number;
  tir: number;
  totalM2: number;
  totalTL: number;
} | null;

// ─── Pure fonksiyonlar (bileşen dışında, render'da yeniden oluşturulmaz) ──

function findOptimalCombination(
  ihtiyac: number,
  lorryM2: number,
  truckM2: number,
  lorryPrice: number,
  truckPrice: number
): OptimalResult {
  if (ihtiyac <= 0) return null;

  let best: OptimalResult = null;
  let minTL = Infinity;
  let minFazla = Infinity;

  for (let t = 0; t <= 10; t++) {
    for (let k = 0; k <= 5; k++) {
      if (t === 0 && k === 0) continue;
      const totalM2 = t * truckM2 + k * lorryM2;
      if (totalM2 < ihtiyac) continue;
      const totalTL = t * truckM2 * truckPrice + k * lorryM2 * lorryPrice;
      const fazla = totalM2 - ihtiyac;

      if (
        totalTL < minTL ||
        (Math.abs(totalTL - minTL) < 100 && fazla < minFazla)
      ) {
        minTL = totalTL;
        minFazla = fazla;
        best = { kamyon: k, tir: t, totalM2, totalTL };
      }
    }
  }

  return best;
}

function buildEffectivePrice(
  kamyon: number,
  tir: number,
  lorryM2: number,
  truckM2: number,
  lorryPrice: number | null,
  truckPrice: number | null
): number | null {
  const totalM2 = kamyon * lorryM2 + tir * truckM2;
  if (totalM2 === 0) return null;
  const totalTL =
    (lorryPrice !== null ? kamyon * lorryM2 * lorryPrice : 0) +
    (truckPrice !== null ? tir * truckM2 * truckPrice : 0);
  return totalTL / totalM2;
}

function fmt(v: number, d = 2) {
  return v.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });
}

// ─── Alt Bileşenler ─────────────────────────────────────────────────────────

function CounterButton({
  onClick,
  disabled,
  children,
  ariaLabel,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-fe-border bg-fe-raised text-fe-text transition-colors hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-brand-300 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function AracKarti({
  label,
  roleLabel,
  capacity,
  price,
  avantaj,
  count,
  onIncrement,
  onDecrement,
  available,
}: {
  label: string;
  roleLabel?: string;
  capacity: number;
  price: number | null;
  avantaj: number | null;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  available: boolean;
}) {
  if (!available) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-fe-border/30 bg-fe-raised/20 p-4 opacity-40">
        <p className="text-xs text-fe-muted">Bu kalınlıkta</p>
        <p className="text-xs text-fe-muted">{label} yok</p>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl border p-4 transition-all ${
        count > 0
          ? "border-brand-500/40 bg-brand-500/8 shadow-[0_0_0_1px_rgba(212,132,90,0.12)]"
          : "border-fe-border bg-fe-raised/50"
      }`}
    >
      {count > 0 && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
          {count}
        </span>
      )}

      {roleLabel && (
        <p className={`mb-1.5 text-[9px] font-semibold uppercase tracking-wider ${
          roleLabel === "Önerilen" ? "text-brand-400" : "text-fe-muted/60"
        }`}>
          {roleLabel}
        </p>
      )}
      <p className="mb-1 text-sm font-semibold text-fe-text">{label}</p>
      <p className="mb-0.5 text-[11px] text-fe-muted">{fmt(capacity, 0)} m²</p>

      {price !== null ? (
        <p className="mb-3 text-[13px] font-bold text-white">
          ₺{fmt(price)}{" "}
          <span className="text-[10px] font-normal text-fe-muted">/m²</span>
        </p>
      ) : (
        <p className="mb-3 text-[13px] text-fe-muted">Fiyat teklif ile</p>
      )}

      {avantaj !== null && avantaj > 0 && (
        <div className="mb-3 inline-flex items-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          ↓ ₺{fmt(avantaj)} avantaj
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <CounterButton
          onClick={onDecrement}
          disabled={count === 0}
          ariaLabel={`${label} adetini bir azalt`}
        >
          <Minus className="h-4 w-4" />
        </CounterButton>

        <span
          className="min-w-[2rem] text-center text-lg font-bold text-fe-text"
          aria-live="polite"
          aria-atomic="true"
        >
          {count}
        </span>

        <CounterButton onClick={onIncrement} ariaLabel={`${label} adetini bir artır`}>
          <Plus className="h-4 w-4" />
        </CounterButton>
      </div>
    </div>
  );
}

// ─── Sabitler ───────────────────────────────────────────────────────────────

const INITIAL_SEPET: SepetInternal = {
  kamyon: 0,
  tir: 0,
  autoApplied: false,
  stokOnerisi: false,
};

// ─── Ana Bileşen ─────────────────────────────────────────────────────────────

export default function SepetUI({
  lorryM2,
  truckM2,
  lorryPrice,
  truckPrice,
  packageRefPrice,
  depotStock,
  depotPrice,
  depotMinM2,
  minOrderM2,
  ihtiyac,
  onChange,
  onSetIhtiyac,
  hideMinWarning = false,
}: Props) {
  // prevIhtiyac'ı state olarak tut: render sırasında ihtiyac değişimini yakalar
  // ve "setState during render" escape hatch'i ile tepki verir (effect yerine).
  // Bu, React'ın önerdiği getDerivedStateFromProps eşdeğeri: react.dev/learn/you-might-not-need-an-effect
  const [prevIhtiyac, setPrevIhtiyac] = useState<number>(-1);
  const [sepet, setSepet] = useState<SepetInternal>(INITIAL_SEPET);

  // ─── TEK KAYNAK: optimal kombinasyon memo'su ────────────────────────────
  const optimalCombo = useMemo<OptimalResult>(() => {
    if (ihtiyac <= 0 || !lorryPrice || !truckPrice) return null;
    return findOptimalCombination(ihtiyac, lorryM2, truckM2, lorryPrice, truckPrice);
  }, [ihtiyac, lorryM2, truckM2, lorryPrice, truckPrice]);

  // ─── Stok daha ucuz mu? ─────────────────────────────────────────────────
  const stokDahaUygun = useMemo(() => {
    if (
      ihtiyac <= 0 ||
      ihtiyac < depotMinM2 ||   // deponun kendi minimumunu karşılamıyorsa depot önerisi gösterilmez
      depotStock <= 0 ||
      depotPrice === null ||
      depotStock < ihtiyac ||
      optimalCombo === null
    ) {
      return false;
    }
    return ihtiyac * depotPrice < optimalCombo.totalTL;
  }, [ihtiyac, depotMinM2, depotStock, depotPrice, optimalCombo]);

  // ─── ihtiyac değişince otomatik uygula — render sırasında (effect değil) ──
  // React'ın "store information from previous renders" escape hatch'i.
  // ESLint react-hooks/set-state-in-effect kuralını tetiklemez.
  if (prevIhtiyac !== ihtiyac) {
    setPrevIhtiyac(ihtiyac);

    if (ihtiyac <= 0) {
      setSepet(INITIAL_SEPET);
    } else if (depotStock > 0 && minOrderM2 > 0 && ihtiyac < minOrderM2) {
      // Depo siparişi altında: kamyon önermeden beklet (stoksuz kalınlıkta bu dal atllanır)
      setSepet(INITIAL_SEPET);
    } else if (stokDahaUygun) {
      setSepet({ kamyon: 0, tir: 0, autoApplied: false, stokOnerisi: true });
    } else if (optimalCombo) {
      setSepet({
        kamyon: optimalCombo.kamyon,
        tir: optimalCombo.tir,
        autoApplied: true,
        stokOnerisi: false,
      });
    }
  }

  // ─── onChange callback'ini her state değişiminde çağır ──────────────────
  // lastSentRef: state'e gelecekte object eklense bile sonsuz döngüyü engeller.
  // useCallback(fn, []) ile stabil tutulan onChange olmazsa döngüye girer —
  // bu guard ikinci savunma hattı.
  const lastSentRef = useRef<string>("");

  useEffect(() => {
    const totalM2 = sepet.kamyon * lorryM2 + sepet.tir * truckM2;
    const effectivePrice = buildEffectivePrice(
      sepet.kamyon,
      sepet.tir,
      lorryM2,
      truckM2,
      lorryPrice,
      truckPrice
    );
    const signature = `${sepet.kamyon}-${sepet.tir}-${sepet.autoApplied}-${sepet.stokOnerisi}-${totalM2}-${effectivePrice ?? "null"}-${scenario}`;
    if (lastSentRef.current === signature) return;
    lastSentRef.current = signature;
    onChange({
      kamyon: sepet.kamyon,
      tir: sepet.tir,
      autoApplied: sepet.autoApplied,
      totalM2,
      effectivePrice,
      stokOnerisi: sepet.stokOnerisi,
      scenario,
    });
  }, [sepet, lorryM2, truckM2, lorryPrice, truckPrice, onChange]);

  // ─── Manuel değişim ─────────────────────────────────────────────────────
  function handleKamyon(delta: number) {
    setSepet((prev) => ({
      ...prev,
      kamyon: Math.max(0, prev.kamyon + delta),
      autoApplied: false,
      stokOnerisi: false,
    }));
  }

  function handleTir(delta: number) {
    setSepet((prev) => ({
      ...prev,
      tir: Math.max(0, prev.tir + delta),
      autoApplied: false,
      stokOnerisi: false,
    }));
  }

  function handleGeriAl() {
    if (!optimalCombo) return;
    setSepet({
      kamyon: optimalCombo.kamyon,
      tir: optimalCombo.tir,
      autoApplied: true,
      stokOnerisi: false,
    });
  }

  // ─── Türetilmiş değerler ────────────────────────────────────────────────
  const { kamyon, tir, autoApplied, stokOnerisi } = sepet;

  const totalM2 = kamyon * lorryM2 + tir * truckM2;
  const totalTL =
    (lorryPrice !== null ? kamyon * lorryM2 * lorryPrice : 0) +
    (truckPrice !== null ? tir * truckM2 * truckPrice : 0);
  const fazlaM2 = totalM2 > ihtiyac && ihtiyac > 0 ? totalM2 - ihtiyac : 0;

  const lorryAvantaj =
    packageRefPrice !== null && lorryPrice !== null ? packageRefPrice - lorryPrice : null;
  const truckAvantaj =
    packageRefPrice !== null && truckPrice !== null ? packageRefPrice - truckPrice : null;

  // Kamyon/TIR senaryosu için türetilmiş yardımcılar
  const lorryLotM2 = kamyon * lorryM2;
  const truckLotM2 = tir * truckM2;
  // true → kullanıcı lorryLotM2'den küçük girdi, optimizer yuvarladı
  const lorryRoundedUp = kamyon > 0 && tir === 0 && ihtiyac > 0 && ihtiyac < lorryLotM2;
  const truckRoundedUp = tir > 0 && kamyon === 0 && ihtiyac > 0 && ihtiyac < truckLotM2;

  const scenario: SepetScenario = (() => {
    if (ihtiyac <= 0) return 'empty';
    // below_minimum yalnızca stok olan kalınlıklarda geçerli (depo bazlı minimum)
    // stok yoksa fabrika minimumu = 1 Kamyon → lorry_optimal zaten açıklıyor
    if (depotStock > 0 && minOrderM2 > 0 && ihtiyac < minOrderM2) return 'below_minimum';
    if (stokOnerisi) return 'depot_optimal';
    if (kamyon === 0 && tir === 0) return 'ara_metraj';
    if (kamyon > 0 && tir === 0) return 'lorry_optimal';
    if (tir > 0 && kamyon === 0) return 'tir_optimal';
    if (kamyon > 0 && tir > 0) return 'large_project';
    return 'ara_metraj';
  })();

  // Manuel mod önerisi: sepet dolu ama optimal farklı
  const suggestionDiffersFromCurrent =
    !autoApplied &&
    !stokOnerisi &&
    (kamyon > 0 || tir > 0) &&
    optimalCombo !== null &&
    (optimalCombo.kamyon !== kamyon || optimalCombo.tir !== tir);

  return (
    <div className="mt-4 space-y-3" aria-label="Sepet">

      {/* ─── Tek Ana Karar Mesajı ──────────────────────────────────── */}
      <div aria-live="polite">

        {/* Minimum altı — hideMinWarning: yazarken gizle, debounce yerleşince göster */}
        {scenario === 'below_minimum' && !hideMinWarning && (
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
        {scenario === 'depot_optimal' && (
          <div className="rounded-xl border border-green-600/30 bg-green-950/25 p-4">
            <p className="text-sm font-semibold text-green-200">Tuzla Depo teslim için uygun</p>
            <p className="mt-1 text-[11px] leading-relaxed text-green-200/70">
              Bu metraj mevcut stoktan karşılanabilir. Hızlı teslim için WhatsApp üzerinden stok
              ve teslimat teyidi alabilirsiniz.
            </p>
          </div>
        )}

        {/* Kamyon seçenek */}
        {scenario === 'lorry_optimal' && (
          <div className="rounded-xl border border-brand-700/30 bg-brand-950/20 p-4">
            <p className="text-sm font-semibold text-brand-200">
              {kamyon === 1
                ? lorryRoundedUp && depotStock === 0
                  ? "Fabrika siparişi için minimum 1 Kamyon"
                  : "1 Kamyon tam yükleme için uygun"
                : `${kamyon} Kamyon yüklemesi`}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-brand-200/70">
              {lorryRoundedUp && depotStock === 0
                ? `Bu kalınlık fabrikadan minimum ${fmt(lorryM2, 0)} m² (1 Kamyon) alınabilir. Girdiğiniz ${fmt(ihtiyac, 0)} m² için sipariş ${fmt(lorryLotM2, 0)} m²'ye tamamlandı.`
                : kamyon === 1
                  ? "Girdiğiniz metraj 1 kamyon kapasitesine denk geliyor. Bu seçenek, depo teslimata göre daha avantajlı m² fiyatı sunabilir."
                  : `${fmt(lorryLotM2, 0)} m² tam kamyon yüklemesiyle avantajlı m² fiyatı alabilirsiniz.`}
            </p>
            {suggestionDiffersFromCurrent && optimalCombo && (
              <button
                type="button"
                onClick={handleGeriAl}
                className="mt-2 text-[11px] font-semibold text-brand-300 hover:text-brand-100 transition-colors"
              >
                {optimalCombo.kamyon} Kamyon seç →
              </button>
            )}
          </div>
        )}

        {/* TIR seçenek */}
        {scenario === 'tir_optimal' && (
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
                onClick={handleGeriAl}
                className="mt-2 text-[11px] font-semibold text-brand-300 hover:text-brand-100 transition-colors"
              >
                {optimalCombo.tir} TIR seç →
              </button>
            )}
          </div>
        )}

        {/* Büyük proje: karışık veya çoklu yükleme */}
        {scenario === 'large_project' && (
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
                onClick={handleGeriAl}
                className="mt-2 text-[11px] font-semibold text-brand-300 hover:text-brand-100 transition-colors"
              >
                Önerilen kombinasyonu uygula →
              </button>
            )}
          </div>
        )}

        {/* Ara metraj: seçim bekleniyor */}
        {scenario === 'ara_metraj' && lorryPrice !== null && truckPrice !== null && (
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

      {/* ─── Araç Kartları (de-emphasize below minimum) ──────────── */}
      <div className={scenario === 'below_minimum' ? "opacity-40 pointer-events-none select-none" : undefined}>
      <div className="grid grid-cols-2 gap-3">
        <AracKarti
          label="Kamyon"
          roleLabel={autoApplied && kamyon > 0 && tir === 0 ? "Önerilen" : "Hızlı Seçim"}
          capacity={lorryM2}
          price={lorryPrice}
          avantaj={lorryAvantaj}
          count={kamyon}
          onIncrement={() => handleKamyon(1)}
          onDecrement={() => handleKamyon(-1)}
          available={lorryPrice !== null}
        />
        <AracKarti
          label="TIR"
          roleLabel={autoApplied && tir > 0 && kamyon === 0 ? "Önerilen" : "Tam Araç"}
          capacity={truckM2}
          price={truckPrice}
          avantaj={truckAvantaj}
          count={tir}
          onIncrement={() => handleTir(1)}
          onDecrement={() => handleTir(-1)}
          available={truckPrice !== null}
        />
      </div>

      {/* Sepet Özeti */}
      {(kamyon > 0 || tir > 0) && (
        <div
          className="rounded-xl border border-fe-border/60 bg-fe-raised/35 px-4 py-3"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-fe-muted">Toplam Sipariş</p>
              <p className="mt-0.5 text-sm font-semibold text-fe-text">{fmt(totalM2, 0)} m²</p>
              {fazlaM2 > 0 && (
                <p className="mt-0.5 text-[10px] text-emerald-400">+{fmt(fazlaM2, 0)} m² fazla</p>
              )}
            </div>
            {totalTL > 0 && (
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wide text-fe-muted">Tahmini Tutar</p>
                <p className="mt-0.5 text-base font-bold text-white">₺{fmt(totalTL, 0)}</p>
                <p className="mt-0.5 text-[10px] text-fe-muted">KDV hariç</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Eğitsel Kutu */}
      <div className="rounded-lg border border-brand-700/25 bg-brand-950/20 px-3 py-3">
        <p className="mb-1 text-xs font-semibold text-brand-200">Neden tam araç avantajlı?</p>
        <p className="text-[11px] leading-relaxed text-brand-200/70">
          Fabrika çıkışlı alımlarda tam araç yüklemesi gerekir. Ara metraj ihtiyaçlarında sistem
          önce depo stoklarını kontrol eder.
        </p>
      </div>
      </div>{/* /de-emphasize wrapper */}

    </div>
  );
}
