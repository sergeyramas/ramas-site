import Link from "next/link";
import { allByKind } from "@/lib/content";
import { FilteredGrid } from "@/components/FilteredGrid";
import { PageHeader } from "@/components/PageHeader";

export const metadata = {
  title: "Projects",
  alternates: { canonical: "/projects" },
  keywords: ["проекты", "AI продукты", "Next.js проекты", "BetaLine", "PiratEBay", "Сергей Рамас"],
};

export default function ProjectsPage() {
  const items = allByKind("project");
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 pb-24">
      <PageHeader
        eyebrow="Projects · в работе и в живом эфире"
        title="Сайты и продукты, которые я веду."
        subtitle="Что-то — под клиентов агентства. Что-то — мои собственные продукты, на которых учусь и зарабатываю."
        count={items.length}
      />
      <Link
        href="/collections/gap-to-launch"
        className="mb-10 sm:mb-14 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent hover:opacity-80 transition-opacity"
      >
        Подборка · От GAP-анализа до супер-сайта: как взрываем нишу
        <span aria-hidden>→</span>
      </Link>
      <FilteredGrid items={items} />
    </div>
  );
}
