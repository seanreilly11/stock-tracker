import { polygonFetch } from "@/lib/api/queries";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> },
) {
  const { ticker } = await params;
  const data = await polygonFetch(`/v3/reference/tickers/${ticker}`);

  if (!data)
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  return Response.json(data);
}
