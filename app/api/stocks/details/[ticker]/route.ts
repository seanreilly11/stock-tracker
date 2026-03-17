import { polygonFetch } from "@/server/queries";
import { NextRequest } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ ticker: string }> },
) {
    try {
        const { ticker } = await params;
        const data = await polygonFetch(`/v3/reference/tickers/${ticker}`);
        return Response.json(data);
    } catch (error) {
        return Response.json(
            { error: (error as Error).message },
            { status: 500 },
        );
    }
}
