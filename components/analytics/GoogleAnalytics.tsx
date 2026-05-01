// Google Analytics 4 — Consent Mode v2 ile başlangıçta DENY (KVKK-strict).
// CookieConsent.tsx → "Tümünü Kabul Et" tıklanınca analytics + ad çerezleri
// granted'a çıkar VE explicit bir page_view eventi gönderilir (gtag('config')
// ilk yüklemede deny olduğu için pageview'ı atlamış olur).

import Script from 'next/script';

interface Props {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: Props) {
  if (!measurementId) return null;

  return (
    <>
      {/* 1) Consent Mode v2 — TAG yüklenmeden ÖNCE default'lar tanımlanmalı */}
      <Script id="ga-consent-default" strategy="beforeInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'granted',
          security_storage: 'granted',
          wait_for_update: 500
        });
        gtag('set', 'ads_data_redaction', true);
      `}</Script>

      {/* 2) GA4 gtag.js — analytics_storage 'denied' olsa bile yüklenir, anonim sinyal gönderir */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">{`
        gtag('js', new Date());
        gtag('config', '${measurementId}', {
          anonymize_ip: true,
          allow_google_signals: false,
          allow_ad_personalization_signals: false
        });
      `}</Script>
    </>
  );
}
