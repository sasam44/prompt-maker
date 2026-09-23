"use client";

export function LoadingState() {
  return (
    <div className="card-surface p-6 sm:p-8 animate-fade-in" aria-live="polite" aria-label="Generating your prompt">
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-block w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" aria-hidden="true" />
        <p className="text-sm font-medium text-[var(--fg)]">
          Forging your prompt…
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <div className="shimmer h-6 w-2/3" />
          <div className="shimmer h-4 w-1/2" />
        </div>
        <div className="space-y-2.5">
          <div className="shimmer h-4 w-full" />
          <div className="shimmer h-4 w-11/12" />
          <div className="shimmer h-4 w-4/5" />
          <div className="shimmer h-4 w-full" />
          <div className="shimmer h-4 w-3/4" />
        </div>
        <div className="space-y-2.5">
          <div className="shimmer h-4 w-full" />
          <div className="shimmer h-4 w-10/12" />
          <div className="shimmer h-4 w-5/6" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="shimmer h-9 w-24 rounded-lg" />
          <div className="shimmer h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
