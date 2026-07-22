import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const metadata = {
  title: "GAP-анализы ниш",
  description:
    "Что такое GAP-анализ и зачем он нужен, плюс все проведённые разборы ниш: Логика ИТП, Фундамент21, ROCKMESH, BetaLine, Рынок Маркет. Боли покупателей дословными цитатами и карта пробелов рынка.",
  alternates: { canonical: "/gaps" },
  keywords: ["GAP-анализ", "анализ конкурентов", "боли покупателей", "разведка ниши", "Сергей Рамас"],
};

const BUCKETS = [
  {
    title: "Насыщение",
    text: "Что есть у 3+ конкурентов. Пропустить нельзя — выглядишь непрофессионально. Но продавать этим бесполезно.",
    gold: false,
  },
  {
    title: "Разрывы — золото",
    text: "Чего не делает никто, хотя боль в отзывах кричит. Отсюда берётся оффер и первый экран.",
    gold: true,
  },
  {
    title: "Слабые места",
    text: "Делают 1–2 и делают поверхностно. Можно сделать заметно лучше и забрать сравнение.",
    gold: false,
  },
  {
    title: "Язык клиента",
    text: "Дословные формулировки из отзывов. Тексты пишутся их словами, а не маркетинговыми.",
    gold: false,
  },
];

const FLOW = [
  "ниша + ключевое слово",
  "конкуренты и их сайты",
  "отзывы и боли дословно",
  "GAP по 4 корзинам",
  "структура сайта",
  "прототип",
];

type Gap = {
  slug: string;
  niche: string;
  project: string;
  note: string;
  meta: string;
  href?: string;
  external?: boolean;
  projectHref?: string;
  projectLabel?: string;
};

const PUBLISHED: Gap[] = [
  {
    slug: "logika-itp",
    niche: "Обслуживание ИТП · Москва и МО",
    project: "ООО «Логика»",
    note: "Конкуренты, страхи заказчика (штрафы, аварии, сезон) и незакрытые разрывы. К анализу приложены три готовых прототипа лендинга — A / B / C.",
    meta: "10 июля 2026 · отдельный сайт + 3 прототипа",
    href: "https://logika-itp-gap-analysis.vercel.app",
    external: true,
    projectHref: "https://logika-itp-gap-analysis.vercel.app/proto-a.html",
    projectLabel: "Прототип сайта",
  },
  {
    slug: "fundament21",
    niche: "ЖБИ, ФБС и фундаменты",
    project: "фундамент21.рф",
    note: "Визуальный бенчмарк конкурентов, SEO-срез, скоринг по 8 критериям и палитра ниши. Клиентский формат — с обложкой и выводами на первом экране.",
    meta: "12 июня 2026 · клиентский отчёт",
    href: "/examples/competitive-analysis-fundament21",
    projectHref: "https://fundament21.vercel.app",
    projectLabel: "Сайт-результат",
  },
  {
    slug: "rockmesh",
    niche: "Стеклопластиковая сетка",
    project: "ROCKMESH",
    note: "7 конкурентов, 6 источников отзывов, визуальные эталоны и разрывы. Рядом — исходный рабочий разбор по 7 корзинам, из которого вырос клиентский отчёт.",
    meta: "13 мая 2026 · клиентский отчёт",
    href: "/examples/competitive-analysis-rockmesh",
    projectHref: "https://setka-rockmesh.vercel.app",
    projectLabel: "Сайт-результат",
  },
];

const INTERNAL: Gap[] = [
  {
    slug: "betaline-voice",
    niche: "Голосовые роботы обзвона",
    project: "BetaLine AI",
    note: "Разбор на реальных цитатах: 11 источников отзывов (Tomoru, Звонобот, Звонок, Скорозвон), таблица доказательств с URL и датами захвата. Вывод — рынок продаёт софт, а покупают сопровождение.",
    meta: "7 июля 2026 · pain-driven, с цитатами",
    href: "/gap/betaline-voice-ai.html",
    projectHref: "https://betaline-ai.ru",
    projectLabel: "Сайт-результат",
  },
  {
    slug: "betaline-solutions",
    niche: "ИИ-агенты для бизнеса",
    project: "BetaLine AI",
    note: "22 компании, 8 каталогов решений, 4 диагностических оффера. Три разрыва: каталог по затыкам вместо отделов, диагностика внутри живого бота, вход «пробовали конструктор — упёрлись».",
    meta: "9 июля 2026 · разрывы и слабые места",
    href: "/gap/betaline-solutions.html",
    projectHref: "https://betaline-ai.ru",
    projectLabel: "Сайт-результат",
  },
  {
    slug: "rockmesh-buckets",
    niche: "Стеклопластиковая сетка · 7 корзин",
    project: "ROCKMESH",
    note: "Исходный рабочий документ полного фреймворка: насыщение, разрывы, слабые места, язык клиента, визуальные конвенции, доверие, конверсия.",
    meta: "10 мая 2026 · рабочий документ",
    href: "/gap/rockmesh-7-buckets.html",
    projectHref: "https://setka-rockmesh.vercel.app",
    projectLabel: "Сайт-результат",
  },
];

const CLOSED: Gap[] = [
  {
    slug: "rynok-market",
    niche: "Раздел доставки · логистика стройматериалов",
    project: "Рынок Маркет",
    note: "Три класса эталонов (Curri, Uber Freight / Onfleet / Lalamove, российские анти-примеры), что взято и что осознанно отвергнуто, и как каждое решение зашито в макеты.",
    meta: "6 июля 2026 · доступ по подписке",
    projectHref: "/projects/rynok-market",
    projectLabel: "О проекте",
  },
];

function GapRow({ gap }: { gap: Gap }) {
  const locked = !gap.href;
  return (
    <li
      className={`edge rounded-xl bg-card p-6 sm:p-7 ${locked ? "border-dashed" : "transition-colors hover:bg-elevated"}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-lg sm:text-xl font-medium tracking-tight">{gap.niche}</h3>
        <span className="eyebrow text-subtle">{gap.project}</span>
      </div>
      <p className="mt-3 text-sm text-muted leading-relaxed max-w-prose">{gap.note}</p>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-subtle">{gap.meta}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        {gap.href ? (
          gap.external ? (
            <a
              href={gap.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-fg hover:text-accent transition-colors"
            >
              Открыть GAP-анализ
              <ArrowUpRight aria-hidden className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          ) : (
            <Link
              href={gap.href}
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-fg hover:text-accent transition-colors"
            >
              Открыть GAP-анализ
              <span aria-hidden>→</span>
            </Link>
          )
        ) : (
          <a
            href="https://t.me/Sergeyramas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent hover:opacity-80 transition-opacity"
          >
            Запросить доступ
            <ArrowUpRight aria-hidden className="w-3.5 h-3.5" strokeWidth={1.5} />
          </a>
        )}

        {gap.projectHref &&
          (gap.projectHref.startsWith("/") ? (
            <Link
              href={gap.projectHref}
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
            >
              {gap.projectLabel}
              <span aria-hidden>→</span>
            </Link>
          ) : (
            <a
              href={gap.projectHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
            >
              {gap.projectLabel}
              <ArrowUpRight aria-hidden className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          ))}
      </div>
    </li>
  );
}

function Group({ label, gaps }: { label: string; gaps: Gap[] }) {
  return (
    <section className="mt-14 sm:mt-16">
      <p className="eyebrow mb-5">{label}</p>
      <ul className="grid gap-4">
        {gaps.map((g) => (
          <GapRow key={g.slug} gap={g} />
        ))}
      </ul>
    </section>
  );
}

export default function GapsPage() {
  const total = PUBLISHED.length + INTERNAL.length + CLOSED.length;
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 pb-24">
      <PageHeader
        eyebrow="GAP-анализы · разведка ниш"
        title="Где в нише дыра."
        subtitle="Разведка рынка, из которой рождается сайт: что делают все конкуренты, чего не делает никто, и какими словами клиенты описывают свою боль."
        count={total}
      />

      <section className="edge rounded-2xl bg-card p-7 sm:p-10">
        <h2 className="display text-2xl sm:text-3xl">Что такое GAP-анализ и что он решает</h2>
        <p className="mt-5 text-base text-muted leading-relaxed max-w-prose">
          Обычный «анализ конкурентов» отвечает на вопрос «как у них?» и заканчивается табличкой.
          GAP-анализ отвечает на другой вопрос: <strong className="text-fg">где в нише дыра, которую
          можно занять</strong> — и подтверждает ответ дословными цитатами покупателей, а не интуицией.
        </p>
        <p className="mt-4 text-base text-muted leading-relaxed max-w-prose">
          Проблема, которую он закрывает: сайт делают «как у лидера рынка» и получают ещё одного
          неотличимого игрока. Клиент заходит, не видит разницы и уходит сравнивать по цене.
          GAP-анализ ломает эту ловушку — он показывает, что именно все проговаривают одинаково
          (и потому это не аргумент), а какую боль рынок не закрывает вовсе.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {BUCKETS.map((b) => (
            <li
              key={b.title}
              className={`edge rounded-xl p-5 ${b.gold ? "border-accent/60 bg-accent/5" : "bg-bg"}`}
            >
              <p className={`text-sm font-medium ${b.gold ? "text-accent" : "text-fg"}`}>{b.title}</p>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">{b.text}</p>
            </li>
          ))}
        </ul>

        <ul className="mt-8 flex flex-wrap items-center gap-2">
          {FLOW.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className="edge rounded-full bg-bg px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted">
                {step}
              </span>
              {i < FLOW.length - 1 && <span aria-hidden className="text-subtle">→</span>}
            </li>
          ))}
        </ul>

        <p className="mt-7 text-sm text-muted leading-relaxed max-w-prose">
          На выходе — не «отчёт в стол», а каркас будущего сайта: каждый блок закрывает конкретную
          боль конкретной цитатой, и рядом написано, кто из конкурентов это делает и как именно мы
          делаем лучше. Движок, которым это собирается, —{" "}
          <Link href="/solutions/pain-driven-research" className="text-accent hover:opacity-80">
            скилл Pain-Driven Research
          </Link>
          .
        </p>
      </section>

      <Group label="Опубликованные" gaps={PUBLISHED} />
      <Group label="Внутренние — рабочие документы" gaps={INTERNAL} />
      <Group label="Закрытые — по подписке" gaps={CLOSED} />
    </div>
  );
}
