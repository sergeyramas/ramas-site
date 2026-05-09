import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { MDXContent } from "@/components/MDXContent";
import { bySlug, allSlugs } from "@/lib/content";
import Link from "next/link";

export function generateStaticParams() {
  return allSlugs("solution").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = bySlug("solution", slug);
  if (!item) return {};
  return { title: item.title, description: item.summary };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = bySlug("solution", slug);
  if (!item) notFound();

  const hasBody = item.body && item.body.trim().length > 0;

  return (
    <article className="max-w-3xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 pb-24">
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
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rise rise-3 mt-10 group flex items-center justify-between gap-4 p-6 bg-card hover:bg-elevated rounded-2xl border border-border hover:border-accent transition-all"
        >
          <div className="flex flex-col gap-1">
            <span className="eyebrow">Полный гайд</span>
            <span className="font-medium text-base sm:text-lg">
              {new URL(item.externalUrl).hostname.replace(/^www\./, "")}
              <span className="text-muted"> {new URL(item.externalUrl).pathname.replace(/\/$/, "")}</span>
            </span>
          </div>
          <ArrowUpRight
            aria-hidden
            className="w-5 h-5 text-muted group-hover:text-accent shrink-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.5}
          />
        </a>
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
