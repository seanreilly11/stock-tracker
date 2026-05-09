import { polygonFetch } from "@/lib/api/polygon";
import { NextRequest } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ ticker: string }> },
) {
    try {
        const { ticker } = await params;
        const data = await polygonFetch(
            `/v1/related-companies/${ticker.toUpperCase()}`,
        );
        return Response.json(data);
    } catch (error) {
        return Response.json(
            { error: (error as Error).message },
            { status: 500 },
        );
    }
}
