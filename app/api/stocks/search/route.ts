import { polygonFetch } from "@/lib/api/polygon";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const search = req.nextUrl.searchParams.get("search") ?? "";
        const data = await polygonFetch("/v3/reference/tickers", {
            search,
            market: "stocks",
            active: "true",
            sort: "type",
            order: "asc",
            limit: "25",
        });
        return Response.json(data);
    } catch (error) {
        return Response.json(
            { error: (error as Error).message },
            { status: 500 },
        );
    }
}
