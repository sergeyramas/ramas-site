# Personal Site (ramas-site) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a personal portfolio site at `ramas*.vercel.app` showcasing 22 cards across Solutions / Projects / Ideas, with light/dark themes, zero auth/payments.

**Architecture:** Next.js 16 App Router static site. Single MDX content type with `kind: solution|project|idea` discriminator filtered into three grids. velite parses MDX with Zod-validated frontmatter. `next-themes` provides class-based theme switching. Deployed from public `sergeyramas/ramas-site` repo to Vercel.

**Tech Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · velite (MDX+Zod) · next-themes · shadcn/ui (minimal) · Inter + JetBrains Mono via next/font · Vercel Analytics

**Working directory:** `/Users/sergeyrama/Documents/ramas-site/`

**Spec:** `docs/superpowers/specs/2026-05-09-personal-site-design.md`

---

## File Structure

```
ramas-site/
├── app/
│   ├── layout.tsx                       # root layout: fonts, ThemeProvider, Nav, Footer
│   ├── page.tsx                         # / — Hero + featured + section CTAs
│   ├── globals.css                      # Tailwind + CSS vars for themes
│   ├── solutions/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── ideas/page.tsx
│   └── about/page.tsx
├── components/
│   ├── Card.tsx                         # one tile (handles internal vs external link)
│   ├── Grid.tsx                         # bento layout
│   ├── Hero.tsx                         # home hero
│   ├── PageHeader.tsx                   # h1 + subtitle for section pages
│   ├── Nav.tsx
│   ├── Footer.tsx
│   ├── ThemeProvider.tsx                # next-themes wrapper
│   └── ThemeToggle.tsx                  # sun/moon button
├── content/items/                       # all 22 MDX files
├── lib/
│   ├── content.ts                       # query helpers (allByKind, bySlug, featured)
│   └── utils.ts                         # cn() helper for class merging
├── public/
│   ├── covers/                          # card cover images (placeholder: solid colors via CSS until added)
│   └── og-default.png                   # static OG fallback
├── velite.config.ts                     # MDX + Zod schema
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
├── tsconfig.json
├── package.json
├── .gitignore
├── .nvmrc
└── README.md
```

**Decomposition principle:** components don't know about MDX parsing. `lib/content.ts` is the only module that reads from velite output. Each component takes plain props.

---

## Phase 1 — Bootstrap (local scaffold + theming)

### Task 1: Initialize Next.js project

**Files:** `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx` (will be replaced), `app/globals.css`, `.gitignore`, `tailwind.config.ts`, `postcss.config.mjs`

- [ ] **Step 1:** Verify Node 20+ is active.

```bash
cd /Users/sergeyrama/Documents/ramas-site
node --version
```
Expected: `v20.x` or higher. If not — `nvm install 20 && nvm use 20`.

- [ ] **Step 2:** Initialize Next.js 16 in current directory (non-empty: `docs/` exists, that's fine).

```bash
cd /Users/sergeyrama/Documents/ramas-site
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*" --turbopack --no-git
```

When prompted "Directory is not empty, continue?" — answer **Yes**. Existing `docs/` is preserved.

Expected: `package.json`, `app/`, `tailwind.config.ts`, `tsconfig.json` created. Project builds.

- [ ] **Step 3:** Verify dev server runs.

```bash
npm run dev
```
Expected: `Ready on http://localhost:3000` within 5s. Open browser → see Next.js default page. Then `Ctrl+C`.

- [ ] **Step 4:** Pin Node version, add `.nvmrc`.

Create `.nvmrc`:
```
20
```

- [ ] **Step 5:** Commit baseline.

```bash
cd /Users/sergeyrama/Documents/ramas-site
git init
git add -A
git commit -m "chore: scaffold Next.js 16 + Tailwind"
```

---

### Task 2: Install runtime dependencies

**Files:** `package.json`

- [ ] **Step 1:** Install content + theming + analytics deps.

```bash
cd /Users/sergeyrama/Documents/ramas-site
npm install velite zod next-themes @vercel/analytics clsx tailwind-merge
npm install -D @types/node
```

Expected: no errors, `package.json` updated.

- [ ] **Step 2:** Install lucide-react for icons (sun/moon for ThemeToggle, GitHub etc.).

```bash
npm install lucide-react
```

- [ ] **Step 3:** Verify build still passes.

```bash
npm run build
```
Expected: build succeeds, `.next/` produced.

- [ ] **Step 4:** Commit.

```bash
git add package.json package-lock.json
git commit -m "chore: add velite, next-themes, analytics, icons"
```

---

### Task 3: Configure typed CSS variables for two themes

**Files:** `app/globals.css`, `tailwind.config.ts`

- [ ] **Step 1:** Replace `app/globals.css` with full content:

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;
}

:root {
  --bg: #FAF8F4;
  --fg: #1A1A1A;
  --muted: #6B6660;
  --accent: #A04B2A;
  --border: #E8E5DE;
  --card: #FFFFFF;
}

.dark {
  --bg: #1A1815;
  --fg: #F5F2EB;
  --muted: #8F887E;
  --accent: #C76847;
  --border: #2E2A24;
  --card: #211E1A;
}

* {
  border-color: var(--border);
}

html {
  background: var(--bg);
  color: var(--fg);
  -webkit-font-smoothing: antialiased;
}

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
}

a { color: inherit; text-decoration: none; }
a:hover { color: var(--accent); }

::selection { background: var(--accent); color: var(--bg); }
```

- [ ] **Step 2:** Replace `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
    "./.velite/**/*.{js,mjs}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        border: "var(--border)",
        card: "var(--card)",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 3:** Run dev to verify CSS compiles.

```bash
npm run dev
```
Expected: no errors. Then `Ctrl+C`.

- [ ] **Step 4:** Commit.

```bash
git add app/globals.css tailwind.config.ts
git commit -m "feat: dual-theme CSS variables (light/dark)"
```

---

### Task 4: ThemeProvider + ThemeToggle

**Files:** `components/ThemeProvider.tsx`, `components/ThemeToggle.tsx`, `lib/utils.ts`

- [ ] **Step 1:** Create `lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2:** Create `components/ThemeProvider.tsx`:

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />;
}
```

- [ ] **Step 3:** Create `components/ThemeToggle.tsx`:

```tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-border hover:border-accent transition-colors"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
```

- [ ] **Step 4:** Commit.

```bash
git add components/ThemeProvider.tsx components/ThemeToggle.tsx lib/utils.ts
git commit -m "feat: ThemeProvider and ThemeToggle (next-themes)"
```

---

### Task 5: Root layout with fonts, ThemeProvider, Nav, Footer

**Files:** `app/layout.tsx`, `components/Nav.tsx`, `components/Footer.tsx`

- [ ] **Step 1:** Create `components/Nav.tsx`:

```tsx
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
```

- [ ] **Step 2:** Create `components/Footer.tsx`:

```tsx
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
```

- [ ] **Step 3:** Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: { default: "Ramas — Solutions, Projects, Ideas", template: "%s · Ramas" },
  description: "Сергей Рамас. AI-операционные системы, лендинги, автоматизация продаж. Упакованные решения и живые проекты.",
  metadataBase: new URL("https://ramas.vercel.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4:** Run dev, verify ThemeToggle works.

```bash
npm run dev
```
Open http://localhost:3000. Click sun/moon button — background should flip warm-light ↔ warm-dark instantly. Refresh — choice persists. `Ctrl+C`.

- [ ] **Step 5:** Commit.

```bash
git add app/layout.tsx components/Nav.tsx components/Footer.tsx
git commit -m "feat: root layout with fonts, theming, nav, footer"
```

---

## Phase 2 — Content infrastructure

### Task 6: velite config with frontmatter schema

**Files:** `velite.config.ts`, `next.config.ts`, `package.json` (scripts), `.gitignore`, `tsconfig.json`

- [ ] **Step 1:** Create `velite.config.ts`:

```ts
import { defineConfig, defineCollection, s } from "velite";

const items = defineCollection({
  name: "Item",
  pattern: "items/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      slug: s.slug("global"),
      kind: s.enum(["solution", "project", "idea"]),
      summary: s.string().max(280),
      cover: s.string().optional(),
      externalUrl: s.string().url().nullable().optional(),
      tags: s.array(s.string()).default([]),
      status: s.enum(["live", "wip", "archived", "concept"]).default("live"),
      tier: s.enum(["free", "paid"]).default("free"),
      date: s.isodate(),
      featured: s.boolean().default(false),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      url: data.externalUrl ?? `/${data.kind}s/${data.slug}`,
      isExternal: Boolean(data.externalUrl),
    })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { items },
});
```

- [ ] **Step 2:** Update `package.json` scripts (merge `velite` into existing scripts; preserve scripts from `create-next-app`):

```json
{
  "scripts": {
    "dev": "velite --watch & next dev --turbopack",
    "build": "velite && next build",
    "start": "next start",
    "lint": "next lint",
    "content": "velite"
  }
}
```

Note: keep any existing scripts not listed; replace only `dev` and `build`. The `&` in `dev` runs velite watcher in parallel with Next.

- [ ] **Step 3:** Add to `.gitignore`:

```
# velite
.velite
```

Append to existing `.gitignore`, do not overwrite.

- [ ] **Step 4:** Update `tsconfig.json` paths to alias velite output. Open `tsconfig.json`, find `"paths"` block, add `#site/content`:

```json
"paths": {
  "@/*": ["./*"],
  "#site/content": ["./.velite"]
}
```

- [ ] **Step 5:** Create `content/items/` directory and a sanity-check MDX:

```bash
mkdir -p content/items
```

Create `content/items/sanity.mdx`:

```mdx
---
title: "Sanity Check"
slug: "sanity"
kind: solution
summary: "Disposable card to verify velite parses MDX and Zod validates frontmatter"
externalUrl: null
tags: [internal]
status: concept
date: 2026-05-09
featured: false
---

# Hello world

This file will be deleted in Task 9.
```

- [ ] **Step 6:** Run velite build manually.

```bash
npx velite
```
Expected: `.velite/items.json` created, contains the sanity card with `url: "/solutions/sanity"`, `isExternal: false`.

- [ ] **Step 7:** Verify TypeScript types are generated.

```bash
ls .velite/
cat .velite/index.d.ts | head -20
```
Expected: `.velite/index.d.ts` exists, contains `Item` type.

- [ ] **Step 8:** Commit.

```bash
git add velite.config.ts package.json .gitignore tsconfig.json content/items/sanity.mdx
git commit -m "feat: velite config + frontmatter schema"
```

---

### Task 7: Content query helpers

**Files:** `lib/content.ts`

- [ ] **Step 1:** Create `lib/content.ts`:

```ts
import { items } from "#site/content";

export type Item = (typeof items)[number];
export type Kind = Item["kind"];

export function allByKind(kind: Kind): Item[] {
  return items
    .filter((i) => i.kind === kind)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function bySlug(kind: Kind, slug: string): Item | undefined {
  return items.find((i) => i.kind === kind && i.slug === slug);
}

export function featured(limit = 4): Item[] {
  return items
    .filter((i) => i.featured)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, limit);
}

export function allInternalSlugs(kind: Kind): string[] {
  return items.filter((i) => i.kind === kind && !i.isExternal).map((i) => i.slug);
}
```

- [ ] **Step 2:** Verify types resolve.

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3:** Commit.

```bash
git add lib/content.ts
git commit -m "feat: content query helpers"
```

---

### Task 8: Card and Grid components

**Files:** `components/Card.tsx`, `components/Grid.tsx`, `components/PageHeader.tsx`, `components/Hero.tsx`

- [ ] **Step 1:** Create `components/Card.tsx`:

```tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Item } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Card({ item, dense = false }: { item: Item; dense?: boolean }) {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    item.isExternal ? (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
        {children}
      </a>
    ) : (
      <Link href={item.url} className="group block h-full">
        {children}
      </Link>
    );

  return (
    <Wrapper>
      <article
        className={cn(
          "h-full border border-border bg-card p-5 transition-colors group-hover:border-accent",
          dense ? "rounded-md" : "rounded-lg p-6"
        )}
      >
        <header className="flex items-start justify-between gap-3">
          <h3 className={cn("font-medium leading-tight", dense ? "text-base" : "text-lg")}>
            {item.title}
          </h3>
          {item.isExternal && (
            <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent shrink-0 mt-1" />
          )}
        </header>
        <p className="mt-2 text-sm text-muted leading-relaxed">{item.summary}</p>
        {item.tags.length > 0 && !dense && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 4).map((t) => (
              <li key={t} className="font-mono text-xs text-muted">
                #{t}
              </li>
            ))}
          </ul>
        )}
      </article>
    </Wrapper>
  );
}
```

- [ ] **Step 2:** Create `components/Grid.tsx`:

```tsx
import type { Item } from "@/lib/content";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

export function Grid({ items, dense = false }: { items: Item[]; dense?: boolean }) {
  if (items.length === 0) {
    return <p className="text-muted">Пока пусто. Скоро появится.</p>;
  }
  return (
    <ul
      className={cn(
        "grid gap-4",
        dense ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {items.map((item) => (
        <li key={`${item.kind}-${item.slug}`}>
          <Card item={item} dense={dense} />
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3:** Create `components/PageHeader.tsx`:

```tsx
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-10">
      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">{title}</h1>
      {subtitle && <p className="mt-3 text-muted max-w-2xl">{subtitle}</p>}
    </header>
  );
}
```

- [ ] **Step 4:** Create `components/Hero.tsx`:

```tsx
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
```

- [ ] **Step 5:** Commit.

```bash
git add components/Card.tsx components/Grid.tsx components/PageHeader.tsx components/Hero.tsx
git commit -m "feat: Card, Grid, PageHeader, Hero"
```

---

## Phase 3 — Pages

### Task 9: Home page (/)

**Files:** `app/page.tsx`

- [ ] **Step 1:** Replace `app/page.tsx`:

```tsx
import { featured, allByKind } from "@/lib/content";
import { Hero } from "@/components/Hero";
import { Grid } from "@/components/Grid";
import Link from "next/link";

export default function HomePage() {
  const featuredItems = featured(4);
  const sections = [
    { kind: "solution", title: "Solutions", href: "/solutions", desc: "Упакованные гайды, скиллы, скрипты." },
    { kind: "project", title: "Projects", href: "/projects", desc: "Живые сайты и продукты." },
    { kind: "idea", title: "Ideas", href: "/ideas", desc: "Что хочется сделать." },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto px-6">
      <Hero />

      {featuredItems.length > 0 && (
        <section className="mt-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">Featured</h2>
          <div className="mt-6">
            <Grid items={featuredItems} />
          </div>
        </section>
      )}

      <section className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {sections.map((s) => {
          const count = allByKind(s.kind).length;
          return (
            <Link
              key={s.kind}
              href={s.href}
              className="block border border-border rounded-lg p-6 hover:border-accent transition-colors"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-medium">{s.title}</h3>
                <span className="font-mono text-sm text-muted">{count}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{s.desc}</p>
              <p className="mt-6 text-sm text-accent">Все →</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
```

- [ ] **Step 2:** Delete sanity card (will reappear in Phase 4 with real content).

```bash
rm content/items/sanity.mdx
```

- [ ] **Step 3:** Verify build.

```bash
npm run build
```
Expected: build succeeds. May warn "no items" — that's fine; will be filled in Phase 4.

- [ ] **Step 4:** Commit.

```bash
git add app/page.tsx
git rm content/items/sanity.mdx
git commit -m "feat: home page (hero + featured + section CTAs)"
```

---

### Task 10: Section index pages (/solutions, /projects, /ideas)

**Files:** `app/solutions/page.tsx`, `app/projects/page.tsx`, `app/ideas/page.tsx`

- [ ] **Step 1:** Create `app/solutions/page.tsx`:

```tsx
import { allByKind } from "@/lib/content";
import { Grid } from "@/components/Grid";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Solutions" };

export default function SolutionsPage() {
  const items = allByKind("solution");
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <PageHeader
        title="Solutions"
        subtitle="Упакованные гайды, скиллы и скрипты. Что-то ведёт на GitHub Pages, что-то открывается прямо здесь."
      />
      <Grid items={items} />
    </div>
  );
}
```

- [ ] **Step 2:** Create `app/projects/page.tsx`:

```tsx
import { allByKind } from "@/lib/content";
import { Grid } from "@/components/Grid";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  const items = allByKind("project");
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <PageHeader
        title="Projects"
        subtitle="Живые сайты и продукты, которые я веду или сделал."
      />
      <Grid items={items} />
    </div>
  );
}
```

- [ ] **Step 3:** Create `app/ideas/page.tsx`:

```tsx
import { allByKind } from "@/lib/content";
import { Grid } from "@/components/Grid";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Ideas" };

export default function IdeasPage() {
  const items = allByKind("idea");
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <PageHeader
        title="Ideas"
        subtitle="Что хочется сделать. Wishlist, открытый для обсуждения."
      />
      <Grid items={items} dense />
    </div>
  );
}
```

- [ ] **Step 4:** Verify build.

```bash
npm run build
```
Expected: success. Three new routes in build output: `/solutions`, `/projects`, `/ideas`.

- [ ] **Step 5:** Commit.

```bash
git add app/solutions/page.tsx app/projects/page.tsx app/ideas/page.tsx
git commit -m "feat: section index pages"
```

---

### Task 11: Dynamic detail pages (/solutions/[slug], /projects/[slug])

**Files:** `app/solutions/[slug]/page.tsx`, `app/projects/[slug]/page.tsx`

- [ ] **Step 1:** Create `app/solutions/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/MDXContent";
import { bySlug, allInternalSlugs } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";

export function generateStaticParams() {
  return allInternalSlugs("solution").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = bySlug("solution", slug);
  if (!item) return {};
  return { title: item.title, description: item.summary };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = bySlug("solution", slug);
  if (!item || item.isExternal) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/solutions" className="font-mono text-xs uppercase tracking-widest text-muted hover:text-accent">
        ← Solutions
      </Link>
      <PageHeader title={item.title} subtitle={item.summary} />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent code={item.body} />
      </div>
    </article>
  );
}
```

- [ ] **Step 2:** Create `app/projects/[slug]/page.tsx` (mirror of above with `kind: "project"`):

```tsx
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/MDXContent";
import { bySlug, allInternalSlugs } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";

export function generateStaticParams() {
  return allInternalSlugs("project").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = bySlug("project", slug);
  if (!item) return {};
  return { title: item.title, description: item.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = bySlug("project", slug);
  if (!item || item.isExternal) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/projects" className="font-mono text-xs uppercase tracking-widest text-muted hover:text-accent">
        ← Projects
      </Link>
      <PageHeader title={item.title} subtitle={item.summary} />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent code={item.body} />
      </div>
    </article>
  );
}
```

- [ ] **Step 3:** Create `components/MDXContent.tsx` to render velite-compiled MDX:

```tsx
"use client";

import * as runtime from "react/jsx-runtime";

const sharedComponents = {
  // override defaults here later
};

function getMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export function MDXContent({ code, components }: { code: string; components?: Record<string, React.ComponentType> }) {
  const Component = getMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
```

- [ ] **Step 4:** Install `@tailwindcss/typography` for `prose` class:

```bash
npm install -D @tailwindcss/typography
```

Then update `app/globals.css` — append at bottom:

```css
@plugin "@tailwindcss/typography";
```

- [ ] **Step 5:** Verify build.

```bash
npm run build
```
Expected: success. Routes `/solutions/[slug]` and `/projects/[slug]` listed (initially zero static params — populated in Phase 4).

- [ ] **Step 6:** Commit.

```bash
git add app/solutions/[slug]/page.tsx app/projects/[slug]/page.tsx components/MDXContent.tsx app/globals.css package.json package-lock.json
git commit -m "feat: dynamic MDX detail pages"
```

---

### Task 12: About page

**Files:** `app/about/page.tsx`

- [ ] **Step 1:** Create `app/about/page.tsx`:

```tsx
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
```

- [ ] **Step 2:** Commit.

```bash
git add app/about/page.tsx
git commit -m "feat: about page"
```

---

## Phase 4 — Seed content (22 cards)

### Task 13: Solutions content (8 MDX files)

**Files:** `content/items/*.mdx`

For each card below, create a file at `content/items/<slug>.mdx`. **External cards** (with `externalUrl`) have an empty body — no internal page is rendered.

- [ ] **Step 1:** Create `content/items/multiagent-intensive-day-1.mdx`:

```mdx
---
title: "Multiagent Intensive — AI-Секретарь от нуля"
slug: "multiagent-intensive-day-1"
kind: solution
summary: "Урок 1: AI-Секретарь от нуля. 24 шага копипаст-гайда с готовыми шаблонами."
externalUrl: "https://sergeyramas.github.io/multiagent-intensive-day-1/"
tags: [course, agents, claude-code]
status: live
date: 2026-04-23
featured: true
---
```

- [ ] **Step 2:** Create `content/items/karpathy-wiki-bundle.mdx`:

```mdx
---
title: "Karpathy Wiki Bundle"
slug: "karpathy-wiki-bundle"
kind: solution
summary: "All-in-one installer памяти для Claude Code: memory-compiler hooks + 14 Obsidian wiki skills."
externalUrl: "https://github.com/sergeyramas/karpathy-wiki-bundle"
tags: [memory, claude-code, obsidian]
status: live
date: 2026-04-10
featured: true
---
```

- [ ] **Step 3:** Create `content/items/ramas-karpathy-tree.mdx`:

```mdx
---
title: "Ramas-Karpathy-Tree"
slug: "ramas-karpathy-tree"
kind: solution
summary: "Per-project memory layer для Claude Code. cwd-aware routing, pre-filter, Haiku flush, two-tier MEMORY."
externalUrl: "https://sergeyramas.github.io/ramas-karpathy-tree/"
tags: [memory, claude-code]
status: live
date: 2026-05-01
featured: true
---
```

- [ ] **Step 4:** Create `content/items/idea-to-spec-trio.mdx`:

```mdx
---
title: "Idea → Spec Trio"
slug: "idea-to-spec-trio"
kind: solution
summary: "Три скилла Claude Code, которые превращают идею в техническое задание за 20–30 минут."
externalUrl: "https://sergeyramas.github.io/idea-to-spec-trio/"
tags: [claude-code, skill, prd]
status: live
date: 2026-04-26
featured: false
---
```

- [ ] **Step 5:** Create `content/items/karpathy-memory.mdx`:

```mdx
---
title: "Karpathy Memory"
slug: "karpathy-memory"
kind: solution
summary: "Personal knowledge base, скомпилированная из AI-разговоров. Karpathy LLM KB pattern."
externalUrl: "https://sergeyramas.github.io/karpathy-memory/"
tags: [memory, knowledge-base]
status: live
date: 2026-04-21
featured: false
---
```

- [ ] **Step 6:** Create `content/items/ebay-agents-swarm-report.mdx`:

```mdx
---
title: "eBay Agents Swarm — MacBook Contest Report"
slug: "ebay-agents-swarm-report"
kind: solution
summary: "Публичный отчёт: from live eBay automation to an agent operations layer. Six steps + safety gates."
externalUrl: "https://sergeyramas.github.io/ebay-agents-swarm-report/"
tags: [ebay, agents, report]
status: live
date: 2026-04-26
featured: false
---
```

- [ ] **Step 7:** Create `content/items/memory-karpathy.mdx`:

```mdx
---
title: "Memory Karpathy"
slug: "memory-karpathy"
kind: solution
summary: "Personal KB compiled from AI conversations. Inspired by Karpathy LLM KB pattern."
externalUrl: "https://github.com/sergeyramas/memory-karpathy"
tags: [memory, knowledge-base]
status: live
date: 2026-04-10
featured: false
---
```

- [ ] **Step 8:** Create `content/items/tailscale-personal-vpn.mdx` (full body — internal page):

```mdx
---
title: "Tailscale + VPS как личный VPN"
slug: "tailscale-personal-vpn"
kind: solution
summary: "Свой VPN на собственном сервере за 15 минут. Чистый IP, WireGuard, бесплатно для личного."
externalUrl: null
tags: [vpn, tailscale, devops]
status: live
date: 2026-05-09
featured: true
---

## Картинка целиком

Представь что у тебя дома есть Mac, и где-то в Германии стоит твой VPS. Tailscale делает между ними зашифрованный туннель (как кабель, протянутый через интернет). Этот туннель работает в обе стороны:

1. Ты можешь зайти на свой VPS так, будто он стоит у тебя в соседней комнате — по простому имени `dev-box`, без IP-адресов, без ssh-ключей, без проброса портов.
2. Ты можешь весь свой интернет-трафик отправить через VPS — то есть когда ты открываешь Google, Anthropic, что угодно, твой Mac не идёт в интернет напрямую через провайдера. Он сначала по туннелю шлёт всё на VPS, а уже VPS идёт в интернет от своего имени.

Для Google и Anthropic это выглядит так, будто ты сидишь в Германии за этим VPS-ом. Они видят немецкий IP. Российский IP твоего провайдера наружу вообще не появляется.

Это и есть VPN. Дословно VPN означает "виртуальная частная сеть" — а Tailscale именно её и создаёт между твоим Mac и твоим VPS.

## Чем Tailscale отличается от обычного VPN

Обычный VPN (NordVPN, ProtonVPN) — это чужой сервер. Ты подключаешься к нему вместе с тысячами других людей. Все вы выходите в интернет с одного IP, поэтому Google и Anthropic знают, что это VPN-IP, и относятся к нему подозрительно. Плюс этот IP меняется каждый раз — сегодня Германия, завтра Голландия.

Tailscale работает не так. У тебя свой собственный сервер в Германии. Только ты через него ходишь. У него постоянный, чистый IP, не помеченный как VPN. Для внешних сервисов это выглядит как обычный пользователь, который сидит за статичным интернет-каналом.

Плюс Tailscale умеет ещё одну вещь: создаёт внутреннюю сеть из твоих устройств. Если добавить iPhone, ноутбук жены, ещё один сервер — все они увидят друг друга как будто стоят в одной локальной сети. Без публичных IP, без портов наружу, без VPN-сервера в офисе.

## Как это настраивается (15 минут, один раз)

**Шаг 1.** Заводишь аккаунт на [tailscale.com](https://tailscale.com) — бесплатный для личного (до 100 устройств и 3 пользователей). Логин через Google или GitHub.

**Шаг 2.** Ставишь Tailscale на Mac — скачиваешь приложение, входишь тем же логином. В верхнем меню Mac появляется иконка Tailscale.

**Шаг 3.** Ставишь Tailscale на VPS:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

Скрипт даст ссылку — открываешь в браузере и логинишься. После этого VPS появляется в твоём списке устройств.

**Шаг 4.** Включаешь VPS как exit node:

```bash
sudo tailscale up --advertise-exit-node
```

Затем на [tailscale.com](https://tailscale.com) находишь VPS в устройствах и в его настройках разрешаешь "Use as exit node". Один чекбокс.

**Шаг 5.** На Mac в иконке Tailscale выбираешь "Use exit node → dev-box". Всё. С этой секунды твой Mac в интернет ходит через VPS.

## Сравнение по пунктам

**Скорость.** Tailscale построен на WireGuard — самом быстром современном протоколе. Лаги меньше, чем у OpenVPN/IPsec.

**Надёжность.** У NordVPN периодически "не подключается сегодня" / "забанили в этой стране". У тебя свой VPS — он или работает, или ты сам его сломал.

**Стабильный IP.** Anthropic, GitHub, любой сервис, который смотрит на поведение, видит один и тот же IP месяцами. Резко снижает шанс попасть на ручную проверку.

**Удобство.** Кроме "выйти в интернет через Германию" получаешь бесплатный SSH-доступ к серверу по имени, можешь поднять БД на VPS и подключаться из локального DBeaver без проброса портов.

**Цена.** Tailscale бесплатный для личных. Платишь только за VPS — Hetzner CX22 это ~5€/мес. Итого годовое — €60.

## Где это неудобнее

Если нужно "включить и выключить страну" — посмотреть Netflix как из США, через час из Японии — нужен коммерческий VPN с сотнями локаций. Tailscale работает только с серверами, которые ты сам поднял. Решение: держать 2–3 VPS в разных странах в одной tailnet и переключаться. Но это €15/мес.

## Короткая модель в одной фразе

Tailscale — это бесплатный личный VPN на твоём собственном сервере, который попутно делает все твои устройства видимыми друг для друга по простым именам.
```

- [ ] **Step 9:** Run velite to verify all 8 parse correctly.

```bash
npx velite
```
Expected: `.velite/items.json` contains 8 entries with `kind: "solution"`. No Zod errors.

- [ ] **Step 10:** Commit.

```bash
git add content/items/
git commit -m "content: 8 solutions seed"
```

---

### Task 14: Projects content (6 MDX files)

**Files:** `content/items/*.mdx`

- [ ] **Step 1:** Create `content/items/fundament21.mdx`:

```mdx
---
title: "Fundament21"
slug: "fundament21"
kind: project
summary: "Миграция фундамент21.рф с Pulscen на Next.js + Directus. 3929 товаров, e-commerce под фундаменты."
externalUrl: "https://fundament21.vercel.app"
tags: [nextjs, directus, ecommerce]
status: wip
date: 2026-04-30
featured: true
---
```

- [ ] **Step 2:** Create `content/items/piratebay-landing.mdx`:

```mdx
---
title: "PiratEBay"
slug: "piratebay-landing"
kind: project
summary: "SaaS-лендинг для eBay-агентов. Next.js 16."
externalUrl: "https://piratebay-landing.vercel.app"
tags: [nextjs, saas, ebay]
status: live
date: 2026-04-27
featured: false
---
```

- [ ] **Step 3:** Create `content/items/betaline-ai.mdx`:

```mdx
---
title: "BetaLine AI"
slug: "betaline-ai"
kind: project
summary: "Telegram-бот + CRM + веб-чат. AI-агенты для бизнеса. Свой домен + сабдомен под CRM."
externalUrl: "https://betaline-ai.ru"
tags: [ai-agents, crm, telegram]
status: live
date: 2026-04-27
featured: false
---
```

- [ ] **Step 4:** Create `content/items/gowinit-landing.mdx`:

```mdx
---
title: "GoWinit Landing"
slug: "gowinit-landing"
kind: project
summary: "Лендинг проекта GoWinit. Vercel deploy."
externalUrl: "https://gowinit-landing.vercel.app"
tags: [landing]
status: live
date: 2026-04-27
featured: false
---
```

- [ ] **Step 5:** Create `content/items/paintshop-proposal.mdx`:

```mdx
---
title: "Paintshop Proposal"
slug: "paintshop-proposal"
kind: project
summary: "Лендинг-предложение системы управления цеховой работой для микро-автомалярной мастерской."
externalUrl: "https://paintshop-proposal.vercel.app"
tags: [landing, b2b]
status: live
date: 2026-05-08
featured: false
---
```

- [ ] **Step 6:** Create `content/items/ebay-automation-stack.mdx`:

```mdx
---
title: "eBay Automation Stack"
slug: "ebay-automation-stack"
kind: project
summary: "Полностью автоматизированный reseller-бизнес на eBay (US): GE1 + PE12 stores."
externalUrl: null
tags: [ebay, automation, agents]
status: live
date: 2026-05-08
featured: true
---

Полностью автоматизированный reseller-бизнес в США: два магазина GE1 (primary) + PE12 (secondary), всё закрытие сделок, закупка через DHM/CPAPX, синхронизация tracking-номеров и мониторинг цен и стока — без ручной работы.

## Что внутри

- **Closing-автомат.** Заказы закрываются скриптом, как только покупатель оплатил.
- **Purchasing.** Бот покупает товар у поставщика (DHM, CPAPX, ResmedDirect, Shopify) с подменой адреса под покупателя eBay.
- **Tracking sync.** Когда поставщик отгрузил — трек прокидывается в eBay, статус заказа обновляется автоматически.
- **Price/stock monitor.** Каждый листинг сверяется с источником, при изменении цены или OOS — корректируется или скрывается.
- **Buyer messaging.** Сообщения покупателю (apologies, refunds, tracking) шлются через Trading API без захода в eBay UI.

## Под капотом

Python-скрипты на VPS, Telegram-нотификации в реальном времени, Google Sheets как SKU_CATALOG для маппинга "что у кого покупать". Repo приватный.
```

- [ ] **Step 7:** Run velite, verify 14 items total.

```bash
npx velite
```
Expected: 8 solutions + 6 projects = 14 items in `.velite/items.json`.

- [ ] **Step 8:** Commit.

```bash
git add content/items/
git commit -m "content: 6 projects seed"
```

---

### Task 15: Ideas content (8 MDX files)

**Files:** `content/items/*.mdx`

Ideas reference internal vault entries — `externalUrl: null`, but bodies are short tizers (no internal detail page rendered for idea kind in v1; they appear only in the grid). Note: ideas pages route is `/ideas` only — no `/ideas/[slug]` in v1. The body is unused but valid; keep it as 1–2 sentences for future expansion.

- [ ] **Step 1:** Create `content/items/seo-geo-autopilot.mdx`:

```mdx
---
title: "SEO/GEO Autopilot"
slug: "seo-geo-autopilot"
kind: idea
summary: "Воссоздать систему Попова по SEO/GEO кодом. Без n8n. Контент-движок под локальный поиск."
externalUrl: null
tags: [seo, geo, content]
status: concept
date: 2026-05-09
featured: false
---
```

- [ ] **Step 2:** Create `content/items/prebuy-auditor-agent.mdx`:

```mdx
---
title: "Prebuy Auditor Agent"
slug: "prebuy-auditor-agent"
kind: idea
summary: "AI-аудитор товара перед покупкой: проверяет отзывы, цены у конкурентов, риски возврата."
externalUrl: null
tags: [agents, ecommerce]
status: concept
date: 2026-05-09
featured: false
---
```

- [ ] **Step 3:** Create `content/items/ai-persona-traffic-factory.mdx`:

```mdx
---
title: "AI Persona Traffic Factory"
slug: "ai-persona-traffic-factory"
kind: idea
summary: "Фабрика органического трафика на AI-персонах: каждая персона ведёт свою тему в соцсетях, конвертит в продукт."
externalUrl: null
tags: [traffic, agents, marketing]
status: concept
date: 2026-05-09
featured: false
---
```

- [ ] **Step 4:** Create `content/items/traffic-engine.mdx`:

```mdx
---
title: "Traffic Engine"
slug: "traffic-engine"
kind: idea
summary: "Универсальный движок генерации и распределения трафика по нескольким каналам с единой аналитикой."
externalUrl: null
tags: [traffic, marketing]
status: concept
date: 2026-05-09
featured: false
---
```

- [ ] **Step 5:** Create `content/items/yandex-direct-agents.mdx`:

```mdx
---
title: "Yandex Direct Agents"
slug: "yandex-direct-agents"
kind: idea
summary: "Связка агентов под Яндекс.Директ: автогенерация объявлений, A/B, ставки, антифрод."
externalUrl: null
tags: [agents, yandex-direct]
status: concept
date: 2026-05-09
featured: false
---
```

- [ ] **Step 6:** Create `content/items/youtube-growth.mdx`:

```mdx
---
title: "YouTube Growth"
slug: "youtube-growth"
kind: idea
summary: "Сценарии и production-pipeline под рост YouTube-канала об агентских системах."
externalUrl: null
tags: [content, youtube]
status: concept
date: 2026-05-09
featured: false
---
```

- [ ] **Step 7:** Create `content/items/us-market-entry.mdx`:

```mdx
---
title: "US Market Entry"
slug: "us-market-entry"
kind: idea
summary: "Чек-лист и операционная инфра для входа российского AI-продукта на американский рынок."
externalUrl: null
tags: [usa, business]
status: concept
date: 2026-05-09
featured: false
---
```

- [ ] **Step 8:** Create `content/items/agents-catalog.mdx`:

```mdx
---
title: "Agents Catalog"
slug: "agents-catalog"
kind: idea
summary: "Каталог типовых агентов с готовыми промптами, инструментами и SLA — как реестр Lego-блоков."
externalUrl: null
tags: [agents, catalog]
status: concept
date: 2026-05-09
featured: false
---
```

- [ ] **Step 9:** Run velite, verify 22 items total.

```bash
npx velite
```
Expected: 22 items, 8 solution + 6 project + 8 idea.

- [ ] **Step 10:** Build full site and verify all routes.

```bash
npm run build
```
Expected: build prints these static routes:
- `/`
- `/solutions`, `/solutions/tailscale-personal-vpn`
- `/projects`, `/projects/ebay-automation-stack`
- `/ideas`
- `/about`

Total `/solutions/[slug]` static params = 1 (only tailscale is internal). Total `/projects/[slug]` static params = 1 (only ebay-automation-stack is internal).

- [ ] **Step 11:** Smoke-check in browser.

```bash
npm run dev
```

Open and verify:
- http://localhost:3000 — hero + 4 featured cards + 3 section CTAs with correct counts (8/6/8)
- http://localhost:3000/solutions — grid of 8 cards, external ones have arrow icon
- http://localhost:3000/solutions/tailscale-personal-vpn — full article renders
- http://localhost:3000/projects — grid of 6
- http://localhost:3000/projects/ebay-automation-stack — internal article
- http://localhost:3000/ideas — dense grid of 8
- http://localhost:3000/about — bio
- Click sun/moon — instant theme flip; refresh — choice persists
- External card click — opens in new tab to correct URL

`Ctrl+C`.

- [ ] **Step 12:** Commit.

```bash
git add content/items/
git commit -m "content: 8 ideas seed; 22 cards total"
```

---

## Phase 5 — Polish

### Task 16: OG default image + favicon

**Files:** `public/og-default.png`, `public/favicon.ico`, `app/layout.tsx`

- [ ] **Step 1:** Generate a simple OG image — text "ramas / solutions · projects · ideas" on warm off-white. Use any tool (Figma export, or `og-image` generator). Save as `public/og-default.png` (1200×630 PNG).

If no design tool handy, create a temporary one with `sharp`:

```bash
npm install -D sharp
```

Create `scripts/make-og.mjs`:

```js
import sharp from "sharp";

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#FAF8F4"/>
  <text x="80" y="120" font-family="ui-monospace, monospace" font-size="32" fill="#A04B2A">ramas</text>
  <text x="80" y="320" font-family="system-ui" font-size="84" font-weight="500" fill="#1A1A1A">Solutions.</text>
  <text x="80" y="430" font-family="system-ui" font-size="84" font-weight="500" fill="#1A1A1A">Projects. Ideas.</text>
  <text x="80" y="540" font-family="system-ui" font-size="28" fill="#6B6660">Сергей Рамас — личный сайт</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile("public/og-default.png");
console.log("OG image created.");
```

```bash
node scripts/make-og.mjs
ls -lh public/og-default.png
```
Expected: ~30–80 KB.

- [ ] **Step 2:** Add OG meta to `app/layout.tsx`. Update the `metadata` export:

```tsx
export const metadata: Metadata = {
  title: { default: "Ramas — Solutions, Projects, Ideas", template: "%s · Ramas" },
  description: "Сергей Рамас. AI-операционные системы, лендинги, автоматизация продаж. Упакованные решения и живые проекты.",
  metadataBase: new URL("https://ramas.vercel.app"),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Ramas",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
};
```

- [ ] **Step 3:** Replace default Next.js favicon. The simplest path — keep the auto-generated `app/favicon.ico` from create-next-app for v1; replace later. (No action required.)

- [ ] **Step 4:** Build and verify OG meta.

```bash
npm run build
npm run start &
sleep 3
curl -s http://localhost:3000 | grep 'og:image'
kill %1
```
Expected: `<meta property="og:image" content=".../og-default.png" ...>`.

- [ ] **Step 5:** Commit.

```bash
git add public/og-default.png app/layout.tsx scripts/make-og.mjs package.json package-lock.json
git commit -m "feat: OG image + metadata"
```

---

### Task 17: README and final checks

**Files:** `README.md`

- [ ] **Step 1:** Create `README.md`:

```markdown
# ramas-site

Personal site of Сергей Рамас. Solutions · Projects · Ideas.

**Live:** https://ramas.vercel.app

## Stack

Next.js 16 · TypeScript · Tailwind v4 · velite (MDX) · next-themes

## Local dev

```bash
nvm use
npm install
npm run dev
```

## Adding a card

1. Drop a new `.mdx` file in `content/items/`.
2. Required frontmatter: `title`, `slug`, `kind` (`solution|project|idea`), `summary`, `date`.
3. Set `externalUrl` to point at GitHub Pages / live demo, or leave `null` for internal MDX article.
4. Commit and push — Vercel auto-deploys.

See `docs/superpowers/specs/2026-05-09-personal-site-design.md` for the full design.
```

- [ ] **Step 2:** Commit.

```bash
git add README.md
git commit -m "docs: README"
```

- [ ] **Step 3:** Final lint and build pass.

```bash
npm run lint
npm run build
```
Expected: no errors, no warnings.

- [ ] **Step 4:** Lighthouse smoke. Run prod server, check home page.

```bash
npm run build && npm run start &
sleep 3
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless" --output=json --output-path=./lh.json --quiet
node -e 'const r = require("./lh.json"); console.log(Object.entries(r.categories).map(([k,v])=>k+": "+Math.round(v.score*100)).join(" · "))'
rm lh.json
kill %1
```
Expected: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. If Performance < 95 — investigate (most common cause: unused fonts, oversized OG).

---

## Phase 6 — Publish

### Task 18: Push to GitHub

**Files:** N/A

- [ ] **Step 1:** Verify git status clean.

```bash
cd /Users/sergeyrama/Documents/ramas-site
git status
```
Expected: `nothing to commit, working tree clean`.

- [ ] **Step 2:** Create public GitHub repo via `gh`.

```bash
gh repo create sergeyramas/ramas-site --public --source=. --description="Personal site of Сергей Рамас — solutions, projects, ideas" --push
```
Expected: repo created, `main` pushed. Output ends with the repo URL.

- [ ] **Step 3:** Verify on GitHub.

```bash
gh repo view sergeyramas/ramas-site --web
```
Browser opens — README visible, file tree present.

---

### Task 19: Vercel deploy

**Files:** N/A

- [ ] **Step 1:** Verify vercel CLI authed.

```bash
vercel whoami
```
Expected: prints `sergeyramas` (or team name).

- [ ] **Step 2:** Link project. From repo root:

```bash
cd /Users/sergeyrama/Documents/ramas-site
vercel link --yes --project=ramas
```

If `ramas` slug is taken, fall back to `ramas-lab`:

```bash
vercel link --yes --project=ramas-lab
```

If both taken — try `ramas-site`. Vercel will create the project under team `sergeyramas-projects`.

Expected: `.vercel/project.json` created.

- [ ] **Step 3:** First production deploy.

```bash
vercel deploy --prod
```
Expected: deployment URL printed (e.g. `https://ramas.vercel.app` or `https://ramas-<hash>.vercel.app`). Build logs show velite ran, then Next compiled.

- [ ] **Step 4:** Open deployed site, run final smoke.

```bash
vercel inspect --prod | grep "Production URL"
```

Open URL in browser. Verify:
- Hero loads
- All 3 sections show correct counts
- ThemeToggle works in production
- Tailscale internal page renders MDX
- External cards open in new tab

- [ ] **Step 5:** Connect repo for auto-deploy on push (idempotent).

```bash
vercel git connect
```

- [ ] **Step 6:** Test auto-deploy: trivial commit + push.

```bash
echo "" >> README.md
git add README.md
git commit -m "chore: trigger first auto-deploy"
git push
```

Wait ~30s, then:

```bash
vercel ls ramas --json 2>/dev/null | head -5 || vercel ls
```

Expected: latest deployment shows `READY` state from `git` source.

---

## Self-Review — completed inline

**Spec coverage:**

| Spec section | Implementing tasks |
|---|---|
| §3 Scope (v1 includes) | Tasks 1–17; YAGNI items absent ✓ |
| §3 Two themes | Tasks 3, 4, 5 |
| §4 Tech Stack | Tasks 1, 2, 6 |
| §5 Visual palette | Task 3 (CSS vars), Task 4 (toggle) |
| §6 Content model | Task 6 (velite schema), Tasks 13–15 (MDX seed) |
| §7 Routes | Tasks 9–12 |
| §8 Repo Structure | Matches Tasks 1–12 file paths |
| §9 Seed Content (22 cards) | Tasks 13–15, every card explicitly listed |
| §10 About | Task 12 |
| §11 Future paywall | Frontmatter `tier` field present in schema (Task 6); no logic — correct |
| §12 Deployment Plan | Tasks 18, 19 |
| §14 Success Criteria | Verified in Tasks 15 (smoke), 17 (Lighthouse), 19 (prod smoke) |

No gaps.

**Placeholder scan:** No "TBD" / "TODO" / "implement later" / "similar to" — every step has actual content.

**Type consistency:** `Item`, `Kind`, `allByKind`, `bySlug`, `featured`, `allInternalSlugs` defined in Task 7, used identically in Tasks 9–11. `MDXContent` defined in Task 11 step 3, used in Tasks 11 step 1 & 2.

---

## Execution Handoff

Plan complete and saved to `/Users/sergeyrama/Documents/ramas-site/docs/superpowers/plans/2026-05-09-personal-site.md`.

Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
