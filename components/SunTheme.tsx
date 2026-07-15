"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const MANUAL_KEY = "ramas-theme-manual";

/** Called by ThemeToggle: records that the user picked a theme by hand. */
export function markThemeManual() {
  try {
    window.localStorage.setItem(MANUAL_KEY, "1");
  } catch {
    /* ignore */
  }
}

function pickedManually() {
  try {
    return window.localStorage.getItem(MANUAL_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * On first mount, ask /api/sun for the appropriate theme (based on Vercel-geo
 * sunrise/sunset) and switch — but only if the user has never picked a theme
 * manually. An explicit choice is respected forever; sun-mode is only the
 * default for visitors who have not touched the toggle.
 */
export function SunTheme() {
  const { setTheme } = useTheme();
  // Runs once per mount. Without this guard the effect re-fires when setTheme
  // changes identity and clobbers the theme the user just picked.
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    if (pickedManually()) return;

    let cancelled = false;
    fetch("/api/sun", { cache: "force-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { theme?: "light" | "dark" } | null) => {
        if (cancelled || !data?.theme) return;
        if (pickedManually()) return;
        setTheme(data.theme);
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
