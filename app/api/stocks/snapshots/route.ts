import { polygonFetch } from "@/lib/api/queries";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const tickers = req.nextUrl.searchParams
    .get("tickers")
    ?.split(",")
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean) ?? [];

  if (!tickers.length) return Response.json({ results: [] });

  const [snapshotData, refData] = await Promise.all([
    polygonFetch("/v2/snapshot/locale/us/markets/stocks/tickers", {
      tickers: tickers.join(","),
    }),
    polygonFetch("/v3/reference/tickers", {
      ticker: tickers.join(","),
      limit: "10",
    }),
  ]);

  const priceMap = new Map<string, { price: number; changePercent: number }>();
  for (const t of snapshotData?.tickers ?? []) {
    const price = t?.day?.c ?? t?.prevDay?.c;
    if (price) priceMap.set(t.ticker, { price, changePercent: t?.todaysChangePerc ?? 0 });
  }

  const metaMap = new Map<string, { name: string; sector: string | null }>();
  for (const t of refData?.results ?? []) {
    metaMap.set(t.ticker, { name: t.name ?? t.ticker, sector: t.sic_description ?? null });
  }

  const results = tickers
    .filter((t) => priceMap.has(t))
    .map((t) => ({
      ticker: t,
      ...(metaMap.get(t) ?? { name: t, sector: null }),
      ...priceMap.get(t)!,
    }));

  return Response.json({ results });
}
