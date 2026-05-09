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
    <header className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm tracking-tight hover:text-accent">
          ramas
        </Link>
        <nav className="flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm hover:text-accent">
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
