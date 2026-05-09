"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";
import { useT } from "@/lib/i18n";

export function Nav() {
  const t = useT();
  const links = [
    { href: "/solutions", label: t("nav.solutions") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/ideas", label: t("nav.ideas") },
    { href: "/about", label: t("nav.about") },
  ];

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-bg/75 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between gap-3">
        {/* BIG LOGO */}
        <Link
          href="/"
          aria-label="Ramas — главная"
          className="group flex items-baseline gap-3 hover:opacity-90 transition-opacity"
        >
          <span
            aria-hidden
            className="inline-block w-2.5 h-2.5 rounded-full bg-accent translate-y-[-3px] group-hover:scale-125 transition-transform"
          />
          <span className="display text-3xl sm:text-4xl tracking-[-0.04em] leading-none">
            ramas
          </span>
          <span
            aria-hidden
            className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.22em] text-subtle pb-[2px]"
          >
            ai · hub
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hidden sm:inline-block px-3 py-1.5 rounded-md text-sm text-muted hover:text-fg hover:bg-elevated transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="https://t.me/Sergeyramas"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider text-fg border border-border hover:border-accent hover:text-accent hover:bg-elevated transition-colors"
          >
            <span aria-hidden>tg</span>
            <span className="hidden sm:inline">@Sergeyramas</span>
          </Link>
          <span className="ml-1">
            <LangToggle />
          </span>
          <span className="ml-1">
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}
