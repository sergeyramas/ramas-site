import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Item } from "@/lib/content";
import { cn } from "@/lib/utils";
import Image from "next/image";

const statusLabel: Record<string, string> = {
  live: "Live",
  wip: "В работе",
  archived: "Архив",
  concept: "Идея",
};

export function Card({ item, dense = false, large = false }: { item: Item; dense?: boolean; large?: boolean }) {
  // Solutions always open their own internal step-doc page; external URL is shown
  // there as a "full guide" CTA. Projects fall back to their internal page.
  // Ideas have no /ideas/[slug] route — without an externalUrl they are not linkable.
  const useInternal =
    item.kind === "solution" || (item.kind === "project" && !item.isExternal);
  // Not item.url: velite fills it with `/${kind}s/${slug}` even for ideas, which
  // have no such route (see velite.config.ts). Trust externalUrl only.
  const externalHref = item.isExternal ? item.url : null;
  const showExternalIndicator = item.isExternal;

  const inner = (
    <article
      className={cn(
        "edge h-full bg-card transition-all duration-300",
        "group-hover:bg-elevated group-hover:-translate-y-0.5",
        large
          ? "p-8 sm:p-10 rounded-2xl flex flex-col justify-between min-h-[280px]"
          : dense
            ? "p-5 rounded-xl"
            : "p-6 sm:p-7 rounded-xl"
      )}
    >
      {item.cover && !dense && (
        <div className="relative -mx-5 sm:-mx-7 -mt-5 sm:-mt-7 mb-5 aspect-[16/10] overflow-hidden rounded-t-xl bg-bg">
          <Image
            src={item.cover}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            unoptimized
          />
        </div>
      )}
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="eyebrow">
            {item.kind === "solution" ? "Solution" : item.kind === "project" ? "Project" : "Idea"}
            <span className="text-subtle"> · {statusLabel[item.status] ?? item.status}</span>
          </span>
          <h3
            className={cn(
              "leading-[1.15]",
              large
                ? "display text-3xl sm:text-4xl pr-4"
                : dense
                  ? "text-base font-medium"
                  : "text-lg sm:text-xl font-medium tracking-tight"
            )}
          >
            {item.title}
          </h3>
        </div>
        {showExternalIndicator && (
          <ArrowUpRight
            aria-hidden
            className="w-4 h-4 text-subtle group-hover:text-accent shrink-0 mt-1 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.5}
          />
        )}
      </header>

      <p
        className={cn(
          "text-muted leading-relaxed",
          large ? "mt-6 text-base sm:text-lg max-w-prose" : "mt-3 text-sm",
        )}
      >
        {item.summary}
      </p>

      {item.tags.length > 0 && !dense && (
        <ul className={cn("flex flex-wrap gap-x-3 gap-y-1", large ? "mt-8" : "mt-5")}>
          {item.tags.slice(0, 4).map((t) => (
            <li key={t} className="font-mono text-[11px] tracking-wider text-subtle uppercase">
              {t}
            </li>
          ))}
        </ul>
      )}
    </article>
  );

  if (useInternal) {
    return (
      <Link href={`/${item.kind}s/${item.slug}`} className="group block h-full">
        {inner}
      </Link>
    );
  }

  // No "group" class: without a link there must be no hover-lift pretending to be clickable.
  if (!externalHref) {
    return <div className="block h-full">{inner}</div>;
  }

  return (
    <a href={externalHref} target="_blank" rel="noopener noreferrer" className="group block h-full">
      {inner}
    </a>
  );
}
