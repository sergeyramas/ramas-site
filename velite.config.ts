import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const FALLBACK_COVER = "/blog-covers/blog-default.webp";

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function publicAssetExists(src: string): boolean {
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

// Генератор начинает тело с `# Заголовок` — на странице H1 уже есть в шаблоне.
// Битый локальный src (файл не закоммичен) меняем на запасную обложку.
function rehypeArticleBody() {
  return (tree: HastNode) => {
    const children = tree.children ?? [];
    const first = children.find((node) => node.type === "element");
    if (first?.tagName === "h1") {
      tree.children = children.filter((node) => node !== first);
    }

    const walk = (node: HastNode) => {
      if (node.type === "element" && node.tagName === "h1") node.tagName = "h2";
      if (node.type === "element" && node.tagName === "img") {
        const src = node.properties?.src;
        if (typeof src === "string" && src.startsWith("/") && !publicAssetExists(src)) {
          node.properties = { ...node.properties, src: FALLBACK_COVER };
        }
      }
      for (const child of node.children ?? []) walk(child);
    };
    for (const child of tree.children ?? []) walk(child);
  };
}

const items = defineCollection({
  name: "Item",
  pattern: "items/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      slug: s.slug("global"),
      kind: s.enum(["solution", "project", "idea"]),
      summary: s.string().max(280),
      cover: s.string().optional(),
      preview: s.string().optional(),
      externalUrl: s.string().url().nullable().optional(),
      gapUrl: s.string().optional(),
      tags: s.array(s.string()).default([]),
      status: s.enum(["live", "wip", "archived", "concept"]).default("live"),
      tier: s.enum(["free", "paid"]).default("free"),
      date: s.isodate(),
      featured: s.boolean().default(false),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      url: data.externalUrl ?? `/${data.kind}s/${data.slug}`,
      isExternal: Boolean(data.externalUrl),
    })),
});

// Статьи SEO/GEO-конвейера. Схема — зеркало canonical-mdx-contract.md движка
// (SEO GEO/docs/adapters/canonical-mdx-contract.md): конвейер кладёт сюда .mdx, Velite валидирует.
// Тело — только Markdown, без JSX: тот же файл рендерится вторым движком (markdown-it-py).
const articles = defineCollection({
  name: "Article",
  pattern: "articles/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      description: s.string().max(200),
      slug: s.slug("articles"),
      date: s.isodate(),
      updated: s.isodate(),
      intent: s.enum(["informational", "commercial", "transactional", "local"]),
      author: s.object({
        name: s.string(),
        bio: s.string().optional(),
        url: s.string().optional(),
        photo_url: s.string().optional(),
      }),
      canonical_url: s.string(),
      tags: s.array(s.string()).default([]),
      cover: s.string().optional(),
      reading_time: s.number().optional(),
      faq: s.array(s.object({ q: s.string(), a: s.string() })).default([]),
      schema_extra: s.record(s.string(), s.any()).optional(),
      pipeline_article_id: s.number(),
      // rehype-slug + autolink: заголовки статьи получают id и кликабельный якорь (#).
      body: s.mdx({
        rehypePlugins: [
          rehypeArticleBody,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: "heading-anchor" } }],
        ],
      }),
    })
    .transform((data) => ({ ...data, url: `/blog/${data.slug}` })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { items, articles },
});
