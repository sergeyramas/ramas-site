import Link from "next/link";
import type { NewsIssue, NewsSection } from "@/lib/news";
import { issueDateParts, issueNumber } from "@/lib/news";

function Ticker({ issue }: { issue: NewsIssue }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 border-y border-fg">
      {issue.ticker.map((t, i) => (
        <div
          key={t.label}
          className={`flex items-baseline justify-between gap-2 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] ${
            i < issue.ticker.length - 1 ? "sm:border-r border-border" : ""
          }`}
        >
          <span className="text-muted">{t.label}</span>
          <span className="flex items-baseline gap-2">
            <b className="text-[13px] font-semibold normal-case tracking-normal text-fg tabular-nums">{t.value}</b>
            {t.change && (
              <span className={t.dir === "down" ? "text-accent" : "text-emerald-600 dark:text-emerald-400"}>
                {t.change}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function ItemMeta({ source, time }: { source: string; time?: string }) {
  return (
    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">
      {source}
      {time ? ` · ${time}` : ""}
    </p>
  );
}

function Item({ item, lead, index, numbered }: { item: NewsSection["items"][number]; lead?: boolean; index: number; numbered?: boolean }) {
  const heading = (
    <h3 className={lead ? "text-2xl sm:text-3xl leading-[1.1] tracking-[-0.01em]" : "text-lg leading-snug"}>
      {numbered && (
        <span className="mr-2 font-mono text-[11px] align-top text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      {item.url ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
          {item.title}
        </a>
      ) : (
        item.title
      )}
    </h3>
  );

  return (
    <article className={lead ? "" : "border-t border-border pt-4 mt-4"}>
      {heading}
      {item.summary && (
        <p
          className={`mt-2 text-muted leading-relaxed ${
            lead
              ? "text-[15px] sm:text-base first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-5xl first-letter:leading-[0.8] first-letter:font-bold first-letter:text-accent"
              : "text-[13.5px]"
          }`}
        >
          {item.summary}
        </p>
      )}
      <ItemMeta source={item.source} time={item.time} />
    </article>
  );
}

function Section({ section, lead }: { section: NewsSection; lead: boolean }) {
  return (
    <section>
      <h2 className="mb-4 border-b-2 border-fg pb-1.5 font-sans text-[10.5px] font-bold uppercase tracking-[0.22em] text-accent">
        {section.kicker}
      </h2>
      {section.items.map((item, i) => (
        <Item key={item.title} item={item} lead={lead && i === 0} index={i} numbered={section.numbered} />
      ))}
    </section>
  );
}

export function NewsIssueLayout({ issue, archive = [] }: { issue: NewsIssue; archive?: NewsIssue[] }) {
  const d = issueDateParts(issue.date);

  return (
    <div className="text-fg">
      <header className="border-b-[3px] border-double border-fg pb-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          <span>
            {d.weekday}, {d.long}
          </span>
          <span>выпуск № {issueNumber(issue)}</span>
        </div>
        <h1 className="mt-3 text-center font-serif text-[clamp(2.6rem,7vw,5.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.02em]">
          {issue.title}
        </h1>
        {issue.standfirst && (
          <p className="mt-2 text-center font-serif text-sm italic text-muted sm:text-base">{issue.standfirst}</p>
        )}
      </header>

      <div className="mt-4">
        <Ticker issue={issue} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-border">
        {issue.sections.map((section, i) => (
          <div key={section.id} className="lg:px-6 lg:first:pl-0 lg:last:pr-0">
            <Section section={section} lead={i === 0} />
          </div>
        ))}
      </div>

      {issue.numbers && issue.numbers.length > 0 && (
        <div className="mt-10 border border-border bg-card px-5 py-4">
          <h2 className="mb-3 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-accent">
            Цифры дня
          </h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {issue.numbers.map((n) => (
              <div key={n.label} className="border-b border-border pb-1.5">
                <dd className="text-xl font-semibold tabular-nums">{n.value}</dd>
                <dt className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{n.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      )}

      <footer className="mt-10 flex flex-wrap items-baseline justify-between gap-3 border-t-[3px] border-double border-fg pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
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
        <nav className="mt-12">
          <h2 className="mb-4 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-accent">Архив</h2>
          <ul className="divide-y divide-border border-y border-border">
            {archive
              .filter((a) => a.date !== issue.date)
              .map((a) => (
                <li key={a.date}>
                  <Link
                    href={`/news/${a.date}`}
                    className="flex items-baseline justify-between gap-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-fg"
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
