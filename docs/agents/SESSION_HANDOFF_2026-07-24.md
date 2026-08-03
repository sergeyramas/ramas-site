# Handoff — ramas-site (хаб личного бренда) — 2026-07-24

## Status
Масштабное обновление хаба сделано, задеплоено в прод (Vercel CLI) и вынесено в PR.
Ветка `content/hub-refresh` → PR #1 (open). Осталось: догрузить заблокированные скрины админок (нужны файлы от Серёги) и смёржить PR.

## Read first (in order)
1. `CLAUDE.md` — правила репо (Next.js 16 + Velite; карточки в `content/items/*.mdx`)
2. PR: https://github.com/sergeyramas/ramas-site/pull/1
3. `content/items/*.mdx` — сами карточки (правим их, не app-код)

## In-session decisions
- **Даты скрыты** (реверсивно): подписи на `/gaps` + `datePublished`/`publishedTime` в OG/JSON-LD (`app/projects|solutions/[slug]/page.tsx`). Вернуть — восстановить эти строки.
- **НПЗ-кейс полностью анонимен** (`seo-vzryv-agentnaya-sistema.mdx`): без ниши/сайта/топлива/войны. Не деанонить.
- **Скрины браузера и вставленные в чат картинки нельзя сохранить в файл** — только headless-захват пишется на диск. Закрытые админки за паролем (`ebay-drop-console` 401, `pcmarket-ai-seller/admin` login) — сам не сниму.
- **Обложки** — единая система SVG line-art (тёмная база + сетка + зерно + один акцент), скрипты рендера гоняю из `~/Documents/Betaline NEW V1/` (там установлен Playwright/sharp).
- **Чистый контур**: без имён поставщиков, без GE1/PE12 (→ «грузинский/перуанский»), без IP/ключей.

## Next step
Ждать, пока Серёга положит файлы скринов в `public/shots/` (eBay-админка, Узбекистан веб-админка + его Telegram-скрин) → вставить `![...](/shots/...)` в `ebay-automation-stack.mdx` и `ai-prodavec-magazin-uzbekistan.mdx` → `npm run build` → `vercel --prod --yes`. Либо смёржить PR #1.

## Loose ends
- Письмо Владиславу застейджено в @RamassistBoss_bot (`base-vps:/root/jarvis/state/send_draft.json`) — ждёт ✅ Серёги.
- Прод задеплоен из рабочей копии через CLI; при мёрже PR в `main` git-интеграция Vercel пересоберёт (контент совпадает).

## First message
```
Продолжаю обновление хаба ramas-site (~/Documents/ramas-site). Не начинай пока не скажу.

Прочитай:
1. `~/Documents/ramas-site/docs/agents/SESSION_HANDOFF_2026-07-24.md`
2. `~/Documents/ramas-site/CLAUDE.md`
3. PR https://github.com/sergeyramas/ramas-site/pull/1

Мы на ветке `content/hub-refresh`. Осталось догрузить скрины закрытых админок (я положу файлы в `public/shots/`) и решить по мёржу PR. Жди мою команду.
```
