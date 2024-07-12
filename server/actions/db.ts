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
import { db } from "../firebase";
import { TStock } from "@/utils/types";

/**
 * change between test and prod collection
 */
const COLLECTION =
    process.env.NODE_ENV === "production" ? "users" : "TEST_users";

/**
 * get user doc common function
 */
const commonGetDoc = async (userId: string | undefined) => {
    if (!userId) return { error: "No user ID provided" };
    const docRef = doc(db, COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || !docRef) return { error: "No user found" };

    return { docRef, docSnap };
};

/**
 * auth account functions
 */

export const createUserOnSignUp = async (
    uid: string,
    email: string,
    name: string,
    provider: string
) => {
    return await setDoc(doc(db, COLLECTION, uid), {
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

// export const getUsers = async () => {
//     const querySnapshot = await getDocs(collection(db, COLLECTION));
//     querySnapshot.forEach((doc) => {
//         console.log({ ...doc.data(), docId: doc.id });
//     });
// };

// export const getUser = async (userId: string | undefined) => {
//     const { docRef, docSnap, error } = await commonGetDoc(userId);
//     if (error) return { error };

//     if (docRef) updateDoc(docRef, { lastLogin: new Date() });
//     return docSnap?.data();
// };

/**
 * stock functions
 */

export const getUserStocks = async (userId: string | undefined) => {
    const { docSnap, error } = await commonGetDoc(userId);
    if (error) return { error };
    return docSnap
        ?.data()
        .stocks.sort((a: TStock, b: TStock) =>
            a.ticker.localeCompare(b.ticker)
        );
};

export const getUserStock = async (
    ticker: string,
    userId: string | undefined
) => {
    const { docSnap, error } = await commonGetDoc(userId);
    if (error) return { error };

    const savedStock = docSnap
        ?.data()
        .stocks.find((_stock: TStock) => _stock.ticker == ticker);
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
            .stocks.find((_stock: TStock) => _stock.ticker == stock.ticker);
        if (stockExists) return { error: "Stock already in portfolio" };
        else if (docRef)
            return updateDoc(docRef, {
                stocks: arrayUnion({
                    ...stock,
                    createdDate: Date.now(),
                    updatedDate: Date.now(),
                }),
            });
        return { error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const updateStock = async (
    newStock: Partial<TStock>,
    ticker: string,
    userId: string | undefined
) => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { error };
        const defaultStock: TStock = {
            ticker,
            holding: false,
            name: "",
            targetPrice: null,
            mostRecentPrice: null,
        };
        const existingStock: TStock | null = docSnap
            ?.data()
            ?.stocks.find((saved: TStock) => saved.ticker === ticker);
        const updatedStock: TStock = {
            ...defaultStock,
            ...existingStock,
            ...newStock,
            updatedDate: Date.now(),
            createdDate: !existingStock
                ? Date.now()
                : existingStock.createdDate,
        };
        const updatedStocksArray = [
            ...docSnap
                ?.data()
                ?.stocks.filter((saved: TStock) => saved.ticker !== ticker),
            updatedStock,
        ];

        if (docRef) return updateDoc(docRef, { stocks: updatedStocksArray });
        return { error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const addToNextToBuy = async (
    ticker: string,
    userId: string | undefined
) => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { error };

        if (docSnap?.data()?.nextToBuy?.includes(ticker))
            return { error: "Ticker already in list." };
        if (docSnap?.data()?.nextToBuy?.length >= 3)
            return { error: "Next to buy list at capacity." };

        if (docRef) return updateDoc(docRef, { nextToBuy: arrayUnion(ticker) });

        return { error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error adding to array: ", e);
    }
};

export const removeFromNextToBuy = async (
    ticker: string,
    userId: string | undefined
) => {
    try {
        const { docRef, error } = await commonGetDoc(userId);
        if (error) return { error };

        if (docRef)
            return updateDoc(docRef, { nextToBuy: arrayRemove(ticker) });

        return { error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error adding to array: ", e);
    }
};

export const removeStock = async (
    ticker: string,
    userId: string | undefined
) => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { error };

        const updatedStocksArray = [
            ...docSnap
                ?.data()
                ?.stocks.filter((saved: TStock) => saved.ticker !== ticker),
        ];
        if (docRef) return updateDoc(docRef, { stocks: updatedStocksArray });
        return { error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

/**
 * feedback/contact functions
 */

export const addFeedback = async (
    name: string = "",
    email: string,
    message: string,
    userId: string | undefined
) => {
    try {
        await addDoc(collection(db, "messages"), {
            name,
            email,
            message,
            userId: userId ? userId : null,
            createdAt: Date.now(),
        });
        return true;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};
