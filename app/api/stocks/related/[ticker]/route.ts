import { polygonFetch } from "@/lib/api/queries";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> },
) {
  const { ticker } = await params;
  const data = await polygonFetch(
    `/v1/related-companies/${ticker.toUpperCase()}`,
  );
  if (!data)
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  return Response.json(data);
}
