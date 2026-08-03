import { defineConfig, defineCollection, s } from "velite";

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
      body: s.mdx(),
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
