import type { ProductRules, MinimumOrderSummary } from '@/lib/catalog/types';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface DecisionPanelProps {
  rules: ProductRules;
  minimumOrder: MinimumOrderSummary;
}

const salesModeLabels: Record<string, { label: string; canBuySingle: boolean }> = {
  single_only:      { label: 'Tek başına sipariş edilebilir',          canBuySingle: true  },
  single_or_quote:  { label: 'Tek sipariş veya teklif ile alınabilir', canBuySingle: true  },
  quote_only:       { label: 'Sadece teklif akışıyla alınabilir',       canBuySingle: false },
  system_only:      { label: 'Sistem / paket içinde kullanılır',        canBuySingle: false },
};

/**
 * Her ürün detay sayfasında ZORUNLU render edilen karar paneli.
 * Ürün kurallarını kullanıcı dostu Türkçe olarak açıklar.
 */
export default function DecisionPanel({ rules, minimumOrder }: DecisionPanelProps) {
  const modeInfo = salesModeLabels[rules.sales_mode] ?? salesModeLabels.quote_only;

  return (
    <div className="rounded-xl border border-fe-border bg-fe-raised/40 p-4">
      <h3 className="text-sm font-semibold text-fe-text uppercase tracking-wide mb-3">
        Bu Ürün Hakkında
      </h3>

      <div className="divide-y divide-fe-border/50">
        {/* Tek başına alınabilir mi? */}
        <Row
          icon={modeInfo.canBuySingle ? <Check /> : <Cross />}
          label="Tek başına alınabilir mi?"
          value={modeInfo.label}
          valueColor={modeInfo.canBuySingle ? 'text-green-400' : 'text-fe-muted'}
        />

        {/* Minimum sipariş */}
        <Row
          icon={minimumOrder.has_minimum ? <InfoIcon /> : <Check />}
          label="Minimum sipariş"
          value={minimumOrder.label ?? 'Minimum sipariş yok'}
          valueColor={minimumOrder.has_minimum ? 'text-brand-400' : 'text-fe-muted'}
        />

        {/* Şehir gerekli mi? */}
        <Row
          icon={rules.requires_city_for_pricing ? <InfoIcon /> : <Check />}
          label="Fiyat için şehir gerekli mi?"
          value={rules.requires_city_for_pricing ? 'Evet — şehre göre değişir' : 'Hayır'}
          valueColor={rules.requires_city_for_pricing ? 'text-brand-400' : 'text-fe-muted'}
        />

        {/* Sistem ürünü mü? */}
        {rules.requires_system_context && (
          <Row
            icon={<InfoIcon />}
            label="Sistem ürünü"
            value="Bu ürün genellikle sistem içinde kullanılır"
            valueColor="text-fe-muted"
          />
        )}
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div className="flex items-start gap-2.5 py-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-fe-muted">{label}</p>
        <p className={`text-sm font-medium ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}

function Check() {
  return <CheckCircle className="w-4 h-4 text-green-500" />;
}

function Cross() {
  return <XCircle className="w-4 h-4 text-fe-muted" />;
}

function InfoIcon() {
  return <Info className="w-4 h-4 text-brand-500" />;
}
