# Codex Brief — T2: real raster covers (replace SVG placeholders)

You already finished T1 (portrait, OG, favicon). T1.4 (real screenshots for 5 live projects) was handled separately by another agent — those `.webp` files in `public/covers/projects/` **must not be touched.**

This brief is **T2 only**: replace 16 of the 22 SVG placeholders in `public/covers/<slug>.svg` with **generated raster images (`.webp`)** in a single, consistent visual language. Use a real image-generation API (whichever you have wired: `gpt-image-1`, DALL-E 3, Imagen, nano-banana, etc.). **No SVG, no flat-vector illustration apps, no MidJourney-style hyper-detail.**

## Working directory

`/Users/sergeyrama/Documents/ramas-site/`

## Hard rules

1. **One visual language across all 16.** They must work side-by-side as a series, like art direction in a magazine, not a sticker pack. If after the first two you cannot keep them consistent, **stop and report.**
2. **Do not touch `public/covers/projects/*.webp`** — those are real screenshots. Untouchable.
3. **Do not touch the existing SVG placeholders for the 6 cards already covered:**
   - `betaline-ai`, `fundament21`, `gowindoit-landing`, `paintshop-proposal`, `piratebay-landing`, `betaline-saas-deploy` — already use real screenshots in `public/covers/projects/<slug>.webp`. Skip them.
4. **Output format:** `.webp`, **800×500** (16:10), quality 78, ≤ 80 KB each. Use `sharp` for the resize+convert pipeline (already a dev-dependency).
5. **Color palette is non-negotiable:**
   - Background: deep warm graphite, hue close to `#16130F`. Slight warm cast, never pure black, never blue-grey.
   - Accent: terracotta close to `#DC7A4F`. One temperature, never neon-orange, never red.
   - Secondary tone: warm off-white close to `#F2EDE3`. Use sparingly.
   - Optional muted: `#948A7E` for support shapes.
6. **Composition rules:**
   - One focal subject, off-centred (rule of thirds), generous negative space around it.
   - Subtle 2-pixel grid texture in the background at 4–6% opacity. Visible but non-dominant.
   - 3–5% film grain across the whole image, baked in.
   - The bottom-left of every cover: a 14-pixel monospaced label `[NN]` in terracotta, where NN is the index from the list below. Add this with `sharp` after generation, not via the model — the model will mangle text.
7. **Do not include any text, logos, brand marks, or human faces** in the generated images themselves. The label is the only text, and it's added in post-processing.
8. **Style anchor — describe in every prompt** so the API model stays consistent:
   > "Editorial concept-art still life. Warm graphite background `#16130F` with subtle paper grain. Single object lit from upper-left with warm key light, soft shadow. Object rendered as a stylised 3D matte plaster sculpture or carved object, terracotta `#DC7A4F` and bone `#F2EDE3` material. Off-centred, third-rule composition, generous negative space. Cinematic, calm, slightly mysterious. No text, no logos, no people, no AI-style hyperdetail."

   Append the per-card subject from the list below to this anchor for each generation.

## The 16 cards

Format: `index  slug  subject (use as the subject line of your prompt)`

```
01  multiagent-intensive-day-1   a small terracotta envelope morphing into the silhouette of a tiny bot head with two glowing dot-eyes
02  karpathy-wiki-bundle          three sculpted nodes connected by tense thin threads forming a triangle, with a small bone-white brain at the centre
03  ramas-karpathy-tree           a stylised pine-tree silhouette assembled from terminal-style brackets [ ] { }, made of layered terracotta plaster
04  idea-to-spec-trio             a glowing terracotta lightbulb whose lower half opens into three nested carved tablets like a folded document
05  karpathy-memory               a stack of three open thin folder shapes carved from terracotta, top one fanned open with faint paper-line marks
06  ebay-agents-swarm-report      a single large terracotta hexagon containing seven smaller hex cells, faintly lit from within
07  memory-karpathy               a half-translucent bone-white brain shape made of overlapping thin >_ prompt characters, glowing softly
08  tailscale-personal-vpn        two map-pin sculptures connected by a dashed thread arcing over a small floating bone-white globe
09  ebay-automation-stack         three stacked terracotta blocks with a thick ribbon-arrow curving around the right side, suggesting a pipeline
10  seo-geo-autopilot             a compass needle pointing north over a faint half-visible bone-white world-map outline
11  prebuy-auditor-agent          a magnifying glass with a terracotta rim hovering over a barcode of five carved bars
12  ai-persona-traffic-factory    five small bone-white avatar discs connected to one larger terracotta central node by thin radiating threads
13  traffic-engine                a terracotta fuel-pump nozzle outline emitting three thin upward flow-arrows
14  yandex-direct-agents          three ascending terracotta bars and a small bone-white target/crosshair to the right
15  youtube-growth                a play-triangle assembled from upward stair-step bars of varied height, terracotta on graphite
16  us-market-entry               a doorway carved in terracotta with a faint bone-white compass-rose half-visible behind it
17  agents-catalog                a 3×3 mini-grid of nine identical sculpted discs, the centre one slightly larger and lighter in tone
```

(Yes, 17 lines but only 16 actual covers — `08` and `12` numbering already exists in `01-17` indexing. The `[NN]` label uses the same number — do not renumber.)

Skip these slugs (they are already covered by real screenshots, listed in §3): `betaline-ai`, `fundament21`, `gowindoit-landing`, `paintshop-proposal`, `piratebay-landing`, `betaline-saas-deploy`.

## Pipeline per cover

```
1. Build the prompt:  STYLE_ANCHOR + " " + SUBJECT_LINE
2. Call the image-gen API:
     model: best available raster model (gpt-image-1 preferred, else dall-e-3 quality=hd, else equivalent)
     size: 1792x1024 or larger (we will downscale)
     style/strength: not photorealistic, not cartoon — concept-art / matte sculpture
3. Save the raw output to /tmp/codex-covers-raw/<slug>.png
4. Use sharp to:
     - centre-crop to 16:10 if needed
     - resize to exactly 800x500 with fit:"cover", position:"attention"
     - composite the [NN] label as text:
         * font-family: JetBrains Mono / Menlo / monospace
         * font-size: 14px
         * font-weight: 700
         * fill: #DC7A4F
         * x=24, y=475 (16px from bottom-left)
     - apply quality:78 webp
   Save to public/covers/<slug>.webp
5. Delete public/covers/<slug>.svg
6. In content/items/<slug>.mdx, replace
     cover: /covers/<slug>.svg
   with
     cover: /covers/<slug>.webp
```

## Quality gate

After generating the **first two** covers (`01 multiagent-intensive-day-1` and `02 karpathy-wiki-bundle`):

1. View them side-by-side. Do they look like the same series?
2. Is the warm graphite background actually warm graphite (not blue-black)?
3. Is the terracotta the right hue (not too red, not too orange)?
4. Same lighting direction? Same level of detail? Same "weight"?

**If any answer is no — stop and report.** Adjust the style anchor (more weight on "matte plaster sculpture" or "calm cinematic" or whatever drifted), regenerate the two, then continue. **Do not push 16 covers that don't sit together.**

## Verification

```
ls public/covers/*.webp | wc -l        # must equal 16
ls public/covers/*.svg | wc -l         # must equal 0  (all deleted)
file public/covers/*.webp | head -3    # spot-check dimensions
grep '^cover:' content/items/*.mdx | wc -l   # must equal 22 still
grep '/covers/.*\.svg' content/items/*.mdx   # must be empty (no svg references left)

npm run lint
npm run build       # must succeed
```

## Deploy + alias

```
git add -A
git commit -m "feat(visuals): T2 — 16 generated raster covers (replace SVG placeholders)"
git push origin main
vercel deploy --prod
DEP=$(vercel ls 2>&1 | grep -oE 'https://ramas-[a-z0-9]+-sergeyramas-projects.vercel.app' | head -1)
vercel alias set "$DEP" sergeyramas.vercel.app
vercel alias set "$DEP" ramas-site.vercel.app
curl -s -o /dev/null -w "%{http_code}\n" https://sergeyramas.vercel.app    # 200
curl -s -o /dev/null -w "%{http_code}\n" https://sergeyramas.vercel.app/covers/multiagent-intensive-day-1.webp    # 200
```

## Anti-patterns — these will be rejected on review

- Different lighting direction across covers. Pick one (top-left key light) and stick to it.
- One cover with strong perspective and another flat — pick a depth language and stick to it.
- Glow / neon / synthwave / glassmorphism / 3D-render-cinema-4d look. The anchor is **matte plaster sculpture**, not Behance trend feed.
- Pure white shapes. Use bone `#F2EDE3`, never `#FFFFFF`.
- Pure black background. Use warm graphite `#16130F`.
- The model adds text or numbers — strip them and re-prompt with stronger "no text, no letters, no numbers" negative.
- Hyperdetailed AI-render with intricate filigree. The covers are calm and confident, not busy.
- Cards that drift toward the same subject (every other one ends up being a vague "node graph"). Make each subject specific.

## When done

Reply with:

- A 4×4 grid screenshot of all 16 covers (you can use `sharp.composite` or save and view in Finder).
- File listing of `public/covers/` confirming `.webp` count and zero `.svg`.
- Production curl status.
- One-paragraph self-review on whether the series sits together.

If you cannot achieve consistent style after two attempts at the first two covers — stop and report. Better no T2 than 16 cards that fight each other.
