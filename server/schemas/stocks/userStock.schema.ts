import z from "zod";
import { ResponseSchema } from "../common/response.schema";

export const UserStockSchema = z.object({
    ticker: z.string(),
    name: z.string(),
    holding: z.boolean(),
    targetPrice: z.number().nullable(),
    mostRecentPrice: z.number().nullable(),
    notes: z
        .array(
            z.object({
                id: z.string(),
                text: z.string(),
                createdAt: z.number(),
                updatedAt: z.number(),
            }),
        )
        .optional(),
    updatedDate: z.number().optional(),
    createdDate: z.number().optional(),
});

export type UserStock = z.infer<typeof UserStockSchema>;

export const UserStockResponseSchema = ResponseSchema.extend({
    data: UserStockSchema,
});
export type UserStockResponse = z.infer<typeof UserStockResponseSchema>;

export const UserStocksResponseSchema = z.object({
    data: z.object({
        items: z.array(UserStockSchema),
    }),
});

export type UserStocksResponse = z.infer<typeof UserStocksResponseSchema>;
