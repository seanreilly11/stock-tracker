import { standardFetch } from "./queries";

export const searchStocks = (keyword: string) =>
  standardFetch("/stocks/search", { search: keyword });

export const getStockPrices = (ticker: string) =>
  standardFetch(`/stocks/prices/${ticker}`);

export const getStockDetails = (ticker: string) =>
  standardFetch(`/stocks/details/${ticker}`);

export const getStockNews = (ticker: string) =>
  standardFetch(`/stocks/news`, { ticker, limit: "5" });

export const getRelatedCompanies = (ticker: string) =>
  standardFetch(`/stocks/related/${ticker}`);
