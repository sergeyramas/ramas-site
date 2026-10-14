import { articles, items } from "#site/content";

export type RelatedEntry = {
  href: string;
  title: string;
  summary: string;
  label: string;
};

const KIND_LABEL = { solution: "Solution", project: "Project", idea: "Idea" } as const;

// Страницы, у которых реально есть своя страница на сайте:
// все solutions, только внутренние projects (у внешних нет /projects/[slug]), статьи блога.
function lookup(href: string): RelatedEntry | null {
  const [, section, slug] = href.split("/");
  if (section === "blog") {
    const a = articles.find((x) => x.slug === slug);
    return a ? { href, title: a.title, summary: a.description, label: "Блог" } : null;
  }
  const kind = section === "solutions" ? "solution" : section === "projects" ? "project" : null;
  if (!kind) return null;
  const it = items.find((x) => x.kind === kind && x.slug === slug);
  if (!it || (kind === "project" && it.isExternal)) return null;
  return { href, title: it.title, summary: it.summary, label: KIND_LABEL[kind] };
}

// Неизвестный путь — ошибка сборки, чтобы не публиковать битые связи.
export function resolveRelated(hrefs: readonly string[], selfHref?: string): RelatedEntry[] {
  return hrefs
    .filter((h) => h !== selfHref)
    .map((h) => {
      const entry = lookup(h);
      if (!entry) throw new Error(`related: страницы нет на сайте: ${h} (в ${selfHref ?? "?"})`);
      return entry;
    });
}
