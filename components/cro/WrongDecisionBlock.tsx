const MISTAKES = [
  {
    n: '01',
    title: 'Kalınlığı sadece ucuzluğa göre seçmek',
    body: 'Karar metresi metre kare fiyatı değil, 10 yılda ödenen ısınma faturasıdır.',
  },
  {
    n: '02',
    title: 'Sadece levha fiyatına bakmak',
    body: 'Sıva, dübel, file, profil, köşebent — sistem 8 kalemdir; tek kalem yanıltıcıdır.',
  },
  {
    n: '03',
    title: 'Nakliyeyi sonradan eklemek',
    body: 'Levha bazlı tekliflerde nakliye "ekstra" gelir; sahadaki tutar farklı çıkar.',
  },
  {
    n: '04',
    title: 'Belge ve uygunluk istememek',
    body: 'TSE/CE olmayan malzeme, EKB onayı ve garanti vaadinde sorun yaratır.',
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Sahada Sık Görülen
          </p>
          <h2
            id="hata-baslik"
            className="mt-3 font-heading font-extrabold text-[28px] sm:text-[36px] leading-[1.15] tracking-tight text-fe-text"
          >
            En sık yapılan 4 hata
          </h2>
        </div>
        <ol className="mt-12 divide-y divide-fe-border/40 lg:divide-y-0 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-2">
          {MISTAKES.map((m) => (
            <li
              key={m.n}
              className="flex items-start gap-5 py-6 sm:py-7 lg:py-5 lg:border-t lg:border-fe-border/40 first:lg:border-t-0 nth-2:lg:border-t-0"
            >
              <span
                aria-hidden
                className="font-mono text-3xl sm:text-4xl font-light text-brand/70 leading-none shrink-0 tabular-nums"
              >
                {m.n}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-base sm:text-lg font-semibold text-fe-text leading-snug">
                  {m.title}
                </p>
                <p className="mt-2 text-sm text-fe-muted leading-relaxed">
                  {m.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
