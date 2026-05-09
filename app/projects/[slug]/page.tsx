import { notFound } from "next/navigation";
import { MDXContent } from "@/components/MDXContent";
import { bySlug, allInternalSlugs } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";

export function generateStaticParams() {
  return allInternalSlugs("project").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = bySlug("project", slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    keywords: item.tags,
    alternates: { canonical: `/projects/${item.slug}` },
    openGraph: {
      title: item.title,
      description: item.summary,
      type: "article",
      publishedTime: new Date(item.date).toISOString(),
      images: item.cover ? [{ url: item.cover }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = bySlug("project", slug);
  if (!item || item.isExternal) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
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
            mainEntityOfPage: `https://sergeyramas.vercel.app/projects/${item.slug}`,
          }),
        }}
      />
      <Link href="/projects" className="font-mono text-xs uppercase tracking-widest text-muted hover:text-accent">
        ← Projects
      </Link>
      <PageHeader title={item.title} subtitle={item.summary} />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent code={item.body} />
      </div>
    </article>
  );
}
