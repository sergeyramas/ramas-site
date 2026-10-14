// Проверка внутренних ссылок контента: related во frontmatter и ссылки в теле MDX.
// Запускается после `velite` (читает .velite/*.json) и до `next build`; ненулевой код = сборка падает.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (f) => JSON.parse(readFileSync(join(root, ".velite", f), "utf8"));
const items = read("items.json");
const articles = read("articles.json");

// Статические маршруты — из app/**/page.tsx (динамические [slug] разбираем по контенту).
const routes = new Set();
(function walk(dir, rel) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === "api") continue;
      walk(full, `${rel}/${name}`);
    } else if (name === "page.tsx" && !rel.includes("[")) routes.add(rel || "/");
  }
})(join(root, "app"), "");

const pageExists = (path) => {
  const [, section, slug, ...rest] = path.split("/");
  if (rest.length) return false;
  if (section === "blog" && slug) return articles.some((a) => a.slug === slug);
  if (section === "solutions" && slug) return items.some((i) => i.kind === "solution" && i.slug === slug);
  if (section === "projects" && slug) return items.some((i) => i.kind === "project" && !i.isExternal && i.slug === slug);
  return routes.has(path.replace(/\/$/, "") || "/");
};
const fileExists = (path) => existsSync(join(root, "public", decodeURIComponent(path)));

const errors = [];
const check = (path, where) => {
  const clean = path.split("#")[0].split("?")[0];
  if (clean === "") return; // чистый якорь
  if (!pageExists(clean) && !fileExists(clean)) errors.push(`${where}: нет страницы ${path}`);
};

const files = [
  ...readdirSync(join(root, "content/items")).map((f) => `content/items/${f}`),
  ...readdirSync(join(root, "content/articles")).map((f) => `content/articles/${f}`),
];
for (const f of files) {
  if (!f.endsWith(".mdx")) continue;
  const src = readFileSync(join(root, f), "utf8");
  const body = src.replace(/^---[\s\S]*?\n---\n/, "").replace(/```[\s\S]*?```/g, "");
  for (const m of body.matchAll(/(?<!\!\[[^\]]*)\]\((\/[^)\s]*)\)/g)) check(m[1], f);
  for (const m of body.matchAll(/href="(\/[^"]*)"/g)) check(m[1], f);
}
for (const [kind, list] of [["items", items], ["articles", articles]]) {
  for (const e of list) {
    for (const r of e.related ?? []) {
      if (!pageExists(r)) errors.push(`${kind}/${e.slug}: related -> нет страницы ${r}`);
      if (r === e.url) errors.push(`${kind}/${e.slug}: related ссылается на себя`);
    }
  }
}

if (errors.length) {
  console.error(`check-links: найдено ${errors.length} битых ссылок\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`check-links: ок (${files.length} файлов)`);
