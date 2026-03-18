'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pdfOfferSchema, type PdfOfferFormData } from '@/lib/schemas/pdfOffer.schema';

interface PdfOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PdfOfferFormData) => Promise<void>;
  isSubmitting?: boolean;
  defaultCompanyName?: string;
  defaultCity?: string;
}

export function PdfOfferModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  defaultCompanyName,
  defaultCity,
}: PdfOfferModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PdfOfferFormData>({
    resolver: zodResolver(pdfOfferSchema),
    defaultValues: {
      customerCompany: defaultCompanyName || '',
      relatedPerson: '',
      deliveryAddress: '',
      phone: '',
      email: '',
      city: defaultCity || '',
      district: '',
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    // modal her açıldığında zorunlu alanları temizle, opsiyonelleri koru
    // Şehir bilgisi varsa varsayılan olarak ata
    reset((prev) => ({
      ...prev,
      relatedPerson: '',
      deliveryAddress: '',
      phone: '',
      city: defaultCity || prev.city || '',
      district: '',
    }));
  }, [isOpen, reset, defaultCity]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
          disabled={isSubmitting}
          aria-label="Kapat"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-white mb-1">Resmi Teklif Bilgileri</h3>
        <p className="text-sm text-slate-400 mb-6">
          Zorunlu alanları doldurun, teklif PDF’i bu bilgilerle oluşturulacaktır.
        </p>

        <form
          onSubmit={handleSubmit(async (data) => {
            await onSubmit(data);
          })}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Firma Adı <span className="text-slate-500 text-xs">(opsiyonel)</span>
            </label>
            <input
              type="text"
              {...register('customerCompany')}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Örn: Gültekin Yapı İnşaat"
              disabled={isSubmitting}
            />
            {errors.customerCompany && (
              <p className="text-red-400 text-xs mt-1">{errors.customerCompany.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              İlgili Kişi <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('relatedPerson')}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Örn: Erkan Gültekin"
              disabled={isSubmitting}
            />
            {errors.relatedPerson && (
              <p className="text-red-400 text-xs mt-1">{errors.relatedPerson.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                İlçe <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register('district')}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Örn: Pendik"
                disabled={isSubmitting}
              />
              {errors.district && (
                <p className="text-red-400 text-xs mt-1">{errors.district.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                İl <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register('city')}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Örn: İstanbul"
                disabled={isSubmitting}
              />
              {errors.city && (
                <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Açık Adres <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={2}
              {...register('deliveryAddress')}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              placeholder="Mahalle, Cadde, Sokak, No..."
              disabled={isSubmitting}
            />
            {errors.deliveryAddress && (
              <p className="text-red-400 text-xs mt-1">{errors.deliveryAddress.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Telefon <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="05321234567"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Mail <span className="text-slate-500 text-xs">(opsiyonel)</span>
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="mail@firma.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-bold text-base text-white bg-orange-600 hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'PDF Hazırlanıyor...' : 'Teklifi Oluştur ve İndir'}
          </button>

          <p className="text-center text-xs text-slate-500">
            Bu bilgiler yalnızca oluşturulan PDF teklif formunda gösterilir.
          </p>
        </form>
      </div>
    </div>
  );
}



