export type Stock = {
    ticker: string;
    name: string;
    holding: boolean;
    targetPrice: number | null;
    mostRecentPrice: number | null;
    notes?: string[];
};

export type AVStock = {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
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

type SearchedStockAlphaV = {
    "1. symbol": string;
    "2. name": string;
    "3. type": string;
    "4. region": string;
    "5. marketOpen": string;
    "6. marketClose": string;
    "7. timezone": string;
    "8. currency": string;
    "9. matchScore": string;
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
