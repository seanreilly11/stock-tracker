import nodemailer from "nodemailer";
import { APP_NAME, PRIMARY_COLOUR } from "@/utils/constants";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type StockResponse = { T: string; c: number };
type UserWithStocks = {
    name: string;
    email: string;
    stocks: { ticker: string; targetPrice: number | null; holding: boolean }[];
};

export const sendEmails = async (
    responses: StockResponse[],
    users: UserWithStocks[],
) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    for (const response of responses) {
        for (const user of users) {
            const stock = user.stocks.find(
                (s) => s.ticker === response.T && s.targetPrice,
            );
            if (
                stock &&
                ((response.c > stock.targetPrice! && stock.holding) ||
                    (response.c < stock.targetPrice! && !stock.holding))
            ) {
                await transporter.sendMail({
                    from: `"${APP_NAME}" <${process.env.GMAIL_USERNAME}>`,
                    to: user.email,
                    subject: `${response.T} has hit your price target!`,
                    html: defineEmailHTML(user, response.T),
                });
            }
        }
    }
};

const defineEmailHTML = (user: { name: string }, ticker: string) => {
    return `<div style="">
        <div style="padding: 2rem;">
            <h1 style="margin-top: 0">${ticker} has hit your price target!</h1>
            <h3>Hi ${user.name},</h3>
            <p>${ticker} has passed the target price that you set in ${APP_NAME}.</p>
            <p>It's now time to go checkout your plan for ${ticker} and put that plan into${"\u00A0"}action!</p>
            <br />
            <a
                href="${APP_URL}"
                style="
                    background-color: ${PRIMARY_COLOUR};
                    color: #fff;
                    text-decoration: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                "
                >Go to ${APP_NAME}</a
            >
            <br />
            <br />
            <p>
                Happy investing, <br />
                ${APP_NAME}
            </p>
        </div>
    </div>`;
};
