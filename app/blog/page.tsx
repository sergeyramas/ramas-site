import { allArticles } from "@/lib/blog";
import { ArticleGrid } from "@/components/ArticleGrid";
import { PageHeader } from "@/components/PageHeader";

export const metadata = {
  title: "Блог",
  description: "Статьи о ИИ-агентах, автоматизации и SEO — что строю и как это работает.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = allArticles();

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 pb-24">
      <PageHeader
        eyebrow="Блог"
        title="Заметки из мастерской."
        subtitle="Как устроены агентные конвейеры, инфраструктура и автоматизация — разборы того, что реально запущено и работает."
        count={posts.length}
      />
      <ArticleGrid articles={posts} />
    </div>
  );
}
