import { allByKind } from "@/lib/content";
import { Grid } from "@/components/Grid";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Solutions" };

export default function SolutionsPage() {
  const items = allByKind("solution");
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <PageHeader
        title="Solutions"
        subtitle="Упакованные гайды, скиллы и скрипты. Что-то ведёт на GitHub Pages, что-то открывается прямо здесь."
      />
      <Grid items={items} />
    </div>
  );
}
