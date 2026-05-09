import Link from "next/link";

const kpis = [
  { value: "3929", label: "товаров перенёс на Next.js" },
  { value: "2", label: "магазина на eBay автоматизированы" },
  { value: "22", label: "решения, проекта и идеи здесь" },
];

export function Hero() {
  return (
    <section className="pt-20 pb-24 sm:pt-28 sm:pb-32">
      <p className="eyebrow rise rise-1">Сергей Рамас · агентство · автономные агенты · UTC+3</p>

      <h1 className="display rise rise-2 mt-6 text-5xl sm:text-7xl md:text-[88px]">
        AI-операционные системы,
        <br />
        <span className="display-italic text-accent">лендинги</span> и автоматизация продаж.
      </h1>

      <p className="rise rise-3 mt-8 max-w-2xl text-lg sm:text-xl text-muted leading-relaxed">
        Веду агентство — Яндекс.Директ, сайты, внедрение ИИ. Делаю reseller-бизнес на eBay в США.
        Здесь живут упакованные решения, проекты, которыми занят прямо сейчас, и идеи, до которых дойдут руки.
      </p>

      <div className="rise rise-4 mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <Link href="/solutions" className="group inline-flex items-center gap-2 hover:text-accent">
          <span>Solutions</span>
          <span className="font-mono text-muted group-hover:text-accent transition-colors">→</span>
        </Link>
        <Link href="/projects" className="group inline-flex items-center gap-2 hover:text-accent">
          <span>Projects</span>
          <span className="font-mono text-muted group-hover:text-accent transition-colors">→</span>
        </Link>
        <Link href="/ideas" className="group inline-flex items-center gap-2 hover:text-accent">
          <span>Ideas</span>
          <span className="font-mono text-muted group-hover:text-accent transition-colors">→</span>
        </Link>
        <Link href="/about" className="group inline-flex items-center gap-2 hover:text-accent">
          <span>About</span>
          <span className="font-mono text-muted group-hover:text-accent transition-colors">→</span>
        </Link>
      </div>

      <dl className="rise rise-5 mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 border-t border-border pt-10">
        {kpis.map((k) => (
          <div key={k.label} className="flex flex-col gap-2">
            <dt className="display text-4xl sm:text-5xl">{k.value}</dt>
            <dd className="text-sm text-muted leading-snug max-w-[28ch]">{k.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
