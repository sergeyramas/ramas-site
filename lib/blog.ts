import { existsSync } from "node:fs";
import { join } from "node:path";
import { articles } from "#site/content";

export type Article = (typeof articles)[number];

export function allArticles(): Article[] {
  return [...articles].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

const STOP = new Set([
  "как", "что", "это", "для", "или", "при", "без", "под", "над", "его", "она", "они",
  "сайт", "сайта", "сайте", "сайту", "сайтов", "новый", "новая", "новое", "новые",
  "после", "перед", "между", "только", "можно", "нужно", "через", "когда", "если",
  "чтобы", "также", "этот", "этой", "этого", "свой", "свои", "своей", "есть", "нет",
]);

function tokens(article: Article): Set<string> {
  const raw = [article.title, article.description, ...article.tags].join(" ");
  const out = new Set<string>();
  for (const part of raw.toLowerCase().split(/[^\p{L}\p{N}]+/u)) {
    if (part.length < 4 || STOP.has(part)) continue;
    out.add(part);
  }
  return out;
}

function overlap(a: Article, b: Article): number {
  const mine = tokens(a);
  let score = 0;
  for (const token of tokens(b)) if (mine.has(token)) score += 1;
  return score;
}

// Совпадение тегов и слов заголовка/описания. Если пересечения нет — последние по дате.
export function relatedArticles(current: Article, limit = 3): Article[] {
  const rest = allArticles().filter((a) => a.slug !== current.slug);
  const ranked = rest
    .map((a) => ({ a, score: overlap(current, a) }))
    .sort((x, y) => y.score - x.score || +new Date(y.a.date) - +new Date(x.a.date));

  const picked: Article[] = [];
  for (const row of ranked) {
    if (row.score <= 0) break;
    picked.push(row.a);
    if (picked.length >= limit) return picked;
  }
  for (const article of rest) {
    if (picked.length >= limit) break;
    if (!picked.some((item) => item.slug === article.slug)) picked.push(article);
  }
  return picked;
}

// Cover resolution: frontmatter `cover` wins; otherwise public/blog-covers/<slug>.webp
// if it exists; otherwise the shared blog-default.webp; otherwise null, and the
// caller renders a gradient placeholder.
function publicFile(name: string): string | null {
  const path = `/blog-covers/${name}`;
  const fsPath = join(process.cwd(), "public", "blog-covers", name);
  return existsSync(fsPath) ? path : null;
}

// Local paths must exist under public/. A missing file (the pipeline sometimes
// writes the URL before the asset) falls through to the shared cover.
export function localAssetOk(src: string): boolean {
  if (!src.startsWith("/") || src.startsWith("//")) return true;
  let pathname = src.split("?")[0].split("#")[0];
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    return false;
  }
  if (pathname.includes("\0") || pathname.split("/").includes("..")) return false;
  return existsSync(join(process.cwd(), "public", pathname));
}

export function coverFor(article: Pick<Article, "slug" | "cover">): string | null {
  if (article.cover && localAssetOk(article.cover)) return article.cover;
  return publicFile(`${article.slug}.webp`) ?? publicFile("blog-default.webp");
}

export const SITE_ORIGIN = "https://sergeyramas.vercel.app";
export const PUBLIC_AUTHOR = "Сергей Рамас";

// Конвейер пишет «Сергей Рамазанов» (статья о конвейере вручную — «Сергей Рамас»).
// На сайте и в схеме одно публичное имя.
export function authorName(name: string | undefined): string {
  const trimmed = (name ?? "").trim().replace(/\s+/g, " ");
  if (!trimmed) return PUBLIC_AUTHOR;
  if (/рамазанов|рамас/i.test(trimmed) || /ramazanov|\bramas\b/i.test(trimmed)) return PUBLIC_AUTHOR;
  return trimmed;
}

export function absoluteAsset(src: string | null | undefined): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/")) return `${SITE_ORIGIN}${src}`;
  return `${SITE_ORIGIN}/${src}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );
}
