"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
type Dir = "ltr" | "rtl";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function currentDir(): Dir {
  if (typeof document === "undefined") return "ltr";
  return document.documentElement.dir === "rtl" ? "rtl" : "ltr";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [dir, setDir] = useState<Dir>("ltr");

  useEffect(() => {
    setTheme(currentTheme());
    setDir(currentDir());
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next === "dark" ? "dark" : "";
    try {
      localStorage.setItem("bout:theme", next);
    } catch {
      // ignore
    }
    setTheme(next);
  }

  function toggleDir() {
    const next: Dir = dir === "rtl" ? "ltr" : "rtl";
    document.documentElement.dir = next;
    try {
      localStorage.setItem("bout:dir", next);
    } catch {
      // ignore
    }
    setDir(next);
  }

  const btn =
    "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[9px] uppercase tracking-[0.25em] transition-colors";
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={theme === "dark"}
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        title={theme === "dark" ? "Light theme" : "Dark theme"}
        className={btn}
        style={{ border: "1px solid rgba(123,103,82,0.22)", color: "rgba(61,48,37,0.8)", padding: "0 12px" }}
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>
      <button
        type="button"
        onClick={toggleDir}
        aria-pressed={dir === "rtl"}
        aria-label={dir === "rtl" ? "Switch to left-to-right layout" : "Switch to right-to-left layout"}
        title="Text direction"
        className={btn}
        style={{ border: "1px solid rgba(123,103,82,0.22)", color: "rgba(61,48,37,0.8)", padding: "0 12px" }}
      >
        {dir === "rtl" ? "LTR" : "RTL"}
      </button>
    </span>
  );
}
