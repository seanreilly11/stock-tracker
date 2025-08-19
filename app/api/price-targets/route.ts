import { getUsers } from "@/server/actions/db";

export async function GET(req: Request) {
    try {
        const users = await getUsers();
        const tickers = [
            ...new Set(
                users.flatMap((user) =>
                    user.stocks.map((stock: { ticker: string }) => stock.ticker)
                )
            ),
        ];

        const smallTickers = tickers;

        const reqs = smallTickers.map(async (ticker) => {
            const res = await fetch(
                `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
            );
            const data = await res.json();
            return data.results[0];
        });

        const responses = await Promise.all(reqs);

        for (let i = 0; i < responses.length; i++) {
            const response = responses[i];
            const hasTicker: any[] = [];
            users.forEach((user) => {
                const stock = user.stocks.find(
                    (stock: { ticker: string; targetPrice: number | null }) =>
                        stock.ticker == response.T && stock.targetPrice
                );
                if (stock && response.c > stock.targetPrice) {
                    hasTicker.push([response.T, user.email, stock.targetPrice]);
                }
            });
            console.log(hasTicker);
        }

        return Response.json(responses);
    } catch (error) {
        console.error(error);
    }
}
