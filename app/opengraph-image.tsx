import { ImageResponse } from 'next/og';

// Next.js OpenGraph image — statik PNG yerine her build'de dinamik üretilir.
// 1200×630 (Twitter / Facebook / LinkedIn standart).

export const runtime = 'edge';
export const alt = 'Taşyünü Fiyatları — Mantolama Maliyeti Hesaplama';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'linear-gradient(135deg, #0b0b0c 0%, #131315 50%, #1c1c21 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Üst — eyebrow + altın çizgi */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '60px',
              height: '2px',
              background: '#c69e54',
            }}
          />
          <div
            style={{
              fontSize: '22px',
              letterSpacing: '8px',
              color: '#c69e54',
              fontWeight: 500,
            }}
          >
            FABRİKA ÇIKIŞLI MANTOLAMA
          </div>
        </div>

        {/* Orta — büyük başlık */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '92px',
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              maxWidth: '900px',
            }}
          >
            Taşyünü Fiyatları,
          </div>
          <div
            style={{
              fontSize: '92px',
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              color: '#c69e54',
              maxWidth: '900px',
            }}
          >
            tek hesapta.
          </div>
        </div>

        {/* Alt — alt çizgi + meta strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '32px',
            fontSize: '22px',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <div style={{ fontWeight: 700 }}>tasyunufiyatlari.com</div>
          <div style={{ display: 'flex', gap: '36px' }}>
            <div>81 il sevkiyat</div>
            <div style={{ color: 'rgba(255,255,255,0.4)' }}>·</div>
            <div>8 kalem set</div>
            <div style={{ color: 'rgba(255,255,255,0.4)' }}>·</div>
            <div>PDF teklif</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
