import { z } from "zod";

export const categorySchema = z.enum([
  "web-app",
  "game",
  "mobile",
  "automation",
  "content",
  "other",
]);

export const aiTargetSchema = z.enum([
  "claude",
  "chatgpt",
  "trae",
  "gemini",
  "universal",
]);

export const detailLevelSchema = z.enum(["concise", "balanced", "comprehensive"]);

export const outputLanguageSchema = z.enum([
  "english",
  "chinese",
  "spanish",
  "french",
  "german",
  "japanese",
  "portuguese",
]);

export const generationRequestSchema = z.object({
  idea: z
    .string()
    .trim()
    .min(5, "Your idea needs at least 5 characters.")
    .max(2000, "Keep your idea under 2000 characters."),
  category: categorySchema,
  aiTarget: aiTargetSchema,
  detailLevel: detailLevelSchema,
  techStack: z.string().trim().max(500, "Tech stack must be under 500 characters.").optional().default(""),
  constraints: z
    .string()
    .trim()
    .max(1000, "Constraints must be under 1000 characters.")
    .optional()
    .default(""),
  outputLanguage: outputLanguageSchema,
});

export const generatedPromptSchema = z.object({
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().min(1).max(1000),
  prompt: z.string().trim().min(1),
  assumptions: z.array(z.string().trim().min(1).max(500)).max(20),
});

export const generationResponseSchema = z.object({
  result: generatedPromptSchema,
});

export type GenerationRequestType = z.infer<typeof generationRequestSchema>;
export type GeneratedPromptType = z.infer<typeof generatedPromptSchema>;
export type GenerationResponseType = z.infer<typeof generationResponseSchema>;
