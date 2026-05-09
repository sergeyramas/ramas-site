import Link from "next/link";

export const metadata = { title: "About" };

const facts = [
  { value: "UTC+3", label: "часовой пояс" },
  { value: "RU · EN", label: "языки в работе" },
  { value: "21K+", label: "км на велосипеде в 2025" },
];

const stack = [
  "Next.js · TypeScript · Tailwind",
  "Claude Code + собственные скиллы",
  "Python · FastAPI · Telegram-боты",
  "Directus · Postgres · Redis",
  "Hetzner VPS · Tailscale · Vercel",
];

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 pb-24">
      <p className="eyebrow rise rise-1">About · кто я и чем занят</p>

      <h1 className="display rise rise-2 mt-6 text-5xl sm:text-7xl">
        Сергей <span className="display-italic text-accent">Рамас</span>.
      </h1>

      <p className="rise rise-3 mt-8 text-lg sm:text-xl text-muted leading-relaxed">
        Веду агентство по Яндекс.Директу, разработке сайтов и внедрению AI-систем в бизнес-процессы.
        Под капотом — мульти-агентные системы, которые закрывают рутину быстрее людей. Параллельно
        строю в США полностью автоматизированный reseller-бизнес на eBay.
      </p>

      <dl className="rise rise-4 mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8 border-y border-border py-8">
        {facts.map((f) => (
          <div key={f.label} className="flex flex-col gap-1">
            <dt className="display text-3xl">{f.value}</dt>
            <dd className="text-sm text-muted">{f.label}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-16">
        <p className="eyebrow">Свои продукты</p>
        <p className="display-italic mt-4 text-2xl sm:text-3xl leading-snug max-w-2xl">
          «Каждый продукт — это эксперимент: проверить гипотезу, выкатить за неделю,
          дать ему шанс жить или закрыть».
        </p>
        <ul className="mt-8 space-y-3 text-base">
          <li>
            <Link href="https://betaline-ai.ru" className="hover:text-accent">
              <span className="font-medium">BetaLine AI</span>
            </Link>
            <span className="text-muted"> — Telegram-бот + CRM + веб-чат для бизнеса.</span>
          </li>
          <li>
            <Link href="https://fundament21.vercel.app" className="hover:text-accent">
              <span className="font-medium">Fundament21</span>
            </Link>
            <span className="text-muted"> — миграция e-commerce на Next.js + Directus, 3929 SKU.</span>
          </li>
          <li>
            <Link href="https://piratebay-landing.vercel.app" className="hover:text-accent">
              <span className="font-medium">PiratEBay</span>
            </Link>
            <span className="text-muted"> — SaaS-лендинг для eBay-агентов.</span>
          </li>
        </ul>
      </section>

      <section className="mt-16">
        <p className="eyebrow">eBay в США</p>
        <p className="mt-4 leading-relaxed text-muted">
          Два аккаунта (грузинский и перуанский), полностью автоматизированы: closing, purchasing,
          sync треков, мониторинг цен и стока. Вся ручная работа — это решения о том, что добавить
          в каталог.
        </p>
      </section>

      <section className="mt-16">
        <p className="eyebrow">AI-стек и память</p>
        <p className="mt-4 leading-relaxed text-muted">
          OpenClaw (autonomous agent на VPS) + ClaudeClaw (бэкап на Mac). Память построена по
          паттерну Karpathy LLM Wiki — соответствующие инструменты живут{" "}
          <Link href="/solutions" className="underline decoration-subtle underline-offset-4 hover:text-accent hover:decoration-accent">
            в Solutions
          </Link>.
        </p>
      </section>

      <section className="mt-16">
        <p className="eyebrow">Текущий стек</p>
        <ul className="mt-6 space-y-2 font-mono text-sm text-muted">
          {stack.map((s) => (
            <li key={s} className="flex items-center gap-3">
              <span className="text-subtle">·</span>
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <p className="eyebrow">Вне работы</p>
        <p className="mt-4 leading-relaxed text-muted">
          Путешествия, йога, гири, велоспорт. В 2025 прошёл полумарафон на Филиппинах.
        </p>
      </section>

      <section className="mt-20 border-t border-border pt-10">
        <p className="eyebrow">Связь</p>
        <p className="display mt-4 text-3xl sm:text-4xl">
          <Link href="mailto:fantroms@gmail.com" className="hover:text-accent">
            fantroms@gmail.com
          </Link>
        </p>
        <p className="mt-3 text-sm text-muted">
          Также:{" "}
          <Link href="https://t.me/Sergeyramas" className="underline decoration-subtle underline-offset-4 hover:text-accent hover:decoration-accent">
            Telegram · @Sergeyramas
          </Link>
          {" "}·{" "}
          <Link href="https://github.com/sergeyramas" className="underline decoration-subtle underline-offset-4 hover:text-accent hover:decoration-accent">
            github.com/sergeyramas
          </Link>
        </p>
      </section>
    </article>
  );
}
