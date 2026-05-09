import { polygonFetch } from "@/lib/api/polygon";
import { fetchSafe } from "@/lib/utils/helpers";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> },
) {
  const { ticker } = await params;
  const data = await fetchSafe(() =>
    polygonFetch(`/v2/aggs/ticker/${ticker}/prev`, { adjusted: "true" }),
  );
  // `/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}`
  if (!data) return Response.json({ error: "Failed to fetch" }, { status: 500 });
  return Response.json(data);
}
