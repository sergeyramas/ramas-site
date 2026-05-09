import Link from "next/link";

export function Hero() {
  return (
    <section className="py-16 sm:py-24 max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Сергей Рамас</p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-medium leading-[1.1] tracking-tight">
        AI-операционные системы, лендинги, автоматизация продаж.
      </h1>
      <p className="mt-6 text-lg text-muted leading-relaxed">
        Веду агентство: Яндекс.Директ, сайты, внедрение ИИ. Дроп-шиппинг на eBay (US).
        Здесь — мои упакованные решения, живые проекты и идеи в работе.
      </p>
      <div className="mt-8 flex gap-6 text-sm">
        <Link href="/solutions" className="hover:text-accent">Solutions →</Link>
        <Link href="/projects" className="hover:text-accent">Projects →</Link>
        <Link href="/ideas" className="hover:text-accent">Ideas →</Link>
      </div>
    </section>
  );
}
