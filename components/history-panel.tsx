"use client";

import type { HistoryEntry } from "@/lib/types";

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const TARGET_LABELS: Record<string, string> = {
  claude: "Claude",
  chatgpt: "ChatGPT",
  trae: "Trae",
  gemini: "Gemini",
  universal: "Universal",
};

const CATEGORY_LABELS: Record<string, string> = {
  "web-app": "Web App",
  game: "Game",
  mobile: "Mobile",
  automation: "Automation",
  content: "Content",
  other: "Other",
};

export function HistoryPanel({
  entries,
  onRestore,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  if (entries.length === 0) {
    return (
      <div className="card-surface p-6 text-center">
        <p className="text-sm text-[var(--muted)]">
          No history yet. Forge your first prompt and it will appear here for quick reuse.
        </p>
      </div>
    );
  }

  return (
    <div className="card-surface p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Recent prompts
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-[var(--muted)] hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          Clear all
        </button>
      </div>

      <ul className="space-y-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="group flex items-start justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-accent)] p-3"
          >
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onRestore(entry)}
                className="text-left block w-full"
                title="Restore this prompt into the editor"
              >
                <p className="text-sm font-medium text-[var(--fg)] truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {entry.result.title}
                </p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">
                  {CATEGORY_LABELS[entry.input.category] ?? entry.input.category} ·{" "}
                  {TARGET_LABELS[entry.input.aiTarget] ?? entry.input.aiTarget} ·{" "}
                  {formatDate(entry.createdAt)}
                </p>
              </button>
            </div>
            <button
              type="button"
              onClick={() => onDelete(entry.id)}
              className="shrink-0 rounded-md p-1.5 text-[var(--muted)] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              aria-label={`Delete ${entry.result.title} from history`}
              title="Delete from history"
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
