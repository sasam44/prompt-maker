import type { GenerationRequest, GeneratedPrompt } from "./types";

export interface GenerateResult {
  ok: boolean;
  result?: GeneratedPrompt;
  error?: string;
}

export async function generatePrompt(input: GenerationRequest): Promise<GenerateResult> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        error: data?.error ?? `Request failed with status ${res.status}.`,
      };
    }

    if (!data?.result) {
      return { ok: false, error: "The server returned an unexpected response." };
    }

    return { ok: true, result: data.result as GeneratedPrompt };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Network error. Please try again.",
    };
  }
}
