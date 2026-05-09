"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export function FeaturedHeader() {
  const t = useT();
  return (
    <div className="flex items-end justify-between mb-8">
      <p className="eyebrow">{t("home.featured")} · Featured</p>
      <Link
        href="/solutions"
        className="font-mono text-xs text-subtle hover:text-accent transition-colors"
      >
        {t("home.all")}
      </Link>
    </div>
  );
}
