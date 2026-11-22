#!/usr/bin/env python3
"""Собирает ежедневный выпуск /news: RSS -> DeepSeek (OpenCode Go) -> data/news/issues.json.

Запуск вручную:      python3 scripts/news/generate.py
Без записи в файл:   python3 scripts/news/generate.py --dry-run
Без git push:        python3 scripts/news/generate.py --no-push
Своя дата:           python3 scripts/news/generate.py --date 2026-11-08

Источники: TechCrunch AI, CoinDesk, BBC World + котировки CoinGecko.
Текст на русском делает oc-llm (подписка OpenCode Go, DeepSeek V4.1 Flash).
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import html
import json
import os
import re
import subprocess
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DATA = REPO / "data" / "news" / "issues.json"
OC_LLM = Path.home() / ".claude" / "scripts" / "oc-llm"

FEEDS = [
    ("ai", "TechCrunch", "https://techcrunch.com/category/artificial-intelligence/feed/"),
    ("crypto", "CoinDesk", "https://www.coindesk.com/arc/outboundfeeds/rss/"),
    ("world", "BBC", "https://feeds.bbci.co.uk/news/world/rss.xml"),
]
SECTION_TITLES = {
    "ai": "Искусственный интеллект",
    "crypto": "Криптовалюты",
    "world": "Главное в мире",
}
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129 Safari/537.36"


def get(url: str, timeout: int = 30) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def strip_html(s: str, limit: int = 260) -> str:
    s = re.sub(r"<[^>]+>", " ", s or "")
    s = html.unescape(re.sub(r"\s+", " ", s)).strip()
    return s[:limit].rsplit(" ", 1)[0] + "…" if len(s) > limit else s


def parse_dt(value: str | None) -> dt.datetime | None:
    if not value:
        return None
    for fmt in ("%a, %d %b %Y %H:%M:%S %z", "%a, %d %b %Y %H:%M:%S %Z", "%Y-%m-%dT%H:%M:%S%z"):
        try:
            d = dt.datetime.strptime(value.strip(), fmt)
            return d if d.tzinfo else d.replace(tzinfo=dt.timezone.utc)
        except ValueError:
            continue
    return None


def rss_image(node) -> str | None:
    """Картинка из RSS: media:content / media:thumbnail / enclosure / <img> в описании."""
    best = None
    for ch in node.iter():
        tag = ch.tag.split("}")[-1].lower()
        attrs = {k.lower(): v for k, v in (ch.attrib or {}).items()}
        url = attrs.get("url")
        if not url:
            continue
        if tag in ("content", "thumbnail") and "ichef.bbci.co.uk" in url:
            url = re.sub(r"/\d{2,4}/", "/800/", url)
        if tag in ("content", "thumbnail", "enclosure"):
            kind = attrs.get("type", "") or attrs.get("medium", "")
            if "image" in kind or re.search(r"\.(jpe?g|png|webp)(\?|$)", url, re.I):
                if not best or tag == "content":
                    best = url
    if best:
        return html.unescape(best)
    desc = node.findtext("description") or ""
    m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', desc)
    return html.unescape(m.group(1)) if m else None


def og_image(page_url: str) -> str | None:
    """Fallback: og:image со страницы статьи."""
    try:
        raw = get(page_url, timeout=20).decode("utf-8", "ignore")
    except Exception:
        return None
    m = re.search(r'<meta[^>]+(?:property|name)=["\'](?:og:image|twitter:image)["\'][^>]+content=["\']([^"\']+)', raw, re.I)
    if not m:
        m = re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\'](?:og:image|twitter:image)', raw, re.I)
    return html.unescape(m.group(1)) if m else None


def download_image(img_url: str, date: str, key: str) -> str | None:
    """Скачивает картинку в public/news/<date>/ и возвращает веб-путь."""
    try:
        req = urllib.request.Request(img_url, headers={"User-Agent": UA, "Referer": img_url})
        with urllib.request.urlopen(req, timeout=25) as r:
            blob = r.read(4_000_000)
            ctype = r.headers.get("Content-Type", "")
    except Exception:
        return None
    if not ctype.startswith("image/") or len(blob) < 4000:
        return None
    ext = "jpg" if "jpeg" in ctype or "jpg" in ctype else ctype.split("/")[-1].split(";")[0][:4]
    name = hashlib.sha1(key.encode()).hexdigest()[:10]
    folder = REPO / "public" / "news" / date
    folder.mkdir(parents=True, exist_ok=True)
    (folder / f"{name}.{ext}").write_bytes(blob)
    return f"/news/{date}/{name}.{ext}"


def fetch_feed(bucket: str, source: str, url: str, max_age_h: int) -> list[dict]:
    try:
        root = ET.fromstring(get(url))
    except Exception as e:  # noqa: BLE001
        print(f"! {source}: не удалось прочитать ленту ({e})", file=sys.stderr)
        return []

    now = dt.datetime.now(dt.timezone.utc)
    items = []
    for node in root.iter("item"):
        title = (node.findtext("title") or "").strip()
        link = (node.findtext("link") or "").strip()
        desc = strip_html(node.findtext("description") or "")
        published = parse_dt(node.findtext("pubDate"))
        if not title or not link:
            continue
        if published and (now - published).total_seconds() > max_age_h * 3600:
            continue
        hours = round((now - published).total_seconds() / 3600) if published else None
        items.append({
            "bucket": bucket,
            "source": source,
            "title": html.unescape(title),
            "url": link,
            "summary": desc,
            "age": hours,
            "img": rss_image(node),
        })
        if len(items) >= 12:
            break
    return items


def prices() -> list[dict]:
    try:
        raw = json.loads(get(
            "https://api.coingecko.com/api/v3/simple/price"
            "?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true"
        ))
    except Exception as e:  # noqa: BLE001
        print(f"! цены недоступны ({e})", file=sys.stderr)
        return []

    out = []
    for cid, label, digits in (("bitcoin", "BTC", 0), ("ethereum", "ETH", 2), ("solana", "SOL", 2)):
        d = raw.get(cid)
        if not d:
            continue
        chg = round(d.get("usd_24h_change", 0), 2)
        price = d["usd"]
        out.append({
            "label": label,
            "value": f"${price:,.{digits}f}".replace(",", " ").replace(".", "."),
            "change": f"{'+' if chg >= 0 else '−'}{abs(chg):.2f}%",
            "dir": "up" if chg >= 0 else "down",
        })
    return out


PROMPT = """Ты редактор ежедневной новостной сводки для сайта Сергея Рамаса.
Ниже — свежие материалы из RSS (английский). Сделай из них выпуск на русском.

Правила:
- 3 раздела: ai (ИИ), crypto (крипта), world (мир). В каждом 4 материала.
- Первый материал раздела ai — главный за день: дай ему summary на 3–4 предложения, остальным — 1–2 предложения.
- Только факты из предоставленных материалов. Не выдумывай цифры, имена и события.
- Заголовки — короткие, в стиле газетной вёрстки, без кликбейта.
- url бери ровно тот, что в источнике.
- time — человеческое «сегодня», «3 часа назад», «6 ноября» по полю age.
- Никакого маркдауна, только JSON.

Формат ответа (строго):
{"glance":["5 коротких фактов дня, по одному предложению каждый"],"sections":[{"id":"ai","kicker":"Искусственный интеллект","items":[{"title":"...","summary":"...","source":"TechCrunch","time":"сегодня","url":"https://..."}]},{"id":"crypto","kicker":"Криптовалюты","items":[...]},{"id":"world","kicker":"Главное в мире","numbered":true,"items":[...]}]}

Материалы:
"""


def ask_llm(items: list[dict]) -> dict | None:
    lines = []
    for it in items:
        age = f"{it['age']} ч назад" if it.get("age") is not None else ""
        lines.append(f"- [{it['bucket']}] {it['source']} | {it['title']} | {age} | {it['url']} | {it['summary'][:220]}")
    prompt = PROMPT + "\n".join(lines)

    if not OC_LLM.exists():
        print("! oc-llm не найден", file=sys.stderr)
        return None

    try:
        proc = subprocess.run([str(OC_LLM)], input=prompt, capture_output=True, text=True, timeout=600)
    except Exception as e:  # noqa: BLE001
        print(f"! oc-llm упал: {e}", file=sys.stderr)
        return None
    if proc.returncode != 0:
        print(f"! oc-llm код {proc.returncode}: {proc.stderr[:300]}", file=sys.stderr)
        return None

    text = proc.stdout.strip()
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        print("! в ответе модели нет JSON", file=sys.stderr)
        return None
    try:
        payload = json.loads(m.group(0))
    except json.JSONDecodeError as e:
        print(f"! JSON не разобрался: {e}", file=sys.stderr)
        return None

    glance = payload.get("glance")
    if isinstance(glance, list):
        payload["glance"] = [str(g).strip() for g in glance if str(g).strip()][:6]
    else:
        payload.pop("glance", None)

    sections = payload.get("sections")
    if not isinstance(sections, list) or len(sections) < 2:
        print("! в ответе нет секций", file=sys.stderr)
        return None
    for s in sections:
        if not isinstance(s.get("items"), list) or not s["items"]:
            print("! пустая секция", file=sys.stderr)
            return None
        s.setdefault("kicker", SECTION_TITLES.get(s.get("id"), "Новости"))
        for it in s["items"]:
            it.setdefault("source", "—")
            if not it.get("url", "").startswith("http"):
                it.pop("url", None)
    return payload


def attach_images(payload: dict, by_url: dict[str, dict], date: str) -> int:
    """Проставляет item['image'] (скачанный локально) для выбранных материалов."""
    got = 0
    for section in payload["sections"]:
        for item in section["items"]:
            url = item.get("url")
            if not url:
                continue
            candidate = (by_url.get(url) or {}).get("img") or og_image(url)
            if not candidate:
                continue
            web_path = download_image(candidate, date, url)
            if web_path:
                item["image"] = web_path
                got += 1
    return got


def fallback(items: list[dict]) -> dict:
    """Если модель недоступна — выпуск из сырых заголовков (без перевода)."""
    sections = []
    for bucket, title in SECTION_TITLES.items():
        chunk = [i for i in items if i["bucket"] == bucket][:4]
        if not chunk:
            continue
        sections.append({
            "id": bucket,
            "kicker": title,
            "items": [{
                "title": i["title"],
                "summary": i["summary"],
                "source": i["source"],
                "time": f"{i['age']} ч назад" if i.get("age") is not None else "",
                "url": i["url"],
            } for i in chunk],
        })
    return {"sections": sections}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", default=dt.date.today().isoformat())
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--no-push", action="store_true")
    ap.add_argument("--max-age", type=int, default=30, help="сколько часов назад считать свежим")
    args = ap.parse_args()

    items: list[dict] = []
    for bucket, source, url in FEEDS:
        got = fetch_feed(bucket, source, url, args.max_age)
        print(f"· {source}: {len(got)} материалов")
        items.extend(got)

    if not items:
        print("нет материалов — выпуск не собираю", file=sys.stderr)
        return 1

    payload = ask_llm(items) or fallback(items)
    by_url = {i["url"]: i for i in items}
    with_images = attach_images(payload, by_url, args.date)
    print(f"· картинок: {with_images}")
    ticker = prices()

    issue = {
        "date": args.date,
        "generatedAt": dt.datetime.now().astimezone().isoformat(timespec="seconds"),
        "title": "Сводка дня",
        "standfirst": "Искусственный интеллект · Криптовалюты · Главное в мире",
        "ticker": ticker,
        "sections": payload["sections"],
        "numbers": [{"label": t["label"], "value": t["value"]} for t in ticker],
        "sources": sorted({i["source"] for i in items}),
    }
    if not issue["ticker"]:
        issue.pop("ticker")
        issue["ticker"] = [{"label": "BTC", "value": "—"}]

    if args.dry_run:
        print(json.dumps(issue, ensure_ascii=False, indent=2)[:4000])
        return 0

    data = json.loads(DATA.read_text()) if DATA.exists() else {"issues": []}
    data["issues"] = [i for i in data["issues"] if i["date"] != issue["date"]]
    data["issues"].insert(0, issue)
    data["issues"].sort(key=lambda i: i["date"], reverse=True)
    data["issues"] = data["issues"][:90]
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")

    n_items = sum(len(s["items"]) for s in issue["sections"])
    print(f"✓ выпуск {issue['date']}: {len(issue['sections'])} раздела, {n_items} материалов")

    if args.no_push:
        return 0

    env = {**os.environ, "GIT_AUTHOR_NAME": "news-bot", "GIT_AUTHOR_EMAIL": "news@ramas.dev",
           "GIT_COMMITTER_NAME": "news-bot", "GIT_COMMITTER_EMAIL": "news@ramas.dev"}
    def run(*args, check=True):
        r = subprocess.run(["git", "-C", str(REPO), *args], capture_output=True, text=True, env=env)
        if check and r.returncode != 0:
            print(f"! git {args[0]} -> {r.stderr.strip()[:300]}", file=sys.stderr)
        return r

    run("fetch", "origin", "main", check=False)
    run("rebase", "origin/main", check=False)
    run("add", "data/news/issues.json", "public/news")
    commit = run("commit", "-m", f"news: выпуск {issue['date']}", check=False)
    if commit.returncode != 0 and "nothing to commit" not in commit.stdout:
        print(f"! commit -> {commit.stderr.strip()[:200]}", file=sys.stderr)
        return 1
    push = run("push", "origin", "HEAD:main")
    if push.returncode != 0:
        return 1
    print("✓ запушено")
    return 0


if __name__ == "__main__":
    sys.exit(main())
