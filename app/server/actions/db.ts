import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Stock } from "../types";

export const createUserOnSignUp = async (
    uid: string,
    email: string,
    name: string,
    provider: string
) => {
    return await setDoc(doc(db, "users", uid), {
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

const commonGetDoc = async (userId: string | undefined) => {
    if (!userId) return { error: "No user ID provided" };
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || !docRef) return { error: "No user found" };

    return { docRef, docSnap };
};

// export const getUsers = async () => {
//     const querySnapshot = await getDocs(collection(db, "users"));
//     querySnapshot.forEach((doc) => {
//         console.log({ ...doc.data(), docId: doc.id });
//     });
// };

// export const getUser = async (userId: string | undefined) => {
//     const { docRef, docSnap, error } = await commonGetDoc(userId);
//     if (error) return { error };

//     if (docRef) updateDoc(docRef, { lastLogin: new Date(), provider: "" });
//     return docSnap?.data();
// };

export const getUserStocks = async (userId: string | undefined) => {
    const { docSnap, error } = await commonGetDoc(userId);
    if (error) return { error };
    return docSnap
        ?.data()
        .stocks.sort((a: Stock, b: Stock) => a.ticker.localeCompare(b.ticker));
};

export const getUserStock = async (
    ticker: string,
    userId: string | undefined
) => {
    const { docSnap, error } = await commonGetDoc(userId);
    if (error) return { error };

    const savedStock = docSnap
        ?.data()
        .stocks.find((_stock: Stock) => _stock.ticker == ticker);
    if (!savedStock) return { error: "Stock not in portfolio" };
    return savedStock;
};

export const addStock = async (stock: Stock, userId: string | undefined) => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { error };

        const stockExists = docSnap
            ?.data()
            .stocks.find((_stock: Stock) => _stock.ticker == stock.ticker);
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
    newStock: Partial<Stock>,
    ticker: string,
    userId: string | undefined
) => {
    try {
        const { docRef, docSnap, error } = await commonGetDoc(userId);
        if (error) return { error };

        const existingStock: Stock = docSnap
            ?.data()
            ?.stocks.find((saved: Stock) => saved.ticker === ticker);
        const updatedStock: Stock = {
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
                ?.stocks.filter((saved: Stock) => saved.ticker !== ticker),
            updatedStock,
        ];

        if (docRef) return updateDoc(docRef, { stocks: updatedStocksArray });
        return { error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error adding document: ", e);
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
                ?.stocks.filter((saved: Stock) => saved.ticker !== ticker),
        ];
        if (docRef) return updateDoc(docRef, { stocks: updatedStocksArray });
        return { error: "DocRef not referenced. Issue with userId." };
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};
