import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Stock } from "@/app/lib/types";

export const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        console.log(doc.id);
        // console.log(doc.data());
    });
};

export const getUser = async (id: string) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return { error: "No user found" };

    updateDoc(docRef, { lastLogin: new Date() });
    return docSnap.data();
};

export const getUserStocks = async (id: string) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return { error: "No user found" };

    return docSnap
        .data()
        .stocks.sort((a: Stock, b: Stock) => a.ticker.localeCompare(b.ticker));
};

export const getUserStock = async (ticker: string, id: string) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return { error: "No user found" };

    const savedStock = docSnap
        .data()
        .stocks.find((_stock: Stock) => _stock.ticker == ticker);
    if (!savedStock) return { error: "Stock not in portfolio" };
    return savedStock;
};

export const addStock = async (stock: Stock, userId: string) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { error: "No user found" };

        const stockExists = docSnap
            .data()
            .stocks.find((_stock: Stock) => _stock.ticker == stock.ticker);
        if (stockExists) return { error: "Stock already in portfolio" };
        return updateDoc(docRef, {
            stocks: arrayUnion({ ...stock, createdDate: Date.now() }),
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const updateStock = async (stock: Stock, userId: string) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { error: "No user found" };

        const updatedStocksArray = [
            ...docSnap
                ?.data()
                ?.stocks.filter(
                    (saved: Stock) => saved.ticker !== stock.ticker
                ),
            { ...stock, updatedDate: Date.now() },
        ];

        return updateDoc(docRef, { stocks: updatedStocksArray });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const removeStock = async (ticker: string, userId: string) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { error: "No user found" };

        const updatedStocksArray = [
            ...docSnap
                ?.data()
                ?.stocks.filter((saved: Stock) => saved.ticker !== ticker),
        ];
        console.log(updatedStocksArray);

        return updateDoc(docRef, { stocks: updatedStocksArray });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};
