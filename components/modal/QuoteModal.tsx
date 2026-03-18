'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteSchema, type QuoteFormData } from '@/lib/schemas/quote.schema';

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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Teklif Talebi</h3>
                            <p className="text-orange-100 text-sm">
                                {selectedPackage.definition.name} • {metraj} m²
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {/* Sipariş Özeti */}
                    <div className="bg-orange-50 rounded-xl p-4 mb-6 border border-orange-200">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span>📋</span> Sipariş Özeti
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
                                <div className="font-bold text-orange-600">
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
                    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                        <h4 className="font-semibold text-gray-800 mb-4">İletişim Bilgileriniz</h4>

                        {/* Ad Soyad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ad Soyad <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('customerName')}
                                type="text"
                                placeholder="Örn: Ahmet Yılmaz"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.customerName && (
                                <p className="text-red-600 text-sm mt-1">{errors.customerName.message}</p>
                            )}
                        </div>

                        {/* E-posta */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                E-posta <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('customerEmail')}
                                type="email"
                                placeholder="Örn: ahmet@example.com"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                                    errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.customerEmail && (
                                <p className="text-red-600 text-sm mt-1">{errors.customerEmail.message}</p>
                            )}
                        </div>

                        {/* Telefon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Telefon <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('customerPhone')}
                                type="tel"
                                placeholder="Örn: 05321234567"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                                    errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.customerPhone && (
                                <p className="text-red-600 text-sm mt-1">{errors.customerPhone.message}</p>
                            )}
                        </div>

                        {/* Firma (Opsiyonel) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Firma Adı <span className="text-gray-400 text-xs">(Opsiyonel)</span>
                            </label>
                            <input
                                {...register('customerCompany')}
                                type="text"
                                placeholder="Örn: ABC İnşaat Ltd. Şti."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Adres (Opsiyonel) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teslimat Adresi <span className="text-gray-400 text-xs">(Opsiyonel)</span>
                            </label>
                            <textarea
                                {...register('customerAddress')}
                                placeholder="Tam adresinizi giriniz..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                            />
                        </div>

                        {/* Bilgilendirme */}
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">ℹ️ Bilgi:</span> Teklifiniz gönderildikten sonra en kısa sürede size dönüş yapılacaktır. Fiyat ve teslimat detayları için sizinle iletişime geçilecektir.
                            </p>
                        </div>

                        {/* Modal Footer - Butonlar */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                                disabled={isSubmitting}
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Gönderiliyor..." : "Teklif Gönder"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
