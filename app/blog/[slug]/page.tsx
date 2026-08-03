import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/MDXContent";
import { articles } from "#site/content";

function bySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = bySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: post.canonical_url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = bySlug(slug);
  if (!post) notFound();

  // JSON-LD: Article всегда, FAQPage — только если во frontmatter есть вопросы.
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated,
      author: { "@type": "Person", name: post.author.name, url: post.author.url },
      mainEntityOfPage: post.canonical_url,
      ...post.schema_extra,
    },
  ];
  if (post.faq.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <article className="max-w-3xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 pb-24">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Link
        href="/blog"
        className="rise rise-1 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
      >
        <span>←</span>
        <span>Блог</span>
      </Link>

      <header className="rise rise-2 mt-8 border-b border-border pb-10">
        <p className="eyebrow">
          {post.date}
          {post.reading_time ? ` · ${post.reading_time} мин` : ""}
        </p>
        <h1 className="display mt-4 text-4xl sm:text-6xl">{post.title}</h1>
        <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
          {post.description}
        </p>
      </header>

      <div className="rise rise-4 step-doc mt-16">
        <MDXContent code={post.body} />
      </div>

      {post.faq.length > 0 && (
        <section className="rise rise-4 mt-16 border-t border-border pt-10">
          <h2 className="text-2xl">Вопросы и ответы</h2>
          <dl className="mt-6 space-y-6">
            {post.faq.map((f) => (
              <div key={f.q}>
                <dt className="font-medium">{f.q}</dt>
                <dd className="mt-2 text-muted leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}
