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
import { db, logCustomEvent } from "../firebase";
import { TStock, UserDoc } from "@/utils/types";
import { MAX_NEXT_TO_BUY } from "@/utils/constants";

/**
 * Change between test and prod collections based on environment.
 * Query functions (getUserStocks, getUserStock, etc.) throw on error so React Query
 * can catch them and set isError. Mutation functions return { error } so callers
 * can inspect the result in onSuccess.
 */
const USERS_COLLECTION =
    process.env.NODE_ENV === "production" ? "users" : "TEST_users";

const MESSAGES_COLLECTION =
    process.env.NODE_ENV === "production" ? "messages" : "TEST_messages";

/**
 * get user doc common function
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
) => {
    return await setDoc(doc(db, USERS_COLLECTION, uid), {
        name,
        email,
        lastLogin: Date.now(),
        createdAt: Date.now(),
        stocks: [],
        provider,
    });
};

export const updateUserLoginDate = async (uid: string) => {
    const { docRef, error } = await commonGetDoc(uid);
    if (error) return { error };
    else if (docRef) return updateDoc(docRef, { lastLogin: Date.now() });
    return { error: "DocRef not referenced. Issue with userId." };
};

export const getUsers = async (): Promise<UserDoc[]> => {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const array: UserDoc[] = [];
    querySnapshot.forEach((doc) => {
        array.push({
            ...(doc.data() as Omit<UserDoc, "docId">),
            docId: doc.id,
        });
    });
    return array;
};

/**
 * stock functions
 */

export const getUserStocks = async (userId: string | undefined) => {
    const { docSnap, error } = await commonGetDoc(userId);
    if (error) throw new Error(error);
    return docSnap
        ?.data()
        .stocks.sort((a: TStock, b: TStock) =>
            a.ticker.localeCompare(b.ticker),
        );
};

export const getUserStock = async (
    ticker: string,
    userId: string | undefined,
) => {
    const { docSnap, error } = await commonGetDoc(userId);
    if (error) return { error };

    const savedStock = docSnap
        ?.data()
        .stocks.find((stock: TStock) => stock.ticker === ticker);
    if (!savedStock) return { error: "Stock not in portfolio" };
    return savedStock;
};

export const getUserNextBuyStocks = async (userId: string | undefined) => {
    const { docSnap, error } = await commonGetDoc(userId);
    if (error) return { error };
    return docSnap?.data().nextToBuy ?? [];
};

export const addStock = async (stock: TStock, userId: string | undefined) => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { error };

        const stockExists = docSnap
            ?.data()
            .stocks.find((_stock: TStock) => _stock.ticker === stock.ticker);
        if (stockExists) return { error: "Stock already in portfolio" };
        else if (docRef)
            return await updateDoc(docRef, {
                stocks: arrayUnion({
                    ...stock,
                    createdDate: Date.now(),
                    updatedDate: Date.now(),
                }),
            });
        return { error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error adding stock: ", e);
        return { error: (e as Error).message };
    }
};

export const updateStock = async (
    newStock: Partial<TStock>,
    ticker: string,
    userId: string | undefined,
) => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { error };

        const existingStock: TStock | undefined = docSnap
            ?.data()
            ?.stocks.find((saved: TStock) => saved.ticker === ticker);
        if (!existingStock) return { error: "Stock not found in portfolio" };

        const updatedStock: TStock = {
            ...existingStock,
            ...newStock,
            updatedDate: Date.now(),
            createdDate: existingStock.createdDate,
        };
        const updatedStocksArray = [
            ...docSnap
                ?.data()
                ?.stocks.filter((saved: TStock) => saved.ticker !== ticker),
            updatedStock,
        ];

        if (docRef) return await updateDoc(docRef, { stocks: updatedStocksArray });
        return { error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error updating stock: ", e);
        return { error: (e as Error).message };
    }
};

export const addToNextToBuy = async (
    ticker: string,
    userId: string | undefined,
) => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { error };

        if (docSnap?.data()?.nextToBuy?.includes(ticker))
            return { error: "Ticker already in list." };
        if (docSnap?.data()?.nextToBuy?.length >= MAX_NEXT_TO_BUY) {
            logCustomEvent("next_to_buy_max_reached");
            return { error: "Next to buy list at capacity." };
        }

        if (docRef) return await updateDoc(docRef, { nextToBuy: arrayUnion(ticker) });

        return { error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error adding to next to buy: ", e);
        return { error: (e as Error).message };
    }
};

export const removeFromNextToBuy = async (
    ticker: string,
    userId: string | undefined,
) => {
    try {
        const { docRef, error } = await commonGetDoc(userId);
        if (error) return { error };

        if (docRef)
            return await updateDoc(docRef, { nextToBuy: arrayRemove(ticker) });

        return { error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error removing from next to buy: ", e);
        return { error: (e as Error).message };
    }
};

export const removeStock = async (
    ticker: string,
    userId: string | undefined,
) => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { error };

        const updatedStocksArray = [
            ...docSnap
                ?.data()
                ?.stocks.filter((saved: TStock) => saved.ticker !== ticker),
        ];
        if (docRef) return await updateDoc(docRef, { stocks: updatedStocksArray });
        return { error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error removing stock: ", e);
        return { error: (e as Error).message };
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
) => {
    try {
        await addDoc(collection(db, MESSAGES_COLLECTION), {
            name,
            email,
            message,
            userId: userId ? userId : null,
            createdAt: Date.now(),
        });
        return true;
    } catch (e) {
        console.error("Error adding feedback: ", e);
        return { error: (e as Error).message };
    }
};
