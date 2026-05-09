import Link from "next/link";

export function ContactCTA() {
  return (
    <section className="relative z-10 border-t border-border mt-32">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <p className="eyebrow">Связь · кратко и по делу</p>

        <div className="mt-6 grid gap-10 md:grid-cols-[1.4fr_1fr] items-end">
          <h2 className="display text-3xl sm:text-5xl leading-tight max-w-2xl">
            Понравилось — забирай <span className="display-italic text-accent">в Telegram</span>.
            Хочешь увидеть всё сразу — на главную.
          </h2>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:gap-4">
            <Link
              href="https://t.me/Sergeyramas"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn justify-between"
            >
              <span className="bolt" aria-hidden>✦</span>
              <span>tg @Sergeyramas</span>
              <span aria-hidden>↗</span>
            </Link>
            <Link
              href="/"
              className="cta-btn justify-between"
            >
              <span className="bolt" aria-hidden>◆</span>
              <span>На главную · sergeyramas.vercel.app</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
