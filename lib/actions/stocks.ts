"use server";
import { revalidatePath } from "next/cache";
import { getUidFromSession } from "@/lib/session";
import {
    addStock,
    updateStock,
    removeStock,
    addNote,
    deleteNote,
    addToNextToBuy,
    removeFromNextToBuy,
    addTarget,
    removeTarget,
} from "@/lib/data";
import { TTargetKind, TStockConviction, TStockTag, TNoteKind } from "@/types";

export async function addStockAction(ticker: string, name: string) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    const stock = await addStock(uid, ticker, name);
    await addNote(stock.id, uid, `Added ${ticker} to watchlist.`, "plan", ["onboarding"]);
    revalidatePath("/");
}

export async function addStockWithConfigAction(
    ticker: string,
    name: string,
    config: {
        conviction?: TStockConviction;
        tag?: TStockTag;
        buyPrice?: number;
        buyNote?: string;
        trimPrice?: number;
        trimNote?: string;
        thesis?: string;
    },
) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    const stock = await addStock(uid, ticker, name, config.conviction, config.tag);

    // Onboarding plan note — inserted first so it's oldest (anchors bottom of timeline)
    const targetCount = (config.buyPrice ? 1 : 0) + (config.trimPrice ? 1 : 0);
    const targetSummary = targetCount > 0 ? ` Set ${targetCount} target${targetCount > 1 ? "s" : ""}.` : "";
    const thesisSummary = config.thesis?.trim() ? " Initial thesis seeded." : "";
    await addNote(
        stock.id, uid,
        `Added ${ticker} to watchlist.${targetSummary}${thesisSummary}`,
        "plan",
        ["onboarding"],
    );

    // Targets (no individual notes — plan note summarises the initial setup)
    if (config.buyPrice) await addTarget(stock.id, uid, "buy", config.buyPrice, config.buyNote ?? "");
    if (config.trimPrice) await addTarget(stock.id, uid, "sell", config.trimPrice, config.trimNote ?? "");

    // Thesis note last — newest timestamp, appears above plan note in the timeline
    if (config.thesis?.trim()) await addNote(stock.id, uid, config.thesis.trim(), "thesis");
    revalidatePath("/");
}

export async function updateStockAction(
    stockId: string,
    updates: {
        most_recent_price?: number | null;
    },
    ticker: string,
) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await updateStock(stockId, updates);
    revalidatePath(`/stocks/${ticker}`);
    revalidatePath("/");
}

export async function removeStockAction(stockId: string) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await removeStock(stockId);
    revalidatePath("/");
}

export async function addNoteAction(
    stockId: string,
    text: string,
    ticker: string,
    kind?: TNoteKind,
    tags?: string[],
) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await addNote(stockId, uid, text, kind, tags);
    revalidatePath(`/stocks/${ticker}`);
}

export async function deleteNoteAction(noteId: string, ticker: string) {
    await deleteNote(noteId);
    revalidatePath(`/stocks/${ticker}`);
}

export async function addToNextToBuyAction(ticker: string) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await addToNextToBuy(uid, ticker);
    revalidatePath("/");
}

export async function removeFromNextToBuyAction(ticker: string) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await removeFromNextToBuy(uid, ticker);
    revalidatePath("/");
}

export async function addTargetAction(
    stockId: string,
    ticker: string,
    kind: TTargetKind,
    price: number,
    label: string,
) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await addTarget(stockId, uid, kind, price, label);
    await addNote(
        stockId, uid,
        `Set ${kind} target at $${price.toFixed(2)}${label ? ` — ${label}` : ""}.`,
        "target",
        ["plan"],
    );
    revalidatePath(`/stocks/${ticker}`);
}

export async function removeTargetAction(targetId: string, ticker: string) {
    await removeTarget(targetId);
    revalidatePath(`/stocks/${ticker}`);
}
