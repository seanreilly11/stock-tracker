const parseResponse = (r: Response) => {
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
};

export const searchStocks = (keyword: string) =>
  fetch(`/api/stocks/search?${new URLSearchParams({ search: keyword })}`).then(parseResponse);

export const getStockPrices = (ticker: string) =>
  fetch(`/api/stocks/prices/${ticker}`).then(parseResponse);

export const getStockDetails = (ticker: string) =>
  fetch(`/api/stocks/details/${ticker}`).then(parseResponse);

export const getStockNews = (ticker: string) =>
  fetch(`/api/stocks/news?ticker=${ticker}&limit=10`).then(parseResponse);

export const getRelatedCompanies = (ticker: string) =>
  fetch(`/api/stocks/related/${ticker}`).then(parseResponse);
