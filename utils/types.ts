export type TStock = {
    ticker: string;
    name: string;
    holding: boolean;
    targetPrice: number | null;
    mostRecentPrice: number | null;
    notes?: string[];
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
        sentiment: string;
        sentiment_reasoning: string;
        ticker: string;
    }[];
};

export type TNote = {
    id: string;
    text: string;
    createdAt: number | string;
    updatedAt: number | string;
};

export type PolygonStock = {
    adjusted: true;
    count: 1;
    queryCount: 1;
    request_id: "6760de57971b78d1b8b0c5d1dc73ed08";
    results: ResultStock;
    resultsCount: 1;
    status: "OK";
    ticker: "MSFT";
};

export type ResultStock = {
    T: string;
    c: number;
    h: number;
    l: number;
    n: number;
    o: number;
    t: number;
    v: number;
    vw: number;
};

export type SearchedStockPolygon = {
    active: boolean;
    cik: string;
    composite_figi: string;
    currency_name: string;
    last_updated_utc: string;
    locale: string;
    market: string;
    name: string;
    primary_exchange: string;
    share_class_figi: string;
    ticker: string;
    type: string;
};
