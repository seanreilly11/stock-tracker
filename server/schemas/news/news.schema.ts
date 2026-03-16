import z from "zod";

export const NewsArticleSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    article_url: z.string(),
    published_utc: z.string(),
    image_url: z.string(),
    publisher: z.object({
        name: z.string(),
    }),
    insights: z.array(
        z.object({
            sentiment: z.enum(["positive", "neutral", "negative"]),
            sentiment_reasoning: z.string(),
            ticker: z.string(),
        }),
    ),
});
export type TNewsArticle = z.infer<typeof NewsArticleSchema>;

export const NewsListSchema = z.object({
    count: z.number(),
    results: z.array(NewsArticleSchema),
});
export type TNewsList = z.infer<typeof NewsListSchema>;
