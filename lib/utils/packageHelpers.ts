import type { CalculatedPackage } from '@/lib/types';

/**
 * FOMO: Teklif geçerlilik tarihi (3 gün sonra)
 */
export const getOfferValidityDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};

/**
 * Gamification: Doluluk oranına göre renk
 */
export const getTruckMeterColor = (fillPercentage: number): string => {
    if (fillPercentage >= 86) return 'bg-green-500'; // Mükemmel
    if (fillPercentage >= 41) return 'bg-yellow-500'; // Standart
    return 'bg-red-500'; // Verimsiz
};

/**
 * Smart Advice: Lojistik önerisi
 */
export const getSmartAdvice = (logistics: CalculatedPackage['logistics']): string | null => {
    if (!logistics || logistics.vehicleType === 'multiple') return null;

    const activeFill =
        logistics.vehicleType === 'lorry'
            ? logistics.lorryFillPercentage
            : logistics.truckFillPercentage;

    if (activeFill >= 86) {
        return '🎉 Mükemmel! Araç tam kapasitede kullanılıyor - En uygun nakliye maliyeti.';
    }

    if (logistics.packagesNeededForOptimal && logistics.packagesNeededForOptimal > 0) {
        const additionalM2 = (
            logistics.packagesNeededForOptimal * logistics.packageSizeM2
        ).toFixed(1);
        return `💡 Sadece ${logistics.packagesNeededForOptimal} paket daha (${additionalM2} m²) eklerseniz araç tam dolacak ve nakliye farkı sıfırlanacak!`;
    }

    return null;
};

/**
 * WhatsApp mesajı oluştur
 */
export const generateWhatsAppMessage = (
    pkg: CalculatedPackage,
    metraj: number,
    cityName: string
): string => {
    const refCode = `#TY${Date.now().toString().slice(-6)}`;

    return (
        `Merhaba! Sitenizden hesapladığım sipariş bilgileri:\n\n` +
        `📦 Paket: ${pkg.definition.name}\n` +
        `📏 Metraj: ${metraj} m²\n` +
        `📍 Şehir: ${cityName}\n` +
        `💰 Tutar: ${pkg.grandTotal.toLocaleString('tr-TR')} ₺\n\n` +
        `Ödeme planı ve termin öğrenebilir miyim?\n\n` +
        `Ref: ${refCode}`
    );
};

/**
 * WhatsApp URL oluştur
 */
export const generateWhatsAppURL = (phoneNumber: string, message: string): string => {
    const encodedMessage = encodeURIComponent(message);
    // return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    // Numara override edildi
    return `https://wa.me/905426084887?text=${encodedMessage}`;
};
