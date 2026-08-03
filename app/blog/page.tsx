import Link from "next/link";
import { articles } from "#site/content";

export const metadata = {
  title: "Блог",
  description: "Статьи о ИИ-агентах, автоматизации и SEO — что строю и как это работает.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = [...articles].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 pb-24">
      <header className="rise rise-1 border-b border-border pb-10">
        <p className="eyebrow">Блог</p>
        <h1 className="display mt-4 text-4xl sm:text-6xl">Статьи</h1>
      </header>

      <ul className="rise rise-2 mt-12 space-y-10">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
                {post.date}
                {post.reading_time ? ` · ${post.reading_time} мин` : ""}
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="mt-3 text-muted leading-relaxed">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      {posts.length === 0 && <p className="mt-12 text-muted">Пока пусто.</p>}
    </div>
  );
}
