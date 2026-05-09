"use client";

import { useMemo, useState } from "react";
import { Grid } from "./Grid";
import type { Item } from "@/lib/content";

export function FilteredGrid({
  items,
  dense = false,
}: {
  items: Item[];
  dense?: boolean;
}) {
  const [active, setActive] = useState<string | null>(null);

  // Aggregate tags with counts so we can show useful labels and sort by frequency.
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const it of items) {
      for (const t of it.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => {
      // Sort by count desc, then alphabetical so the bar is stable across renders.
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });
  }, [items]);

  const filtered = useMemo(
    () => (active ? items.filter((i) => i.tags.includes(active)) : items),
    [items, active],
  );

  return (
    <>
      <div className="filter-bar" role="tablist" aria-label="Фильтр по тегам">
        <button
          type="button"
          role="tab"
          aria-selected={active === null}
          className={`filter-btn ${active === null ? "is-active" : ""}`}
          onClick={() => setActive(null)}
        >
          Все
          <span className="filter-count">{items.length}</span>
        </button>
        {tags.map(([t, n]) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={active === t}
            className={`filter-btn ${active === t ? "is-active" : ""}`}
            onClick={() => setActive(t)}
          >
            {t}
            <span className="filter-count">{n}</span>
          </button>
        ))}
      </div>

      <Grid items={filtered} dense={dense} />
    </>
  );
}
