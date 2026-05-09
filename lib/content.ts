import { items } from "#site/content";

export type Item = (typeof items)[number];
export type Kind = Item["kind"];

export function allByKind(kind: Kind): Item[] {
  return items
    .filter((i) => i.kind === kind)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function bySlug(kind: Kind, slug: string): Item | undefined {
  return items.find((i) => i.kind === kind && i.slug === slug);
}

export function featured(limit = 4): Item[] {
  return items
    .filter((i) => i.featured)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, limit);
}

export function allInternalSlugs(kind: Kind): string[] {
  return items.filter((i) => i.kind === kind && !i.isExternal).map((i) => i.slug);
}

export function allSlugs(kind: Kind): string[] {
  return items.filter((i) => i.kind === kind).map((i) => i.slug);
}
