export function PageHeader({
  eyebrow,
  title,
  subtitle,
  count,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  count?: number;
}) {
  return (
    <header className="mb-14 sm:mb-20 border-b border-border pb-10 sm:pb-14">
      <div className="flex items-end justify-between gap-6">
        {eyebrow && <p className="eyebrow rise rise-1">{eyebrow}</p>}
        {typeof count === "number" && (
          <span className="eyebrow rise rise-1">
            <span className="text-fg">{String(count).padStart(2, "0")}</span>
            <span className="text-subtle"> / total</span>
          </span>
        )}
      </div>
      <h1 className="display rise rise-2 mt-5 text-5xl sm:text-7xl">{title}</h1>
      {subtitle && (
        <p className="rise rise-3 mt-6 max-w-2xl text-base sm:text-lg text-muted leading-relaxed">{subtitle}</p>
      )}
    </header>
  );
}
