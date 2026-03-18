"use server";

import { revalidatePath } from "next/cache";
import { getUidFromSession } from "@/lib/session";
import {
    addStockServer,
    updateStockServer,
    removeStockServer,
    addToNextToBuyServer,
    removeFromNextToBuyServer,
} from "@/lib/db.server";
import { TStock } from "@/lib/schemas/stocks/stock.schema";
import { DbResult } from "@/lib/schemas/common/response.schema";

export async function addStockAction(stock: TStock): Promise<DbResult> {
    const uid = await getUidFromSession();
    if (!uid) return { success: false, data: null, error: "Not authenticated" };
    const result = await addStockServer(stock, uid);
    revalidatePath("/");
    return result;
}

export async function updateStockAction(
    stock: Partial<TStock>,
    ticker: string,
): Promise<DbResult> {
    const uid = await getUidFromSession();
    if (!uid) return { success: false, data: null, error: "Not authenticated" };
    const result = await updateStockServer(stock, ticker, uid);
    revalidatePath(`/stocks/${ticker}`);
    revalidatePath("/");
    return result;
}

export async function removeStockAction(ticker: string): Promise<DbResult> {
    const uid = await getUidFromSession();
    if (!uid) return { success: false, data: null, error: "Not authenticated" };
    const result = await removeStockServer(ticker, uid);
    revalidatePath("/");
    revalidatePath(`/stocks/${ticker}`);
    return result;
}

export async function addToNextToBuyAction(ticker: string): Promise<DbResult> {
    const uid = await getUidFromSession();
    if (!uid) return { success: false, data: null, error: "Not authenticated" };
    const result = await addToNextToBuyServer(ticker, uid);
    revalidatePath("/");
    revalidatePath(`/stocks/${ticker}`);
    return result;
}

export async function removeFromNextToBuyAction(
    ticker: string,
): Promise<DbResult> {
    const uid = await getUidFromSession();
    if (!uid) return { success: false, data: null, error: "Not authenticated" };
    const result = await removeFromNextToBuyServer(ticker, uid);
    revalidatePath("/");
    revalidatePath(`/stocks/${ticker}`);
    return result;
}
