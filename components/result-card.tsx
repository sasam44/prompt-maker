"use client";

import { useState } from "react";
import type { GeneratedPrompt } from "@/lib/types";

interface ResultCardProps {
  result: GeneratedPrompt;
}

export function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`# ${result.title}

${result.summary}

----------------------------------------------------------------

${result.prompt}

----------------------------------------------------------------

ASSUMPTIONS:
${result.assumptions.map((a) => `• ${a}`).join("\n")}
`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = result.prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const content = `# ${result.title}

${result.summary}

----------------------------------------------------------------

${result.prompt}

----------------------------------------------------------------

ASSUMPTIONS:
${result.assumptions.map((a) => `• ${a}`).join("\n")}
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(result.title)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      className="card-surface p-6 sm:p-8 animate-fade-in-up"
      aria-label="Generated result"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <h2 className="editorial-font text-2xl sm:text-3xl font-bold text-[var(--fg)] leading-tight">
          {result.title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-accent)] px-3 py-2 text-xs font-medium text-[var(--fg)] hover:border-emerald-500/60 transition-colors"
            aria-label="Copy the prompt to clipboard"
          >
            {copied ? (
              <>
                <CheckIcon />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon />
                Copy
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-accent)] px-3 py-2 text-xs font-medium text-[var(--fg)] hover:border-emerald-500/60 transition-colors"
            aria-label="Download the prompt as a text file"
          >
            <DownloadIcon />
            Download
          </button>
        </div>
      </div>

      {result.summary && (
        <p className="text-[15px] leading-relaxed text-[var(--muted)] mb-6">{result.summary}</p>
      )}

      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Paste-ready prompt
            </h3>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-accent)] p-4 overflow-x-auto">
            <pre className="mono-font text-[13px] leading-relaxed whitespace-pre-wrap text-[var(--fg)]">
              {result.prompt}
            </pre>
          </div>
        </div>

        {result.assumptions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
              Assumptions
            </h3>
            <ul className="space-y-2">
              {result.assumptions.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[var(--muted)] leading-relaxed"
                >
                  <span
                    className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"
                    aria-hidden="true"
                  />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "prompt"
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}
