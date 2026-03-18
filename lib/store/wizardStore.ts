import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ==========================================
// WIZARD STATE INTERFACE
// ==========================================

interface WizardState {
  // ===== WIZARD ADIMI =====
  step: number;

  // ===== ADIM 1: Ürün Bilgileri =====
  levhaTipi: 'tasyunu' | 'eps' | null;
  markaId: number | null;
  markaAdi: string | null;
  modelId: number | null;
  modelAdi: string | null;
  kalinlik: number | null;
  metraj: number | null;

  // ===== ADIM 2: Teslimat Bilgileri =====
  sehirKodu: number | null;
  sehirAdi: string | null;
  ilceId: number | null;
  ilceAdi: string | null;

  // ===== ADIM 3: Paket Seçimi =====
  secilenPaket: any | null;
  showResults: boolean;

  // ==========================================
  // ACTIONS
  // ==========================================

  // ----- Adım 1: Ürün Bilgileri -----
  setLevhaTipi: (tip: 'tasyunu' | 'eps') => void;
  setMarka: (id: number, adi: string) => void;
  setModel: (id: number, adi: string) => void;
  setKalinlik: (kalinlik: number) => void;
  setMetraj: (metraj: number) => void;

  // ----- Adım 2: Teslimat Bilgileri -----
  setSehir: (kod: number, adi: string) => void;
  setIlce: (id: number, adi: string) => void;

  // ----- Adım 3: Paket Seçimi -----
  setSecilenPaket: (paket: any) => void;
  setShowResults: (show: boolean) => void;

  // ----- Wizard Navigasyon -----
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  step: 1,
  levhaTipi: null,
  markaId: null,
  markaAdi: null,
  modelId: null,
  modelAdi: null,
  kalinlik: null,
  metraj: null,
  sehirKodu: null,
  sehirAdi: null,
  ilceId: null,
  ilceAdi: null,
  secilenPaket: null,
  showResults: false,
};

// ==========================================
// ZUSTAND STORE
// ==========================================

export const useWizardStore = create<WizardState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // ===== ADIM 1 ACTIONS =====
        setLevhaTipi: (tip) =>
          set(
            {
              levhaTipi: tip,
              // Levha tipi değiştiğinde marka ve modeli sıfırla
              markaId: null,
              markaAdi: null,
              modelId: null,
              modelAdi: null,
            },
            false,
            'setLevhaTipi'
          ),

        setMarka: (id, adi) =>
          set(
            {
              markaId: id,
              markaAdi: adi,
              // Marka değiştiğinde modeli sıfırla
              modelId: null,
              modelAdi: null,
            },
            false,
            'setMarka'
          ),

        setModel: (id, adi) =>
          set(
            {
              modelId: id,
              modelAdi: adi,
            },
            false,
            'setModel'
          ),

        setKalinlik: (kalinlik) =>
          set(
            {
              kalinlik,
            },
            false,
            'setKalinlik'
          ),

        setMetraj: (metraj) =>
          set(
            {
              metraj,
            },
            false,
            'setMetraj'
          ),

        // ===== ADIM 2 ACTIONS =====
        setSehir: (kod, adi) =>
          set(
            {
              sehirKodu: kod,
              sehirAdi: adi,
              // Şehir değiştiğinde ilçeyi sıfırla
              ilceId: null,
              ilceAdi: null,
            },
            false,
            'setSehir'
          ),

        setIlce: (id, adi) =>
          set(
            {
              ilceId: id,
              ilceAdi: adi,
            },
            false,
            'setIlce'
          ),

        // ===== ADIM 3 ACTIONS =====
        setSecilenPaket: (paket) =>
          set(
            {
              secilenPaket: paket,
            },
            false,
            'setSecilenPaket'
          ),

        setShowResults: (show) =>
          set(
            {
              showResults: show,
            },
            false,
            'setShowResults'
          ),

        // ===== WIZARD NAVİGASYON =====
        nextStep: () => {
          const currentStep = get().step;
          set(
            {
              step: Math.min(currentStep + 1, 3),
            },
            false,
            'nextStep'
          );
        },

        previousStep: () => {
          const currentStep = get().step;
          set(
            {
              step: Math.max(currentStep - 1, 1),
            },
            false,
            'previousStep'
          );
        },

        goToStep: (step) =>
          set(
            {
              step: Math.max(1, Math.min(step, 3)),
            },
            false,
            'goToStep'
          ),

        reset: () =>
          set(
            {
              ...initialState,
            },
            false,
            'reset'
          ),
      }),
      {
        name: 'tasyunu-wizard', // localStorage key
        partialize: (state) => ({
          // Sadece kullanıcı seçimlerini kaydet, UI state'lerini kaydetme
          levhaTipi: state.levhaTipi,
          markaId: state.markaId,
          markaAdi: state.markaAdi,
          modelId: state.modelId,
          modelAdi: state.modelAdi,
          kalinlik: state.kalinlik,
          metraj: state.metraj,
          sehirKodu: state.sehirKodu,
          sehirAdi: state.sehirAdi,
          ilceId: state.ilceId,
          ilceAdi: state.ilceAdi,
        }),
      }
    ),
    {
      name: 'WizardStore', // DevTools'da görünecek isim
    }
  )
);

// ==========================================
// SELECTOR HOOKS (Optional - Performance)
// ==========================================

// Sadece step'i al (re-render optimizasyonu)
export const useWizardStep = () => useWizardStore((state) => state.step);

// Adım 1 verilerini al
export const useStep1Data = () =>
  useWizardStore((state) => ({
    levhaTipi: state.levhaTipi,
    markaId: state.markaId,
    markaAdi: state.markaAdi,
    modelId: state.modelId,
    modelAdi: state.modelAdi,
    kalinlik: state.kalinlik,
    metraj: state.metraj,
  }));

// Adım 2 verilerini al
export const useStep2Data = () =>
  useWizardStore((state) => ({
    sehirKodu: state.sehirKodu,
    sehirAdi: state.sehirAdi,
    ilceId: state.ilceId,
    ilceAdi: state.ilceAdi,
  }));

// Validation kontrolü
export const useIsStep1Valid = () =>
  useWizardStore(
    (state) =>
      state.levhaTipi !== null &&
      state.markaId !== null &&
      state.kalinlik !== null &&
      state.metraj !== null &&
      state.metraj > 0
  );

export const useIsStep2Valid = () =>
  useWizardStore((state) => state.sehirKodu !== null);
