import raw from "@/data/news/issues.json";

export type NewsTicker = {
  label: string;
  value: string;
  change?: string;
  dir?: "up" | "down" | "flat";
};

export type NewsItem = {
  title: string;
  summary?: string;
  source: string;
  time?: string;
  url?: string;
};

export type NewsSection = {
  id: string;
  kicker: string;
  numbered?: boolean;
  items: NewsItem[];
};

export type NewsIssue = {
  date: string;
  generatedAt: string;
  kicker?: string;
  title: string;
  standfirst?: string;
  ticker: NewsTicker[];
  sections: NewsSection[];
  numbers?: { label: string; value: string }[];
  sources: string[];
};

const issues = (raw.issues as NewsIssue[]).slice().sort((a, b) => b.date.localeCompare(a.date));

export function allIssues(): NewsIssue[] {
  return issues;
}

export function latestIssue(): NewsIssue | undefined {
  return issues[0];
}

export function issueByDate(date: string): NewsIssue | undefined {
  return issues.find((i) => i.date === date);
}

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const WEEKDAYS = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];

export function issueDateParts(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  return {
    day: d.getUTCDate(),
    month: MONTHS[d.getUTCMonth()],
    year: d.getUTCFullYear(),
    weekday: WEEKDAYS[d.getUTCDay()],
    long: `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`,
  };
}

export function issueNumber(issue: NewsIssue): string {
  const idx = issues.findIndex((i) => i.date === issue.date);
  const n = issues.length - idx;
  return String(n).padStart(3, "0");
}
