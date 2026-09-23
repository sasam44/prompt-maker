"use client";

export function EmptyState() {
  return (
    <div className="card-surface p-8 sm:p-10 text-center animate-fade-in">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl prompt-grid-bg bg-[var(--bg-accent)] border border-[var(--border)] mb-4">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400" aria-hidden="true">
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
          <path d="M19 15l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 15z" />
        </svg>
      </div>
      <h2 className="editorial-font text-2xl font-bold text-[var(--fg)] mb-2">
        Your forged prompt appears here
      </h2>
      <p className="text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
        Fill in the form to turn a short idea into a complete, structured, paste-ready
        prompt for Claude, ChatGPT, Trae, Gemini, or any AI tool.
      </p>
    </div>
  );
}
