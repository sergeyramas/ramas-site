import type { MetadataRoute } from "next";
import { items } from "#site/content";

const BASE = "https://sergeyramas.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const fixed: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,          changeFrequency: "weekly",  priority: 1.0, lastModified: now },
    { url: `${BASE}/solutions`, changeFrequency: "weekly",  priority: 0.8, lastModified: now },
    { url: `${BASE}/projects`,  changeFrequency: "weekly",  priority: 0.8, lastModified: now },
    { url: `${BASE}/ideas`,     changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${BASE}/about`,     changeFrequency: "monthly", priority: 0.7, lastModified: now },
  ];

  // Dynamic pages: every solution gets its own URL (all of them have an internal page),
  // and every project too. Skip ideas — there are no /ideas/[slug] routes.
  const dynamic: MetadataRoute.Sitemap = items
    .filter((i) => i.kind === "solution" || i.kind === "project")
    .map((i) => ({
      url: `${BASE}/${i.kind}s/${i.slug}`,
      lastModified: new Date(i.date),
      changeFrequency: "monthly" as const,
      priority: i.featured ? 0.7 : 0.5,
    }));

  return [...fixed, ...dynamic];
}
