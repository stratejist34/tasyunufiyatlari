// Google Analytics 4 — Consent Mode v2.
// analytics_storage default GRANTED (analytics anonim, KVKK için kabul edilebilir).
// ad_* default DENIED — reklam çerezleri sadece banner kabul ile granted.
// Banner reddinde CookieConsent component analytics_storage'ı denied'a çekiyor.

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
          analytics_storage: 'granted',
          functionality_storage: 'granted',
          security_storage: 'granted'
        });
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
