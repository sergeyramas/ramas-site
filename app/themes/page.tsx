import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata = { title: "Themes preview" };

type Palette = {
  letter: "A" | "B" | "C";
  name: string;
  desc: string;
  bg: string;
  surface: string;
  card: string;
  text: string;
  muted: string;
  subtle: string;
  border: string;
  accent: string;
  accentSoft: string;
  // Optional separate hero region (for mix variant)
  heroBg: string;
  heroText: string;
  heroMuted: string;
  heroAccent: string;
};

const palettes: Palette[] = [
  {
    letter: "A",
    name: "Лавандовый свет",
    desc: "Светлая база, глубокий violet-600 акцент, лавандовые подложки.",
    bg: "#FAF8FB",
    surface: "#F2EBFE",
    card: "#FFFFFF",
    text: "#1A1429",
    muted: "#605775",
    subtle: "#9088A6",
    border: "#E5DEF1",
    accent: "#7C3AED",
    accentSoft: "#C7B6F5",
    heroBg: "#FAF8FB",
    heroText: "#1A1429",
    heroMuted: "#605775",
    heroAccent: "#7C3AED",
  },
  {
    letter: "B",
    name: "Фиолетовая ночь",
    desc: "Глубокий тёмно-фиолетовый, светлый текст, violet-400 акцент.",
    bg: "#0F0820",
    surface: "#1A0F2E",
    card: "#1F1338",
    text: "#EDE7F8",
    muted: "#9C8FBE",
    subtle: "#6F6489",
    border: "#2A1D45",
    accent: "#A78BFA",
    accentSoft: "#7C3AED",
    heroBg: "#0F0820",
    heroText: "#EDE7F8",
    heroMuted: "#9C8FBE",
    heroAccent: "#A78BFA",
  },
  {
    letter: "C",
    name: "Микс — тёмный hero, светлый низ",
    desc: "Hero — фиолетовая ночь, остальные секции — лавандовый свет.",
    bg: "#FAF8FB",
    surface: "#F2EBFE",
    card: "#FFFFFF",
    text: "#1A1429",
    muted: "#605775",
    subtle: "#9088A6",
    border: "#E5DEF1",
    accent: "#7C3AED",
    accentSoft: "#C7B6F5",
    heroBg: "#0F0820",
    heroText: "#EDE7F8",
    heroMuted: "#9C8FBE",
    heroAccent: "#A78BFA",
  },
];

const cards = [
  { tag: "Solution · Live", title: "Karpathy Wiki Bundle", views: "14·min", time: "01" },
  { tag: "Project · WIP", title: "Fundament21 — миграция", views: "3929·SKU", time: "02" },
  { tag: "Solution · Live", title: "Tailscale + VPS как личный VPN", views: "15·min", time: "03" },
];

function PaletteDemo({ p }: { p: Palette }) {
  // Inline CSS variables scoped to this section
  const wrapperStyle: CSSProperties = {
    background: p.bg,
    color: p.text,
    borderColor: p.border,
  };
  const heroStyle: CSSProperties = {
    background: p.heroBg,
    color: p.heroText,
    borderColor: p.border,
  };
  const cardStyle: CSSProperties = {
    background: p.card,
    borderColor: p.border,
  };

  return (
    <section className="rounded-2xl overflow-hidden border" style={wrapperStyle}>
      {/* Demo label */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b text-xs font-mono uppercase tracking-widest"
        style={{ borderColor: p.border, color: p.muted }}
      >
        <span style={{ color: p.accent, fontWeight: 700 }}>Вариант {p.letter}</span>
        <span>{p.name}</span>
      </div>

      {/* Mini nav */}
      <div
        className="flex items-center justify-between px-8 py-4 border-b"
        style={heroStyle}
      >
        <div className="flex items-center gap-2 text-sm font-mono" style={{ color: p.heroText }}>
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.heroAccent }} />
          ramas
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-widest">
          <span style={{ color: p.heroMuted }}>solutions</span>
          <span style={{ color: p.heroMuted }}>projects</span>
          <span
            className="px-2.5 py-1 rounded-md border"
            style={{ borderColor: p.border, color: p.heroText }}
          >
            tg @sergeyramas
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="px-8 py-12 sm:py-16" style={heroStyle}>
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: "#22c55e" }}
          />
          <span style={{ color: p.heroAccent }}>система активна · 2026</span>
        </div>
        <h2
          className="mt-5 font-bold leading-[0.95] tracking-tight"
          style={{
            color: p.heroText,
            fontSize: "clamp(2.25rem, 5.5vw, 4rem)",
            letterSpacing: "-0.03em",
            textShadow: `2px 0 ${p.heroAccent}33`,
          }}
        >
          AI-операционные<br />
          <span style={{ color: p.heroAccent }}>системы</span> и продажи.
        </h2>
        <p
          className="mt-5 max-w-md font-mono text-[13px] leading-relaxed"
          style={{ color: p.heroMuted }}
        >
          Веду агентство, делаю reseller-бизнес на eBay,<br />
          <span style={{ color: p.heroAccent, fontWeight: 700 }}>выкатываю свои продукты</span>.
        </p>
        <div className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-md border font-mono text-[11px] uppercase tracking-widest"
          style={{ borderColor: p.border, color: p.heroText, background: p.surface + "40" }}>
          начать дoминацию <span>↗</span>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 px-8 py-8 border-b" style={{ borderColor: p.border, background: p.bg, color: p.text }}>
        {[
          { v: "22", l: "карточек" },
          { v: "3929", l: "SKU мигрировано" },
          { v: "2", l: "store автоматизированы" },
        ].map((k) => (
          <div key={k.l}>
            <div className="font-bold" style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", color: p.text }}>
              {k.v}
            </div>
            <div className="mt-1 text-[10px] font-mono uppercase tracking-widest" style={{ color: p.muted }}>
              {k.l}
            </div>
          </div>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-8" style={{ background: p.bg }}>
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-xl border p-5 flex flex-col gap-3"
            style={cardStyle}
          >
            <div
              className="h-24 rounded-lg flex items-center justify-center font-mono text-2xl"
              style={{ background: p.surface, color: p.accent }}
            >
              {c.time}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: p.accent }}>
              {c.tag}
            </div>
            <div className="font-medium leading-snug" style={{ color: p.text }}>
              {c.title}
            </div>
            <div className="mt-auto flex items-center justify-between text-[11px] font-mono" style={{ color: p.muted }}>
              <span>{c.views}</span>
              <span style={{ color: p.accent }}>open →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mini footer */}
      <div
        className="px-8 py-5 border-t flex items-center justify-between text-[11px] font-mono"
        style={{ borderColor: p.border, color: p.muted, background: p.surface }}
      >
        <span>© 2026 Сергей Рамас</span>
        <span style={{ color: p.accent }}>tg @Sergeyramas · github.com/sergeyramas</span>
      </div>
    </section>
  );
}

export default function ThemesPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-12 pb-24">
      <header className="mb-12">
        <p className="eyebrow">Theme preview · выбери вариант</p>
        <h1 className="display mt-4 text-4xl sm:text-6xl">
          Три палитры <span className="display-italic text-accent">в одном экране</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted leading-relaxed">
          Полный редизайн в стиле Mastodont AI Hub: фиксированный nav, hero с status-dot,
          KPI-полоса, grid карточек, mono-eyebrows, footer. Скажи букву —{" "}
          <Link href="https://t.me/Sergeyramas" className="underline decoration-subtle underline-offset-4 hover:text-accent hover:decoration-accent">
            в телегу
          </Link>{" "}
          или сюда — повешу на весь сайт.
        </p>
      </header>

      <div className="space-y-10">
        {palettes.map((p) => (
          <PaletteDemo key={p.letter} p={p} />
        ))}
      </div>

      <footer className="mt-16 pt-10 border-t border-border text-sm text-muted">
        Превью статичные — это макеты, не реальный сайт. Glitch-эффекты, particles,
        scan-line, custom cursor и анимации reveal-on-scroll появятся уже в финальном
        редизайне после твоего выбора. Они не убиваются палитрой — работают в любом из
        трёх вариантов.
      </footer>
    </div>
  );
}
