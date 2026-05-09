export const polygonFetch = async (
    path: string,
    params: Record<string, string> = {},
) => {
    const searchParams = new URLSearchParams({
        ...params,
        apiKey: process.env.POLYGON_API_KEY || "",
    });
    return fetch(`https://api.polygon.io${path}?${searchParams.toString()}`);
};
