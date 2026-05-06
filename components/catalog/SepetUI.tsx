"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SepetVehicleCards from "./SepetVehicleCards";
import SepetScenarioMessage from "./SepetScenarioMessage";

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
  /** Vehicle cards bloğunu portal ile başka bir DOM noktasına render et.
   *  null/verilmezse SepetUI'ın içinde yerinde render edilir (geri uyumlu). */
  vehicleCardsSlot?: HTMLElement | null;
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
  vehicleCardsSlot,
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
      <SepetScenarioMessage
        scenario={scenario}
        hideMinWarning={hideMinWarning}
        lorryM2={lorryM2}
        truckM2={truckM2}
        lorryPrice={lorryPrice}
        truckPrice={truckPrice}
        ihtiyac={ihtiyac}
        minOrderM2={minOrderM2}
        depotStock={depotStock}
        kamyon={kamyon}
        tir={tir}
        truckLotM2={truckLotM2}
        truckRoundedUp={truckRoundedUp}
        optimalCombo={optimalCombo}
        suggestionDiffersFromCurrent={suggestionDiffersFromCurrent}
        onSetIhtiyac={onSetIhtiyac}
        onGeriAl={handleGeriAl}
      />

      {/* ─── Araç Kartları (portal kullanılırsa üst grid'e taşınır) ──── */}
      {(() => {
        const cardsBlock = (
          <div className={scenario === 'below_minimum' ? "opacity-40 pointer-events-none select-none" : undefined}>
            <SepetVehicleCards
              kamyon={kamyon}
              lorryM2={lorryM2}
              lorryPrice={lorryPrice}
              lorryAvantaj={lorryAvantaj}
              lorryRoleLabel={autoApplied && kamyon > 0 && tir === 0 ? "Önerilen" : "Hızlı Seçim"}
              onKamyonInc={() => handleKamyon(1)}
              onKamyonDec={() => handleKamyon(-1)}
              tir={tir}
              truckM2={truckM2}
              truckPrice={truckPrice}
              truckAvantaj={truckAvantaj}
              truckRoleLabel={autoApplied && tir > 0 && kamyon === 0 ? "Önerilen" : "Tam Araç"}
              onTirInc={() => handleTir(1)}
              onTirDec={() => handleTir(-1)}
              showSummary={!vehicleCardsSlot}
              totalM2={totalM2}
              totalTL={totalTL}
              fazlaM2={fazlaM2}
              layout={vehicleCardsSlot ? "vertical" : "horizontal"}
            />
          </div>
        );

        return vehicleCardsSlot ? createPortal(cardsBlock, vehicleCardsSlot) : cardsBlock;
      })()}

    </div>
  );
}
