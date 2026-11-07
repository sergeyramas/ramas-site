import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsIssueLayout } from "@/components/NewsIssueLayout";
import { allIssues, issueByDate, issueDateParts } from "@/lib/news";

export function generateStaticParams() {
  return allIssues().map((i) => ({ date: i.date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const issue = issueByDate(date);
  if (!issue) return {};
  const d = issueDateParts(issue.date);
  return {
    title: `Сводка дня — ${d.long}`,
    description: issue.standfirst ?? "Ежедневная сводка: ИИ, криптовалюты и главное в мире.",
    alternates: { canonical: `/news/${issue.date}` },
    openGraph: {
      title: `Сводка дня — ${d.long}`,
      description: issue.standfirst ?? "ИИ, криптовалюты и главное в мире.",
      type: "article",
      publishedTime: `${issue.date}T08:00:00+03:00`,
    },
  };
}

export default async function NewsIssuePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const issue = issueByDate(date);
  if (!issue) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-10 sm:px-8 sm:pt-14">
      <Link
        href="/news"
        className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-fg"
      >
        ← Свежий выпуск
      </Link>
      <NewsIssueLayout issue={issue} archive={allIssues()} />
    </div>
  );
}
