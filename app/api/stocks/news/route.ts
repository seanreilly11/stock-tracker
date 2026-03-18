import { fetchStockNews } from "@/lib/api";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const ticker = searchParams.get("ticker") ?? "";
        const limit = searchParams.get("limit") ?? "10";
        const data = await fetchStockNews(ticker, limit);
        return Response.json(data);
    } catch (error) {
        return Response.json(
            { error: (error as Error).message },
            { status: 500 },
        );
    }
}
