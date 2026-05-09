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
  return { title: item.title, description: item.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = bySlug("project", slug);
  if (!item || item.isExternal) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
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
