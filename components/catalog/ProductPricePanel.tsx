"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Layers, Package } from "lucide-react";

import type { CatalogProductView, DecisionContext, WizardPrefill } from "@/lib/catalog/types";
import AreaThresholdAssist from "./AreaThresholdAssist";
import SingleProductQuoteButton from "./SingleProductQuoteButton";
import TransportTierRail, { type TierOption } from "./TransportTierSelector";
import WizardLinkButton from "./WizardLinkButton";

interface ShippingZone {
  city_code: number;
  city_name: string;
  base_shipping_cost: string | number;
  optimix_levha_discount: string | number;
  discount_kamyon: string | number;
  discount_tir: string | number;
}

interface LogisticsCap {
  thickness: number;
  lorry_capacity_m2: string | number;
  truck_capacity_m2: string | number;
  package_size_m2: string | number;
}

interface Props {
  product: CatalogProductView;
  decision: DecisionContext;
  prefill: WizardPrefill | null;
  shippingZones: ShippingZone[];
  logisticsCapacity: LogisticsCap[];
  selectedThickness: number | null;
}

type TierId = "lorry" | "truck" | "depot";

const PROFIT_MARGIN = 0.1;

export default function ProductPricePanel({
  product,
  decision,
  prefill,
  shippingZones,
  logisticsCapacity,
  selectedThickness,
}: Props) {
  const defaultCity = shippingZones.find((z) => z.city_code === 34) ?? shippingZones[0];
  const [selectedCode, setSelectedCode] = useState<number>(defaultCity?.city_code ?? 34);
  const [selectedTier, setSelectedTier] = useState<TierId>("depot");
  const [neededM2, setNeededM2] = useState<string>("");

  const zone = shippingZones.find((z) => z.city_code === selectedCode) ?? defaultCity;
  const { rules, base_price, minimum_order, thickness_prices } = product;

  const activeThicknessPrice = thickness_prices
    ? selectedThickness
      ? thickness_prices.find((p) => p.thickness === selectedThickness) ?? thickness_prices[0]
      : thickness_prices[0]
    : null;

  const activeThickness = activeThicknessPrice?.thickness ?? selectedThickness;
  const isKdvIncluded = activeThicknessPrice?.is_kdv_included ?? false;
  const rawPrice = activeThicknessPrice?.base_price ?? base_price;

  const logistics =
    logisticsCapacity.find((l) => l.thickness === (activeThickness ?? 0) * 10) ?? null;
  const lorryM2 = logistics ? parseFloat(String(logistics.lorry_capacity_m2)) : null;
  const truckM2 = logistics ? parseFloat(String(logistics.truck_capacity_m2)) : null;
  const packageSizeM2 = logistics ? parseFloat(String(logistics.package_size_m2)) : null;

  const discKamyon = zone ? parseFloat(String(zone.discount_kamyon)) : 0;
  const discTir = zone ? parseFloat(String(zone.discount_tir)) : 0;
  const shippingCost = zone ? parseFloat(String(zone.base_shipping_cost)) : 0;

  const isk2 = (activeThicknessPrice?.discount_2 ?? 8) / 100;
  const kdvHaricListe = rawPrice !== null ? (isKdvIncluded ? rawPrice / 1.2 : rawPrice) : null;
  const pricePerM2Base =
    kdvHaricListe !== null && packageSizeM2 && packageSizeM2 > 0
      ? kdvHaricListe / packageSizeM2
      : kdvHaricListe;

  function calcPrice(isk1Pct: number): number | null {
    if (pricePerM2Base === null) return null;
    return pricePerM2Base * (1 - isk1Pct / 100) * (1 - isk2) * (1 + PROFIT_MARGIN);
  }

  const packageRefPrice = calcPrice(0);
  const lorryPrice = lorryM2 ? calcPrice(discKamyon) : null;
  const truckPrice = truckM2 ? calcPrice(discTir) : null;

  const depotDiscountPct = product.depot_discount ?? 0;
  const depotStock = activeThicknessPrice?.stock_tuzla ?? 0;
  const depotPrice = depotStock > 0 ? calcPrice(depotDiscountPct) : null;

  const neededM2Num = neededM2 ? parseFloat(neededM2.replace(",", ".")) : 0;
  const isLorryEligible = neededM2Num > 0 && lorryM2 !== null && neededM2Num >= lorryM2;
  const isTruckEligible = neededM2Num > 0 && truckM2 !== null && neededM2Num >= truckM2;

  const tiers: TierOption[] = [
    ...(lorryM2
      ? [
          {
            id: "lorry" as TierId,
            label: "Kamyon",
            capacity: lorryM2,
            price: lorryPrice,
            savings: packageRefPrice && lorryPrice ? packageRefPrice - lorryPrice : null,
            shipping: shippingCost > 0 ? shippingCost * (1 - discKamyon / 100) : 0,
            disabled: !isLorryEligible,
            minM2Required: isLorryEligible ? undefined : lorryM2,
          },
        ]
      : []),
    ...(truckM2
      ? [
          {
            id: "truck" as TierId,
            label: "TIR",
            capacity: truckM2,
            price: truckPrice,
            savings: packageRefPrice && truckPrice ? packageRefPrice - truckPrice : null,
            shipping: shippingCost > 0 ? shippingCost * (1 - discTir / 100) : 0,
            disabled: !isTruckEligible,
            minM2Required: isTruckEligible ? undefined : truckM2,
          },
        ]
      : []),
    ...(depotStock > 0
      ? [
          {
            id: "depot" as TierId,
            label: "Hızlı Teslim",
            capacity: product.depot_min_m2 ?? 300,
            price: depotPrice,
            savings: null,
            shipping: null,
            depotStock,
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (neededM2Num <= 0) {
      if (depotStock > 0) {
        setSelectedTier("depot");
      } else if (lorryM2) {
        setSelectedTier("lorry");
      } else if (truckM2) {
        setSelectedTier("truck");
      }
      return;
    }

    if (isTruckEligible) {
      setSelectedTier("truck");
      return;
    }

    if (isLorryEligible) {
      setSelectedTier("lorry");
      return;
    }

    if (depotStock > 0) {
      setSelectedTier("depot");
    }
  }, [depotStock, isLorryEligible, isTruckEligible, lorryM2, neededM2Num, truckM2]);

  const activeTier = tiers.find((tier) => tier.id === selectedTier) ?? tiers[0];
  const displayPrice = activeTier?.price ?? null;

  const showTiers = tiers.length > 0 && logistics !== null;
  const showTierPrice =
    rules.pricing_visibility_mode === "from_price" ||
    rules.pricing_visibility_mode === "exact_price";

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-fe-border bg-fe-raised/40 p-5">
        <div className="mb-4">
          {rules.pricing_visibility_mode === "hidden" && (
            <p className="text-fe-muted text-sm italic">Fiyat görüntülenmez</p>
          )}

          {rules.pricing_visibility_mode === "quote_required" && (
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-fe-muted-strong">
                Fiyat
              </p>
              <p className="text-base font-medium text-fe-text">Teklif ile belirlenir</p>
            </div>
          )}

          {showTierPrice && displayPrice !== null && (
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-fe-muted-strong">
                m² Fiyatı
              </p>
              <p className="text-3xl font-bold leading-none text-white">
                ₺
                {displayPrice.toLocaleString("tr-TR", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
                <span className="ml-1 text-sm font-normal text-fe-muted">/ m²</span>
              </p>
              <p className="mt-1 text-[11px] text-fe-muted-strong">KDV hariç</p>
              {(activeThickness || activeTier) && (
                <p className="mt-1 text-xs text-fe-muted">
                  {[activeThickness ? `${activeThickness} cm` : "", activeTier?.label]
                    .filter(Boolean)
                    .join("  •  ")}
                </p>
              )}
            </div>
          )}
        </div>

        {shippingZones.length > 0 && (
          <div className="mb-4 border-b border-fe-border/60 pb-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-fe-muted-strong">
              Teslimat Şehri
            </p>
            <div className="relative">
              <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(Number(e.target.value))}
                className="w-full appearance-none rounded-lg border border-fe-border bg-fe-surface px-3 py-2.5 pr-8 text-sm text-fe-text transition-colors hover:bg-fe-raised focus:outline-none focus:border-brand-500/60 [color-scheme:dark]"
              >
                {shippingZones.map((z) => (
                  <option key={z.city_code} value={z.city_code} className="bg-fe-surface text-fe-text">
                    {z.city_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fe-muted" />
            </div>
            {zone && (
              <p className="mt-1.5 text-[10px] text-fe-muted">
                {zone.city_code === 34
                  ? "📍 Depoya en yakın — en hızlı teslim"
                  : [41, 16, 14, 54, 81].includes(zone.city_code)
                    ? "📍 Bölgesel avantajlı teslim"
                    : null}
              </p>
            )}
          </div>
        )}

        {showTiers && showTierPrice && (
          <div className="mb-4 border-b border-fe-border/60 pb-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-fe-muted-strong">
              Proje Metrajı (m²)
            </p>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={neededM2}
                onChange={(e) => setNeededM2(e.target.value)}
                placeholder="örn. 1200"
                className="w-full rounded-lg border border-fe-border bg-fe-bg/80 px-3 py-2.5 pr-10 text-sm text-fe-text transition-colors placeholder:text-fe-muted focus:outline-none focus:border-brand-500/60"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-fe-muted">
                m²
              </span>
            </div>

            <AreaThresholdAssist
              neededM2={neededM2Num}
              lorryM2={lorryM2}
              truckM2={truckM2}
              lorryPrice={lorryPrice}
              truckPrice={truckPrice}
              packageRefPrice={packageRefPrice}
              discKamyon={discKamyon}
              discTir={discTir}
              onJump={(targetM2) => setNeededM2(String(targetM2))}
            />
          </div>
        )}

        {showTiers && (
          <div className="mb-4 border-b border-fe-border/60 pb-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-fe-muted-strong">
              Sipariş Büyüklüğü{activeThickness ? ` · ${activeThickness} cm` : ""}
            </p>
            <TransportTierRail
              tiers={tiers}
              selectedId={activeTier?.id ?? "depot"}
              onSelect={setSelectedTier}
              className="mt-3"
            />

            <div className="mt-[18px] space-y-2">
              <SingleProductQuoteButton
                product={product}
                activeThickness={activeThickness ?? null}
                pricePerM2KdvHaric={displayPrice ?? 0}
                neededM2={neededM2Num}
                cityCode={selectedCode}
                cityName={zone?.city_name ?? ""}
                tierLabel={activeTier?.label ?? ""}
                isShippingIncluded={activeTier?.id !== "depot"}
                vehicleType={activeTier?.id ?? null}
              />
              <p className="px-1 text-center text-[10px] leading-relaxed text-fe-muted">
                Fiyat, şehir ve metraj bilginizle kişisel teklif oluşturulur, PDF olarak sunulur
              </p>
              <a
                href="https://wa.me/905322041825"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-1 text-center text-xs text-fe-muted transition-colors hover:text-fe-muted"
              >
                Sormak istediğiniz mi var? → WhatsApp
              </a>
            </div>
          </div>
        )}

        {showTierPrice && !showTiers && logistics === null && activeThickness && (
          <div className="mb-3 rounded-lg border border-fe-border/50 bg-fe-raised/30 px-3 py-2.5">
            <p className="text-xs text-fe-muted">
              Bu kalınlık için nakliye verisi henüz girilmemiştir. Teklif formu veya WhatsApp
              üzerinden fiyat alabilirsiniz.
            </p>
          </div>
        )}

        {minimum_order.has_minimum && minimum_order.label && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-xs text-fe-muted">Minimum sipariş</span>
            <span className="text-xs font-medium text-amber-400">{minimum_order.label}</span>
          </div>
        )}
      </div>

      {(rules.requires_system_context || rules.sales_mode !== "single_only") && (
        <div className="rounded-xl border border-brand-500/30 bg-brand-950/20 p-5">
          <p className="mb-1 text-sm font-semibold leading-snug text-fe-text">
            Sistem halinde %10-15 daha uygun
          </p>
          <p className="mb-4 text-xs text-fe-muted">
            Dübel · Sıva · File eklenince metrekare maliyeti düşer. Takım fiyatını hesapla.
          </p>

          <WizardLinkButton
            prefill={prefill}
            targetStep={decision.wizard_target_step}
            label="Takım Fiyatını Gör →"
            variant="primary"
            className="w-full py-3 text-base"
            icon={<Package className="h-4 w-4" />}
          />
        </div>
      )}

      {rules.requires_system_context && (
        <div className="flex items-start gap-2 rounded-lg border border-fe-border/50 bg-fe-raised/30 px-4 py-3">
          <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fe-muted" />
          <p className="text-xs text-fe-muted">
            Bu ürün genellikle sistem halinde tercih edilir.
          </p>
        </div>
      )}
    </div>
  );
}
