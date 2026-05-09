import type { Item } from "@/lib/content";
import { Card } from "./Card";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function Grid({ items, dense = false }: { items: Item[]; dense?: boolean }) {
  if (items.length === 0) {
    return <p className="text-muted">Пока пусто. Скоро появится.</p>;
  }
  return (
    <ul
      className={cn(
        "grid gap-4 sm:gap-5",
        dense ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {items.map((item, i) => (
        <Reveal as="li" key={`${item.kind}-${item.slug}`} delay={Math.min(i * 60, 480)}>
          <Card item={item} dense={dense} />
        </Reveal>
      ))}
    </ul>
  );
}

export function FeaturedBento({ items }: { items: Item[] }) {
  if (items.length === 0) return null;
  const [hero, ...rest] = items;
  return (
    <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
      <li className="lg:col-span-2 lg:row-span-2 rise rise-1">
        <Card item={hero} large />
      </li>
      {rest.slice(0, 3).map((item, i) => (
        <li key={`${item.kind}-${item.slug}`} className={`rise rise-${i + 2}`}>
          <Card item={item} />
        </li>
      ))}
    </ul>
  );
}
