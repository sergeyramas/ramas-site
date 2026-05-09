"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

interface HomeSectionsProps {
  counts: { solution: number; project: number; idea: number };
}

export function HomeSections({ counts }: HomeSectionsProps) {
  const t = useT();
  const sections = [
    {
      kind: "solution" as const,
      title: t("nav.solutions"),
      href: "/solutions",
      desc: t("home.solutions.desc"),
    },
    {
      kind: "project" as const,
      title: t("nav.projects"),
      href: "/projects",
      desc: t("home.projects.desc"),
    },
    {
      kind: "idea" as const,
      title: t("nav.ideas"),
      href: "/ideas",
      desc: t("home.ideas.desc"),
    },
  ];

  return (
    <>
      <p className="eyebrow mb-8">{t("home.browse")}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
        {sections.map((s, i) => {
          const count = counts[s.kind];
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
                {t("home.open")}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
