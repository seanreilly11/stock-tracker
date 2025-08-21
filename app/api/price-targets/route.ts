import { getUsers } from "@/server/actions/db";
import { sendEmails } from "@/utils/emails";

export async function GET(req: Request) {
    try {
        const users = await getUsers();
        const tickers = [
            ...new Set(
                users.flatMap((user) =>
                    user.stocks.map((stock: { ticker: string }) => stock.ticker)
                )
            ),
        ].slice(0, 4);

        const reqs = tickers.map(async (ticker) => {
            const res = await fetch(
                `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
            );
            const data = await res.json();
            return data.results[0];
        });

        const responses = await Promise.all(reqs);

        await sendEmails(responses, users);

        return Response.json(true);
    } catch (error) {
        console.error(error);
        return Response.json("Internal Server Error", { status: 500 });
    }
}
