import Link from "next/link";
import type { NewsIssue, NewsItem, NewsSection } from "@/lib/news";
import { issueDateParts, issueNumber } from "@/lib/news";

/* ── вспомогательное ───────────────────────────────────────── */

const CITIES = [
  { city: "МСК", offset: 3 },
  { city: "UTC", offset: 0 },
  { city: "Нью-Йорк", offset: -5 },
];

function cityClocks(iso: string) {
  const base = new Date(iso).getTime();
  return CITIES.map(({ city, offset }) => ({
    city,
    time: new Date(base + offset * 3600_000)
      .toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })
      .slice(0, 5),
  }));
}

/** «18:45» из «3 часа назад» — время по МСК относительно сборки выпуска. */
function exactTime(item: NewsItem, generatedAt: string) {
  const raw = item.time ?? "";
  const hours = raw.match(/(\d+)\s*час/);
  if (!hours) return raw;
  const base = new Date(generatedAt).getTime() - Number(hours[1]) * 3600_000;
  return `${new Date(base + 3 * 3600_000).toISOString().slice(11, 16)}`;
}

const RUBRIC: Record<string, string> = {
  ai: "ИИ",
  crypto: "Крипта",
  world: "Мир",
};

function stamp(item: NewsItem, sectionId: string, generatedAt: string) {
  const time = exactTime(item, generatedAt);
  const rubric = RUBRIC[sectionId] ?? "";
  return time ? `${rubric} · ${time}` : rubric;
}

function materials(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} материал`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} материала`;
  return `${n} материалов`;
}

function firstSentence(text?: string, limit = 150) {
  if (!text) return "";
  const cut = text.split(/(?<=[.!?])\s/)[0] ?? text;
  return cut.length > limit ? `${cut.slice(0, limit).replace(/[,\s]+\S*$/, "")}…` : cut;
}

function glanceFacts(issue: NewsIssue) {
  if (issue.glance?.length) return issue.glance.map((title) => ({ title, note: "" }));
  const picks: { item: NewsItem; section: string }[] = [];
  issue.sections.forEach((section, sIdx) => {
    if (section.items[0]) picks.push({ item: section.items[0], section: section.id });
    if (sIdx > 0 && section.items[1]) picks.push({ item: section.items[1], section: section.id });
  });
  return picks.slice(0, 6).map(({ item }) => ({ title: item.title, note: firstSentence(item.summary, 90) }));
}

/* ── atoms ─────────────────────────────────────────────────── */

function Kicker({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-accent ${className}`}>
      {children}
    </div>
  );
}

function Meta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[9.5px] uppercase tracking-[0.14em] text-subtle ${className}`}>{children}</p>
  );
}

function Headline({ item, size }: { item: NewsItem; size: "lead" | "normal" | "small" }) {
  const cls =
    size === "lead"
      ? "font-serif text-[clamp(1.9rem,4vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.02em]"
      : size === "normal"
        ? "font-serif text-[1.12rem] font-semibold leading-[1.22]"
        : "font-serif text-[1rem] font-semibold leading-[1.28]";

  return (
    <h3 className={cls}>
      {item.url ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
          {item.title}
        </a>
      ) : (
        item.title
      )}
    </h3>
  );
}

function Thumb({ item }: { item: NewsItem }) {
  if (!item.image) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.image}
      alt=""
      loading="lazy"
      className="h-[66px] w-[88px] flex-none border border-border object-cover"
    />
  );
}

/* ── блоки ─────────────────────────────────────────────────── */

function Glance({ facts, generatedAt }: { facts: { title: string; note: string }[]; generatedAt: string }) {
  const [msk, ...rest] = cityClocks(generatedAt);
  return (
    <aside className="lg:border-r lg:border-dashed lg:border-border lg:pr-6">
      <div className="border-b border-dashed border-border pb-2">
        <h2 className="font-serif text-[1.4rem] font-semibold leading-[1.1]">День одним взглядом</h2>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.12em] text-subtle">
          <span className="text-accent">обновлено {msk.time} МСК</span>
          {rest.map((c) => (
            <span key={c.city}>
              {c.time} {c.city}
            </span>
          ))}
        </div>
      </div>
      <ol className="mt-3 space-y-3">
        {facts.map((fact, i) => (
          <li key={fact.title} className="flex gap-2.5">
            <span className="mt-[0.15rem] font-serif text-[0.95rem] leading-none text-accent">{i + 1}</span>
            <div>
              <p className="text-[12.5px] font-semibold leading-snug">{fact.title}</p>
              {fact.note && <p className="mt-0.5 text-[11.5px] leading-snug text-muted">{fact.note}</p>}
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function Lead({ item, section, generatedAt }: { item: NewsItem; section: NewsSection; generatedAt: string }) {
  return (
    <main className="lg:px-8">
      <Kicker className="text-center">{section.kicker}</Kicker>
      <div className="mt-3 text-center">
        <Headline item={item} size="lead" />
      </div>
      {item.summary && (
        <p className="mx-auto mt-4 max-w-[46ch] text-center text-[14.5px] leading-relaxed text-muted">
          {item.summary}
        </p>
      )}
      {item.image && (
        <figure className="mt-4 overflow-hidden border border-border bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt="" className="aspect-[16/9] w-full object-cover" />
        </figure>
      )}
      <Meta className="mt-3 text-center">
        {item.source} · {stamp(item, section.id, generatedAt)}
      </Meta>
    </main>
  );
}

function Sidebar({
  items,
  sectionIds,
  numbers,
  generatedAt,
}: {
  items: NewsItem[];
  sectionIds: string[];
  numbers?: { label: string; value: string }[];
  generatedAt: string;
}) {
  const [first, ...rest] = items;
  if (!first) return null;
  return (
    <aside className="lg:border-l lg:border-dashed lg:border-border lg:pl-6">
      <div>
        <Headline item={first} size="normal" />
        {first.image && (
          <figure className="mt-3 overflow-hidden border border-border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={first.image} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
          </figure>
        )}
        <Meta className="mt-2">{first.source} · {stamp(first, sectionIds[0], generatedAt)}</Meta>
      </div>

      {rest.length > 0 && (
        <ul className="mt-4 space-y-3 border-t border-dashed border-border pt-4">
          {rest.slice(0, 3).map((item, i) => (
            <li key={item.title} className="border-b border-dashed border-border pb-3 last:border-b-0 last:pb-0">
              <Headline item={item} size="small" />
              <Meta className="mt-1">{item.source} · {stamp(item, sectionIds[i + 1] ?? sectionIds[0], generatedAt)}</Meta>
            </li>
          ))}
        </ul>
      )}

      {numbers && numbers.length > 0 && (
        <div className="mt-5 border border-border bg-card px-4 py-3">
          <Kicker>Цифры дня</Kicker>
          <dl className="mt-2 space-y-2">
            {numbers.map((n) => (
              <div
                key={n.label}
                className="flex items-baseline justify-between gap-3 border-b border-dashed border-border pb-1.5 last:border-b-0 last:pb-0"
              >
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted">{n.label}</dt>
                <dd className="text-[13px] font-semibold tabular-nums">{n.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </aside>
  );
}

function SectionBand({ section, generatedAt }: { section: NewsSection; generatedAt: string }) {
  const cols = section.items.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section id={section.id} className="mt-10 border-t-2 border-fg pt-4">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="font-sans text-[10.5px] font-bold uppercase tracking-[0.22em] text-accent">
          {section.kicker}
        </h2>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-subtle">
          {materials(section.items.length)}
        </span>
      </div>
      <ul className={`grid gap-x-8 gap-y-5 ${cols}`}>
        {section.items.map((item) => (
          <li key={item.title} className="border-t border-dashed border-border pt-3 first:border-t-0 first:pt-0 sm:border-t-0 sm:pt-0">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <Meta className="mb-1">{stamp(item, section.id, generatedAt)}</Meta>
                <div className="flex gap-2.5">
                  <Thumb item={item} />
                  <Headline item={item} size="small" />
                </div>
                {item.summary && (
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                    {firstSentence(item.summary, 150)}
                  </p>
                )}
                <Meta className="mt-1.5">{item.source}</Meta>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── страница ──────────────────────────────────────────────── */

export function NewsIssueLayout({ issue, archive = [] }: { issue: NewsIssue; archive?: NewsIssue[] }) {
  const d = issueDateParts(issue.date);
  const facts = glanceFacts(issue);
  const [leadSection, ...otherSections] = issue.sections;
  const lead = leadSection?.items[0];
  const sidebarItems = [...(leadSection?.items.slice(1, 3) ?? []), ...(otherSections[0]?.items.slice(0, 2) ?? [])];
  const sidebarSections = [
    leadSection?.id ?? "ai",
    leadSection?.id ?? "ai",
    otherSections[0]?.id ?? "crypto",
    otherSections[0]?.id ?? "crypto",
  ];

  return (
    <div className="text-fg">
      <header>
        <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
          <span>
            {d.weekday}, {d.long}
          </span>
          <span className="text-accent">выпуск № {issueNumber(issue)}</span>
        </div>

        <div className="mt-3 border-y border-dashed border-border py-3 text-center">
          <h1 className="font-serif text-[clamp(2.4rem,6.5vw,4.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.02em]">
            {issue.title}
          </h1>
          {issue.standfirst && (
            <p className="mt-1.5 font-serif text-[13px] italic text-muted">{issue.standfirst}</p>
          )}
        </div>

        <nav className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 border-b border-border pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {issue.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="transition-colors hover:text-fg">
              {RUBRIC[s.id] ?? s.kicker}
            </a>
          ))}
          <Link href="/news" className="transition-colors hover:text-fg">
            Архив
          </Link>
        </nav>
      </header>

      <div className="mt-3 grid grid-cols-2 border-b border-border sm:grid-cols-4">
        {issue.ticker.map((t, i) => (
          <div
            key={t.label}
            className={`flex items-baseline justify-between gap-2 py-2 pr-3 font-mono text-[10px] uppercase tracking-[0.1em] sm:pl-3 ${
              i < issue.ticker.length - 1 ? "sm:border-r sm:border-dashed sm:border-border" : ""
            }`}
          >
            <span className="text-muted">{t.label}</span>
            <span className="flex items-baseline gap-2">
              <b className="text-[12px] font-semibold normal-case tracking-normal tabular-nums">{t.value}</b>
              {t.change && (
                <span className={t.dir === "down" ? "text-accent" : "text-emerald-700 dark:text-emerald-400"}>
                  {t.change}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[250px_1fr_280px] lg:gap-0">
        <Glance facts={facts} generatedAt={issue.generatedAt} />
        {lead && leadSection && <Lead item={lead} section={leadSection} generatedAt={issue.generatedAt} />}
        <Sidebar
          items={sidebarItems}
          sectionIds={sidebarSections}
          numbers={issue.numbers}
          generatedAt={issue.generatedAt}
        />
      </div>

      {issue.sections.map((section) => (
        <SectionBand key={section.id} section={section} generatedAt={issue.generatedAt} />
      ))}

      <footer className="mt-10 flex flex-wrap items-baseline justify-between gap-3 border-t border-dashed border-border pt-3 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted">
        <span>Источники: {issue.sources.join(" · ")}</span>
        <span>
          Собрано{" "}
          {new Date(issue.generatedAt).toLocaleString("ru-RU", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Moscow",
          })}{" "}
          МСК
        </span>
      </footer>

      {archive.length > 1 && (
        <nav className="mt-10">
          <Kicker>Архив</Kicker>
          <ul className="mt-3 divide-y divide-dashed divide-border border-y border-dashed border-border">
            {archive
              .filter((a) => a.date !== issue.date)
              .map((a) => (
                <li key={a.date}>
                  <Link
                    href={`/news/${a.date}`}
                    className="flex items-baseline justify-between gap-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-fg"
                  >
                    <span>{issueDateParts(a.date).long}</span>
                    <span className="text-subtle">{issueDateParts(a.date).weekday}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
