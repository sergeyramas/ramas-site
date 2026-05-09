import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted">
        <div>© {new Date().getFullYear()} Сергей Рамас</div>
        <div className="flex gap-6">
          <Link href="https://github.com/sergeyramas" className="hover:text-accent">GitHub</Link>
          <Link href="mailto:fantroms@gmail.com" className="hover:text-accent">Email</Link>
        </div>
      </div>
    </footer>
  );
}
