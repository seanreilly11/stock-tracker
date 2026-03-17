import z from "zod";

export const AISuggestionOptionSchema = z.enum(["popular", "upside"]);
export type AISuggestionOption = z.infer<typeof AISuggestionOptionSchema>;

export const AISuggestionSchema = z.object({
    name: z.string(),
    ticker: z.string(),
    reason: z.string(),
});
export type AISuggestion = z.infer<typeof AISuggestionSchema>;

export const AINotesSchema = z.object({
    explanation: z.string(),
    impact: z.enum(["increase", "decrease"]),
});
export type AINotes = z.infer<typeof AINotesSchema>;
