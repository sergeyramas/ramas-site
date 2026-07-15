"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { markThemeManual } from "./SunTheme";

const subscribe = () => () => {};
const isClient = () => true;
const isServer = () => false;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, isClient, isServer);

  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        markThemeManual();
        setTheme(isDark ? "light" : "dark");
      }}
      className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-border hover:border-accent transition-colors"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
