import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) return new Response("Missing url", { status: 400 });

    try {
        const res = await fetch(
            `${url}?apiKey=${process.env.POLYGON_API_KEY || ""}`,
        );
        if (!res.ok) return new Response("Not found", { status: 404 });

        const contentType = res.headers.get("content-type") ?? "image/png";
        const buffer = await res.arrayBuffer();
        return new Response(buffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch {
        return new Response("Failed to fetch logo", { status: 500 });
    }
}
