import Link from "next/link";
import { Reveal } from "./Reveal";
import { ArticleCover } from "./ArticleCover";
import { formatDate, type Article } from "@/lib/blog";

export function ArticleCard({ article, delay = 0 }: { article: Article; delay?: number }) {
  return (
    <Reveal as="li" delay={delay}>
      <Link href={`/blog/${article.slug}`} className="group block h-full">
        <article className="edge h-full bg-card rounded-xl transition-all duration-300 group-hover:bg-elevated group-hover:-translate-y-0.5">
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-bg">
            <ArticleCover article={article} />
          </div>
          <div className="p-6 sm:p-7">
            <p className="eyebrow">
              {formatDate(article.date)}
              {article.reading_time ? ` · ${article.reading_time} мин чтения` : ""}
            </p>
            <h3 className="mt-3 text-lg sm:text-xl font-medium leading-snug tracking-tight group-hover:text-accent transition-colors">
              {article.title}
            </h3>
            <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-3">{article.description}</p>
            {article.tags.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1">
                {article.tags.slice(0, 4).map((t) => (
                  <li key={t} className="font-mono text-[11px] tracking-wider text-subtle uppercase">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      </Link>
    </Reveal>
  );
}
