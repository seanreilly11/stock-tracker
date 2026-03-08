import z from "zod";
import { ResponseSchema } from "../common/response.schema";

export const UserStockSchema = z.object({
    ticker: z.string(),
    name: z.string(),
    holding: z.boolean(),
    targetPrice: z.number().nullable(),
    mostRecentPrice: z.number().nullable(),
    notes: z.array(z.any()).optional(),
    updatedDate: z.union([z.number(), z.string()]).optional(),
    createdDate: z.union([z.number(), z.string()]).optional(),
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
