import "server-only";
import { createClient } from "@/lib/supabase/server";
import { TTarget, TTargetKind, TStockConviction, TStockTag, TNoteKind } from "@/types";

// ── Stocks ────────────────────────────────────────────────────────────────────

export async function getUserStocks(uid: string | null) {
    if (!uid) return [];
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
}

export async function getUserStock(uid: string | null, ticker: string) {
    if (!uid) return null;
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", uid)
        .eq("ticker", ticker)
        .maybeSingle();
    if (error) throw error;
    return data;
}

export async function addStock(
    uid: string,
    ticker: string,
    name: string,
    conviction?: TStockConviction,
    tag?: TStockTag,
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("stocks")
        .insert({ user_id: uid, ticker, name, conviction, tag })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function updateStock(
    stockId: string,
    updates: {
        most_recent_price?: number | null;
    },
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("stocks")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", stockId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function removeStock(stockId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("stocks").delete().eq("id", stockId);
    if (error) throw error;
}

// ── Notes ─────────────────────────────────────────────────────────────────────

export async function getStockNotes(stockId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("stock_id", stockId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
}

export async function addNote(
    stockId: string,
    uid: string,
    text: string,
    kind?: TNoteKind,
    tags?: string[],
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("notes")
        .insert({ stock_id: stockId, user_id: uid, text, kind: kind ?? "observation", tags })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function deleteNote(noteId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("notes").delete().eq("id", noteId);
    if (error) throw error;
}

// ── Next to Buy ───────────────────────────────────────────────────────────────

export async function getUserNextBuyStocks(uid: string | null) {
    if (!uid) return [] as string[];
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("next_to_buy")
        .select("ticker")
        .eq("user_id", uid)
        .order("created_at", { ascending: true });
    if (error) throw error;
    return data.map((r) => r.ticker) as string[];
}

export async function addToNextToBuy(uid: string, ticker: string) {
    const supabase = await createClient();
    const { count } = await supabase
        .from("next_to_buy")
        .select("*", { count: "exact", head: true })
        .eq("user_id", uid);
    if ((count ?? 0) >= 3) throw new Error("Next to buy list is full (max 3)");
    const { error } = await supabase
        .from("next_to_buy")
        .insert({ user_id: uid, ticker });
    if (error) throw error;
}

export async function removeFromNextToBuy(uid: string, ticker: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("next_to_buy")
        .delete()
        .eq("user_id", uid)
        .eq("ticker", ticker);
    if (error) throw error;
}

// ── Targets ───────────────────────────────────────────────────────────────────

export async function getTargets(stockId: string): Promise<TTarget[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("targets")
        .select("*")
        .eq("stock_id", stockId)
        .order("created_at", { ascending: true });
    if (error) throw error;
    return data as TTarget[];
}

export async function addTarget(
    stockId: string,
    uid: string,
    kind: TTargetKind,
    price: number,
    label: string,
): Promise<TTarget> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("targets")
        .insert({ stock_id: stockId, user_id: uid, kind, price, label, status: "armed" })
        .select()
        .single();
    if (error) throw error;
    return data as TTarget;
}

export async function removeTarget(targetId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("targets").delete().eq("id", targetId);
    if (error) throw error;
}

export interface TriggeredAlert {
    id: string
    ticker: string
    kind: TTargetKind
    price: number
    triggered_at: string | null
}

export async function getTriggeredAlerts(uid: string | null): Promise<TriggeredAlert[]> {
    if (!uid) return []
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("targets")
        .select("id, kind, price, triggered_at, stocks!inner(ticker)")
        .eq("user_id", uid)
        .eq("status", "triggered")
        .order("triggered_at", { ascending: false })
        .limit(10)
    if (error) throw error
    return (data ?? []).map((row: any) => ({
        id: row.id,
        ticker: row.stocks.ticker,
        kind: row.kind,
        price: row.price,
        triggered_at: row.triggered_at,
    }))
}

export async function getTargetCountsByUser(uid: string | null): Promise<{
    triggered: Record<string, number>
    total: Record<string, number>
    triggeredTotal: number
}> {
    if (!uid) return { triggered: {}, total: {}, triggeredTotal: 0 }
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("targets")
        .select("stock_id, status")
        .eq("user_id", uid)
    if (error) throw error
    const triggered: Record<string, number> = {}
    const total: Record<string, number> = {}
    let triggeredTotal = 0
    for (const row of data ?? []) {
        total[row.stock_id] = (total[row.stock_id] ?? 0) + 1
        if (row.status === "triggered") {
            triggered[row.stock_id] = (triggered[row.stock_id] ?? 0) + 1
            triggeredTotal++
        }
    }
    return { triggered, total, triggeredTotal }
}

export async function updateStockThesis(stockId: string, thesis: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("stocks")
        .update({ thesis, updated_at: new Date().toISOString() })
        .eq("id", stockId);
    if (error) throw error;
}

export async function acknowledgeTarget(targetId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("targets")
        .update({ status: "armed" })
        .eq("id", targetId);
    if (error) throw error;
}

// ── Feedback ──────────────────────────────────────────────────────────────────

export async function addFeedback(
    email: string,
    message: string,
    name?: string,
    userId?: string,
) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("feedback")
        .insert({ email, message, name, user_id: userId ?? null });
    if (error) throw error;
}
