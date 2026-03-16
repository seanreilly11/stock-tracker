export type TStock = {
    ticker: string;
    name: string;
    holding: boolean;
    targetPrice: number | null;
    mostRecentPrice: number | null;
    notes?: TNote[];
    updatedDate?: number | string;
    createdDate?: number | string;
};

export type TNewsArticle = {
    id: string;
    title: string;
    description: string;
    article_url: string;
    published_utc: string;
    image_url: string;
    publisher: {
        name: string;
    };
    insights: {
        sentiment: "positive" | "neutral" | "negative";
        sentiment_reasoning: string;
        ticker: string;
    }[];
};

export type TNewsList = {
    count: number;
    results: TNewsArticle[];
};

export type TNote = {
    id: string;
    text: string;
    createdAt: number;
    updatedAt: number;
};

export type AISuggestion = {
    name: string;
    ticker: string;
    reason: string;
};

export type AISuggestionOption = "popular" | "upside";

export type AINotes = {
    explanation: string;
    impact: "increase" | "decrease";
};

export type TStockPrice = {
    ticker: {
        ticker: string;
        todaysChangePerc: number;
        todaysChange: number;
        updated: number;
        day: {
            o: number;
            h: number;
            l: number;
            c: number;
            v: number;
            vw: number;
        };
        prevDay: {
            o: number;
            h: number;
            l: number;
            c: number;
            v: number;
            vw: number;
        };
    };
    status: string;
};

export type SearchedStockPolygon = {
    active: boolean;
    cik: string;
    currency_name: string;
    last_updated_utc: string;
    locale: string;
    market: string;
    name: string;
    primary_exchange: string;
    ticker: string;
    type: string;
    homepage_url: string;
    description: string;
    sic_description: string;
    branding: { logo_url: string; icon_url: string };
};

export type TStockDetails = {
    status: string;
    results: SearchedStockPolygon;
};

export type DbResult<T = undefined> =
    | { success: true; data: T }
    | { success: false; error: string };

export type UserDoc = {
    name: string;
    email: string;
    stocks: TStock[];
    lastLogin: number;
    createdAt: number;
    provider: string;
    nextToBuy?: string[];
    docId: string;
};
