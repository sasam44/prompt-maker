"use client";

import { useTheme } from "@/lib/use-theme";

export function Header() {
  const { theme, toggle, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group" aria-label="Prompt Maker home">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl prompt-grid-bg bg-[var(--bg-accent)] border border-[var(--border)]">
            <span className="editorial-font font-bold text-lg text-emerald-600 dark:text-emerald-400">
              P
            </span>
          </div>
          <div className="leading-none">
            <p className="editorial-font font-semibold text-[17px] tracking-tight text-[var(--fg)]">
              Prompt Maker
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] mt-0.5">
              by SASAM
            </p>
          </div>
        </a>

        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-accent)] px-3.5 py-2 text-sm font-medium text-[var(--fg)] hover:border-emerald-500/50 transition-colors"
          aria-label={mounted && theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {mounted && theme === "dark" ? (
            <>
              <SunIcon />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <MoonIcon />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
