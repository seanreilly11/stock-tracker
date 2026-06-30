import { Resend } from "resend";
import { TTargetKind } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);

const KIND_LABEL: Record<TTargetKind, string> = {
  buy: "Buy",
  sell: "Sell",
  stop: "Stop",
};

export async function sendAlertEmail(
  to: string,
  ticker: string,
  kind: TTargetKind,
  targetPrice: number,
  currentPrice: number,
) {
  const kindLabel = KIND_LABEL[kind];
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  await resend.emails.send({
    from: "alerts@yourdomain.com",
    to,
    subject: `${ticker} ${kindLabel} alert hit — $${targetPrice}`,
    html: `
      <h2>${ticker} price alert triggered</h2>
      <p><strong>Type:</strong> ${kindLabel}</p>
      <p><strong>Target price:</strong> $${targetPrice}</p>
      <p><strong>Current price:</strong> $${currentPrice.toFixed(2)}</p>
      <p><a href="${appUrl}/stocks/${ticker}">View ${ticker}</a></p>
    `,
  });
}
