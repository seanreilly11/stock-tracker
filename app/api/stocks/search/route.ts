import { polygonFetch } from "@/lib/api/queries";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search") ?? "";
  const data = await polygonFetch("/v3/reference/tickers", {
    search,
    market: "stocks",
    active: "true",
    sort: "type",
    order: "asc",
    limit: "25",
  });

  if (!data)
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  return Response.json(data);
}
