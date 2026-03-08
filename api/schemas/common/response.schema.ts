import z from "zod";

export const ResponseSchema = z.object({
    success: z.boolean(),
    error: z.string().optional(),
});

export type ApiResponse = z.infer<typeof ResponseSchema>;
