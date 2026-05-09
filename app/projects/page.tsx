import { allByKind } from "@/lib/content";
import { FilteredGrid } from "@/components/FilteredGrid";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Projects" };

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
      <FilteredGrid items={items} />
    </div>
  );
}
