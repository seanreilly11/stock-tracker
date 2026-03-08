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
    // responseSchema: any,
) => {
    const params = new URLSearchParams({
        ...urlParams,
        apiKey: process.env.NEXT_PUBLIC_POLYGON_API_KEY || "",
    });
    const res = await fetch(
        `https://api.polygon.io${url}?${params.toString()}`,
    );
    return await validateAndParseResponse(res, errorMessage);
};

const parseAIResponse = async (response: Response, errorMessage: string) => {
    const unsafeResponse = await response.json();
    if (!response.ok) {
        throw new Error(unsafeResponse.error || errorMessage);
    }
    const string = await unsafeResponse.choices[0].message.content;
    let jsonData;
    if (string.startsWith("```json"))
        jsonData = string?.split("```json")[1]?.split("```")[0];
    else jsonData = string;
    return JSON.parse(jsonData);
};

export const standardAIPost = async (
    url: string,
    data: Record<string, any>,
    errorMessage: string,
) => {
    const res = await fetch(`/api/ai${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return await parseAIResponse(res, errorMessage);
};
