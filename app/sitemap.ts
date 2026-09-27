import type { MetadataRoute } from "next";
import { articles } from "#site/content";
import { allInternalSlugs, allSlugs, bySlug, type Kind } from "@/lib/content";

const BASE = "https://sergeyramas.vercel.app";

function itemPages(kind: Extract<Kind, "solution" | "project">, slugs: string[]): MetadataRoute.Sitemap {
  return slugs.flatMap((slug) => {
    const item = bySlug(kind, slug);
    if (!item) return [];
    return [
      {
        url: `${BASE}/${kind}s/${item.slug}`,
        lastModified: new Date(item.date),
        changeFrequency: "monthly" as const,
        priority: item.featured ? 0.7 : 0.5,
      },
    ];
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const fixed: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,          changeFrequency: "weekly",  priority: 1.0, lastModified: now },
    { url: `${BASE}/solutions`, changeFrequency: "weekly",  priority: 0.8, lastModified: now },
    { url: `${BASE}/projects`,  changeFrequency: "weekly",  priority: 0.8, lastModified: now },
    { url: `${BASE}/collections/gap-to-launch`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${BASE}/gaps`,      changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${BASE}/ideas`,     changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${BASE}/about`,     changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${BASE}/blog`,      changeFrequency: "weekly",  priority: 0.7, lastModified: now },
  ];

  // Статьи конвейера: post_check движка требует, чтобы опубликованный URL был в sitemap.
  const posts: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: new Date(a.updated),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Те же наборы slug, что и generateStaticParams: у каждой solution есть страница,
  // внешние project (externalUrl → isExternal) отдают notFound() и в карту не входят.
  const dynamic: MetadataRoute.Sitemap = [
    ...itemPages("solution", allSlugs("solution")),
    ...itemPages("project", allInternalSlugs("project")),
  ];

  return [...fixed, ...posts, ...dynamic];
}
