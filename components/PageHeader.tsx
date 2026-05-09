export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-10">
      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">{title}</h1>
      {subtitle && <p className="mt-3 text-muted max-w-2xl">{subtitle}</p>}
    </header>
  );
}
