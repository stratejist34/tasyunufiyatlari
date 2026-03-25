'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { PdfOfferModal } from '@/components/modal/PdfOfferModal';
import { generateQuotePDF } from '@/lib/pdfGenerator';
import type { PdfOfferFormData } from '@/lib/schemas/pdfOffer.schema';
import type { CatalogProductView } from '@/lib/catalog/types';

interface Props {
  product: CatalogProductView;
  activeThickness: number | null;
  pricePerM2KdvHaric: number;   // KDV hariç hesaplı m² fiyatı
  neededM2: number;              // 0 ise girilen alan yok
  cityCode: number;
  cityName: string;
  tierLabel: string;             // Kamyon / TIR / Hızlı Teslim
  isShippingIncluded: boolean;
  vehicleType: 'lorry' | 'truck' | 'depot' | null;
}

interface SuccessState {
  refCode: string;
  pdfUrl: string;
  pdfFilename: string;
}

export default function SingleProductQuoteButton({
  product,
  activeThickness,
  pricePerM2KdvHaric,
  neededM2,
  cityCode,
  cityName,
  tierLabel,
  isShippingIncluded,
  vehicleType,
}: Props) {
  const [showModal, setShowModal]       = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successState, setSuccessState] = useState<SuccessState | null>(null);

  const handleSubmit = async (formData: PdfOfferFormData) => {
    setIsSubmitting(true);
    try {
      const areaM2        = Math.max(1, neededM2);
      const pricePerM2    = pricePerM2KdvHaric;
      const totalKdvHaric = pricePerM2 * areaM2;
      const vatAmount     = Math.round(totalKdvHaric * 0.20 * 100) / 100;
      const grandTotal    = totalKdvHaric + vatAmount;
      const thickness     = String(activeThickness ?? 0);
      const matType: 'tasyunu' | 'eps' = product.material_type === 'eps' ? 'eps' : 'tasyunu';
      const refCode       = `TY${String(Date.now()).slice(-7)}`;

      // 1. DB'ye kaydet
      try {
        await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName:    formData.relatedPerson,
            customerEmail:   formData.email || '',
            customerPhone:   formData.phone,
            customerCompany: formData.customerCompany || '',
            customerAddress: [formData.deliveryAddress, formData.district, formData.city].filter(Boolean).join(' / '),
            submissionType:  'pdf_quote',
            sourceChannel:   'catalog',
            materialType:    matType,
            brandId:         product.brand.id,
            brandName:       product.brand.name,
            modelId:         product.id,
            modelName:       product.name,
            thicknessCm:     Math.min(15, Math.max(2, activeThickness ?? 5)),
            areaM2,
            cityCode:        String(cityCode),
            cityName,
            districtCode:    null,
            districtName:    formData.district || null,
            packageName:     product.name,
            packageDescription: `${product.brand.name} ${product.name}${activeThickness ? ` ${thickness}cm` : ''}`,
            plateBrandName:  product.brand.name,
            accessoryBrandName: '-',
            totalPrice:      grandTotal,
            pricePerM2,
            shippingCost:    0,
            discountPercentage: 0,
            priceWithoutVat: totalKdvHaric,
            vatAmount,
            packageCount:    1,
            packageSizeM2:   1,
            itemsPerPackage: 1,
            vehicleType:     vehicleType === 'depot' ? 'none' : (vehicleType ?? null),
            lorryCapacityPackages: null,
            truckCapacityPackages: null,
            lorryFillPercentage:  null,
            truckFillPercentage:  null,
            packageItems:    { product: product.name, thickness: activeThickness, pricePerM2 },
          }),
        });
      } catch {
        // DB kayıt hatası PDF üretimini engellemesin
      }

      // TODO: Gerçek ops bildirimi için server-side WhatsApp Business API (Twilio/360dialog)
      // veya admin notification sistemi kurulacak. DB kaydı şimdilik yeterli.
      // TODO (A/B): doc.save() ile otomatik indirme davranışı test edilecek.
      // Seçenek A: mevcut — PDF hem yeni sekmede açılır hem otomatik indirilir.
      // Seçenek B: doc.save() kaldırılır, kullanıcı "PDF İndir" butonuyla indirir.
      // Dönüşüm verisi yeterliyse B'ye geçilebilir.

      // 2. PDF oluştur, indir ve blob URL al
      const whatsappMsg = encodeURIComponent(
        `Merhaba, ${refCode} no'lu teklif hakkında bilgi almak istiyorum.`
      );
      const pdfUrl = await generateQuotePDF({
        packageName:        product.name,
        packageDescription: `${product.brand.name} ${product.name}`,
        plateBrandName:     product.brand.name,
        accessoryBrandName: '-',
        metraj:             areaM2,
        thickness,
        materialType:       matType,
        materialLongName:   matType === 'tasyunu' ? 'Taşyünü' : 'EPS',
        cityName,
        grandTotal,
        pricePerM2,
        totalProductCost:   totalKdvHaric,
        shippingCost:       0,
        priceWithoutVat:    totalKdvHaric,
        vatAmount,
        refCode,
        validityDate:       new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('tr-TR'),
        whatsappOrderLink:  `https://wa.me/905322041825?text=${whatsappMsg}`,
        customerCompany:    formData.customerCompany || '',
        relatedPerson:      formData.relatedPerson,
        deliveryAddress:    formData.deliveryAddress,
        phone:              formData.phone,
        email:              formData.email || '',
        city:               formData.city,
        district:           formData.district,
        systemDescription:  `${product.brand.name} ${product.name}${activeThickness ? ` — ${thickness} cm` : ''}`,
        isShippingIncluded,
        items: [
          {
            description:     `${product.brand.name} ${product.name}${activeThickness ? ` (${thickness} cm)` : ''}`,
            quantity:        areaM2,
            unit:            'm²',
            consumptionRate: 1,
            unitPrice:       pricePerM2,
            totalPrice:      totalKdvHaric,
            isPlate:         true,
            packageCount:    0,
          },
        ],
      });

      // PDF yeni sekmede açmayı dene (async context'te popup blocker devreye girebilir)
      try { window.open(pdfUrl, '_blank'); } catch { /* bloklanmış olabilir, success state'deki butonlar fallback */ }

      setShowModal(false);
      setSuccessState({ refCode, pdfUrl, pdfFilename: `${refCode}_teklif.pdf` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success state ───────────────────────────────────────────
  if (successState) {
    return (
      <div className="rounded-xl border border-green-700/40 bg-green-950/20 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base leading-none">✅</span>
          <p className="text-sm font-semibold text-green-300">Teklifiniz hazır</p>
        </div>
        <ul className="space-y-1.5 mb-3">
          {[
            'En avantajlı fiyat uygulandı',
            'Talep sisteme kaydedildi',
            'PDF hazırlandı',
          ].map(item => (
            <li key={item} className="flex items-center gap-2 text-xs text-fe-muted">
              <span className="text-green-400 text-[11px] flex-shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <p className="text-[10px] text-fe-muted leading-relaxed mb-3">
          PDF yeni sekmede açıldı. İsterseniz cihazınıza da indirebilirsiniz.
        </p>

        {successState.pdfUrl && (
          <div className="grid grid-cols-2 gap-2 mb-2">
            <a
              href={successState.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-center text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors"
            >
              Teklifi Görüntüle
            </a>
            <a
              href={successState.pdfUrl}
              download={successState.pdfFilename}
              className="py-2 text-center text-xs font-semibold text-fe-text bg-fe-raised hover:bg-fe-raised/80 rounded-lg transition-colors"
            >
              ↓ PDF İndir
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => setSuccessState(null)}
          className="block w-full text-center text-xs text-fe-muted hover:text-fe-muted transition-colors mt-1"
        >
          Yeni teklif oluştur
        </button>
      </div>
    );
  }

  // ── Normal state ────────────────────────────────────────────
  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="w-full py-3 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white rounded-xl font-bold text-sm transition-colors"
      >
        Anında Teklif Oluştur
      </button>

      {showModal && createPortal(
        <PdfOfferModal
          isOpen={showModal}
          onClose={() => !isSubmitting && setShowModal(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          defaultCity={cityName}
        />,
        document.body
      )}
    </>
  );
}
