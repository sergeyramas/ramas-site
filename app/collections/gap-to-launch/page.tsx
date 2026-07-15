import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { allByKind } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export const metadata = {
  title: "От GAP-анализа до супер-сайта",
  description:
    "Как я взрываю нишу клиента: рисёрч болей покупателей, GAP-анализ конкурентов и сайт, который закрывает то, что не закрыли остальные. Кейсы ROCKMESH, Fundament21, Логика ИТП.",
  alternates: { canonical: "/collections/gap-to-launch" },
  keywords: ["GAP-анализ", "pain-driven", "конкурентная разведка", "лендинг", "Сергей Рамас"],
};

const TAG = "gap-to-launch";

type ArtifactLink = { label: string; href: string; external: boolean };

const EXTRAS: Record<string, { note: string; links: ArtifactLink[] }> = {
  "rockmesh": {
    note: "6 закрытых пробелов конкурентов → карточка товара переписана под возражения покупателя, а не под каталожный шаблон.",
    links: [
      { label: "Сайт-результат", href: "https://setka-rockmesh.vercel.app", external: true },
      { label: "GAP-анализ ниши", href: "/examples/competitive-analysis-rockmesh", external: false },
    ],
  },
  "fundament21": {
    note: "3929 товаров переехали с Pulscen на Next.js + Directus — структура каталога собрана вокруг болей B2B-закупщика, а не вокруг остатков склада.",
    links: [
      { label: "Сайт-результат", href: "https://fundament21.vercel.app", external: true },
      { label: "GAP-анализ ниши", href: "/examples/competitive-analysis-fundament21", external: false },
    ],
  },
  "logika-itp": {
    note: "От боли «непонятно, что вообще входит в обслуживание ИТП» — к интерактивному прототипу сервиса и прототипу сайта, который отвечает на этот вопрос с первого экрана.",
    links: [
      { label: "GAP-анализ ниши", href: "https://logika-itp-gap-analysis.vercel.app", external: true },
      { label: "Интерактивный прототип сервиса", href: "https://logika-itp-demo.vercel.app", external: true },
      { label: "Прототип сайта", href: "https://logika-itp-gap-analysis.vercel.app/proto-a.html", external: true },
    ],
  },
};

function ArtifactLinkRow({ links }: { links: ArtifactLink[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
      {links.map((l) => (
        <li key={l.href}>
          {l.external ? (
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
            >
              {l.label}
              <ArrowUpRight aria-hidden className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          ) : (
            <Link
              href={l.href}
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
            >
              {l.label}
              <span aria-hidden>→</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function GapToLaunchPage() {
  const items = allByKind("project").filter((i) => i.tags.includes(TAG));

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 pb-24">
      <PageHeader
        eyebrow="Подборка · разобранные проекты"
        title="От GAP-анализа до супер-сайта: как взрываем нишу."
        subtitle="Не бриф, а рисёрч: собираю дословные боли покупателей из отзывов и форумов, накладываю на то, что уже показывают конкуренты в нише, и вижу пробелы — то, что не закрыл никто. Дальше сайт строится не по вкусу, а по карте этих пробелов: каждая секция закрывает конкретную боль."
        count={items.length}
      />

      <div className="flex flex-col gap-10 sm:gap-14">
        {items.map((item, i) => {
          const extra = EXTRAS[item.slug];
          const isLogika = item.slug === "logika-itp";

          return (
            <Reveal as="article" key={item.slug} delay={Math.min(i * 80, 320)} className="edge rounded-2xl bg-card p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {isLogika ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-bg">
                      <Image
                        src="/covers/projects/logika-before.webp"
                        alt="Логика ИТП — сайт до"
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                      <span className="absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-widest bg-bg/80 text-muted px-2 py-1 rounded">
                        До
                      </span>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-bg">
                      <Image
                        src={item.cover!}
                        alt="Логика ИТП — прототип сайта после"
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                      <span className="absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-widest bg-bg/80 text-accent px-2 py-1 rounded">
                        После
                      </span>
                    </div>
                  </div>
                ) : (
                  item.cover && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-bg">
                      <Image
                        src={item.cover}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )
                )}

                <div>
                  <span className="eyebrow">
                    Project
                    <span className="text-subtle"> · {item.status === "wip" ? "В работе" : "Live"}</span>
                  </span>
                  <h2 className="display mt-3 text-2xl sm:text-3xl">{item.title}</h2>
                  <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">{item.summary}</p>
                  {extra && <p className="mt-3 text-sm text-subtle leading-relaxed">{extra.note}</p>}
                  {extra && <ArtifactLinkRow links={extra.links} />}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
