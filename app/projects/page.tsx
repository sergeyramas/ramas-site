import { allByKind } from "@/lib/content";
import { Grid } from "@/components/Grid";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  const items = allByKind("project");
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <PageHeader
        title="Projects"
        subtitle="Живые сайты и продукты, которые я веду или сделал."
      />
      <Grid items={items} />
    </div>
  );
}
