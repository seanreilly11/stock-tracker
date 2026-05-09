import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import { DbResult } from "@/lib/schemas/common/response.schema";
import { TStock } from "@/lib/schemas/stocks/stock.schema";
import { MAX_NEXT_TO_BUY } from "@/utils/constants";

const USERS_COLLECTION =
    process.env.NODE_ENV === "production" ? "users" : "TEST_users";

export async function getUserStocksServer(
    uid: string,
): Promise<DbResult<TStock[]>> {
    try {
        const docSnap = await adminDb
            .collection(USERS_COLLECTION)
            .doc(uid)
            .get();
        if (!docSnap.exists)
            return { success: false, data: null, error: "No user found" };
        const stocks: TStock[] = (docSnap.data()?.stocks ?? []).sort(
            (a: TStock, b: TStock) => a.ticker.localeCompare(b.ticker),
        );
        return { success: true, data: stocks, error: undefined };
    } catch (e) {
        return { success: false, data: null, error: (e as Error).message };
    }
}

export async function getUserStockServer(
    ticker: string,
    uid: string,
): Promise<DbResult<TStock>> {
    try {
        const docSnap = await adminDb
            .collection(USERS_COLLECTION)
            .doc(uid)
            .get();
        if (!docSnap.exists)
            return { success: false, data: null, error: "No user found" };
        const savedStock: TStock | undefined = docSnap
            .data()
            ?.stocks.find((s: TStock) => s.ticker === ticker);
        if (!savedStock)
            return {
                success: false,
                data: null,
                error: "Stock not in portfolio",
            };
        return { success: true, data: savedStock, error: undefined };
    } catch (e) {
        return { success: false, data: null, error: (e as Error).message };
    }
}

export async function getUserNextBuyStocksServer(
    uid: string,
): Promise<DbResult<string[]>> {
    try {
        const docSnap = await adminDb
            .collection(USERS_COLLECTION)
            .doc(uid)
            .get();
        if (!docSnap.exists)
            return { success: false, data: null, error: "No user found" };
        return {
            success: true,
            data: docSnap.data()?.nextToBuy ?? [],
            error: undefined,
        };
    } catch (e) {
        return { success: false, data: null, error: (e as Error).message };
    }
}

export async function addStockServer(
    stock: TStock,
    uid: string,
): Promise<DbResult> {
    try {
        const docRef = adminDb.collection(USERS_COLLECTION).doc(uid);
        const docSnap = await docRef.get();
        if (!docSnap.exists)
            return { success: false, data: null, error: "No user found" };
        const exists = docSnap
            .data()
            ?.stocks.some((s: TStock) => s.ticker === stock.ticker);
        if (exists)
            return {
                success: false,
                data: null,
                error: "Stock already in portfolio",
            };
        await docRef.update({
            stocks: FieldValue.arrayUnion({
                ...stock,
                createdDate: Date.now(),
                updatedDate: Date.now(),
            }),
        });
        return { success: true, data: null, error: undefined };
    } catch (e) {
        return { success: false, data: null, error: (e as Error).message };
    }
}

export async function updateStockServer(
    newStock: Partial<TStock>,
    ticker: string,
    uid: string,
): Promise<DbResult> {
    try {
        const docRef = adminDb.collection(USERS_COLLECTION).doc(uid);
        const docSnap = await docRef.get();
        if (!docSnap.exists)
            return { success: false, data: null, error: "No user found" };
        const existing: TStock | undefined = docSnap
            .data()
            ?.stocks.find((s: TStock) => s.ticker === ticker);
        if (!existing)
            return {
                success: false,
                data: null,
                error: "Stock not found in portfolio",
            };
        const updated = {
            ...existing,
            ...newStock,
            updatedDate: Date.now(),
            createdDate: existing.createdDate,
        };
        const updatedArray = [
            ...docSnap
                .data()!
                .stocks.filter((s: TStock) => s.ticker !== ticker),
            updated,
        ];
        await docRef.update({ stocks: updatedArray });
        return { success: true, data: null, error: undefined };
    } catch (e) {
        return { success: false, data: null, error: (e as Error).message };
    }
}

export async function removeStockServer(
    ticker: string,
    uid: string,
): Promise<DbResult> {
    try {
        const docRef = adminDb.collection(USERS_COLLECTION).doc(uid);
        const docSnap = await docRef.get();
        if (!docSnap.exists)
            return { success: false, data: null, error: "No user found" };
        const updatedArray = docSnap
            .data()!
            .stocks.filter((s: TStock) => s.ticker !== ticker);
        await docRef.update({ stocks: updatedArray });
        return { success: true, data: null, error: undefined };
    } catch (e) {
        return { success: false, data: null, error: (e as Error).message };
    }
}

export async function addToNextToBuyServer(
    ticker: string,
    uid: string,
): Promise<DbResult> {
    try {
        const docRef = adminDb.collection(USERS_COLLECTION).doc(uid);
        const docSnap = await docRef.get();
        if (!docSnap.exists)
            return { success: false, data: null, error: "No user found" };
        const nextToBuy: string[] = docSnap.data()?.nextToBuy ?? [];
        if (nextToBuy.includes(ticker))
            return {
                success: false,
                data: null,
                error: "Ticker already in list.",
            };
        if (nextToBuy.length >= MAX_NEXT_TO_BUY)
            return {
                success: false,
                data: null,
                error: "Next to buy list at capacity.",
            };
        await docRef.update({ nextToBuy: FieldValue.arrayUnion(ticker) });
        return { success: true, data: null, error: undefined };
    } catch (e) {
        return { success: false, data: null, error: (e as Error).message };
    }
}

export async function removeFromNextToBuyServer(
    ticker: string,
    uid: string,
): Promise<DbResult> {
    try {
        const docRef = adminDb.collection(USERS_COLLECTION).doc(uid);
        await docRef.update({ nextToBuy: FieldValue.arrayRemove(ticker) });
        return { success: true, data: null, error: undefined };
    } catch (e) {
        return { success: false, data: null, error: (e as Error).message };
    }
}
