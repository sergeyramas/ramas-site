import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: "22", label: "решения, проекта и идеи" },
  { value: "3929", label: "товаров на Next.js" },
  { value: "2", label: "магазина на eBay автоматизированы" },
];

export function FounderCard() {
  return (
    <section className="founder-card relative mt-32 sm:mt-40 rounded-3xl border border-border bg-card overflow-hidden">
      {/* Subtle accent glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(60% 80% at 80% 100%, rgba(212,255,60,0.06), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative grid grid-cols-1 md:grid-cols-[280px_1fr] gap-0 md:gap-10 p-6 sm:p-10 lg:p-12">
        {/* Portrait */}
        <div className="relative w-full max-w-[280px] aspect-[4/5] mx-auto md:mx-0 overflow-hidden rounded-2xl border border-border bg-elevated">
          <Image
            src="/portraits/sergey-rama.webp"
            alt="Сергей Рамас"
            fill
            sizes="(min-width: 768px) 280px, 100vw"
            className="object-cover"
            priority={false}
          />
        </div>

        {/* Body */}
        <div className="flex flex-col justify-between mt-8 md:mt-0">
          <div>
            <h2 className="display text-4xl sm:text-5xl lg:text-6xl tracking-[-0.025em] leading-[0.95]">
              SERGEY <span className="display-italic text-accent">RAMAS</span>
            </h2>
            <p className="mt-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-accent/90">
              Founder · AI Operations Architect
            </p>

            <p className="mt-6 text-base sm:text-lg text-muted leading-relaxed max-w-[60ch]">
              Веду <strong className="text-fg">агентство по Яндекс.Директу</strong>, разработке
              сайтов и внедрению AI-систем в бизнес-процессы. Под капотом — мульти-агентные
              системы, которые закрывают рутину быстрее людей. Параллельно строю в США{" "}
              <strong className="text-fg">полностью автоматизированный reseller-бизнес на eBay</strong>.
              Здесь, на хабе — упакованные решения, гайды и стэки. Бери и внедряй.
            </p>
          </div>

          {/* Stats */}
          <dl className="mt-10 grid grid-cols-3 gap-6 sm:gap-10 max-w-2xl">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dt className="display text-2xl sm:text-3xl lg:text-4xl">{s.value}</dt>
                <dd className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-subtle leading-snug">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-elevated hover:bg-card hover:border-accent transition-colors text-sm font-medium"
            >
              <span>Подробнее</span>
              <span className="text-accent">→</span>
            </Link>
            <Link
              href="https://t.me/Sergeyramas"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-bg hover:bg-accent/90 transition-colors text-sm font-bold"
            >
              <span>Связаться в Telegram</span>
              <span>↗</span>
            </Link>
            <Link
              href="mailto:fantroms@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors px-2"
            >
              <span>fantroms@gmail.com</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Status strip at bottom */}
      <div className="relative border-t border-border px-6 sm:px-10 lg:px-12 py-4 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.15em] text-subtle">
        <span className="inline-flex items-center gap-2">
          <span className="status-dot" aria-hidden />
          <span className="text-accent">online · открыт к проектам · 2026</span>
        </span>
        <span className="hidden sm:inline">UTC+3 · RU · EN</span>
      </div>
    </section>
  );
}
