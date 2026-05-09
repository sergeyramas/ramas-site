import { featured, allByKind } from "@/lib/content";
import { Hero } from "@/components/Hero";
import { Grid } from "@/components/Grid";
import Link from "next/link";

export default function HomePage() {
  const featuredItems = featured(4);
  const sections = [
    { kind: "solution", title: "Solutions", href: "/solutions", desc: "Упакованные гайды, скиллы, скрипты." },
    { kind: "project", title: "Projects", href: "/projects", desc: "Живые сайты и продукты." },
    { kind: "idea", title: "Ideas", href: "/ideas", desc: "Что хочется сделать." },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto px-6">
      <Hero />

      {featuredItems.length > 0 && (
        <section className="mt-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">Featured</h2>
          <div className="mt-6">
            <Grid items={featuredItems} />
          </div>
        </section>
      )}

      <section className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {sections.map((s) => {
          const count = allByKind(s.kind).length;
          return (
            <Link
              key={s.kind}
              href={s.href}
              className="block border border-border rounded-lg p-6 hover:border-accent transition-colors"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-medium">{s.title}</h3>
                <span className="font-mono text-sm text-muted">{count}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{s.desc}</p>
              <p className="mt-6 text-sm text-accent">Все →</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
