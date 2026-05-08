// lib/api/db.ts
import { createClient } from "@/lib/supabase/client"

// ── User ──────────────────────────────────────────────────────────────────────

export async function updateUserLoginDate(userId: string) {
  const supabase = createClient()
  await supabase
    .from("users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", userId)
}

// ── Stocks ────────────────────────────────────────────────────────────────────

export async function getUserStocks(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function getUserStock(userId: string, ticker: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .eq("user_id", userId)
    .eq("ticker", ticker)
    .single()
  if (error) throw error
  return data
}

export async function addStock(userId: string, ticker: string, name: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("stocks")
    .insert({ user_id: userId, ticker, name, holding: false })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateStock(
  stockId: string,
  updates: {
    holding?: boolean
    target_price?: number | null
    most_recent_price?: number | null
  }
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("stocks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", stockId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeStock(stockId: string) {
  const supabase = createClient()
  // notes cascade-delete via FK ON DELETE CASCADE
  const { error } = await supabase.from("stocks").delete().eq("id", stockId)
  if (error) throw error
}

// ── Notes ─────────────────────────────────────────────────────────────────────

export async function getStockNotes(stockId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("stock_id", stockId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return data
}

export async function addNote(stockId: string, userId: string, text: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("notes")
    .insert({ stock_id: stockId, user_id: userId, text })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateNote(noteId: string, text: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("notes")
    .update({ text, updated_at: new Date().toISOString() })
    .eq("id", noteId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteNote(noteId: string) {
  const supabase = createClient()
  const { error } = await supabase.from("notes").delete().eq("id", noteId)
  if (error) throw error
}

// ── Next to Buy ───────────────────────────────────────────────────────────────

export async function getUserNextBuyStocks(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("next_to_buy")
    .select("ticker")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return data.map((r) => r.ticker)
}

export async function addToNextToBuy(userId: string, ticker: string) {
  const supabase = createClient()

  const { count } = await supabase
    .from("next_to_buy")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if ((count ?? 0) >= 3) {
    // TODO: add analytics event tracking (was: logCustomEvent("next_to_buy_max_reached"))
    throw new Error("Next to buy list is full (max 3)")
  }

  const { error } = await supabase
    .from("next_to_buy")
    .insert({ user_id: userId, ticker })
  if (error) throw error
}

export async function removeFromNextToBuy(userId: string, ticker: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from("next_to_buy")
    .delete()
    .eq("user_id", userId)
    .eq("ticker", ticker)
  if (error) throw error
}

// ── Feedback ──────────────────────────────────────────────────────────────────

export async function addFeedback(
  email: string,
  message: string,
  name?: string,
  userId?: string
) {
  const supabase = createClient()
  const { error } = await supabase
    .from("feedback")
    .insert({ email, message, name, user_id: userId ?? null })
  if (error) throw error
}
