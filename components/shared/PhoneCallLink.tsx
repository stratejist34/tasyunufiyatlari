'use client';

// Telefon (tel:) linki + GA4 "Telefon_Aramalari" event.
// Server component'ler bu wrapper ile tıklama event'ini yakalar.

import type { ReactNode, AnchorHTMLAttributes } from 'react';
import { notifyPhoneCall } from '@/lib/notifyPhoneCall';
import type { PhoneSource } from '@/lib/analytics/whatsappSource';

interface PhoneCallLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  href: string;
  source: PhoneSource;
  productName?: string;
  children: ReactNode;
}

export default function PhoneCallLink({
  href,
  source,
  productName,
  children,
  ...rest
}: PhoneCallLinkProps) {
  return (
    <a
      {...rest}
      href={href}
      onClick={() => notifyPhoneCall({ source, productName })}
    >
      {children}
    </a>
  );
}
