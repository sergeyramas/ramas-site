import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/MDXContent";
import { ArticleCover } from "@/components/ArticleCover";
import { ArticleGrid } from "@/components/ArticleGrid";
import { articles } from "#site/content";
import { FaqAnswer } from "@/components/FaqAnswer";
import { htmlToText } from "@/lib/faq";
import { relatedArticles, formatDate, coverFor, authorName, absoluteAsset, PUBLIC_AUTHOR, SITE_ORIGIN } from "@/lib/blog";

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
  const image = coverFor(post) ?? "/og-default.png";
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
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = bySlug(slug);
  if (!post) notFound();

  const name = authorName(post.author.name);
  const image = absoluteAsset(coverFor(post));
  // schema_extra.breadcrumb / person не раскладываем в Article: конвейер кладёт
  // массив строк и вложенный Person, для Article это невалидные поля.
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated,
      author: {
        "@type": "Person",
        name,
        url: post.author.url ?? `${SITE_ORIGIN}/about`,
        ...(post.author.photo_url ? { image: post.author.photo_url } : {}),
      },
      publisher: {
        "@type": "Organization",
        name: PUBLIC_AUTHOR,
        url: SITE_ORIGIN,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_ORIGIN}/og-default.png`,
        },
      },
      ...(image ? { image: [image] } : {}),
      mainEntityOfPage: { "@type": "WebPage", "@id": post.canonical_url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Блог", item: `${SITE_ORIGIN}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: post.canonical_url },
      ],
    },
  ];
  if (post.faq.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: htmlToText(f.a) },
      })),
    });
  }

  const related = relatedArticles(post, 3);

  return (
    <article className="pt-12 sm:pt-16 pb-24">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <Link
          href="/blog"
          className="rise rise-1 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
        >
          <span>←</span>
          <span>Блог</span>
        </Link>

        <div className="rise rise-2 relative mt-8 aspect-[16/8] overflow-hidden rounded-2xl bg-bg">
          <ArticleCover article={post} priority sizes="(min-width: 1024px) 768px, 100vw" />
        </div>

        <header className="rise rise-3 mt-10 border-b border-border pb-10">
          <h1 className="display text-4xl sm:text-6xl">{post.title}</h1>
          <p className="eyebrow mt-5">
            {formatDate(post.date)}
            {post.reading_time ? ` · ${post.reading_time} мин чтения` : ""}
            {" · "}
            {post.author.url ? (
              <Link href={post.author.url} className="hover:text-accent">
                {name}
              </Link>
            ) : (
              name
            )}
          </p>
          <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
            {post.description}
          </p>
        </header>

        <div className="rise rise-4 article-body prose mt-16">
          <MDXContent code={post.body} />
        </div>

        {post.faq.length > 0 && (
          <section className="rise rise-4 mt-16 border-t border-border pt-10">
            <h2 className="text-2xl">Вопросы и ответы</h2>
            <dl className="mt-6 space-y-4">
              {post.faq.map((f) => (
                <div key={f.q} className="bg-card border border-border rounded-xl p-5 sm:p-6">
                  <dt className="font-medium">{f.q}</dt>
                  <FaqAnswer answer={f.a} />
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="mt-20 border-t border-border pt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
          >
            <span>←</span>
            <span>Все статьи</span>
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 sm:px-8 mt-10">
          <p className="eyebrow">Читайте также</p>
          <div className="mt-6">
            <ArticleGrid articles={related} />
          </div>
        </div>
      )}
    </article>
  );
}
