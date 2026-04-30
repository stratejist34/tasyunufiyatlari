'use client';

// WhatsApp linki + source-aware niyet bildirimi.
// Server component'ler bu wrapper'ı import eder; tıklamada arka planda
// /api/whatsapp-intent + GA4 event tetiklenir.

import type { ReactNode, AnchorHTMLAttributes } from 'react';
import { notifyWhatsappIntent } from '@/lib/notifyWhatsappIntent';
import type { WhatsappSource } from '@/lib/analytics/whatsappSource';

interface WhatsappLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel' | 'onClick'> {
  href: string;
  source: WhatsappSource;
  productName?: string;
  children: ReactNode;
}

export default function WhatsappLink({
  href,
  source,
  productName,
  children,
  ...rest
}: WhatsappLinkProps) {
  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => notifyWhatsappIntent({ source, productName })}
    >
      {children}
    </a>
  );
}
