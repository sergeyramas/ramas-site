import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Item } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Card({ item, dense = false }: { item: Item; dense?: boolean }) {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    item.isExternal ? (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
        {children}
      </a>
    ) : (
      <Link href={item.url} className="group block h-full">
        {children}
      </Link>
    );

  return (
    <Wrapper>
      <article
        className={cn(
          "h-full border border-border bg-card p-5 transition-colors group-hover:border-accent",
          dense ? "rounded-md" : "rounded-lg p-6"
        )}
      >
        <header className="flex items-start justify-between gap-3">
          <h3 className={cn("font-medium leading-tight", dense ? "text-base" : "text-lg")}>
            {item.title}
          </h3>
          {item.isExternal && (
            <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent shrink-0 mt-1" />
          )}
        </header>
        <p className="mt-2 text-sm text-muted leading-relaxed">{item.summary}</p>
        {item.tags.length > 0 && !dense && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 4).map((t) => (
              <li key={t} className="font-mono text-xs text-muted">
                #{t}
              </li>
            ))}
          </ul>
        )}
      </article>
    </Wrapper>
  );
}
