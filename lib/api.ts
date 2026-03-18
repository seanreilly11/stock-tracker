import { unstable_cache } from "next/cache";

export const polygonFetch = async (
    path: string,
    params: Record<string, string> = {},
) => {
    const searchParams = new URLSearchParams({
        ...params,
        apiKey: process.env.POLYGON_API_KEY || "",
    });
    const res = await fetch(
        `https://api.polygon.io${path}?${searchParams.toString()}`,
    );
    if (!res.ok) throw new Error(`Polygon API error: ${res.statusText}`);
    return res.json();
};

const parseAIResponse = async (response: Response, errorMessage: string) => {
    const unsafeResponse = await response.json();
    if (!response.ok) {
        throw new Error(unsafeResponse.error || errorMessage);
    }
    const string: string = unsafeResponse.choices[0].message.content;
    const jsonData = string.startsWith("```json")
        ? string.split("```json")[1]?.split("```")[0]
        : string;
    try {
        return JSON.parse(jsonData);
    } catch {
        throw new Error(`Failed to parse AI response: ${jsonData}`);
    }
};

export const fetchStockDetails = unstable_cache(
    async (ticker: string) => polygonFetch(`/v3/reference/tickers/${ticker}`),
    ["stock-details"],
    { revalidate: 86400 },
);

export const fetchStockNews = unstable_cache(
    async (ticker: string, limit: string) =>
        polygonFetch(`/v2/reference/news`, {
            ticker: ticker.toUpperCase(),
            limit,
        }),
    ["stock-news"],
    { revalidate: 1800 },
);

export const fetchStockPrices = (ticker: string) =>
    polygonFetch(`/v2/aggs/ticker/${ticker}/prev`, { adjusted: "true" });

export const searchStocks = (search: string) =>
    polygonFetch(`/v3/reference/tickers`, {
        search,
        market: "stocks",
        active: "true",
        sort: "ticker",
        order: "desc",
        limit: "25",
    });

export const fetchRelatedCompanies = (ticker: string) =>
    polygonFetch(`/v1/related-companies/${ticker}`);

export const standardAPIFetch = async (
    url: string,
    method: "POST" | "GET" | "PUT",
    data: Record<string, unknown>,
    errorMessage: string,
) => {
    const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
    };
    if (method !== "GET") options.body = JSON.stringify(data);
    const res = await fetch(`/api${url}`, options);
    return await parseAIResponse(res, errorMessage);
};
