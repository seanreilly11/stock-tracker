import { adminDb } from "./firebase-admin";
import { DbResult } from "@/lib/schemas/common/response.schema";
import { TStock } from "@/lib/schemas/stocks/stock.schema";

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
        if (!docSnap.exists) return { success: false, data: null, error: "No user found" };
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
        if (!docSnap.exists) return { success: false, data: null, error: "No user found" };
        const savedStock: TStock | undefined = docSnap
            .data()
            ?.stocks.find((s: TStock) => s.ticker === ticker);
        if (!savedStock) return { success: false, data: null, error: "Stock not in portfolio" };
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
        if (!docSnap.exists) return { success: false, data: null, error: "No user found" };
        return {
            success: true,
            data: docSnap.data()?.nextToBuy ?? [],
            error: undefined,
        };
    } catch (e) {
        return { success: false, data: null, error: (e as Error).message };
    }
}
