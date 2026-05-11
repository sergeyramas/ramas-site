# Agent Activity Log — ramas-site

Координация агентов для личного хаба `sergeyramas.vercel.app`.

> Глобальный fleet-ledger — `~/Documents/agent-fleet/`.

## Active

## Recently Completed

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
