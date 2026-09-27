import { allArticles, SITE_ORIGIN } from "@/lib/blog";

function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const dynamic = "force-static";

export function GET() {
  const items = allArticles()
    .map((article) => {
      const link = `${SITE_ORIGIN}/blog/${article.slug}`;
      return `    <item>
      <title>${xml(article.title)}</title>
      <link>${xml(link)}</link>
      <guid isPermaLink="true">${xml(link)}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <description>${xml(article.description)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Блог — Сергей Рамас</title>
    <link>${SITE_ORIGIN}/blog</link>
    <description>Статьи о хостинге, инфраструктуре, автоматизации и ИИ-агентах.</description>
    <language>ru</language>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
