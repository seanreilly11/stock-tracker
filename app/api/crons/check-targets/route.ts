import { NextRequest, NextResponse } from "next/server";
import { getArmedTargetsForCron, triggerTargets } from "@/lib/data-admin";
import { getTickerSnapshots } from "@/lib/api/queries";

function isMarketHours(): boolean {
  const now = new Date();
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay();
  if (day === 0 || day === 6) return false;
  const total = et.getHours() * 60 + et.getMinutes();
  return total >= 570 && total <= 960; // 9:30am–4:00pm ET
}

function isTriggered(kind: string, targetPrice: number, currentPrice: number): boolean {
  if (kind === "sell") return currentPrice >= targetPrice;
  return currentPrice <= targetPrice; // buy + stop
}

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMarketHours()) {
    return NextResponse.json({ skipped: "outside market hours" });
  }

  const targets = await getArmedTargetsForCron();
  if (!targets.length) return NextResponse.json({ triggered: 0, checked: 0 });

  const uniqueTickers = [...new Set(targets.map((t) => t.ticker))];
  const priceMap = await getTickerSnapshots(uniqueTickers);

  const triggeredIds: string[] = [];
  for (const target of targets) {
    const currentPrice = priceMap.get(target.ticker);
    if (!currentPrice) continue;
    if (isTriggered(target.kind, target.price, currentPrice)) {
      triggeredIds.push(target.id);
    }
  }

  await triggerTargets(triggeredIds);

  // Email sending goes here when ready:
  // await Promise.allSettled(triggeredTargets.map(t => sendAlertEmail(...)))

  return NextResponse.json({ triggered: triggeredIds.length, checked: targets.length });
}
