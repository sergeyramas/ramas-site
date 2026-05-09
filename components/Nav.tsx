import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/solutions", label: "Solutions" },
  { href: "/projects", label: "Projects" },
  { href: "/ideas", label: "Ideas" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-bg/75 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm tracking-tight hover:text-accent transition-colors"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-accent" />
          ramas
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
          <span className="ml-1 sm:ml-2">
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}
