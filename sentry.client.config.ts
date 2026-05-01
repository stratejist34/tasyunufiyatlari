// Tarayıcı tarafı Sentry konfigürasyonu.
// React render hataları, fetch hataları, runtime exception'ları yakalar.
// DSN env ile gelir; production-only çalışır (NODE_ENV check).

import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performans örneklemesi: %10 trafiği sample et (Hobby tier kotasını koru)
    tracesSampleRate: 0.1,

    // Sadece hata aldığımızda session replay başlat — quota dostu
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0,

    // PII (kişisel veri) gönderme — KVKK
    sendDefaultPii: false,

    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Bilinen gürültüyü filtrele
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
    ],
  });
}
