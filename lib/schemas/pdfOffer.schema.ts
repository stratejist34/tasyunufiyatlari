import { z } from 'zod';

// ==========================================
// PDF OFFER FORM SCHEMA (Resmi Teklif İndir)
// ==========================================

export const pdfOfferSchema = z.object({
  // Müşteri Bilgileri (PDF üzerinde gösterilecek)
  customerCompany: z.string().max(255, 'En fazla 255 karakter').optional().or(z.literal('')),

  relatedPerson: z
    .string()
    .min(2, 'En az 2 karakter girin')
    .max(100, 'En fazla 100 karakter')
    // Türkçe karakter + boşluk + nokta + tire
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ.\-\s]+$/, 'Sadece harf girişi yapın'),

  city: z
    .string()
    .min(2, 'En az 2 karakter girin')
    .max(50, 'En fazla 50 karakter')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ.\-\s]+$/, 'Geçerli bir il adı girin'),

  district: z
    .string()
    .min(2, 'En az 2 karakter girin')
    .max(50, 'En fazla 50 karakter')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ.\-\s]+$/, 'Geçerli bir ilçe adı girin'),

  deliveryAddress: z
    .string()
    .min(5, 'Adres çok kısa')
    .max(500, 'En fazla 500 karakter'),

  phone: z
    .string()
    .regex(/^05\d{9}$/, '05XX formatında 11 haneli telefon girin (örn: 05321234567)')
    .length(11, 'Telefon numarası 11 haneli olmalı'),

  email: z
    .string()
    .email('Geçerli bir e-posta adresi girin')
    .toLowerCase()
    .trim()
    .optional()
    .or(z.literal('')),
});

export type PdfOfferFormData = z.infer<typeof pdfOfferSchema>;



