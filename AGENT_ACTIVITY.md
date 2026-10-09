# Agent Activity Log — ramas-site

Координация агентов для личного хаба `sergeyramas.vercel.app`.

> Глобальный fleet-ledger — `~/Documents/agent-fleet/`.

## Active

## Recently Completed

- [2026-10-09] **claude-local-opus** (mac) — topic: `haiku-55-video-credits` — DONE
  В статью `haiku-55-pochti-besplatnaya-rabota` добавлено видео (YouTube, nocookie-iframe 16:9) с подписью, абзац про API-кредиты (только Max 5x и Max 20x) и CTA на @ramas_lab. `npm run build` без ошибок, проверено на проде.

- [2026-10-04] **cursor-cloud** — topic: `author-handoff` — DONE (SHA `78e97ed`)
  Имя автора в статьях блога приведено к публичному. Из июльской handoff-заметки убрана одна устаревшая строка. `npm run lint` и `npm run build` прошли без ошибок.

- [2026-09-27] **cursor-cloud** — topic: `sitemap-live-urls` — DONE (SHA `7f91793`)
  Sitemap больше не включает внешние project без страницы (404: betaline-ai, betaline-saas-deploy, logika-itp, piratebay-landing, gowindoit-landing, rockmesh). Набор slug совпадает с `generateStaticParams`. Добавлен `/gaps`. Lint/build чисто, локально все URL карты отдают 200. Прод не деплоился.

- [2026-09-27] **cursor-cloud** — topic: `blog-template-seo` — DONE (SHA `9c67d6f`)
  Шаблон статей: FAQ без сырого HTML, один H1, валидный Article/BreadcrumbList, og:image с запасной обложкой, связанные «Читайте также», WebP схемы бэкапа, имя автора «Сергей Рамас». RSS `/rss.xml`, `/llms.txt`. Метрика и GA4 только из env. Прод не деплоился.

- [2026-09-27] **cursor-cloud** — topic: `blog-nav` — DONE (SHA `09b321b`)
  Пункт «Блог» в шапке (с `lg`) и в мобильном меню, ссылка `/blog`. Список и статьи уже были: коллекция Velite `articles`, путь `content/articles/*.mdx`, sitemap и metadata на месте. Пример-статью не добавлял — в репозитории уже 5 статей конвейера. Прод не деплоился.

- [2026-07-07] **claude-local-opus48** (mac) — topic: `add-ponytail-card` — DONE (SHA `d99f105`)
  Добавлена solution-карточка Ponytail (плагин ленивого сеньора, `DietrichGebert/ponytail`) + hand-authored cover `public/covers/ponytail.svg` в бренд-палитре. Внешняя ссылка на GitHub-репо. Lint/build чисто, задеплоено на прод (`vercel deploy --prod` + alias), проверено `sergeyramas.vercel.app/solutions`.

- [2026-05-10 13:55 UTC] **claude-local-opus47** (mac) — topic: `bootstrap-agent-context` — DONE
  Инициализирован agent-context: `CLAUDE.md` по 11-секционному шаблону, этот `AGENT_ACTIVITY.md`, `.claude/settings.json` с разрешёнными `npm run dev/build/lint/content`, `docs/agents/incidents.md`. Раскатка единой системы agent-context на все активные проекты.

---

## Регламент

### 1. Перед стартом
1. `git pull --rebase`
2. Прочитать `## Active`
3. Если файлы пересекаются — стоп, оператору
4. Запись в `Active` (наверх): `[YYYY-MM-DD HH:MM UTC] **<agent-id>** (<host>) — topic: <slug> — branch: <branch> — files: <paths> — ETA: <min>`
5. `chore: claim work on <topic>` + `git push`

### 2. Во время работы
- Расширился scope — обновить `Active` ДО правки новых файлов
- >30 мин — `git fetch && git rebase origin/main`
- Verification gate — § 6 в CLAUDE.md

### 3. После
1. Перенести в `Recently Completed` с SHA
2. Удалить старше 7 дней
3. `chore: release work on <topic>` + `git push` → Vercel auto-deploy

### 4. Идентификация
`claude-local-opus47`, `claude-vps-sonnet46`, `codex-local`.

### 5. Что писать
**Требует:** `app/`, `components/`, `lib/`, `content/items/`, конфиги, CLAUDE.md, scripts/.
**Не требует:** read-only.

### 6. Stale
>2ч без коммитов = stale. Спросить оператора → `(released by <id> — stale)`.

### 7. Связь с fleet-ledger
START/DONE — одна строка в `~/Documents/agent-fleet/AGENT_ACTIVITY.md` (хук пишет автоматически).
