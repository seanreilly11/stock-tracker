import nodemailer from "nodemailer";
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
    }
}

const sendEmails = async (responses: any[], users: any[]) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "seanreilly52@gmail.com",
            pass: "xgywkihemptapjyj",
        },
    });

    for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        const hasTicker: any[] = [];
        for (let j = 0; j < users.length; j++) {
            const user = users[j];
            const stock = user.stocks.find(
                (stock: { ticker: string; targetPrice: number | null }) =>
                    stock.ticker == response.T && stock.targetPrice
            );
            if (
                stock &&
                ((response.c > stock.targetPrice && stock.holding) ||
                    (response.c < stock.targetPrice && !stock.holding))
            ) {
                hasTicker.push([response.T, user.email, stock.targetPrice]);
                await transporter.sendMail({
                    from: "Sean",
                    to: "seanreilly123@hotmail.com",
                    subject: `${response.T} has hit your price target!`,
                    text: "Move now to handle your price target.",
                });
                // TODO: store it on user that email has been sent for the price target to not resend it
            }
        }
        console.log(hasTicker);
    }

    // const { name, email, message } = req.body;

    // const transporter = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 587,
    //     auth: {
    //         user: process.env.GMAIL_USERNAME,
    //         pass: process.env.GMAIL_PASSWORD,
    //     },
    // });

    // var mailOptions = {
    //     from: "Aotearoa DJ Academy",
    //     to: "seanreilly123@hotmail.com", // TODO: add result email
    //     subject: "Welcome to Aotearoa DJ Academy",
    //     html: defineEmailHTML(req.result),
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //         res.send(500, err.message);
    //     } else {
    //         res.status(200).json(true);
    //     }
    // });
};
