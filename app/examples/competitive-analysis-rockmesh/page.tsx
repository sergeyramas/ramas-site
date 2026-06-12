import Link from "next/link";

export const metadata = {
  title: "GAP-анализ ниши · ROCKMESH",
  description:
    "Живой пример: конкурентная разведка и GAP-анализ ниши «стеклопластиковая сетка» (ROCKMESH) — SERP, скоринг конкурентов, боли покупателей и карта пробелов.",
  alternates: { canonical: "/examples/competitive-analysis-rockmesh" },
  robots: { index: false },
};

export default function CompetitiveAnalysisExamplePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
      <Link
        href="/solutions/competitive-intel-to-html"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
      >
        <span aria-hidden>←</span>
        <span>Назад к статье</span>
      </Link>

      <header className="mt-6 mb-6">
        <p className="eyebrow">Пример · GAP-анализ</p>
        <h1 className="display mt-3 text-2xl sm:text-4xl">
          Конкурентная разведка ниши · ROCKMESH
        </h1>
      </header>

      <div className="edge overflow-hidden rounded-2xl bg-card">
        <iframe
          src="/examples/competitive-analysis-rockmesh.html"
          title="GAP-анализ ниши «стеклопластиковая сетка» — ROCKMESH"
          className="w-full block"
          style={{ height: "calc(100vh - 9rem)", minHeight: "640px", border: "0" }}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link
          href="/solutions/competitive-intel-to-html"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
        >
          <span aria-hidden>←</span>
          <span>Назад к статье</span>
        </Link>
        <a
          href="/examples/competitive-analysis-rockmesh.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
        >
          <span>Открыть в полном окне</span>
          <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );
}
