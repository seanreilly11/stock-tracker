export type { TNote, TStock } from "@/server/schemas/stocks/stock.schema";
export type { TStockPrice, SearchedStockPolygon, TStockDetails } from "@/server/schemas/stocks/polygon.schema";
export type { TNewsArticle, TNewsList } from "@/server/schemas/news/news.schema";
export type { AISuggestion, AISuggestionOption, AINotes } from "@/server/schemas/ai/ai.schema";
export type { UserDoc } from "@/server/schemas/user/user.schema";

// DbResult stays as a plain TS generic — Zod doesn't handle generics cleanly
// and this is an internal utility type, not external data validated at runtime.
export type DbResult<T = undefined> =
    | { success: true; data: T }
    | { success: false; error: string };
