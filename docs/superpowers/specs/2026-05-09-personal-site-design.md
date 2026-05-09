# Personal Site (ramas-site) — Design Spec

**Date:** 2026-05-09
**Owner:** Сергей Рамас (псевдоним; GitHub: `sergeyramas`)
**Status:** Draft v1 — awaiting final approval before plan

---

## 1. Goal

Запустить личный сайт-витрину на Vercel, где Сергей публикует свои "упакованные решения" (гайды, скиллы, скрипты), показывает живые проекты-сайты и ведёт wishlist идей. Сайт должен быть готов к будущему добавлению платного доступа к части решений, но в v1 монетизации нет.

## 2. Positioning

**Тип:** B + слой A — каталог продуктов/решений с лёгким присутствием автора (имя, мини-bio, фото опционально). Не личный блог, не magazine-витрина.

## 3. Scope

### v1 включает

- Одностраничный Next.js-сайт с тремя витринами: Solutions, Projects, Ideas + Home + About
- 22 seed-карточки на день деплоя
- MDX-контент в гите (никакой CMS, никакой БД)
- Static deploy на Vercel default-домене
- Vercel Analytics
- Авто-OG-изображения для shared-линков
- Публичный git-репозиторий `sergeyramas/ramas-site`
- **Две темы:** светлая по умолчанию + переключатель на тёмную (через `next-themes`, иконка-toggle в Nav, выбор сохраняется в localStorage, уважается `prefers-color-scheme` при первом визите)

### v1 НЕ включает (явный YAGNI)

Auth · оплата · комментарии · поиск · фильтры/теги-страницы · RSS · i18n · email-подписка · многоязычность.

Поле `tier: paid` в frontmatter присутствует **только как заглушка** — никакой paywall-логики не пишем.

## 4. Tech Stack

| Слой | Решение |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| UI primitives | shadcn/ui (минимально — Card, Badge, Button) |
| Theming | `next-themes` (light + dark, class-based, suppressHydrationWarning) |
| Контент | MDX через `velite` (или `contentlayer`/`@next/mdx` — финальный выбор в writing-plans) |
| Шрифты | Inter (sans) + JetBrains Mono (для tech-меток) — оба через `next/font` |
| Хостинг | Vercel |
| Аналитика | Vercel Analytics |
| Domain | `ramas.vercel.app` (фолбэк: `ramas-lab.vercel.app` или `ramas-site.vercel.app`) |
| Git | Публичный repo `sergeyramas/ramas-site` |

## 5. Visual Direction

**`minimalist-skill`** — warm monochrome (тёплый off-white фон, графит вместо чистого чёрного), editorial-типографика, плотные bento-сетки без gap-ов, спокойный профессиональный тон.

**Почему этот, а не альтернативы:**
- Не конкурирует с обложками карточек
- Хорошо ложится на Karpathy-вектор (рациональный, типографичный)
- Доверительный тон под человека-эксперта, а не на маркетплейс
- Совместим с будущим переходом к коммьюнити-проекту через единый palette-родственник

**Палитра — две темы** (токены подкрутятся при first pass UI-имплементации, но без смены направления):

**Light (default):**
- Фон: warm off-white `#FAF8F4`
- Текст: graphite `#1A1A1A`
- Accent: terracotta/rust `#A04B2A`
- Линии: `#E8E5DE`

**Dark:**
- Фон: warm dark `#1A1815` (не чистый чёрный — сохраняем "тёплость")
- Текст: cream `#F5F2EB`
- Accent: brighter terracotta `#C76847` (для контраста на тёмном)
- Линии: `#2E2A24`

Один акцентный цвет на весь сайт в обеих темах — links, badges, focus rings. Переключатель — иконка sun/moon в правом углу Nav.

## 6. Content Model

Один MDX-формат для всех трёх витрин. Поле `kind` определяет, на какой странице показывается.

```yaml
---
title: "Tailscale + VPS как личный VPN"
slug: "tailscale-personal-vpn"
kind: solution         # solution | project | idea
summary: "Свой VPN на собственном сервере за 15 минут"
cover: "/covers/tailscale.jpg"   # опционально; иначе авто-OG
externalUrl: null      # если задан — карточка ведёт сразу наружу
tags: [vpn, devops, tailscale]
status: live           # live | wip | archived | concept
tier: free             # free | paid (заглушка под будущее)
date: 2026-05-09
featured: false        # показывать на главной
---
```

**Правило роутинга карточки:**
- Если `externalUrl` задан → клик ведёт сразу на внешний URL (target="_blank", rel="noopener")
- Если `externalUrl` пуст → клик ведёт на `/{kind}s/{slug}` — внутреннюю MDX-страницу

## 7. Routes

```
/                       Home: hero (one-liner) + 3-4 featured-карточки + три CTA-блока в разделы
/solutions              Грид всех solution-карточек
/solutions/[slug]       Внутренняя страница (только для карточек без externalUrl)
/projects               Грид всех project-карточек
/projects/[slug]        Внутренняя страница
/ideas                  Лента wishlist (компактные тизеры, плотнее чем solutions/projects)
/about                  Mini-bio (см. §10)
```

## 8. Repo Structure

```
ramas-site/
├── app/
│   ├── page.tsx                         # /
│   ├── solutions/
│   │   ├── page.tsx                     # /solutions
│   │   └── [slug]/page.tsx              # /solutions/[slug]
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── ideas/page.tsx                   # /ideas
│   ├── about/page.tsx                   # /about
│   ├── layout.tsx
│   └── globals.css
├── content/items/
│   └── *.mdx                            # все 22 карточки
├── components/
│   ├── Card.tsx                         # карточка-плитка
│   ├── Grid.tsx                         # bento-сетка
│   ├── Hero.tsx                         # главная страница: имя + one-liner
│   ├── PageHeader.tsx                   # заголовок витрины
│   ├── Footer.tsx
│   ├── Nav.tsx                          # навбар + ThemeToggle
│   ├── ThemeToggle.tsx                  # sun/moon-кнопка (next-themes)
│   └── ThemeProvider.tsx                # обёртка next-themes для layout.tsx
├── lib/
│   └── content.ts                       # парсинг MDX, фильтрация по kind
├── public/
│   ├── covers/                          # обложки карточек
│   └── og-default.png
├── docs/
│   └── superpowers/specs/               # этот файл
├── velite.config.ts                     # (или contentlayer.config.ts)
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

**Принцип:** каждый компонент маленький, одна ответственность. Карточки и грид не знают про MDX-парсинг — это только в `lib/content.ts`.

## 9. Seed Content (22 карточки на день деплоя)

### Solutions (8)

| Slug | Title | externalUrl | Источник |
|---|---|---|---|
| multiagent-intensive-day-1 | Multiagent Intensive — AI-Секретарь от нуля | `https://sergeyramas.github.io/multiagent-intensive-day-1/` | GH Pages |
| karpathy-wiki-bundle | Karpathy Wiki Bundle | `https://github.com/sergeyramas/karpathy-wiki-bundle` | repo |
| ramas-karpathy-tree | Ramas-Karpathy-Tree (cwd-aware memory) | `https://sergeyramas.github.io/ramas-karpathy-tree/` | GH Pages |
| idea-to-spec-trio | Idea → Spec Trio (3 Claude Code skills) | `https://sergeyramas.github.io/idea-to-spec-trio/` | GH Pages |
| karpathy-memory | Karpathy Memory KB | `https://sergeyramas.github.io/karpathy-memory/` | GH Pages |
| ebay-agents-swarm-report | eBay Agents Swarm — MacBook Contest Report | `https://sergeyramas.github.io/ebay-agents-swarm-report/` | GH Pages |
| memory-karpathy | Memory Karpathy — Personal KB | `https://github.com/sergeyramas/memory-karpathy` | repo |
| tailscale-personal-vpn | **Tailscale + VPS как личный VPN** | `null` (internal MDX) | новая внутренняя |

Текст для `tailscale-personal-vpn.mdx` зафиксирован в брainstorm-сессии 2026-05-09 (объяснение Tailscale простыми словами + 5 шагов настройки + сравнение с обычным VPN). При реализации переносим как есть, добавляем frontmatter и доводим вёрстку MDX-блоков (code-blocks, callouts, ссылки).

### Projects (6)

| Slug | Title | externalUrl |
|---|---|---|
| fundament21 | Fundament21 — миграция e-commerce | `https://fundament21.vercel.app` |
| piratebay-landing | PiratEBay — SaaS для eBay-агентов | `https://piratebay-landing.vercel.app` |
| betaline-ai | BetaLine AI — Telegram-бот + CRM + веб-чат | `https://betaline-ai.ru` |
| gowinit-landing | GoWinit Landing | `https://gowinit-landing.vercel.app` |
| paintshop-proposal | Paintshop Proposal — лендинг автомалярки | `https://paintshop-proposal.vercel.app` |
| ebay-automation-stack | eBay Automation Stack | `null` (internal MDX — текстовое описание архитектуры: GE1+PE12, closing/purchasing/tracking, мониторинг цен; без диаграмм в v1, private repo не ссылаем) |

### Ideas (8)

Из `~/Documents/Jarvis/wiki/ideas/` беру по 1 параграфу-тизеру на каждую: `seo-geo-autopilot`, `prebuy-auditor-agent`, `ai-persona-traffic-factory`, `traffic-engine`, `yandex-direct-agents`, `youtube-growth`, `us-market-entry`, `agents-catalog`.

Для каждой `kind: idea`, `status: concept`, `externalUrl: null` (или ссылка на wiki, если будет публичная зеркальная версия).

## 10. About (контент)

### Hero one-liner (на главной)

> **Сергей Рамас.** Делаю AI-операционные системы, лендинги и автоматизацию продаж. Параллельно — агентство: Яндекс.Директ, сайты, внедрение ИИ. Дроп-шиппинг на eBay (US). Здесь — мои упакованные решения и живые проекты.

### Page `/about`

> **Сергей Рамас**, UTC+3.
>
> **Агентство.** Веду агентство по Яндекс.Директу, разработке сайтов и внедрению AI-систем в бизнес-процессы. Под капотом — собственная связка из мульти-агентных систем, которые закрывают рутину быстрее людей.
>
> **Свои продукты.** [BetaLine AI](https://betaline-ai.ru) — Telegram-бот + CRM + веб-чат. [Fundament21](https://fundament21.vercel.app) — миграция e-commerce на Next.js+Directus. [PiratEBay](https://piratebay-landing.vercel.app) — SaaS-лендинг для eBay-агентов.
>
> **eBay.** Делаю reseller-бизнес в США (GE1+PE12 stores), полностью автоматизированный: closing, purchasing, tracking, мониторинг цен и стока.
>
> **AI-стек.** OpenClaw (autonomous agent на VPS) + ClaudeClaw (backup на Mac). Память построена по паттерну Karpathy LLM Wiki — мои инструменты для этого тоже здесь, в разделе Solutions.
>
> **Вне работы.** Путешествия, йога, гири, велоспорт. Прошёл полумарафон на Филиппинах.
>
> **Контакты:** [GitHub](https://github.com/sergeyramas) · fantroms@gmail.com

Без фото в v1. Можно добавить позже одной строкой.

## 11. Future Hook: Paywall (заглушка, не реализация)

В frontmatter есть поле `tier: free | paid`. В v1 поле игнорируется рендером. Когда придёт время монетизации:
- появится компонент `<PaywallGate tier={item.tier}>` оборачивающий контент
- бэкенд (Stripe / ЮKassa / Telegram-подписка / community-access) выбираем тогда отдельно
- сегодня **никакой** auth/payments инфраструктуры не закладываем

## 12. Deployment Plan (high-level — детали в writing-plans)

Порядок реализации (подтверждён владельцем):

1. **Локальная папка.** Инициализация Next.js-проекта в `~/Documents/ramas-site/`.
2. **Git.** Публичный репо `sergeyramas/ramas-site`, push в `main`.
3. **Vercel.** `vercel link` → `vercel deploy --prod`.

## 13. Out of Scope (для ясности)

- **Коммьюнити-маркетплейс** (отдельный проект с партнёром) — это другой продукт с другой моделью данных, юр.обвесом и темпом запуска. Будет браинштормиться отдельно после v1.
- **Перенос содержимого vault** (`~/Documents/Jarvis/wiki/`) на сайт целиком — нет. Только курированные тизеры в Ideas.
- **Backend, БД, auth** — нет.

## 14. Success Criteria для v1

- [ ] Сайт деплоится на `https://ramas*.vercel.app` без ошибок
- [ ] 22 карточки видны и кликабельны
- [ ] Карточка с `externalUrl` ведёт наружу, без внешнего URL — на внутреннюю MDX-страницу
- [ ] Lighthouse Performance ≥ 95 на Home
- [ ] Tailscale-карточка открывается как полноценная внутренняя страница с читаемой типографикой
- [ ] About-страница и hero one-liner на месте
- [ ] Переключатель тем светлая↔тёмная работает, выбор сохраняется в localStorage, нет FOUC при загрузке
- [ ] Никакой авторизации/оплаты не задействовано
