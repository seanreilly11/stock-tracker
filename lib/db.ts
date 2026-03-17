import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { db, logCustomEvent } from "./firebase";
import { DbResult } from "@/lib/schemas/common/response.schema";
import { TStock } from "@/lib/schemas/stocks/stock.schema";
import { UserDoc } from "@/lib/schemas/user/user.schema";
import { MAX_NEXT_TO_BUY } from "@/utils/constants";

/**
 * Change between test and prod collections based on environment.
 */
const USERS_COLLECTION =
    process.env.NODE_ENV === "production" ? "users" : "TEST_users";

const MESSAGES_COLLECTION =
    process.env.NODE_ENV === "production" ? "messages" : "TEST_messages";

/**
 * Internal helper — not exported. Returns { error } or { docRef, docSnap }.
 */
const commonGetDoc = async (userId: string | undefined) => {
    if (!userId) return { error: "No user ID provided" };
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return { error: "No user found" };

    return { docRef, docSnap };
};

/**
 * auth account functions
 */

export const createUserOnSignUp = async (
    uid: string,
    email: string,
    name: string,
    provider: string,
): Promise<DbResult> => {
    try {
        await setDoc(doc(db, USERS_COLLECTION, uid), {
            name,
            email,
            lastLogin: Date.now(),
            createdAt: Date.now(),
            stocks: [],
            provider,
        });
        return { success: true, data: null, error: undefined };
    } catch (e) {
        console.error("Error creating user: ", e);
        return { success: false, data: null, error: (e as Error).message };
    }
};

export const updateUserLoginDate = async (uid: string): Promise<DbResult> => {
    try {
        const { docRef, error } = await commonGetDoc(uid);
        if (error) return { success: false, data: null, error };
        if (docRef) {
            await updateDoc(docRef, { lastLogin: Date.now() });
            return { success: true, data: null, error: undefined };
        }
        return { success: false, data: null, error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error updating login date: ", e);
        return { success: false, data: null, error: (e as Error).message };
    }
};

export const getUsers = async (): Promise<DbResult<UserDoc[]>> => {
    try {
        const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
        const array: UserDoc[] = [];
        querySnapshot.forEach((doc) => {
            array.push({
                ...(doc.data() as Omit<UserDoc, "docId">),
                docId: doc.id,
            });
        });
        return { success: true, data: array, error: undefined };
    } catch (e) {
        console.error("Error fetching users: ", e);
        return { success: false, data: null, error: (e as Error).message };
    }
};

/**
 * stock functions
 */

export const getUserStocks = async (
    userId: string | undefined,
): Promise<DbResult<TStock[]>> => {
    const { docSnap, error } = await commonGetDoc(userId);
    if (error) return { success: false, data: null, error };
    const stocks: TStock[] = docSnap!
        .data()
        .stocks.sort((a: TStock, b: TStock) => a.ticker.localeCompare(b.ticker));
    return { success: true, data: stocks, error: undefined };
};

export const getUserStock = async (
    ticker: string,
    userId: string | undefined,
): Promise<DbResult<TStock>> => {
    const { docSnap, error } = await commonGetDoc(userId);
    if (error) return { success: false, data: null, error };

    const savedStock: TStock | undefined = docSnap!
        .data()
        .stocks.find((stock: TStock) => stock.ticker === ticker);
    if (!savedStock) return { success: false, data: null, error: "Stock not in portfolio" };
    return { success: true, data: savedStock, error: undefined };
};

export const getUserNextBuyStocks = async (
    userId: string | undefined,
): Promise<DbResult<string[]>> => {
    const { docSnap, error } = await commonGetDoc(userId);
    if (error) return { success: false, data: null, error };
    return { success: true, data: docSnap!.data().nextToBuy ?? [], error: undefined };
};

export const addStock = async (
    stock: TStock,
    userId: string | undefined,
): Promise<DbResult> => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { success: false, data: null, error };

        const stockExists = docSnap!
            .data()
            .stocks.find((_stock: TStock) => _stock.ticker === stock.ticker);
        if (stockExists) return { success: false, data: null, error: "Stock already in portfolio" };

        if (docRef) {
            await updateDoc(docRef, {
                stocks: arrayUnion({
                    ...stock,
                    createdDate: Date.now(),
                    updatedDate: Date.now(),
                }),
            });
            return { success: true, data: null, error: undefined };
        }
        return { success: false, data: null, error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error adding stock: ", e);
        return { success: false, data: null, error: (e as Error).message };
    }
};

export const updateStock = async (
    newStock: Partial<TStock>,
    ticker: string,
    userId: string | undefined,
): Promise<DbResult> => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { success: false, data: null, error };

        const existingStock: TStock | undefined = docSnap!
            .data()
            ?.stocks.find((saved: TStock) => saved.ticker === ticker);
        if (!existingStock) return { success: false, data: null, error: "Stock not found in portfolio" };

        const updatedStock: TStock = {
            ...existingStock,
            ...newStock,
            updatedDate: Date.now(),
            createdDate: existingStock.createdDate,
        };
        const updatedStocksArray = [
            ...docSnap!
                .data()
                ?.stocks.filter((saved: TStock) => saved.ticker !== ticker),
            updatedStock,
        ];

        if (docRef) {
            await updateDoc(docRef, { stocks: updatedStocksArray });
            return { success: true, data: null, error: undefined };
        }
        return { success: false, data: null, error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error updating stock: ", e);
        return { success: false, data: null, error: (e as Error).message };
    }
};

export const addToNextToBuy = async (
    ticker: string,
    userId: string | undefined,
): Promise<DbResult> => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { success: false, data: null, error };

        if (docSnap!.data()?.nextToBuy?.includes(ticker))
            return { success: false, data: null, error: "Ticker already in list." };
        if (docSnap!.data()?.nextToBuy?.length >= MAX_NEXT_TO_BUY) {
            logCustomEvent("next_to_buy_max_reached");
            return { success: false, data: null, error: "Next to buy list at capacity." };
        }

        if (docRef) {
            await updateDoc(docRef, { nextToBuy: arrayUnion(ticker) });
            return { success: true, data: null, error: undefined };
        }
        return { success: false, data: null, error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error adding to next to buy: ", e);
        return { success: false, data: null, error: (e as Error).message };
    }
};

export const removeFromNextToBuy = async (
    ticker: string,
    userId: string | undefined,
): Promise<DbResult> => {
    try {
        const { docRef, error } = await commonGetDoc(userId);
        if (error) return { success: false, data: null, error };

        if (docRef) {
            await updateDoc(docRef, { nextToBuy: arrayRemove(ticker) });
            return { success: true, data: null, error: undefined };
        }
        return { success: false, data: null, error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error removing from next to buy: ", e);
        return { success: false, data: null, error: (e as Error).message };
    }
};

export const removeStock = async (
    ticker: string,
    userId: string | undefined,
): Promise<DbResult> => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { success: false, data: null, error };

        const updatedStocksArray = [
            ...docSnap!
                .data()
                ?.stocks.filter((saved: TStock) => saved.ticker !== ticker),
        ];
        if (docRef) {
            await updateDoc(docRef, { stocks: updatedStocksArray });
            return { success: true, data: null, error: undefined };
        }
        return { success: false, data: null, error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error removing stock: ", e);
        return { success: false, data: null, error: (e as Error).message };
    }
};

/**
 * feedback/contact functions
 */

export const addFeedback = async (
    name: string = "",
    email: string,
    message: string,
    userId: string | undefined,
): Promise<DbResult> => {
    try {
        await addDoc(collection(db, MESSAGES_COLLECTION), {
            name,
            email,
            message,
            userId: userId ? userId : null,
            createdAt: Date.now(),
        });
        return { success: true, data: null, error: undefined };
    } catch (e) {
        console.error("Error adding feedback: ", e);
        return { success: false, data: null, error: (e as Error).message };
    }
};
