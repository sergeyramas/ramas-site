import { allByKind } from "@/lib/content";
import { Grid } from "@/components/Grid";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Ideas" };

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
      <Grid items={items} dense />
    </div>
  );
}
