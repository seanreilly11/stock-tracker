import z from "zod";

export const NoteSchema = z.object({
    id: z.string(),
    text: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
});
export type TNote = z.infer<typeof NoteSchema>;

export const StockSchema = z.object({
    ticker: z.string(),
    name: z.string(),
    holding: z.boolean(),
    targetPrice: z.number().nullable(),
    mostRecentPrice: z.number().nullable(),
    notes: z.array(NoteSchema).optional(),
    updatedDate: z.union([z.number(), z.string()]).optional(),
    createdDate: z.union([z.number(), z.string()]).optional(),
});
export type TStock = z.infer<typeof StockSchema>;
