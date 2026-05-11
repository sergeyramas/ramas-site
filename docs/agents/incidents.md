# ramas-site — Incidents log

Постмортемы. Один инцидент = одна секция. Формат: `## YYYY-MM-DD — <slug>`.

## 2026-05-11 — vercel-auto-deploy-not-triggered

**Симптом:** после `git push origin main` новая карточка `content/items/start-goal.mdx` попала в GitHub, но `https://sergeyramas.vercel.app/solutions/start-goal` отдавал 404, а `vercel ls ramas` не показывал новый deployment.

**Причина:** Vercel project называется `ramas`, GitHub repo — `ramas-site`, canonical alias — `sergeyramas.vercel.app`. Текущий project ведёт себя как CLI-linked deploy: `git push` сам по себе не запустил production deploy.

**Фикс:** выполнить `vercel deploy --prod`, затем явно закрепить canonical alias:

```bash
vercel alias set <deployment>.vercel.app sergeyramas.vercel.app
curl -s -I https://sergeyramas.vercel.app/<path>
```

**Результат:** deployment `ramas-87nwm54al-sergeyramas-projects.vercel.app` получил alias `sergeyramas.vercel.app`; `/solutions/start-goal` вернул HTTP 200.
