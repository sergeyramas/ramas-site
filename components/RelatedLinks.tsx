import Link from "next/link";
import type { RelatedEntry } from "@/lib/related";

export function RelatedLinks({ entries }: { entries: RelatedEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-16 border-t border-border pt-10">
      <p id="related-heading" className="eyebrow">Связанное</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {entries.map((e) => (
          <li key={e.href}>
            <Link href={e.href} className="group block h-full">
              <div className="edge h-full bg-card rounded-xl p-5 transition-all duration-300 group-hover:bg-elevated group-hover:-translate-y-0.5">
                <p className="font-mono text-[11px] tracking-wider text-subtle uppercase">{e.label}</p>
                <h3 className="mt-2 text-base font-medium leading-snug tracking-tight group-hover:text-accent transition-colors">
                  {e.title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-2">{e.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
