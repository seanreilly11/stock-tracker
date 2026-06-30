import { polygonFetch } from "@/lib/api/queries";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> },
) {
  const { ticker } = await params;
  const data = await polygonFetch(`/v2/aggs/ticker/${ticker}/prev`, {
    adjusted: "true",
  });
  // PAID: `/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}`
  // FREE: `/v2/aggs/ticker/${ticker}/prev`
  if (!data)
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  return Response.json(data);
}
