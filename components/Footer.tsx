import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
          <div className="flex flex-col gap-3 max-w-sm">
            <p className="eyebrow">Связь</p>
            <p className="text-fg leading-relaxed">
              Пишите по делу:{" "}
              <Link href="mailto:fantroms@gmail.com" className="underline decoration-subtle underline-offset-4 hover:decoration-accent hover:text-accent">
                fantroms@gmail.com
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Каналы</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="https://github.com/sergeyramas" className="hover:text-accent">GitHub</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent">Bio</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Сайт</p>
            <ul className="space-y-1.5">
              <li><Link href="/solutions" className="hover:text-accent">Solutions</Link></li>
              <li><Link href="/projects" className="hover:text-accent">Projects</Link></li>
              <li><Link href="/ideas" className="hover:text-accent">Ideas</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="display select-none leading-[0.85] tracking-tight text-center pb-2"
        style={{
          fontSize: "clamp(72px, 22vw, 320px)",
          color: "var(--border)",
        }}
      >
        ramas
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-muted">
          <div>© {new Date().getFullYear()} Сергей Рамас. Все мысли честно мои.</div>
          <div className="font-mono text-xs text-subtle">
            built with next.js · velite · tailwind
          </div>
        </div>
      </div>
    </footer>
  );
}
