export type { TNote, TStock } from "@/lib/schemas/stocks/stock.schema";
export type { TStockPrice, SearchedStockPolygon, TStockDetails } from "@/lib/schemas/stocks/polygon.schema";
export type { TNewsArticle, TNewsList } from "@/lib/schemas/news/news.schema";
export type { AISuggestion, AISuggestionOption, AINotes } from "@/lib/schemas/ai/ai.schema";
export type { UserDoc } from "@/lib/schemas/user/user.schema";

// DbResult stays as a plain TS generic — Zod doesn't handle generics cleanly
// and this is an internal utility type, not external data validated at runtime.
export type DbResult<T = undefined> =
    | { success: true; data: T }
    | { success: false; error: string };
