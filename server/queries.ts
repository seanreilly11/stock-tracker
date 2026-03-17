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

const parseAIResponse = async (response: Response, errorMessage: string) => {
    const unsafeResponse = await response.json();
    if (!response.ok) {
        throw new Error(unsafeResponse.error || errorMessage);
    }
    const string: string = unsafeResponse.choices[0].message.content;
    const jsonData = string.startsWith("```json")
        ? string.split("```json")[1]?.split("```")[0]
        : string;
    try {
        return JSON.parse(jsonData);
    } catch {
        throw new Error(`Failed to parse AI response: ${jsonData}`);
    }
};

export const standardAPIFetch = async (
    url: string,
    method: "POST" | "GET" | "PUT",
    data: Record<string, unknown>,
    errorMessage: string,
) => {
    const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
    };
    if (method !== "GET") options.body = JSON.stringify(data);
    const res = await fetch(`/api${url}`, options);
    return await parseAIResponse(res, errorMessage);
};
