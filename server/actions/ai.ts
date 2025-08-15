import { AISuggestionOption } from "@/utils/types";

export const getAISuggestions = async (
    option: AISuggestionOption = "popular"
) => {
    const res = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ option }),
    });
    if (!res.ok) {
        throw new Error("Failed to fetch AI suggestions");
    }
    const data = await res.json();
    // console.log(data);
    const string = await data.choices[0].message.content;
    let jsonData;
    if (string.startsWith("```json"))
        jsonData = string?.split("```json")[1]?.split("```")[0];
    else jsonData = string;

    return JSON.parse(jsonData);
};

export const getAINotes = async (ticker: string, type: string) => {
    const res = await fetch("/api/ai/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker, type }),
    });
    if (!res.ok) {
        throw new Error("Failed to fetch AI notes");
    }
    const data = await res.json();
    // console.log(data);
    const string = await data.choices[0].message.content;
    let jsonData;
    if (string.startsWith("```json"))
        jsonData = string?.split("```json")[1]?.split("```")[0];
    else jsonData = string;

    return JSON.parse(jsonData);
};
