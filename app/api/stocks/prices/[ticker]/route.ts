import { polygonFetch } from "@/lib/api/polygon";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> },
) {
  try {
    const { ticker } = await params;
    const data = await polygonFetch(`/v2/aggs/ticker/${ticker}/prev`, {
      adjusted: "true",
    });
    // `/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}`,

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
