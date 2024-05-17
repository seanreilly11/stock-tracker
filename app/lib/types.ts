export type Stock = {
    ticker: string;
    name: string;
    holding: boolean;
    targetPrice: number | null;
    mostRecentPrice: number | null;
};
