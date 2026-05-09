"use client";

import { useLang } from "@/lib/i18n";

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "ru" ? "en" : "ru")}
      aria-label={lang === "ru" ? "Switch to English" : "Переключить на русский"}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider border border-border hover:border-accent hover:bg-elevated transition-colors min-w-[58px] justify-center"
    >
      <span className={lang === "en" ? "text-accent font-bold" : "text-muted"}>EN</span>
      <span aria-hidden className="text-subtle">·</span>
      <span className={lang === "ru" ? "text-accent font-bold" : "text-muted"}>RU</span>
    </button>
  );
}
