const validateAndParseResponse = async (
    response: Response,
    errorMessage: string,
) => {
    const unsafeResponse = await response.json();
    if (!response.ok) {
        throw new Error(unsafeResponse.error || errorMessage);
    }
    return unsafeResponse;
};

export const standardStockFetch = async (
    url: string,
    urlParams: URLSearchParams,
    errorMessage: string,
) => {
    try {
        const params = new URLSearchParams({
            ...urlParams,
            apiKey: process.env.NEXT_PUBLIC_POLYGON_API_KEY || "",
        });
        const res = await fetch(
            `https://api.polygon.io${url}?${params.toString()}`,
        );
        return await validateAndParseResponse(res, errorMessage);
    } catch (error) {
        console.error(error);
        throw error;
    }
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
