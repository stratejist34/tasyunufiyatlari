'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardText, X } from '@phosphor-icons/react';
import { quoteSchema, type QuoteFormData } from '@/lib/schemas/quote.schema';
import { ICON_WEIGHT } from '@/lib/design/tokens';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPackage: any;
    metraj: number;
    selectedMalzeme: string;
    selectedKalinlik: string;
    selectedCityName: string;
    onSubmit: (formData: QuoteFormData) => Promise<void>;
}

export function QuoteModal({
    isOpen,
    onClose,
    selectedPackage,
    metraj,
    selectedMalzeme,
    selectedKalinlik,
    selectedCityName,
    onSubmit
}: QuoteModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<QuoteFormData>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            customerCompany: '',
            customerAddress: ''
        }
    });

    // Body scroll lock
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [isOpen]);

    // ESC ile kapat
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isSubmitting) onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, isSubmitting, onClose]);

    const onSubmitForm = async (data: QuoteFormData) => {
        try {
            await onSubmit(data);
            reset();
            onClose();
        } catch (error) {
            console.error('Teklif gönderme hatası:', error);
        }
    };

    if (!isOpen || !selectedPackage) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Teklif Talebi"
        >
            <div
                className="bg-white w-full sm:max-w-2xl shadow-2xl flex flex-col rounded-t-2xl sm:rounded-2xl max-h-[100dvh] sm:max-h-[90dvh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER — sticky top */}
                <div className="shrink-0 bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 py-5 rounded-t-2xl">
                    <div className="flex justify-between items-start gap-3">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-1">Teklif Talebi</h3>
                            <p className="text-brand-100 text-sm">
                                {selectedPackage.definition.name} • {metraj} m²
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white hover:bg-white/20 transition-colors shrink-0"
                            aria-label="Kapat"
                        >
                            <X weight={ICON_WEIGHT} size={20} />
                        </button>
                    </div>
                </div>

                {/* SCROLL BODY */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Sipariş Özeti */}
                    <div className="bg-brand-50 rounded-xl p-4 mb-6 border border-brand-200">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <ClipboardText weight={ICON_WEIGHT} size={18} /> Sipariş Özeti
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">Paket:</span>
                                <div className="font-medium text-gray-800">{selectedPackage.definition.name}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Malzeme:</span>
                                <div className="font-medium text-gray-800">
                                    {selectedMalzeme === "tasyunu" ? "Taşyünü" : "EPS"} {selectedKalinlik}cm
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-600">Metraj:</span>
                                <div className="font-medium text-gray-800">{metraj} m²</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Toplam Fiyat:</span>
                                <div className="font-bold text-brand-600">
                                    {selectedPackage.grandTotal.toLocaleString("tr-TR")} ₺
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-600">Şehir:</span>
                                <div className="font-medium text-gray-800">{selectedCityName}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Paket Sayısı:</span>
                                <div className="font-medium text-gray-800">
                                    {selectedPackage.logistics?.packageCount || 0} paket
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* İletişim Formu */}
                    <form
                        id="quote-form"
                        onSubmit={handleSubmit(onSubmitForm)}
                        className="space-y-4"
                    >
                        <h4 className="font-semibold text-gray-800 mb-2">İletişim Bilgileriniz</h4>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ad Soyad <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('customerName')}
                                type="text"
                                placeholder="Örn: Ahmet Yılmaz"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none ${
                                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.customerName && (
                                <p className="text-red-600 text-sm mt-1">{errors.customerName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                E-posta <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('customerEmail')}
                                type="email"
                                placeholder="Örn: ahmet@example.com"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none ${
                                    errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.customerEmail && (
                                <p className="text-red-600 text-sm mt-1">{errors.customerEmail.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Telefon <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('customerPhone')}
                                type="tel"
                                placeholder="Örn: 05321234567"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none ${
                                    errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.customerPhone && (
                                <p className="text-red-600 text-sm mt-1">{errors.customerPhone.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Firma Adı <span className="text-gray-400 text-xs">(Opsiyonel)</span>
                            </label>
                            <input
                                {...register('customerCompany')}
                                type="text"
                                placeholder="Örn: ABC İnşaat Ltd. Şti."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teslimat Adresi <span className="text-gray-400 text-xs">(Opsiyonel)</span>
                            </label>
                            <textarea
                                {...register('customerAddress')}
                                placeholder="Tam adresinizi giriniz..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                            />
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">Bilgi:</span> Teklifiniz gönderildikten sonra en kısa sürede size dönüş yapılacaktır.
                                Fiyat ve teslimat detayları için sizinle iletişime geçilecektir.
                            </p>
                        </div>
                    </form>
                </div>

                {/* FOOTER — sticky bottom */}
                <div className="shrink-0 px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all min-h-[48px]"
                        disabled={isSubmitting}
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        form="quote-form"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold hover:from-brand-600 hover:to-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                    >
                        {isSubmitting ? "Gönderiliyor..." : "Teklif Gönder"}
                    </button>
                </div>
            </div>
        </div>
    );
}
