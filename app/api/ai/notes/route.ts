import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

// export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { ticker } = await req.json();
        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are an assistant that is very knowledgeable about stocks and investing in companies and that generates JSON. You always return just the JSON with no additional description, context, any non-json text or numbering. You know the best stocks to invest in currently that can increase in value.",
                },
                {
                    role: "user",
                    content: `What are three concise but specific key notes you have on stock ticker ${ticker} that could suggest that it could increase or decrease in value in the future. There should be three notes total. This can be two positive notes if you think it has positive upside or two negative notes if you think it has negative upside. This json should be an array of objects typed as {explanation:string, impact:string} that have the explanation and whether it suggests the value will increase or decrease.`,
                },
            ],
            model: "gpt-3.5-turbo",
        });

        return Response.json(response);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
