import type { Article } from "@/lib/blog";
import { ArticleCard } from "./ArticleCard";

export function ArticleGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return <p className="text-muted">Пока пусто. Скоро появится.</p>;
  }
  return (
    <ul className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <ArticleCard key={article.slug} article={article} delay={Math.min(i * 60, 480)} />
      ))}
    </ul>
  );
}
