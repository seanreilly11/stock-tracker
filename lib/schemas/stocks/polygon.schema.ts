import z from "zod";

const DayDataSchema = z.object({
    o: z.number(),
    h: z.number(),
    l: z.number(),
    c: z.number(),
    v: z.number(),
    vw: z.number(),
});

export const StockPriceSchema = z.object({
    ticker: z.object({
        ticker: z.string(),
        todaysChangePerc: z.number(),
        todaysChange: z.number(),
        updated: z.number(),
        day: DayDataSchema,
        prevDay: DayDataSchema,
    }),
    status: z.string(),
});
export type TStockPrice = z.infer<typeof StockPriceSchema>;

export const SearchedStockPolygonSchema = z.object({
    active: z.boolean(),
    cik: z.string(),
    currency_name: z.string(),
    last_updated_utc: z.string(),
    locale: z.string(),
    market: z.string(),
    name: z.string(),
    primary_exchange: z.string(),
    ticker: z.string(),
    type: z.string(),
    homepage_url: z.string(),
    description: z.string(),
    sic_description: z.string(),
    branding: z.object({
        logo_url: z.string(),
        icon_url: z.string(),
    }),
});
export type SearchedStockPolygon = z.infer<typeof SearchedStockPolygonSchema>;

export const StockDetailsSchema = z.object({
    status: z.string(),
    results: SearchedStockPolygonSchema,
});
export type TStockDetails = z.infer<typeof StockDetailsSchema>;
