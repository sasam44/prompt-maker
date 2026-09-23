export type Category =
  | "web-app"
  | "game"
  | "mobile"
  | "automation"
  | "content"
  | "other";

export type AITarget = "claude" | "chatgpt" | "trae" | "gemini" | "universal";

export type DetailLevel = "concise" | "balanced" | "comprehensive";

export type OutputLanguage = "english" | "chinese" | "spanish" | "french" | "german" | "japanese" | "portuguese";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "web-app", label: "Web App" },
  { value: "game", label: "Game" },
  { value: "mobile", label: "Mobile" },
  { value: "automation", label: "Automation" },
  { value: "content", label: "Content" },
  { value: "other", label: "Other" },
];

export const AI_TARGETS: { value: AITarget; label: string }[] = [
  { value: "claude", label: "Claude" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "trae", label: "Trae" },
  { value: "gemini", label: "Gemini" },
  { value: "universal", label: "Universal" },
];

export const DETAIL_LEVELS: { value: DetailLevel; label: string; hint: string }[] = [
  { value: "concise", label: "Concise", hint: "Fast, focused output" },
  { value: "balanced", label: "Balanced", hint: "Good all-round default" },
  { value: "comprehensive", label: "Comprehensive", hint: "In-depth, detailed prompt" },
];

export const OUTPUT_LANGUAGES: { value: OutputLanguage; label: string }[] = [
  { value: "english", label: "English" },
  { value: "chinese", label: "中文" },
  { value: "spanish", label: "Español" },
  { value: "french", label: "Français" },
  { value: "german", label: "Deutsch" },
  { value: "japanese", label: "日本語" },
  { value: "portuguese", label: "Português" },
];

export interface GeneratedPrompt {
  title: string;
  summary: string;
  prompt: string;
  assumptions: string[];
}

export interface GenerationRequest {
  idea: string;
  category: Category;
  aiTarget: AITarget;
  detailLevel: DetailLevel;
  techStack?: string;
  constraints?: string;
  outputLanguage: OutputLanguage;
}

export interface HistoryEntry {
  id: string;
  createdAt: number;
  input: GenerationRequest;
  result: GeneratedPrompt;
}

export const EXAMPLE_PRESET: GenerationRequest = {
  idea:
    "A cozy pixel-art farming game where you tend a floating sky island garden and trade rare crops with visiting cloud merchants.",
  category: "game",
  aiTarget: "universal",
  detailLevel: "balanced",
  techStack: "Phaser 3 (or Godot), TypeScript",
  constraints:
    "No violence. Relaxing atmosphere. Session-friendly (play in 15-minute bursts). ORIGINAL characters, world, and art — do not copy any existing game.",
  outputLanguage: "english",
};
