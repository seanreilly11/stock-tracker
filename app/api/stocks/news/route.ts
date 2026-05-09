import { polygonFetch } from "@/lib/api/polygon";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const ticker = req.nextUrl.searchParams.get("ticker") ?? "";
        const limit = req.nextUrl.searchParams.get("limit") ?? "10";
        const data = await polygonFetch("/v2/reference/news", {
            ticker: ticker.toUpperCase(),
            limit,
        });
        return Response.json(data);
    } catch (error) {
        return Response.json(
            { error: (error as Error).message },
            { status: 500 },
        );
    }
}
