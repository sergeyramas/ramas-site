import { allByKind } from "@/lib/content";
import { FilteredGrid } from "@/components/FilteredGrid";
import { PageHeader } from "@/components/PageHeader";

export const metadata = {
  title: "Solutions",
  alternates: { canonical: "/solutions" },
  keywords: ["solutions", "гайды", "Claude Code скиллы", "AI автоматизация", "Сергей Рамас"],
};

export default function SolutionsPage() {
  const items = allByKind("solution");
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 pb-24">
      <PageHeader
        eyebrow="Solutions · упакованные знания"
        title="Решения, которые можно унести с собой."
        subtitle="Гайды, скиллы для Claude Code, шаблоны и скрипты. Часть открывается прямо здесь, часть — на GitHub Pages в виде отдельных туториалов."
        count={items.length}
      />
      <FilteredGrid items={items} />
    </div>
  );
}
