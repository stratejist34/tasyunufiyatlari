import Link from 'next/link';
import { Layers, Box, Package } from 'lucide-react';
import type { Metadata } from 'next';
import SiteHeader from '@/components/shared/SiteHeader';
import SiteFooter from '@/components/shared/SiteFooter';

export const metadata: Metadata = {
  title: 'Ürün Kataloğu — TaşYünü Fiyatları',
  description:
    'Taşyünü levha, EPS levha ve ısı yalıtım sistemi ürünleri. Fiyat hesapla veya teklif al.',
};

const CATEGORIES = [
  {
    slug: 'tasyunu-levha',
    materialParam: 'tasyunu',
    title: 'Taşyünü Levha',
    description:
      'Rockwool, Isover, Knauf ve diğer markaların taşyünü (mineral yün) ısı yalıtım levhaları.',
    icon: Layers,
    accentColor: 'border-brand-500/40 hover:border-brand-500',
    iconBg: 'bg-brand-600/20',
    iconColor: 'text-brand-400',
  },
  {
    slug: 'eps-levha',
    materialParam: 'eps',
    title: 'EPS Levha',
    description:
      'Genleştirilmiş polistiren (EPS) ısı yalıtım levhaları. Farklı yoğunluk ve kalınlık seçenekleri.',
    icon: Box,
    accentColor: 'border-blue-500/40 hover:border-blue-500',
    iconBg: 'bg-blue-600/20',
    iconColor: 'text-blue-400',
  },
  {
    slug: 'aksesuar',
    materialParam: 'aksesuar',
    title: 'Aksesuar & Tamamlayıcı Ürünler',
    description:
      'Yapıştırıcı, sıva, dübel, file ve mantolama sistemleri için tamamlayıcı ürünler.',
    icon: Package,
    accentColor: 'border-fe-border hover:border-fe-muted/60',
    iconBg: 'bg-fe-raised/30',
    iconColor: 'text-fe-muted',
  },
];

export default function UrunlerPage() {
  return (
    <div className="min-h-screen bg-fe-bg flex flex-col">
      <SiteHeader />

      {/* Page header */}
      <div className="bg-fe-surface border-b border-fe-border">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
          <p className="text-xs text-brand-500 font-semibold uppercase tracking-widest mb-2">
            Ürün Kataloğu
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Isı Yalıtım Ürünleri
          </h1>
          <p className="text-fe-muted max-w-xl">
            Kategori seçin, ürünleri inceleyin ve doğru akışa yönlenin —
            teklif, sipariş veya sistem hesabı.
          </p>
        </div>
      </div>

      {/* Kategori kartları */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/urunler/${cat.slug}`}
                className={`rounded-xl border bg-fe-raised/30 hover:bg-fe-raised/60 p-6 transition-all duration-150 group ${cat.accentColor}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${cat.iconBg}`}>
                  <Icon className={`w-5 h-5 ${cat.iconColor}`} />
                </div>
                <h2 className="text-white font-semibold text-base mb-2 group-hover:text-brand-400 transition-colors">
                  {cat.title}
                </h2>
                <p className="text-fe-muted text-sm leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Hızlı hesap makinesi CTA */}
        <div className="mt-10 rounded-xl border border-fe-border bg-fe-raised/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold mb-1">
              Ürün seçmeden hızlı hesaplama yapmak ister misiniz?
            </h3>
            <p className="text-fe-muted text-sm">
              Hesap makinesiyle malzeme, kalınlık ve şehir seçip anında paket fiyatı alın.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Hesap Makinesi
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
