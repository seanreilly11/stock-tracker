import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

// export const runtime = "edge";

const QUANTITY = "four";

const options = {
    popular: `What are ${QUANTITY} popular stocks currently that look like they have good potential growth to invest in.`,
    upside: `What are ${QUANTITY} less common stocks currently that look like they have good potential upside and growth to invest in.`,
};

export async function POST(req: Request) {
    try {
        const { option } = await req.json();
        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are an assistant that is very knowledgeable about stocks and investing in companies and that generates JSON. You always return just the JSON with no additional description or context. You know the best stocks to invest in currently that can increase in value.",
                },
                {
                    role: "user",
                    content: `${options[option]} Return this data in json format only with without any non-json text or numbering. This json should be an array of objects that have the name, ticker, and reason.`,
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
