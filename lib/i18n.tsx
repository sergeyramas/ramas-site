"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ru" | "en";

const dict: Record<Lang, Record<string, string>> = {
  ru: {
    "nav.solutions": "Решения",
    "nav.projects": "Проекты",
    "nav.ideas": "Идеи",
    "nav.about": "Обо мне",

    "home.featured": "Избранное",
    "home.all": "все →",
    "home.browse": "Разделы",
    "home.solutions.desc":
      "Упакованные гайды, скиллы и скрипты — то, что можно унести в свой проект уже сегодня.",
    "home.projects.desc":
      "Живые сайты и продукты. Что-то под клиентов, что-то моё собственное.",
    "home.ideas.desc":
      "Что хочется сделать, но руки пока не дошли. Открыто к обсуждению.",
    "home.open": "Открыть",

    "founder.role": "Founder · AI Operations Architect",
    "founder.bio":
      "Веду агентство по Яндекс.Директу, разработке сайтов и внедрению AI-систем в бизнес-процессы. Под капотом — мульти-агентные системы, которые закрывают рутину быстрее людей. Параллельно строю в США полностью автоматизированный reseller-бизнес на eBay. Здесь, на хабе — упакованные решения, гайды и стэки. Бери и внедряй.",
    "founder.stat.solutions": "решения, проекта и идеи",
    "founder.stat.products": "товаров на Next.js",
    "founder.stat.stores": "магазина на eBay автоматизированы",
    "founder.cta.more": "Подробнее",
    "founder.cta.tg": "Связаться в Telegram",
    "founder.status": "online · открыт к проектам · 2026",

    "ext.guide": "Полный гайд",
    "ext.open": "Открыть",
    "ext.preview": "превью",
    "ext.live": "live",

    "kind.solution": "Решение",
    "kind.project": "Проект",
    "kind.idea": "Идея",

    "lang.toggle.label": "Язык",
  },
  en: {
    "nav.solutions": "Solutions",
    "nav.projects": "Projects",
    "nav.ideas": "Ideas",
    "nav.about": "About",

    "home.featured": "Featured",
    "home.all": "all →",
    "home.browse": "Browse by kind",
    "home.solutions.desc":
      "Packaged guides, skills and scripts — things you can drop into your own project today.",
    "home.projects.desc":
      "Live sites and products. Some for clients, some my own.",
    "home.ideas.desc":
      "Things I want to build but haven't gotten to yet. Open to discussion.",
    "home.open": "Open",

    "founder.role": "Founder · AI Operations Architect",
    "founder.bio":
      "I run an agency for Yandex.Direct, website development and AI integrations in business processes. Under the hood — multi-agent systems that close routine faster than humans. In parallel I'm building a fully-automated reseller business on eBay (US). On this hub — packaged solutions, guides and stacks. Grab and ship.",
    "founder.stat.solutions": "solutions, projects and ideas",
    "founder.stat.products": "products migrated to Next.js",
    "founder.stat.stores": "automated eBay stores",
    "founder.cta.more": "Read more",
    "founder.cta.tg": "Reach me on Telegram",
    "founder.status": "online · open to projects · 2026",

    "ext.guide": "Full guide",
    "ext.open": "Open",
    "ext.preview": "preview",
    "ext.live": "live",

    "kind.solution": "Solution",
    "kind.project": "Project",
    "kind.idea": "Idea",

    "lang.toggle.label": "Language",
  },
};

const I18nContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}>({
  lang: "ru",
  setLang: () => {},
  t: (k) => k,
});

const COOKIE = "ramas-lang";

function readCookie(): Lang {
  if (typeof document === "undefined") return "ru";
  const m = document.cookie.match(new RegExp("(^|; )" + COOKIE + "=([^;]+)"));
  const v = m?.[2];
  return v === "en" ? "en" : "ru";
}

function writeCookie(lang: Lang) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLangState(readCookie());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined" && hydrated) {
      document.documentElement.lang = lang;
    }
  }, [lang, hydrated]);

  const setLang = (l: Lang) => {
    writeCookie(l);
    setLangState(l);
  };

  const t = (key: string) => dict[lang][key] ?? dict.ru[key] ?? key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext).t;
}

export function useLang() {
  return useContext(I18nContext);
}
