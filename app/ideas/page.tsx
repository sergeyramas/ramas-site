import { allByKind } from "@/lib/content";
import { Grid } from "@/components/Grid";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Ideas" };

export default function IdeasPage() {
  const items = allByKind("idea");
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <PageHeader
        title="Ideas"
        subtitle="Что хочется сделать. Wishlist, открытый для обсуждения."
      />
      <Grid items={items} dense />
    </div>
  );
}
