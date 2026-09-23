"use client";

import { useState } from "react";
import type { GenerationRequest } from "@/lib/types";
import {
  CATEGORIES,
  AI_TARGETS,
  DETAIL_LEVELS,
  OUTPUT_LANGUAGES,
} from "@/lib/types";

interface PromptFormProps {
  initialValue: GenerationRequest;
  onChange: (value: GenerationRequest) => void;
  onSubmit: () => void;
  loading: boolean;
  error?: string | null;
  onUseExample: () => void;
}

export function PromptForm({
  initialValue,
  onChange,
  onSubmit,
  loading,
  error,
  onUseExample,
}: PromptFormProps) {
  const [value, setValue] = useState<GenerationRequest>(initialValue);

  const update = (patch: Partial<GenerationRequest>) => {
    const next = { ...value, ...patch };
    setValue(next);
    onChange(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Create a new prompt">
      {/* Core idea */}
      <div className="space-y-2">
        <label htmlFor="idea" className="block text-sm font-semibold text-[var(--fg)]">
          Your core idea
          <span className="text-emerald-600 dark:text-emerald-400" aria-hidden="true"> *</span>
        </label>
        <div className="relative">
          <textarea
            id="idea"
            value={value.idea}
            onChange={(e) => update({ idea: e.target.value })}
            placeholder="e.g. A cozy pixel-art farming game set on a floating sky island where you trade rare crops with cloud merchants..."
            rows={4}
            maxLength={2000}
            required
            className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--bg-accent)] px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
          />
          <span className="absolute bottom-2 right-3 text-[10px] tabular-nums text-[var(--muted)]">
            {value.idea.length}/2000
          </span>
        </div>
        <button
          type="button"
          onClick={onUseExample}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SparkleIcon />
          Use example idea
        </button>
      </div>

      {/* Category */}
      <fieldset className="space-y-2" aria-labelledby="category-label">
        <legend id="category-label" className="text-sm font-semibold text-[var(--fg)]">
          Project category
        </legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => update({ category: c.value })}
              aria-pressed={value.category === c.value}
              className={`px-3.5 py-2 text-sm rounded-full border font-medium transition-colors ${
                value.category === c.value
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-600"
                  : "border-[var(--border)] bg-[var(--bg-accent)] text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* AI Target */}
      <fieldset className="space-y-2" aria-labelledby="target-label">
        <legend id="target-label" className="text-sm font-semibold text-[var(--fg)]">
          AI target
        </legend>
        <div className="flex flex-wrap gap-2">
          {AI_TARGETS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => update({ aiTarget: t.value })}
              aria-pressed={value.aiTarget === t.value}
              className={`px-3.5 py-2 text-sm rounded-full border font-medium transition-colors ${
                value.aiTarget === t.value
                  ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-600"
                  : "border-[var(--border)] bg-[var(--bg-accent)] text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Detail Level */}
      <fieldset className="space-y-2" aria-labelledby="detail-label">
        <legend id="detail-label" className="text-sm font-semibold text-[var(--fg)]">
          Detail level
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DETAIL_LEVELS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => update({ detailLevel: d.value })}
              aria-pressed={value.detailLevel === d.value}
              className={`text-left p-3 rounded-xl border transition-colors ${
                value.detailLevel === d.value
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40"
                  : "border-[var(--border)] bg-[var(--bg-accent)]"
              }`}
            >
              <span className="block text-sm font-semibold text-[var(--fg)]">{d.label}</span>
              <span className="block text-xs text-[var(--muted)] mt-0.5">{d.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Tech stack */}
      <div className="space-y-2">
        <label htmlFor="techStack" className="block text-sm font-semibold text-[var(--fg)]">
          Technology stack <span className="font-normal text-[var(--muted)]">(optional)</span>
        </label>
        <input
          id="techStack"
          type="text"
          value={value.techStack}
          onChange={(e) => update({ techStack: e.target.value })}
          placeholder="e.g. React, TypeScript, Tailwind CSS, Supabase"
          maxLength={500}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-accent)] px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
        />
      </div>

      {/* Constraints */}
      <div className="space-y-2">
        <label htmlFor="constraints" className="block text-sm font-semibold text-[var(--fg)]">
          Constraints <span className="font-normal text-[var(--muted)]">(optional)</span>
        </label>
        <textarea
          id="constraints"
          value={value.constraints}
          onChange={(e) => update({ constraints: e.target.value })}
          placeholder="e.g. Must run offline, no external assets, mobile-first, ORIGINAL characters only..."
          rows={3}
          maxLength={1000}
          className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--bg-accent)] px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
        />
      </div>

      {/* Output language */}
      <div className="space-y-2">
        <label htmlFor="outputLanguage" className="block text-sm font-semibold text-[var(--fg)]">
          Output language
        </label>
        <select
          id="outputLanguage"
          value={value.outputLanguage}
          onChange={(e) => update({ outputLanguage: e.target.value as GenerationRequest["outputLanguage"] })}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-accent)] px-4 py-3 text-sm text-[var(--fg)] focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
        >
          {OUTPUT_LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/40 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 animate-fade-in"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || value.idea.trim().length < 5}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-emerald-950 font-semibold px-6 py-3.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-offset-4"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" aria-hidden="true" />
            Forging your prompt…
          </>
        ) : (
          <>
            <ForgeIcon />
            Forge prompt
          </>
        )}
      </button>
    </form>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4L12 2zM19 14l.9 2.8 2.8.9-2.8.9L19 21.4l-.9-2.8-2.8-.9 2.8-.9L19 14z" />
    </svg>
  );
}

function ForgeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4v6h6M14 4l-8 8v8h8l8-8z" />
      <path d="M14 12h2M14 16h2" />
    </svg>
  );
}
