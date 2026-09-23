import type {
  GenerationRequest,
  GeneratedPrompt,
  AITarget,
  DetailLevel,
  OutputLanguage,
} from "./types";

const LANGUAGE_NAMES: Record<OutputLanguage, string> = {
  english: "English",
  chinese: "Chinese (中文)",
  spanish: "Spanish (Español)",
  french: "French (Français)",
  german: "German (Deutsch)",
  japanese: "Japanese (日本語)",
  portuguese: "Portuguese (Português)",
};

const TARGET_LABELS: Record<AITarget, string> = {
  claude: "Claude (Anthropic)",
  chatgpt: "ChatGPT (OpenAI)",
  trae: "Trae (ByteDance)",
  gemini: "Gemini (Google)",
  universal: "Universal AI tools",
};

const CATEGORY_LABELS: Record<string, string> = {
  "web-app": "Web Application",
  game: "Game",
  mobile: "Mobile Application",
  automation: "Automation / Workflow",
  content: "Content / Media",
  other: "Other / General",
};

const DETAIL_DESCRIPTIONS: Record<DetailLevel, string> = {
  concise:
    "Concise: Deliver a tight, focused prompt. Keep it lean but complete — 1 to 3 short paragraphs plus a compact bullet list of requirements. Prioritise essentials only.",
  balanced:
    "Balanced: Deliver a well-rounded prompt that covers goals, scope, key features, constraints, tone, and acceptance criteria in a moderate, readable length. A few short structured sections.",
  comprehensive:
    "Comprehensive: Deliver an exhaustive, production-grade prompt. Include role, context, goals, detailed feature specifications, technical requirements, data/models, UI/UX guidelines, performance, error handling, testing/acceptance criteria, deliverables, and a step-by-step build roadmap. Be very detailed.",
};

const IP_SAFETY_GUIDANCE = `
IMPORTANT IP SAFETY RULE — MANDATORY:
If the user's core idea references, is inspired by, or evokes an existing game, product, movie, franchise, character, or brand, you MUST generate a fully ORIGINAL work that preserves only broad genre conventions. Specifically:
- Create original characters with entirely new names, backstories, and personalities.
- Create an original world/setting with new locations, history, and lore.
- Create original art direction, visual identity, color palettes, and UI style.
- Create original music/sound direction and naming conventions.
- Do NOT reproduce trademarks, registered names, character names, assets, artwork, or copyrighted elements.
- You may reference broad genre conventions (e.g., "platformer", "deckbuilder", "open-world RPG") but never specific copyrighted IP.
Always include an "Original IP" note in the final prompt stating that all characters, names, assets, world, music, and visual identity are original and influence-free.
`;

function buildSystemMessage(target: AITarget, detail: DetailLevel): string {
  return `You are Prompt Forge, an expert prompt engineer. Your job is to transform a user's short idea into a complete, structured, paste-ready prompt for an AI.

You are writing a prompt intended for: ${TARGET_LABELS[target]}.
${DETAIL_DESCRIPTIONS[detail]}

${IP_SAFETY_GUIDANCE}

Respond ONLY with a single JSON object (no markdown fences, no commentary) with exactly this shape:
{
  "title": "Short, catchy, descriptive title for the prompt (max 100 chars)",
  "summary": "One or two sentence plain-English summary of what the user wants to build (max 400 chars)",
  "prompt": "The full, paste-ready prompt text. Write it as if addressed directly to the target AI. Use clear section headings where appropriate.",
  "assumptions": ["Array of 3 to 8 assumptions or clarifications the user may want to confirm before building."]
}

The "prompt" field is the most important — it is what the user will copy and paste into ${TARGET_LABELS[target]}. Make it excellent, self-contained, and executable.`;
}

export function buildChatMessages(
  input: GenerationRequest
): { system: string; user: string } {
  const parts: string[] = [];

  parts.push(`CORE IDEA: ${input.idea}`);
  parts.push(`PROJECT CATEGORY: ${CATEGORY_LABELS[input.category] ?? input.category}`);
  parts.push(`AI TARGET: ${TARGET_LABELS[input.aiTarget]}`);
  parts.push(`DETAIL LEVEL: ${input.detailLevel}`);

  if (input.techStack && input.techStack.trim()) {
    parts.push(`PREFERRED TECHNOLOGY STACK: ${input.techStack}`);
  } else {
    parts.push(`PREFERRED TECHNOLOGY STACK: Not specified — recommend a sensible, modern, well-supported stack.`);
  }

  if (input.constraints && input.constraints.trim()) {
    parts.push(`CONSTRAINTS / ADDITIONAL REQUIREMENTS: ${input.constraints}`);
  }

  parts.push(`OUTPUT LANGUAGE: The ENTIRE generated prompt (title, summary, prompt body, and assumptions) MUST be written entirely in ${LANGUAGE_NAMES[input.outputLanguage]}.`);

  return {
    system: buildSystemMessage(input.aiTarget, input.detailLevel),
    user: parts.join("\n\n"),
  };
}

export function parseCompletionJSON(raw: string): GeneratedPrompt {
  let cleaned = raw.trim();

  // Strip markdown code fences if present
  const fenceMatch = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Find the outermost JSON object
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No valid JSON object found in AI response.");
  }

  const jsonString = cleaned.slice(start, end + 1);
  const parsed = JSON.parse(jsonString);

  return {
    title: typeof parsed.title === "string" ? parsed.title.trim() : "Untitled Prompt",
    summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "",
    prompt: typeof parsed.prompt === "string" ? parsed.prompt.trim() : "",
    assumptions:
      Array.isArray(parsed.assumptions)
        ? parsed.assumptions
            .filter((a: unknown) => typeof a === "string" && a.trim().length > 0)
            .map((a: string) => a.trim())
        : [],
  };
}
