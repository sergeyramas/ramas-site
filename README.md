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
