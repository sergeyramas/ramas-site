import { notFound } from "next/navigation";
import { MDXContent } from "@/components/MDXContent";
import { ExternalPreview } from "@/components/ExternalPreview";
import { bySlug, allSlugs } from "@/lib/content";
import Link from "next/link";

export function generateStaticParams() {
  return allSlugs("solution").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = bySlug("solution", slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    keywords: item.tags,
    alternates: { canonical: `/solutions/${item.slug}` },
    openGraph: {
      title: item.title,
      description: item.summary,
      type: "article",
      publishedTime: new Date(item.date).toISOString(),
      images: item.cover ? [{ url: item.cover }] : undefined,
    },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = bySlug("solution", slug);
  if (!item) notFound();

  const hasBody = item.body && item.body.trim().length > 0;

  return (
    <article className="max-w-3xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: item.title,
            description: item.summary,
            datePublished: new Date(item.date).toISOString(),
            author: {
              "@type": "Person",
              name: "Сергей Рамас",
              url: "https://sergeyramas.vercel.app/about",
            },
            image: item.cover ? `https://sergeyramas.vercel.app${item.cover}` : "https://sergeyramas.vercel.app/og-default.png",
            mainEntityOfPage: `https://sergeyramas.vercel.app/solutions/${item.slug}`,
          }),
        }}
      />
      <Link
        href="/solutions"
        className="rise rise-1 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
      >
        <span>←</span>
        <span>Solutions</span>
      </Link>

      <header className="rise rise-2 mt-8 border-b border-border pb-10">
        <p className="eyebrow">
          Solution · {item.status === "live" ? "Live" : item.status}
        </p>
        <h1 className="display mt-4 text-4xl sm:text-6xl">{item.title}</h1>
        <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
          {item.summary}
        </p>
        {item.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1">
            {item.tags.map((t) => (
              <li key={t} className="font-mono text-[11px] tracking-wider text-subtle uppercase">
                {t}
              </li>
            ))}
          </ul>
        )}
      </header>

      {item.externalUrl && (
        <ExternalPreview url={item.externalUrl} preview={item.preview ?? null} />
      )}

      {hasBody && (
        <div className="rise rise-4 step-doc mt-16">
          <MDXContent code={item.body} />
        </div>
      )}

      {!hasBody && !item.externalUrl && (
        <p className="mt-10 text-muted">Скоро появится подробное описание.</p>
      )}
    </article>
  );
}
