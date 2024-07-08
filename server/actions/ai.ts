export const getAISuggestions = async (option: string = "popular") => {
    const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ option }),
    });
    const data = await res.json();
    console.log(data);
    const string = await data.choices[0].message.content;
    let jsonData;
    if (string.startsWith("```json")) {
        jsonData = await string?.split("```json")[1]?.split("```")[0];
    } else jsonData = string;

    return JSON.parse(jsonData);
};
