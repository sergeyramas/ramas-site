# Brief for Codex — Visuals for sergeyramas.vercel.app

You are working in the existing repo: **`/Users/sergeyrama/Documents/ramas-site/`**.
The site is a personal portfolio: **Sergey Ramas / AI HUB** — solutions, projects, ideas.
Live: <https://sergeyramas.vercel.app>. GitHub: <https://github.com/sergeyramas/ramas-site>.

This brief asks you to **generate static visuals and wire them into the existing code**. Do not redesign — only add images where the brief says, in the format the brief specifies.

---

## 1. Tech & art-direction context

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · velite (MDX). All pages already exist. You only add `<Image>` / `<img>` tags in marked spots.

**Palette (must match)**

| Token | Light | Dark |
|---|---|---|
| Background | `#F4EFE6` warm linen | `#16130F` graphite |
| Foreground | `#1A1714` | `#F2EDE3` |
| Card | `#FBF7EF` | `#1E1A15` |
| Accent | `#B85A2E` (light) / `#DC7A4F` (dark) — terracotta |
| Status green | `#22C55E` |
| Glitch shifts | `var(--accent)` + `#4A7BF7` |

**Type:** Unbounded 900 (mega display), Playfair Display (serif), Inter (body), JetBrains Mono (labels).

**Vibe:** editorial × terminal. Warm dark graphite + terracotta. Slight grain. Status badges, glitch RGB-shift, particles, scan-line. **NOT** synthwave neon, NOT corporate flat, NOT Apple-clean. Closer to a self-published zine printed on warm paper, then projected through a CRT.

**Reference live for vibe (block layout, not palette):** <https://aimastodont.com/>

---

## 2. Files you will touch

```
public/
├── og-default.png            # T1.2 — overwrite
├── portraits/
│   └── sergey-rama.webp      # T1.1 — create
├── covers/                   # T2 — create one .webp per slug below
│   ├── multiagent-intensive-day-1.webp
│   ├── karpathy-wiki-bundle.webp
│   ├── ramas-karpathy-tree.webp
│   ├── idea-to-spec-trio.webp
│   ├── karpathy-memory.webp
│   ├── ebay-agents-swarm-report.webp
│   ├── memory-karpathy.webp
│   ├── tailscale-personal-vpn.webp
│   ├── fundament21.webp
│   ├── piratebay-landing.webp
│   ├── betaline-ai.webp
│   ├── gowinit-landing.webp
│   ├── paintshop-proposal.webp
│   ├── ebay-automation-stack.webp
│   ├── seo-geo-autopilot.webp
│   ├── prebuy-auditor-agent.webp
│   ├── ai-persona-traffic-factory.webp
│   ├── traffic-engine.webp
│   ├── yandex-direct-agents.webp
│   ├── youtube-growth.webp
│   ├── us-market-entry.webp
│   └── agents-catalog.webp
└── favicon variants (T1.3)

app/
├── icon.png                  # T1.3 — create (Next.js auto-uses)
├── apple-icon.png            # T1.3 — create
└── about/page.tsx            # T1.1 wire — add portrait

components/
├── Hero.tsx                  # T1.1 wire — optional inline portrait
└── Card.tsx                  # T2 wire — render cover above title

velite.config.ts              # already supports `cover` field — no schema change
content/items/*.mdx           # T2 wire — add `cover: /covers/<slug>.webp` to frontmatter
```

---

## 3. Tasks

### T1 — Critical brand visuals (do these first)

#### T1.1 — Portrait of Sergey

**File:** `public/portraits/sergey-rama.webp` (also save fallback `.jpg`)
**Size:** 1200×1500 (4:5 portrait), webp ≤ 220 KB.
**Subject:** real photo of the owner if you have one in `~/Downloads/` or `~/Pictures/sergey/` — search those folders first. **Do not generate a fake person.** If no real photo is found, **stop and ask the human to drop one into `~/Downloads/sergey-photo.*`**, then resume.

**Processing pipeline (use `sharp` — already installed):**

1. Crop to 4:5 with face in upper-third (rule of thirds).
2. Reduce saturation by ~12%, push warm tones (linen-graphite mood).
3. Add subtle film grain overlay (use a noise SVG at ~5% opacity, then flatten).
4. Export to webp quality 80, save fallback jpg quality 82.

**Wire into `app/about/page.tsx`:** insert directly under the eyebrow line, before `<h1>`:

```tsx
import Image from "next/image";
// ...
<div className="rise rise-2 mt-6 mb-10 w-40 h-48 sm:w-48 sm:h-60 overflow-hidden rounded-2xl border border-border">
  <Image
    src="/portraits/sergey-rama.webp"
    alt="Сергей Рамас — портрет"
    width={480}
    height={600}
    className="w-full h-full object-cover"
    priority
  />
</div>
```

**Optionally** (only if you have a square crop) wire a 64×64 inline avatar into `components/Hero.tsx` next to the «Sergey Ramas» eyebrow line, but do not redesign the hero. Skip if uncertain.

**Alt text:** `"Сергей Рамас — портрет"`.

---

#### T1.2 — Open Graph image

**File:** `public/og-default.png` (overwrite existing).
**Size:** 1200×630 PNG.
**Generation:** **regenerate via `scripts/make-og.mjs`** — it already uses `sharp` and an inline SVG. Update the SVG inside that script so the image reads:

```
SERGEY RAMAS · AI HUB
solutions · projects · ideas
sergeyramas.vercel.app
```

- Background: `#16130F` (warm graphite)
- "SERGEY RAMAS" — Unbounded-style heavy sans, white, top-left, ~64px
- "AI HUB" — same family, terracotta `#DC7A4F`, much larger (180px), display
- "solutions · projects · ideas" — JetBrains Mono uppercase tracking, muted `#948A7E`, bottom-left
- Add a thin `1px` terracotta horizontal line under "AI HUB"
- Add SVG noise overlay at 4% opacity (already pattern in current `scripts/make-og.mjs`)

If `sharp` cannot embed the Unbounded family directly via SVG `font-family`, fall back to **Georgia / system bold** — the OG renderer is server-side; viewers will not see the difference because the file is a flat PNG.

Run `node scripts/make-og.mjs` to write the file.

**Wire-in:** already wired in `app/layout.tsx` `metadata.openGraph.images`. No code change needed if you keep the same path.

---

#### T1.3 — Favicon + apple-icon

**Files:** `app/icon.png` (512×512) and `app/apple-icon.png` (180×180). Next.js App Router auto-detects these and emits the correct `<link rel="icon">` and apple-touch-icon. **Do not edit `app/layout.tsx`** for this.

**Visual:** filled circle `#DC7A4F` on `#16130F` background, white "R" letterform centered (Unbounded 900 if available, else any heavy serif). Square canvas with safe-area padding ~12%.

Use `sharp` to render from a small SVG. After saving, run `npm run build` — Next.js bakes the icons into the route manifest.

---

### T2 — Card cover thumbnails (22 images)

These are optional but high-impact. Execute only if T1 is fully done.

**Format:** webp 800×500 (16:10), each ≤ 80 KB. Keep visual rhythm consistent — generated as a **set**, not one-off.

**Style (mandatory):**
- Same warm graphite background `#16130F` across all 22.
- Each cover has **exactly one focal element**, centered or upper-third — a single object that hints at the topic.
- Element rendered as **flat geometric or thin-line illustration** in `#DC7A4F` accent + 1 secondary tone (off-white `#F2EDE3` or muted `#948A7E`). No 3D, no realistic photography, no AI-generic gradients.
- Subtle 80×80 grid lines visible at 4% opacity behind the element (matches `.hero-grid-bg` on the live site).
- 4% film grain overlay flattened into the final webp.
- A small mono label in the bottom-left: `[NN]` two-digit counter, where NN is the index in the brief below. Color `#DC7A4F`, JetBrains Mono Bold 14px.

**Concept per slug** (this is the *prompt seed* you pass to whichever image-gen pipeline you use; each line is one card):

```
01  multiagent-intensive-day-1     a single envelope icon turning into a small bot face — "AI secretary"
02  karpathy-wiki-bundle            three connected nodes forming a triangle with a tiny brain icon at center
03  ramas-karpathy-tree             a minimal pine-tree silhouette built from terminal brackets [ ] { }
04  idea-to-spec-trio               a lightbulb that morphs into three nested rectangles (a doc)
05  karpathy-memory                 a stack of three thin folders, top one open, lines suggesting compiled text
06  ebay-agents-swarm-report        a hexagon filled with smaller hex cells — agent swarm pattern
07  memory-karpathy                 outline of a brain made from CLI prompt characters >_
08  tailscale-personal-vpn          two pin-icons connected by a dashed line through a small globe
09  fundament21                     a rectangular foundation block grid, 4 columns × 3 rows, monochrome
10  piratebay-landing               a minimalist sailboat silhouette over horizontal scan lines
11  betaline-ai                     a chat bubble with a tiny gear inside it
12  gowinit-landing                 a single upward arrow piercing a thin horizon line
13  paintshop-proposal              a paint-spray nozzle outline emitting three dotted lines
14  ebay-automation-stack           three stacked boxes with a rotating arrow on the side (pipeline)
15  seo-geo-autopilot               a compass needle over a faint world-map outline
16  prebuy-auditor-agent            a magnifying glass over a barcode rectangle
17  ai-persona-traffic-factory      five tiny avatar circles connected to one central node
18  traffic-engine                  a fuel-pump nozzle outline emitting flow-arrows upward
19  yandex-direct-agents            a graph showing three ascending bars + a small arrow target
20  youtube-growth                  a play-triangle shape made out of upward stair-step bars
21  us-market-entry                 a doorway outline with a compass-rose half-visible behind it
22  agents-catalog                  a 3×3 mini-grid of nine identical shapes; the center one has a different stroke
```

Save each as `public/covers/<slug>.webp` exactly matching the slug column.

**Wire-up:**

1. For each MDX file in `content/items/*.mdx`, add a frontmatter line:
   ```yaml
   cover: /covers/<slug>.webp
   ```
2. In `components/Card.tsx`, above the `<header>` block inside the `<article>`, add:
   ```tsx
   {item.cover && !dense && (
     <div className="relative -mx-5 -mt-5 sm:-mx-7 sm:-mt-7 mb-5 aspect-[16/10] overflow-hidden rounded-t-xl bg-bg">
       <Image
         src={item.cover}
         alt={item.title}
         fill
         sizes="(min-width: 1024px) 33vw, 100vw"
         className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
       />
     </div>
   )}
   ```
   Add `import Image from "next/image";` at the top.

3. Run `npx velite` and confirm `cover` appears on each item. Then `npm run build`.

**Skip rule:** If you cannot produce visually consistent results across all 22 in one batch (i.e., the style drifts), **stop after T1**. A partial set of inconsistent covers is worse than none.

---

## 4. Verification (run after every task)

```bash
cd /Users/sergeyrama/Documents/ramas-site
npm run lint            # must be clean
npm run build           # must succeed; check page list at end
ls -lh public/covers    # confirm file count and sizes
ls -lh public/og-default.png public/portraits/sergey-rama.webp
```

Smoke-check the live deploy after each push:

```bash
git add -A
git commit -m "feat(visuals): <what you did>"
git push origin main
vercel deploy --prod
DEP=$(vercel ls 2>&1 | grep -oE 'https://ramas-[a-z0-9]+-sergeyramas-projects.vercel.app' | head -1)
vercel alias set "$DEP" sergeyramas.vercel.app
vercel alias set "$DEP" ramas-site.vercel.app
curl -s -o /dev/null -w "%{http_code}\n" https://sergeyramas.vercel.app
```

Alias commands must succeed and return `200`.

---

## 5. Hard rules

1. **Do not redesign.** No layout changes, no palette changes, no font swaps, no new components beyond what this brief specifies.
2. **No stock photography.** No people who do not exist. No "AI generic" gradients (purple-blue, glass orbs, abstract neon). No emoji as image content.
3. **One consistent style across all 22 covers** or zero covers. T2 is all-or-nothing.
4. **Always check `package.json` before importing a library.** `sharp` is already installed; `next/image` is built-in. Do not add `framer-motion`, `gsap`, `chakra` etc.
5. **Reduced motion / touch users:** images are static — no concerns. Don't add hover JS to images.
6. **Final commit messages** prefix with `feat(visuals):` or `chore(visuals):`. One commit per task (T1.1, T1.2, T1.3, T2).

---

## 6. When you're done

Reply with:

- ✅ T1.1 — portrait file size + source path you used (real photo or generated, and where).
- ✅ T1.2 — `og-default.png` byte size, paste the new SVG you embedded.
- ✅ T1.3 — `app/icon.png` and `app/apple-icon.png` created; favicon visible in browser tab on prod URL.
- ✅ T2 — 22 covers + count of frontmatter lines added; one example screenshot of the Card with cover (or describe layout).
- Production URL still 200 after final alias.

If any subtask is blocked (no photo, image-gen pipeline failed, style drifted), **stop and report**. Don't ship inconsistent output.
