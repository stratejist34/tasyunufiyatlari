# Wizard Store Kullanım Kılavuzu

## 📦 Zustand Store Nedir?

Wizard için merkezi state yönetimi. Tüm form verilerini ve adım bilgilerini yönetir.

## 🎯 Kullanım

### Basic Kullanım

```typescript
import { useWizardStore } from '@/lib/store/wizardStore';

function MyComponent() {
  // Tüm store'u al
  const store = useWizardStore();

  return (
    <div>
      <p>Mevcut Adım: {store.step}</p>
      <p>Seçilen Levha: {store.levhaTipi}</p>
    </div>
  );
}
```

### Performanslı Kullanım (Selector)

```typescript
import { useWizardStep, useStep1Data } from '@/lib/store/wizardStore';

function MyComponent() {
  // Sadece step değişince re-render olur
  const step = useWizardStep();

  // Sadece step1 verileri değişince re-render olur
  const { levhaTipi, markaAdi, kalinlik } = useStep1Data();

  return <div>Step: {step}</div>;
}
```

### Actions Kullanımı

```typescript
import { useWizardStore } from '@/lib/store/wizardStore';

function ProductSelection() {
  const { setLevhaTipi, setMarka, setKalinlik } = useWizardStore();

  return (
    <div>
      <button onClick={() => setLevhaTipi('tasyunu')}>
        Taşyünü Seç
      </button>

      <button onClick={() => setMarka(1, 'Dalmaçyalı')}>
        Dalmaçyalı Seç
      </button>

      <button onClick={() => setKalinlik(5)}>
        5cm Seç
      </button>
    </div>
  );
}
```

### Navigation

```typescript
import { useWizardStore } from '@/lib/store/wizardStore';

function Navigation() {
  const { step, nextStep, previousStep, goToStep, reset } = useWizardStore();

  return (
    <div>
      <button onClick={previousStep}>Geri</button>
      <span>Adım {step}/3</span>
      <button onClick={nextStep}>İleri</button>

      {/* Direkt adıma git */}
      <button onClick={() => goToStep(2)}>Adım 2'ye Git</button>

      {/* Tümünü sıfırla */}
      <button onClick={reset}>Baştan Başla</button>
    </div>
  );
}
```

### Validation

```typescript
import { useIsStep1Valid, useIsStep2Valid } from '@/lib/store/wizardStore';

function WizardSteps() {
  const isStep1Valid = useIsStep1Valid();
  const isStep2Valid = useIsStep2Valid();

  return (
    <div>
      <button disabled={!isStep1Valid}>
        Adım 2'ye Geç
      </button>

      <button disabled={!isStep2Valid}>
        Fiyatları Göster
      </button>
    </div>
  );
}
```

## 💾 LocalStorage

Store otomatik olarak kullanıcı seçimlerini `localStorage`'a kaydeder.

- **Key:** `tasyunu-wizard`
- **Kaydedilenler:** Kullanıcı seçimleri (levha tipi, marka, metraj vs.)
- **Kaydedilmeyenler:** UI state'leri (showResults, secilenPaket)

Kullanıcı sayfayı yenilese bile seçimleri kaybolmaz!

## 🛠️ DevTools

Development modunda Redux DevTools ile state'i izleyebilirsiniz:

1. Chrome'a [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools) kurun
2. Uygulamayı açın
3. DevTools'da "WizardStore" sekmesini açın
4. Tüm action'ları ve state değişikliklerini görün

## 📝 State Yapısı

```typescript
{
  // Wizard Adımı
  step: 1 | 2 | 3,

  // Adım 1: Ürün Bilgileri
  levhaTipi: 'tasyunu' | 'eps' | null,
  markaId: number | null,
  markaAdi: string | null,
  modelId: number | null,
  modelAdi: string | null,
  kalinlik: number | null,
  metraj: number | null,

  // Adım 2: Teslimat
  sehirKodu: number | null,
  sehirAdi: string | null,
  ilceId: number | null,
  ilceAdi: string | null,

  // Adım 3: Sonuçlar
  secilenPaket: any | null,
  showResults: boolean
}
```

## 🎨 Best Practices

### ✅ DO (Yapılması Gerekenler)

```typescript
// Selector kullan (performans için)
const step = useWizardStep();

// Validation hook'ları kullan
const isValid = useIsStep1Valid();

// Action'ları destructure et
const { setLevhaTipi, setMarka } = useWizardStore();
```

### ❌ DON'T (Yapılmaması Gerekenler)

```typescript
// Her değişiklikte tüm store'u alma (gereksiz re-render)
const store = useWizardStore(); // Sadece gerekli değerleri al!

// State'i direkt değiştirme
store.step = 2; // ❌ Kullanma!
store.goToStep(2); // ✅ Action kullan!
```

## 🔄 Migration (Eski useState'lerden Geçiş)

### Önce (useState ile):

```typescript
const [levhaTipi, setLevhaTipi] = useState(null);
const [marka, setMarka] = useState(null);
const [kalinlik, setKalinlik] = useState(null);
// ... 15+ useState
```

### Sonra (Zustand ile):

```typescript
const { levhaTipi, setLevhaTipi, marka, setMarka, kalinlik, setKalinlik } = useWizardStore();
```

Çok daha temiz! 🎉
