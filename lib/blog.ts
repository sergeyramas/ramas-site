import { existsSync } from "node:fs";
import { join } from "node:path";
import { articles } from "#site/content";

export type Article = (typeof articles)[number];

export function allArticles(): Article[] {
  return [...articles].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function relatedArticles(current: Article, limit = 3): Article[] {
  return allArticles()
    .filter((a) => a.slug !== current.slug)
    .slice(0, limit);
}

// Cover resolution: frontmatter `cover` wins; otherwise public/blog-covers/<slug>.webp
// if it exists; otherwise the shared blog-default.webp; otherwise null, and the
// caller renders a gradient placeholder.
function publicFile(name: string): string | null {
  const path = `/blog-covers/${name}`;
  const fsPath = join(process.cwd(), "public", "blog-covers", name);
  return existsSync(fsPath) ? path : null;
}

export function coverFor(article: Pick<Article, "slug" | "cover">): string | null {
  if (article.cover) return article.cover;
  return publicFile(`${article.slug}.webp`) ?? publicFile("blog-default.webp");
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );
}
