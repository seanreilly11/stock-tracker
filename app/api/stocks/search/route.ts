import { polygonFetch } from "@/lib/api";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const search = searchParams.get("search") ?? "";
        const data = await polygonFetch(`/v3/reference/tickers`, {
            search,
            market: "stocks",
            active: "true",
            sort: "ticker",
            order: "desc",
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
