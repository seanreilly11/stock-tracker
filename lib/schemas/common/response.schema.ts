import z from "zod";

export const DbResultSchema = z.object({
    success: z.boolean(),
    error: z.string().optional(),
    data: z.unknown().nullable(),
});

export type DbResult<T = null> =
    | { success: true; data: T; error: undefined }
    | { success: false; data: null; error: string };
