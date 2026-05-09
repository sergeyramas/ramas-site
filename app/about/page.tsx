import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16 prose prose-neutral dark:prose-invert">
      <h1>Сергей Рамас</h1>
      <p className="text-muted">UTC+3</p>

      <h2>Агентство</h2>
      <p>
        Веду агентство по Яндекс.Директу, разработке сайтов и внедрению AI-систем в
        бизнес-процессы. Под капотом — собственная связка из мульти-агентных систем,
        которые закрывают рутину быстрее людей.
      </p>

      <h2>Свои продукты</h2>
      <p>
        <Link href="https://betaline-ai.ru">BetaLine AI</Link> — Telegram-бот + CRM + веб-чат.{" "}
        <Link href="https://fundament21.vercel.app">Fundament21</Link> — миграция e-commerce на
        Next.js+Directus.{" "}
        <Link href="https://piratebay-landing.vercel.app">PiratEBay</Link> — SaaS-лендинг для
        eBay-агентов.
      </p>

      <h2>eBay</h2>
      <p>
        Делаю reseller-бизнес в США (GE1+PE12 stores), полностью автоматизированный:
        closing, purchasing, tracking, мониторинг цен и стока.
      </p>

      <h2>AI-стек</h2>
      <p>
        OpenClaw (autonomous agent на VPS) + ClaudeClaw (backup на Mac). Память построена
        по паттерну Karpathy LLM Wiki — мои инструменты для этого тоже здесь, в разделе
        Solutions.
      </p>

      <h2>Вне работы</h2>
      <p>Путешествия, йога, гири, велоспорт. Прошёл полумарафон на Филиппинах.</p>

      <h2>Контакты</h2>
      <p>
        <Link href="https://github.com/sergeyramas">GitHub</Link> ·{" "}
        <Link href="mailto:fantroms@gmail.com">fantroms@gmail.com</Link>
      </p>
    </article>
  );
}
