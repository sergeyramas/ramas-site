import { featured, allByKind } from "@/lib/content";
import { Hero } from "@/components/Hero";
import { FeaturedBento } from "@/components/Grid";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";

const sections = [
  {
    kind: "solution" as const,
    title: "Solutions",
    href: "/solutions",
    desc: "Упакованные гайды, скиллы и скрипты — то, что можно унести в свой проект уже сегодня.",
  },
  {
    kind: "project" as const,
    title: "Projects",
    href: "/projects",
    desc: "Живые сайты и продукты. Что-то под клиентов, что-то моё собственное.",
  },
  {
    kind: "idea" as const,
    title: "Ideas",
    href: "/ideas",
    desc: "Что хочется сделать, но руки пока не дошли. Открыто к обсуждению.",
  },
];

export default function HomePage() {
  const featuredItems = featured(4);

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8">
      <Hero />

      {featuredItems.length > 0 && (
        <Reveal as="section" delay={100} className="mt-12">
          <div className="flex items-end justify-between mb-8">
            <p className="eyebrow">Featured · избранное</p>
            <Link href="/solutions" className="font-mono text-xs text-subtle hover:text-accent transition-colors">
              all →
            </Link>
          </div>
          <FeaturedBento items={featuredItems} />
        </Reveal>
      )}

      <Reveal as="section" delay={150} className="mt-32 sm:mt-40">
        <p className="eyebrow mb-8">Browse by kind</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {sections.map((s, i) => {
            const count = allByKind(s.kind).length;
            return (
              <Link
                key={s.kind}
                href={s.href}
                className={`group block bg-card hover:bg-elevated p-8 sm:p-10 transition-colors rise rise-${i + 1}`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="display text-3xl sm:text-4xl">{s.title}</h3>
                  <span className="font-mono text-sm text-subtle group-hover:text-accent transition-colors">
                    {String(count).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-4 text-sm text-muted leading-relaxed">{s.desc}</p>
                <p className="mt-10 font-mono text-xs uppercase tracking-widest text-accent inline-flex items-center gap-2">
                  Открыть
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
