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
} from "@/lib/db.server";

export async function addStockAction(ticker: string, name: string) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await addStockServer(uid, ticker, name);
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

export async function addNoteAction(stockId: string, text: string, ticker: string) {
    const uid = await getUidFromSession();
    if (!uid) throw new Error("Not authenticated");
    await addNoteServer(stockId, uid, text);
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
