"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

const STORAGE_KEY = "theme";
const SUN_APPLIED_KEY = "ramas-sun-applied";

/**
 * On first mount, ask /api/sun for the appropriate theme (based on Vercel-geo
 * sunrise/sunset) and switch — but only if the user has not picked a theme
 * manually. We respect explicit user choice forever; sun-mode is only the
 * default for first-time visitors.
 */
export function SunTheme() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // If the user has manually selected a theme, next-themes wrote a value
    // into localStorage. We only auto-switch when no manual choice exists.
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    const sunApplied = typeof window !== "undefined" ? window.localStorage.getItem(SUN_APPLIED_KEY) : null;

    // Manual choice present → respect it, do nothing.
    if (stored && stored !== "system" && sunApplied !== "1") {
      return;
    }

    let cancelled = false;
    fetch("/api/sun", { cache: "force-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { theme?: "light" | "dark" } | null) => {
        if (cancelled || !data?.theme) return;
        setTheme(data.theme);
        try {
          window.localStorage.setItem(SUN_APPLIED_KEY, "1");
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        /* silent — fall through to next-themes default */
      });

    return () => {
      cancelled = true;
    };
  }, [setTheme]);

  return null;
}
