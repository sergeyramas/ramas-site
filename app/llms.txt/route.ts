import { allArticles, SITE_ORIGIN } from "@/lib/blog";

export const dynamic = "force-static";

export function GET() {
  const pages = [
    ["Главная", `${SITE_ORIGIN}/`, "Хаб Сергея Рамаса: решения, проекты, идеи."],
    ["Блог", `${SITE_ORIGIN}/blog`, "Статьи об инфраструктуре, SEO и агентных системах."],
    ["Solutions", `${SITE_ORIGIN}/solutions`, "Упакованные гайды, скиллы и скрипты."],
    ["Projects", `${SITE_ORIGIN}/projects`, "Живые сайты и продукты."],
    ["Ideas", `${SITE_ORIGIN}/ideas`, "Задумки, открытые к обсуждению."],
    ["Обо мне", `${SITE_ORIGIN}/about`, "Кто такой Сергей Рамас и чем занимается."],
  ];

  const articles = allArticles().map(
    (article) =>
      `- [${article.title}](${SITE_ORIGIN}/blog/${article.slug}): ${article.description.replace(/\s+/g, " ").trim()}`,
  );

  const body = `# Сергей Рамас

> Личный сайт-хаб: решения, проекты и блог. Публичное имя автора — Сергей Рамас.

## Key pages

${pages.map(([title, url, note]) => `- [${title}](${url}): ${note}`).join("\n")}

## Articles

${articles.join("\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
