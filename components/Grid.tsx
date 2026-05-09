import type { Item } from "@/lib/content";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

export function Grid({ items, dense = false }: { items: Item[]; dense?: boolean }) {
  if (items.length === 0) {
    return <p className="text-muted">Пока пусто. Скоро появится.</p>;
  }
  return (
    <ul
      className={cn(
        "grid gap-4",
        dense ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {items.map((item) => (
        <li key={`${item.kind}-${item.slug}`}>
          <Card item={item} dense={dense} />
        </li>
      ))}
    </ul>
  );
}
