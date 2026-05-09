import Link from "next/link";

const kpis = [
  { value: "3929", label: "товаров перенёс на Next.js" },
  { value: "2", label: "магазина на eBay автоматизированы" },
  { value: "22", label: "решения, проекта и идеи здесь" },
];

export function Hero() {
  return (
    <section className="hero-mega min-h-[88vh] flex flex-col justify-center pt-24 pb-32 px-2">
      <div className="hero-grid-bg" aria-hidden />
      <div className="hero-particles" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="hero-particle" />
        ))}
      </div>
      <div className="scan-line" aria-hidden />

      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="rise rise-1 inline-flex items-center gap-3 mb-10 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em]">
          <span className="status-dot" aria-hidden />
          <span className="text-accent font-bold">система активна · 2026</span>
        </p>

        <h1
          className="rise rise-2 display-mega glitch text-[clamp(3rem,11vw,9rem)] mb-2"
          data-text="СЕРГЕЙ РАМА"
        >
          СЕРГЕЙ РАМА
        </h1>
        <h2
          className="rise rise-3 display-mega text-accent text-[clamp(2.25rem,8.5vw,7rem)] mb-10 sm:mb-14"
        >
          AI HUB
        </h2>

        <p className="rise rise-4 max-w-[640px] font-mono text-[13px] sm:text-sm leading-[1.9] text-muted mb-10">
          <strong className="text-accent">Промпты</strong>, гайды и схемы под каждое решение.<br />
          Выбери карточку <span className="text-fg">→</span>{" "}
          <strong className="text-fg">забери стек</strong>{" "}
          <span className="text-fg">→</span> внедряй у себя.
        </p>

        <Link href="/solutions" className="rise rise-5 cta-btn">
          <span className="bolt" aria-hidden>⚡</span>
          <span>начать доминацию</span>
        </Link>
      </div>

      <dl className="relative z-10 mt-20 sm:mt-28 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto w-full border-t border-border pt-10">
        {kpis.map((k, i) => (
          <div key={k.label} className={`flex flex-col gap-2 rise rise-${i + 6}`}>
            <dt className="display-mega text-3xl sm:text-4xl">{k.value}</dt>
            <dd className="font-mono text-[11px] uppercase tracking-widest text-muted leading-snug max-w-[28ch]">
              {k.label}
            </dd>
          </div>
        ))}
      </dl>

      <div className="scroll-arrow" aria-hidden>
        <span>scroll</span>
        <span>↓</span>
      </div>
    </section>
  );
}
