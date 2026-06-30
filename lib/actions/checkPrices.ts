"use server";

export async function checkPricesAction(): Promise<{
  triggered: number;
  checked: number;
  skipped?: string;
  error?: string;
}> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/crons/check-targets`,
    { headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } },
  );
  return res.json();
}
