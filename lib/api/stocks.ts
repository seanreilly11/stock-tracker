export const searchStocks = (keyword: string) =>
  fetch(`/api/stocks/search?${new URLSearchParams({ search: keyword })}`).then(
    (r) => r.json(),
  );

export const getStockPrices = (ticker: string) =>
  fetch(`/api/stocks/prices/${ticker}`).then((r) => r.json());

export const getStockDetails = (ticker: string) =>
  fetch(`/api/stocks/details/${ticker}`).then((r) => r.json());

export const getStockNews = (ticker: string) =>
  fetch(`/api/stocks/news?ticker=${ticker}&limit=10`).then((r) => r.json());

export const getRelatedCompanies = (ticker: string) =>
  fetch(`/api/stocks/related/${ticker}`).then((r) => r.json());
