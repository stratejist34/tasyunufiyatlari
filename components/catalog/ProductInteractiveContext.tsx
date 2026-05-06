"use client";

// ProductDetailInteractive Context
// Tüm interactive ürün detayı state'inin tek otoritesi:
//   - selectedCityCode  → şehir seçimi (ProductPricePanel + MobileProductHero okur)
//   - activeThickness   → kalınlık seçimi (ThicknessSelector yazar; herkes okur)
// Mobil özet kart, picker ve fiyat paneli bu state'e abone → şehir/kalınlık her
// değiştiğinde tüm bağımlı bloklar anında reaktif.

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ContextValue {
  cityCode: number;
  setCityCode: (code: number) => void;
  activeThickness: number | null;
  setActiveThickness: (thickness: number | null) => void;
  /** Senaryo-aware m² fiyatı (sepet dolu → effectivePrice; boş → liste).
   *  ProductPricePanel yazar, MobileProductHero ve diğer tüketiciler okur. */
  heroPrice: number | null;
  setHeroPrice: (price: number | null) => void;
}

const ProductInteractiveContext = createContext<ContextValue | null>(null);

interface ProviderProps {
  children: React.ReactNode;
  initialCityCode: number;
  initialThickness: number | null;
}

export function ProductInteractiveProvider({
  children,
  initialCityCode,
  initialThickness,
}: ProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [cityCode, setCityCodeState] = useState(initialCityCode);
  const [activeThickness, setActiveThicknessState] = useState<number | null>(initialThickness);
  const [heroPrice, setHeroPriceState] = useState<number | null>(null);
  const setHeroPrice = useCallback((price: number | null) => {
    setHeroPriceState(price);
  }, []);

  // URL'deki ?kalinlik= değişirse state'i sync et (dış navigasyon, geri/ileri vb.)
  useEffect(() => {
    const raw = searchParams.get("kalinlik");
    if (!raw) return;
    const parsed = parseFloat(raw);
    if (!Number.isFinite(parsed)) return;
    if (parsed !== activeThickness) {
      setActiveThicknessState(parsed);
    }
    // sadece searchParams değişince çalışsın
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const setActiveThickness = useCallback(
    (thickness: number | null) => {
      setActiveThicknessState(thickness);
      // URL'i de güncelle (history pollution önlemek için replace + scroll false)
      if (thickness != null) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("kalinlik", `${thickness}cm`);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    [pathname, router, searchParams]
  );

  const setCityCode = useCallback((code: number) => {
    setCityCodeState(code);
  }, []);

  return (
    <ProductInteractiveContext.Provider
      value={{ cityCode, setCityCode, activeThickness, setActiveThickness, heroPrice, setHeroPrice }}
    >
      {children}
    </ProductInteractiveContext.Provider>
  );
}

export function useProductInteractive(): ContextValue {
  const ctx = useContext(ProductInteractiveContext);
  if (!ctx) {
    throw new Error("useProductInteractive must be used inside <ProductInteractiveProvider>");
  }
  return ctx;
}

/** Provider yoksa null döner — opsiyonel kullanım için. */
export function useProductInteractiveOptional(): ContextValue | null {
  return useContext(ProductInteractiveContext);
}
