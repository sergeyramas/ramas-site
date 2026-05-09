import { allByKind } from "@/lib/content";
import { FilteredGrid } from "@/components/FilteredGrid";
import { PageHeader } from "@/components/PageHeader";

export const metadata = {
  title: "Ideas",
  alternates: { canonical: "/ideas" },
  keywords: ["идеи", "AI стартапы", "продуктовые идеи", "Сергей Рамас"],
};

export default function IdeasPage() {
  const items = allByKind("idea");
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 pb-24">
      <PageHeader
        eyebrow="Ideas · wishlist"
        title="Что хочется сделать."
        subtitle="Список идей, которые ждут своей очереди. Если что-то откликается и хочется обсудить — пишите."
        count={items.length}
      />
      <FilteredGrid items={items} dense />
    </div>
  );
}
