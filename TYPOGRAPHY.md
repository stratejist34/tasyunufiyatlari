# Typography System - Kullanım Kılavuzu

## 🎨 Font Ailesi Yapısı

### 1. **Geist Sans** (Varsayılan Body Font)
- **Kullanım**: Tüm body metinleri, açıklamalar, paragraflar
- **Tailwind Class**: `font-sans` (varsayılan)
- **Özellik**: Modern, temiz, okunabilir

### 2. **Barlow** (Heading & Numbers Font)
- **Kullanım**: Başlıklar (h1-h6), fiyatlar, sayısal veriler
- **Tailwind Class**: `font-heading`
- **Ağırlıklar**: 400 (Regular), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)
- **Özellik**: Endüstriyel, güçlü, dikkat çekici

### 3. **Geist Mono** (Monospace)
- **Kullanım**: Kod blokları, teknik veriler
- **Tailwind Class**: `font-mono`

---

## 📝 Kullanım Örnekleri

### **Başlıklar (Barlow)**
```tsx
// H1 - Ana Sayfa Başlığı
<h1 className="font-heading text-4xl font-bold text-white tracking-tight">
  TaşYünü Fiyatları
</h1>

// H2 - Section Başlığı
<h2 className="font-heading text-2xl font-bold text-white tracking-tight">
  Paket Seçenekleri
</h2>

// H3 - Card Başlığı
<h3 className="font-heading text-xl font-semibold text-white">
  Premium Paket
</h3>
```

### **Fiyatlar ve Sayılar (Barlow + tabular-nums)**
```tsx
// Büyük Fiyat Gösterimi
<div className="font-heading text-3xl font-bold text-white tabular-nums">
  {pkg.grandTotal.toLocaleString('tr-TR')} ₺
</div>

// Küçük Fiyat / m² Fiyatı
<div className="font-heading text-sm text-slate-400 tabular-nums">
  {pkg.pricePerM2.toFixed(2)} ₺/m²
</div>

// Metraj Input
<input
  className="font-heading text-lg tabular-nums"
  type="number"
  value={metraj}
/>
```

### **Body Metinleri (Geist Sans - Varsayılan)**
```tsx
// Açıklama Metni
<p className="text-sm text-slate-400">
  Malzeme tipini, markayı, kalınlığı ve metrajı seçin.
</p>

// Label
<label className="text-sm font-medium text-white">
  Malzeme Tipi
</label>

// Button Text (font-sans zaten varsayılan)
<button className="text-base font-bold">
  İleri →
</button>
```

### **Monospace (Kod/Teknik)**
```tsx
// Referans Kodu
<span className="font-mono text-xs text-slate-500">
  REF: #TY123456
</span>
```

---

## 🎯 Best Practices

### 1. **Başlıklar için MUTLAKA Barlow kullan**
```tsx
// ✅ DOĞRU
<h2 className="font-heading text-2xl font-bold">
  Ürün Bilgileri
</h2>

// ❌ YANLIŞ (Geist Sans kullanılmış)
<h2 className="text-2xl font-bold">
  Ürün Bilgileri
</h2>
```

### 2. **Fiyatlar için `tabular-nums` ekle**
```tsx
// ✅ DOĞRU (Sayılar hizalı görünür)
<div className="font-heading text-3xl font-bold tabular-nums">
  12.500 ₺
</div>

// ❌ YANLIŞ (Sayılar hizasız)
<div className="font-heading text-3xl font-bold">
  12.500 ₺
</div>
```

### 3. **tracking-tight başlıklarda kullan**
```tsx
// Barlow ile daha sıkı harf aralığı profesyonel görünüm verir
<h1 className="font-heading text-4xl font-bold tracking-tight">
```

### 4. **Font ağırlıklarını doğru kullan**
- `font-normal` (400): Body metinleri
- `font-semibold` (600): Vurgulanmış metinler, sub-headings
- `font-bold` (700): Başlıklar, CTA butonları
- `font-extrabold` (800): Hero başlıkları, büyük sayılar

---

## 🔄 Mevcut Kodu Güncelleme

### Wizard Başlıklarını Güncelle:
**Önceki:**
```tsx
<h2 className="text-white text-xl font-bold mb-4">
  Ürün Bilgileri
</h2>
```

**Yeni:**
```tsx
<h2 className="font-heading text-white text-xl font-bold mb-4 tracking-tight">
  Ürün Bilgileri
</h2>
```

### PackageCard Fiyatlarını Güncelle:
**Önceki:**
```tsx
<div className="text-3xl font-bold text-white">
  {pkg.grandTotal.toLocaleString('tr-TR')} ₺
</div>
```

**Yeni:**
```tsx
<div className="font-heading text-3xl font-bold text-white tabular-nums">
  {pkg.grandTotal.toLocaleString('tr-TR')} ₺
</div>
```

---

## 📦 Kurulum Detayları

### `app/layout.tsx`
```typescript
import { Barlow } from "next/font/google";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"], // Türkçe karakterler için
  weight: ["400", "600", "700", "800"],
});

// Body'de CSS değişkeni tanımla
<body className={`${geistSans.variable} ${barlow.variable} antialiased`}>
```

### `app/globals.css`
```css
@theme inline {
  --font-heading: var(--font-barlow);
}
```

### Tailwind'de Kullanım
```tsx
className="font-heading"  // Barlow fontunu kullan
className="font-sans"     // Geist Sans (varsayılan)
className="font-mono"     // Geist Mono
```

---

## ✅ Checklist: Tüm Proje için

- [ ] Tüm `<h1>`, `<h2>`, `<h3>` etiketlerine `font-heading` ekle
- [ ] Tüm fiyat gösterimlerine `font-heading tabular-nums` ekle
- [ ] Wizard step başlıklarına `font-heading tracking-tight` ekle
- [ ] PackageCard başlıklarına `font-heading` ekle
- [ ] Modal başlıklarına `font-heading` ekle
- [ ] Büyük sayılara (metraj, paket sayısı) `font-heading tabular-nums` ekle

---

## 🎨 Görsel Hiyerarşi

```
Hero Başlık        → font-heading text-5xl font-extrabold tracking-tight
Section Başlık     → font-heading text-2xl font-bold tracking-tight
Card Başlık        → font-heading text-xl font-semibold
Alt Başlık         → font-heading text-lg font-semibold
Fiyat (Büyük)      → font-heading text-3xl font-bold tabular-nums
Fiyat (Küçük)      → font-heading text-sm tabular-nums
Body Text          → font-sans text-base (varsayılan)
Açıklama           → font-sans text-sm text-slate-400
```

---

Bu typography sistemi "Industrial Dark" temasını tamamlar ve sayısal verilerin profesyonel görünmesini sağlar! 🚀
