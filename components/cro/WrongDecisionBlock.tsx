const MISTAKES = [
  {
    n: '01',
    title: 'Kalınlığı en ucuza göre seçmek',
    body: '4–5 cm "ucuz" sistem, 8–10 yılda yüksek faturayla geri ödenir. Karar metresi ısınma gideri olmalı.',
  },
  {
    n: '02',
    title: 'Sadece levha fiyatına bakmak',
    body: 'Sıva, dübel, file, profil, köşebent — sistem 8 kalemden oluşur. Tek kalem fiyatı yanıltıcıdır.',
  },
  {
    n: '03',
    title: 'Nakliyeyi sonradan eklemek',
    body: 'Levha bazlı tekliflerde nakliye genellikle "ekstra" gelir. Hesabınızı nakliye dahil yapmazsanız sahadaki gerçek tutarla doğru karar veremezsiniz.',
  },
  {
    n: '04',
    title: 'Belge ve uygunluk talep etmemek',
    body: 'TSE/CE olmayan malzeme, EKB onayında ve uzun vadeli garanti bahsinde sorun yaratır.',
  },
] as const;

export function WrongDecisionBlock() {
  return (
    <section
      aria-labelledby="hata-baslik"
      className="bg-fe-bg py-16 sm:py-24"
    >
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="max-w-[640px]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fe-accent">
            Sahada Sık Görülen
          </p>
          <h2
            id="hata-baslik"
            className="mt-3 font-heading font-extrabold text-[28px] sm:text-[36px] leading-[1.15] tracking-tight text-fe-text"
          >
            En sık yapılan 4 hata
          </h2>
        </div>
        <ol className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          {MISTAKES.map((m) => (
            <li key={m.n} className="relative pl-12">
              <span
                aria-hidden
                className="absolute left-0 top-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-fe-accent/10 text-xs font-mono font-semibold text-fe-accent"
              >
                {m.n}
              </span>
              <p className="text-base font-semibold text-fe-text">{m.title}</p>
              <p className="mt-1.5 text-sm text-fe-text-muted leading-relaxed">{m.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
