import { notFound } from "next/navigation";
import { NewsIssueLayout } from "@/components/NewsIssueLayout";
import { allIssues } from "@/lib/news";

export const metadata = {
  title: "Новости",
  description:
    "Ежедневная сводка: искусственный интеллект, криптовалюты и главное в мире — одна страница, три колонки, только суть.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "Сводка дня · Сергей Рамас",
    description: "ИИ, криптовалюты и главное в мире — ежедневная сводка.",
    type: "website",
  },
};

export default function NewsPage() {
  const issues = allIssues();
  const latest = issues[0];
  if (!latest) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-14 sm:px-8 sm:pt-20">
      <NewsIssueLayout issue={latest} archive={issues} />
    </div>
  );
}
