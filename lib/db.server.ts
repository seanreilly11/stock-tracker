import { createClient } from "@/lib/supabase/server";

export async function getUserStocksServer(uid: string | null) {
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

export async function getUserStockServer(uid: string | null, ticker: string) {
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

export async function getUserNextBuyStocksServer(uid: string | null) {
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

export async function getStockNotesServer(stockId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("stock_id", stockId)
        .order("created_at", { ascending: true });
    if (error) throw error;
    return data;
}

export async function addStockServer(uid: string, ticker: string, name: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("stocks")
        .insert({ user_id: uid, ticker, name, holding: false })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function updateStockServer(
    stockId: string,
    updates: {
        holding?: boolean;
        target_price?: number | null;
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

export async function removeStockServer(stockId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("stocks").delete().eq("id", stockId);
    if (error) throw error;
}

export async function addNoteServer(stockId: string, uid: string, text: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("notes")
        .insert({ stock_id: stockId, user_id: uid, text })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function deleteNoteServer(noteId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("notes").delete().eq("id", noteId);
    if (error) throw error;
}

export async function addToNextToBuyServer(uid: string, ticker: string) {
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

export async function removeFromNextToBuyServer(uid: string, ticker: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("next_to_buy")
        .delete()
        .eq("user_id", uid)
        .eq("ticker", ticker);
    if (error) throw error;
}
