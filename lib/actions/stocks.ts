"use server";
import { revalidatePath } from "next/cache";
import { getUidFromSession } from "@/lib/session";
import {
    addStockServer,
    updateStockServer,
    removeStockServer,
    addNoteServer,
    deleteNoteServer,
    addToNextToBuyServer,
    removeFromNextToBuyServer,
    addTargetServer,
    removeTargetServer,
} from "@/lib/db.server";
import { TTarget } from "@/types";

export async function addStockAction(ticker: string, name: string) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await addStockServer(uid, ticker, name);
    revalidatePath("/");
}

export async function addStockWithConfigAction(
    ticker: string,
    name: string,
    config: {
        conviction?: "low" | "medium" | "high";
        tag?: "core" | "starter" | "speculative" | "watch";
        buyPrice?: number;
        buyNote?: string;
        trimPrice?: number;
        trimNote?: string;
        thesis?: string;
    },
) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    const stock = await addStockServer(uid, ticker, name, config.conviction, config.tag);
    if (config.buyPrice) await addTargetServer(stock.id, uid, "buy", config.buyPrice, config.buyNote ?? "");
    if (config.trimPrice) await addTargetServer(stock.id, uid, "sell", config.trimPrice, config.trimNote ?? "");
    if (config.thesis?.trim()) await addNoteServer(stock.id, uid, config.thesis.trim(), "thesis");
    revalidatePath("/");
}

export async function updateStockAction(
    stockId: string,
    updates: {
        holding?: boolean;
        target_price?: number | null;
        most_recent_price?: number | null;
    },
    ticker: string,
) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await updateStockServer(stockId, updates);
    revalidatePath(`/stocks/${ticker}`);
    revalidatePath("/");
}

export async function removeStockAction(stockId: string) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await removeStockServer(stockId);
    revalidatePath("/");
}

export async function addNoteAction(
    stockId: string,
    text: string,
    ticker: string,
    kind?: string,
    tags?: string[],
) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await addNoteServer(stockId, uid, text, kind, tags);
    revalidatePath(`/stocks/${ticker}`);
}

export async function deleteNoteAction(noteId: string, ticker: string) {
    await deleteNoteServer(noteId);
    revalidatePath(`/stocks/${ticker}`);
}

export async function addToNextToBuyAction(ticker: string) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await addToNextToBuyServer(uid, ticker);
    revalidatePath("/");
}

export async function removeFromNextToBuyAction(ticker: string) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await removeFromNextToBuyServer(uid, ticker);
    revalidatePath("/");
}

export async function addTargetAction(
    stockId: string,
    ticker: string,
    kind: TTarget["kind"],
    price: number,
    label: string,
) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await addTargetServer(stockId, uid, kind, price, label);
    revalidatePath(`/stocks/${ticker}`);
}

export async function removeTargetAction(targetId: string, ticker: string) {
    await removeTargetServer(targetId);
    revalidatePath(`/stocks/${ticker}`);
}
