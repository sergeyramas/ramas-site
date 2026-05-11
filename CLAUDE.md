# ramas-site — agent context

## 1. Identity

- **Что это:** личный сайт-хаб Серёги Рамаса — Solutions / Projects / Ideas. Витрина работ, лендинг профиля
- **Зачем:** одна точка входа для клиентов и нанимателей; маркер «вот что я сделал и могу»
- **Статус:** live, активная итерация
- **Vault:** auto-memory `sergeyramas_hub.md`

## 2. External IDs & URLs

| Что | Где |
|---|---|
| GitHub repo | `sergeyramas/ramas-site` |
| Vercel project | `ramas` |
| Production URL | https://sergeyramas.vercel.app |
| Vault | `~/.claude/projects/.../memory/sergeyramas_hub.md` |
| Старые aliases | `ramas-two.vercel.app`, `ramas-site.vercel.app` — не считать каноном |

## 3. Stack

- **Frontend:** Next.js 16.2.6 (App Router, Turbopack), React 19.2.4, TypeScript
- **Styling:** Tailwind v4, `tailwind-merge`, `clsx`
- **Контент:** velite + MDX (`content/items/*.mdx`)
- **Темы:** `next-themes`
- **Аналитика:** `@vercel/analytics`
- **Прочее:** `suncalc`, `lucide-react`, `zod`

## 4. Layout

```
ramas-site/
├── CLAUDE.md
├── AGENT_ACTIVITY.md
├── README.md
├── .claude/settings.json
├── app/                  # Next.js App Router
├── components/
├── content/items/        # MDX-карточки (Solutions / Projects / Ideas)
├── lib/
├── docs/
│   ├── agents/incidents.md
│   └── superpowers/specs/2026-05-09-personal-site-design.md
├── scripts/
└── public/
```

## 5. Commands

| Задача | Команда |
|---|---|
| dev | `npm run dev` (velite watch + next dev --turbopack) |
| build | `npm run build` |
| lint | `npm run lint` |
| content rebuild | `npm run content` |
| start prod-превью | `npm start` |
| Деплой | `git push` + `vercel deploy --prod` + verify `sergeyramas.vercel.app` |

Перед стартом — `nvm use && npm install`.

## 6. Verification — Definition of Done

- [ ] `npm run lint` чистый
- [ ] `npm run build` без ошибок (velite + next build)
- [ ] Карточка появляется на проде по своему URL после `git push`
- [ ] Mobile-screenshot iPhone SE (320 px) — не ломается
- [ ] `AGENT_ACTIVITY.md` — запись в Recently Completed с SHA
- [ ] При добавлении новой MDX-карточки — frontmatter содержит все обязательные поля (`title`, `slug`, `kind`, `summary`, `date`)

## 7. Guardrails — NEVER без явного подтверждения оператора

- ❌ `git push --force` на main
- ❌ Удалять или переименовывать существующие `content/items/*.mdx` без согласования (внешние ссылки могут вести на slug)
- ❌ Менять Vercel project name `ramas` — это сломает прод-домен
- ❌ Создавать дубль на vercel (типа `ramas-two`) — путаница с прошлого раза, удалили
- ❌ Коммитить `.env.local` или Vercel env vars

## 8. Domain rules

- **Каждая карточка = `.mdx` в `content/items/`.**
  Why: velite парсит каталог; иной источник контента не подцепится.
  How to apply: новая работа → новый файл `<slug>.mdx`, не править существующие.

- **Для внешних работ — `externalUrl`, для внутренних статей — `null` + MDX-тело.**
  Why: разные UX-паттерны на карточке; кнопка vs читалка.
  How to apply: GitHub Pages / live demo → `externalUrl`; внутренний разбор → `null`.

- **Тёмная/светлая тема через `next-themes` обязательны.**
  Why: уже встроено, изменения должны учитывать обе.
  How to apply: при добавлении новых компонентов — проверить обе темы.

## 9. Known gotchas

- **Velite запускается параллельно Next в dev** (`velite --watch & next dev`) — если не прогнать `npm run content` после клона, карточки пустые
- **`@studio-freight/lenis` deprecated** — если решишь добавить smooth scroll, ставь новый пакет `lenis`
- **Vercel project confusion** — project name is `ramas`, repo is `ramas-site`, canonical URL is `sergeyramas.vercel.app`. Do not create/rename projects to "ramas-site".
- **Git push does not reliably auto-deploy** — after pushing, run `vercel deploy --prod`, then `vercel alias set <deployment>.vercel.app sergeyramas.vercel.app`, then verify the canonical URL.

## 10. Skills routing

| Задача | Скилл |
|---|---|
| Добавить новую карточку (контент) | прямо `Edit` в `content/items/` |
| Редизайн / анимации | `superpowers:brainstorming` → `superpowers:writing-plans` |
| Перед merge | `/site-verifier` |
| Перед деплоем | `/ship-to-vercel` or manual `vercel deploy --prod` |
| Опубликовать skill | `~/.claude/skills/publish-skill/SKILL.md` |
| Brand DNA reference | `/awesome-design-md` (вдохновение, не копи 1:1) |

## 11. Pointers

- **Координация:** [`AGENT_ACTIVITY.md`](AGENT_ACTIVITY.md)
- **Полная дизайн-спека:** [`docs/superpowers/specs/2026-05-09-personal-site-design.md`](docs/superpowers/specs/2026-05-09-personal-site-design.md)
- **Инциденты:** [`docs/agents/incidents.md`](docs/agents/incidents.md)
- **README:** [`README.md`](README.md)
- **Auto-memory:** `sergeyramas_hub.md`
