"use client";

import { useState, useCallback, useRef } from "react";
import { Header } from "@/components/header";
import { PromptForm } from "@/components/prompt-form";
import { ResultCard } from "@/components/result-card";
import { HistoryPanel } from "@/components/history-panel";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { generatePrompt } from "@/lib/api";
import { useHistory } from "@/lib/use-history";
import { EXAMPLE_PRESET } from "@/lib/types";
import type { GenerationRequest, GeneratedPrompt, HistoryEntry } from "@/lib/types";

const DEFAULT_INPUT: GenerationRequest = {
  idea: "",
  category: "web-app",
  aiTarget: "claude",
  detailLevel: "balanced",
  techStack: "",
  constraints: "",
  outputLanguage: "english",
};

type Status = "idle" | "loading" | "success" | "error";

export default function HomePage() {
  const [input, setInput] = useState<GenerationRequest>({ ...DEFAULT_INPUT });
  const [result, setResult] = useState<GeneratedPrompt | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [hasAttachedResult, setHasAttachedResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const { entries, addEntry, deleteEntry, clearHistory } = useHistory();

  const handleSubmit = useCallback(async () => {
    if (input.idea.trim().length < 5) {
      setStatus("error");
      setError("Please describe your idea with at least 5 characters.");
      return;
    }

    setStatus("loading");
    setError(null);
    setResult(null);
    setHasAttachedResult(false);

    const res = await generatePrompt(input);

    if (!res.ok || !res.result) {
      setStatus("error");
      setError(res.error ?? "Something went wrong. Please try again.");
      return;
    }

    setResult(res.result);
    setStatus("success");
    addEntry(input, res.result);

    // Scroll to result after render
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    // If the result is on the same screen as form, mark as attached below
    setHasAttachedResult(true);
  }, [input, addEntry]);

  const applyExample = useCallback(() => {
    setInput({ ...EXAMPLE_PRESET });
    setStatus("idle");
    setError(null);
  }, []);

  const restoreEntry = useCallback((entry: HistoryEntry) => {
    setInput({ ...entry.input });
    setResult(entry.result);
    setStatus("success");
    setError(null);
    setHasAttachedResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const inputChanged = useCallback((value: GenerationRequest) => {
    setInput(value);
    // Reset error on edit
    if (status === "error") setStatus("idle");
  }, [status]);

  const showLoading = status === "loading";
  const showEmpty = status === "idle" && !result;
  const showError = status === "error";

  return (
    <div id="top" className="min-h-screen bg-[var(--bg)]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-breathe" aria-hidden="true" />
            Structured · Paste-ready · Multi-target
          </div>
          <h1 className="editorial-font text-4xl sm:text-5xl font-bold text-[var(--fg)] tracking-tight">
            Prompt Maker
          </h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
            by SASAM
          </p>
          <p className="mt-4 max-w-xl mx-auto text-[15px] text-[var(--muted)] leading-relaxed">
            Turn a short idea into a complete, structured prompt for{" "}
            <span className="text-[var(--fg)]">Claude</span>,{" "}
            <span className="text-[var(--fg)]">ChatGPT</span>,{" "}
            <span className="text-[var(--fg)]">Trae</span>,{" "}
            <span className="text-[var(--fg)]">Gemini</span> &{" "}
            <span className="text-[var(--fg)]">Universal AI</span>.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-8 items-start">
          {/* Left: Form */}
          <div className="card-surface p-6 sm:p-8 lg:sticky lg:top-20">
            <h2 className="editorial-font text-xl font-bold text-[var(--fg)] mb-6">
              New prompt
            </h2>
            <PromptForm
              initialValue={input}
              onChange={inputChanged}
              onSubmit={handleSubmit}
              loading={showLoading}
              error={showError ? error : undefined}
              onUseExample={applyExample}
            />
          </div>

          {/* Right: Result */}
          <div className="space-y-6" ref={resultRef}>
            {showLoading && <LoadingState />}
            {showEmpty && <EmptyState />}
            {showError && !result && (
              <div className="card-surface p-8 text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-red-600 dark:text-red-400" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--fg)] mb-1">
                  Something went wrong
                </h3>
                <p className="text-sm text-[var(--muted)] mb-4">{error}</p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 text-white dark:text-emerald-950 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Try again
                </button>
              </div>
            )}
            {hasAttachedResult && result && status === "success" && !showLoading && (
              <ResultCard result={result} />
            )}

            {/* History */}
            <div className="pt-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] mb-4">
                Your history
              </h2>
              <HistoryPanel
                entries={entries}
                onRestore={restoreEntry}
                onDelete={deleteEntry}
                onClear={clearHistory}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[var(--border)] text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
            Prompt Maker
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
            by SASAM
          </p>
          <p className="mt-4 text-xs text-[var(--muted)]">
            built with{" "}
            <a
              href="https://x.com/AntSeed"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-4 transition-colors"
            >
              antseed
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
