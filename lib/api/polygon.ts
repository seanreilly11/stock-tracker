export const polygonFetch = async (
    path: string,
    params: Record<string, string> = {},
) => {
    const searchParams = new URLSearchParams({
        ...params,
        apiKey: process.env.POLYGON_API_KEY || "",
    });
    const res = await fetch(
        `https://api.polygon.io${path}?${searchParams.toString()}`,
    );
    if (!res.ok) throw new Error(`Polygon API error: ${res.statusText}`);
    return res.json();
};
