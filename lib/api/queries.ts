export const standardFetch = async (
  endpoint: string,
  params?: Record<string, string>,
) => {
  const urlParams = new URLSearchParams(params);
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}${urlParams.toString() ? `?${urlParams.toString()}` : ""}`,
  );

  const response = await fetch(url);
  return await parseResponse(response);
};

export const polygonFetch = async (
  path: string,
  params: Record<string, string> = {},
) => {
  const urlParams = new URLSearchParams({
    ...params,
    apiKey: process.env.POLYGON_API_KEY || "",
  });
  const url = `https://api.polygon.io${path}?${urlParams.toString()}`;
  const response = await fetch(url);
  return await parseResponse(response);
};

export async function getTickerSnapshots(tickers: string[]): Promise<Map<string, number>> {
  const priceMap = new Map<string, number>();
  for (let i = 0; i < tickers.length; i += 200) {
    const chunk = tickers.slice(i, i + 200);
    const data = await polygonFetch(
      "/v2/snapshot/locale/us/markets/stocks/tickers",
      { tickers: chunk.join(",") },
    );
    for (const t of data?.tickers ?? []) {
      const price = t?.day?.c ?? t?.prevDay?.c;
      if (price) priceMap.set(t.ticker, price);
    }
  }
  return priceMap;
}

const parseResponse = async (res: Response) => {
  if (!res.ok) {
    if (res.status === 429) {
      console.log("rate limited");
    } else {
      console.log(`${res.status} ${res.statusText}`);
    }
  }
  return await res.json();
};
