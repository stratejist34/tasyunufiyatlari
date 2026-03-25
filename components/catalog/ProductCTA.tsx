"use client";

import WizardLinkButton from './WizardLinkButton';
import type { DecisionContext, WizardPrefill } from '@/lib/catalog/types';

interface ProductCTAProps {
  decision: DecisionContext;
  prefill: WizardPrefill | null;
}

/**
 * Karar motoru çıktısına göre CTA bloku render eder.
 * Primary tam genişlik dominant, secondary daha az vurgulu.
 */
export default function ProductCTA({ decision, prefill }: ProductCTAProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Primary — dominant, tam genişlik */}
      <WizardLinkButton
        prefill={prefill}
        targetStep={decision.wizard_target_step}
        label={decision.cta_label_primary}
        variant="primary"
        className="w-full py-3.5"
      />

      {/* Secondary — outline, daha küçük */}
      {decision.cta_secondary && decision.cta_label_secondary && (
        <WizardLinkButton
          prefill={prefill}
          targetStep={1}
          label={decision.cta_label_secondary}
          variant="secondary"
          className="w-full py-2.5 text-sm"
        />
      )}

      {/* Notlar */}
      {(decision.info_note || decision.price_note) && (
        <div className="flex flex-col gap-1 pt-1">
          {decision.price_note && (
            <p className="text-xs text-fe-muted">{decision.price_note}</p>
          )}
          {decision.info_note && (
            <p className="text-xs text-fe-muted">{decision.info_note}</p>
          )}
        </div>
      )}
    </div>
  );
}
