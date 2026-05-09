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

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { items },
});
