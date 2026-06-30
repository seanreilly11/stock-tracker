import { polygonFetch } from "@/lib/api/queries";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get("ticker") ?? "";
  const limit = req.nextUrl.searchParams.get("limit") ?? "10";
  const data = await polygonFetch("/v2/reference/news", {
    ticker: ticker.toUpperCase(),
    limit,
  });
  if (!data)
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  return Response.json(data);
}
