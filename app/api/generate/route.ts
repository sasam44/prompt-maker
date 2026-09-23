import { NextRequest, NextResponse } from "next/server";
import { generationRequestSchema, generationResponseSchema } from "@/lib/validation";
import { buildChatMessages, parseCompletionJSON } from "@/lib/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_OUTPUT_TOKENS = 8192;

// Redact any token/secret-looking substrings from messages before returning them to the browser.
function sanitize(msg: string, apiKey?: string): string {
  let out = msg;
  // Redact the exact key if provided
  if (apiKey) out = out.split(apiKey).join("[REDACTED]");
  // Redact common bearer/sk-/key patterns
  out = out.replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]");
  out = out.replace(/\bsk-[A-Za-z0-9_-]{8,}\b/g, "sk-[REDACTED]");
  out = out.replace(/\b(api[_-]?key|authorization)\s*[:=]\s*\S+/gi, "$1=[REDACTED]");
  return out;
}
function getModels(): string[] {
  const fromEnv = process.env.API_MODELS;
  if (fromEnv && fromEnv.trim()) {
    return fromEnv
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
  }
  return [
    "openai/gpt-5.6-luna",
    "anthropic/claude-sonnet-5",
    "z-ai/glm-5.2",
    "deepseek/deepseek-v4.1-flash",
  ];
}

function getConfig(): { apiKey: string; baseUrl: string } | null {
  const apiKey = process.env.API_KEY;
  const baseUrl = process.env.API_BASE_URL || "https://freeai.jembatanai.com";
  if (!apiKey) return null;
  return { apiKey, baseUrl: baseUrl.replace(/\/+$/, "") };
}

function unauthorized() {
  return NextResponse.json(
    { error: "The server is missing an API key. Add API_KEY to your environment (.env.local) to enable generation." },
    { status: 500 }
  );
}

async function callChatCompletion(
  baseUrl: string,
  apiKey: string,
  model: string,
  system: string,
  user: string
): Promise<string> {
  const res = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_tokens: MAX_OUTPUT_TOKENS,
      response_format: { type: "json_object" },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      if (err?.error?.message) detail = String(err.error.message);
    } catch {
      // ignore parse failure
    }
    throw new Error(detail);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("The AI returned an empty response.");
  }
  return content;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = generationRequestSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Validation failed." },
      { status: 422 }
    );
  }

  const config = getConfig();
  if (!config) {
    return unauthorized();
  }

  const apiKey = config.apiKey;
  const models = getModels();
  const { system, user } = buildChatMessages(parsed.data);

  let lastError: unknown = null;

  for (const model of models) {
    try {
      const text = await callChatCompletion(
        config.baseUrl,
        config.apiKey,
        model,
        system,
        user
      );

      const parsedJson = parseCompletionJSON(text);

      const validated = generationResponseSchema.safeParse({ result: parsedJson });
      if (!validated.success) {
        lastError = new Error("The AI response did not match the expected schema.");
        continue;
      }

      return NextResponse.json(validated.data, { status: 200 });
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      // If it's an auth/permission error, no point trying other models
      if (/API key|permission|forbidden|unauthorized|not included in your plan|store_model_not_allowed/i.test(msg)) {
        return NextResponse.json(
          { error: `API authentication failed: ${sanitize(msg, apiKey)}` },
          { status: 500 }
        );
      }
      // If quota exceeded, stop immediately
      if (/quota|rate.?limit|429|insufficient_quota/i.test(msg)) {
        return NextResponse.json(
          { error: `API limit reached. Please wait and try again. (${sanitize(msg, apiKey)})` },
          { status: 429 }
        );
      }
      // Otherwise continue to next model
    }
  }

  const detail =
    lastError instanceof Error ? lastError.message : "Unknown error generating the prompt.";

  return NextResponse.json(
    { error: `Unable to generate your prompt after trying several models. ${sanitize(detail, apiKey)}` },
    { status: 500 }
  );
}
