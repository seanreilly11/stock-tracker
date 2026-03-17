import z from "zod";
import { StockSchema } from "../stocks/stock.schema";

export const UserDocSchema = z.object({
    name: z.string(),
    email: z.string(),
    stocks: z.array(StockSchema),
    lastLogin: z.number(),
    createdAt: z.number(),
    provider: z.string(),
    nextToBuy: z.array(z.string()).optional(),
    docId: z.string(),
});
export type UserDoc = z.infer<typeof UserDocSchema>;
