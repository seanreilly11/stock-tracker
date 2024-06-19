import {
    addDoc,
    arrayUnion,
    collection,
    collectionGroup,
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
import { User } from "next-auth";

export const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        // console.log(doc.id);
        console.log({ ...doc.data(), docId: doc.id });
    });
};

export const getUser = async (id: string) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return { error: "No user found" };

    updateDoc(docRef, { lastLogin: new Date() });
    return docSnap.data();
};

export const getUserByEmail = async (user: User) => {
    const q = query(collection(db, "users"), where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    let userId;

    if (querySnapshot.size > 1)
        return { error: "No unique user with this email" };
    else if (querySnapshot.size < 1) {
        const newUser = await addDoc(collection(db, "users"), {
            name: user.name,
            email: user.email,
            lastLogin: new Date(),
            stocks: [],
        });
        userId = newUser.id;
    } else
        querySnapshot.forEach((doc) => {
            userId = doc.id;
        });
    return userId;
};

export const getUserStocks = async (id: string) => {
    if (!id) return { error: "No ID provided" };
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
