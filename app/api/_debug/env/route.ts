import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Geçici teşhis endpoint — env değişkenlerinin runtime'da okunup okunmadığını
 * kanıtlar. Gerçek değer maskelenir; sadece set/yok ve uzunluk dönülür.
 *
 * Kullanım: GET /api/_debug/env
 * Hata ayıklama bittikten sonra DOSYAYI SİL.
 */
export async function GET() {
  const mask = (v: string | undefined) =>
    !v
      ? { set: false, length: 0 }
      : {
          set: true,
          length: v.length,
          // İlk 2 + son 2 karakter, ortası nokta. Anahtarı tam göstermez.
          preview: v.length <= 4 ? '••••' : `${v.slice(0, 2)}${'•'.repeat(Math.max(0, v.length - 4))}${v.slice(-2)}`,
          // Köşeli parantez kontrolü — placeholder olarak girilmiş mi?
          startsWithBracket: v.startsWith('<'),
          endsWithBracket: v.endsWith('>'),
          // Boşluk veya satır sonu var mı?
          hasWhitespace: /\s/.test(v),
        };

  return NextResponse.json({
    runtime: 'nodejs',
    timestamp: new Date().toISOString(),
    env: {
      CALLMEBOT_PHONE_1:  mask(process.env.CALLMEBOT_PHONE_1),
      CALLMEBOT_APIKEY_1: mask(process.env.CALLMEBOT_APIKEY_1),
      CALLMEBOT_PHONE_2:  mask(process.env.CALLMEBOT_PHONE_2),
      CALLMEBOT_APIKEY_2: mask(process.env.CALLMEBOT_APIKEY_2),
    },
    // Vercel runtime'da otomatik atanan env'lerden örnek (her zaman var)
    vercelChecks: {
      VERCEL_ENV: process.env.VERCEL_ENV ?? null,
      VERCEL_REGION: process.env.VERCEL_REGION ?? null,
    },
  });
}
