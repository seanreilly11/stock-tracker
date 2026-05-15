import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { TTargetKind } from "@/types";

export interface ArmedTarget {
  id: string;
  kind: TTargetKind;
  price: number;
  ticker: string;
  user_id: string;
}

export async function getArmedTargetsForCron(): Promise<ArmedTarget[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("targets")
    .select("id, kind, price, user_id, stocks!inner(ticker)")
    .eq("status", "armed");
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    id: row.id,
    kind: row.kind,
    price: row.price,
    user_id: row.user_id,
    ticker: row.stocks.ticker,
  }));
}

export async function triggerTargets(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("targets")
    .update({ status: "triggered", triggered_at: new Date().toISOString() })
    .in("id", ids);
  if (error) throw error;
}
