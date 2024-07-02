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
    name: string
) => {
    return await setDoc(doc(db, "users", uid), {
        name,
        email,
        lastLogin: new Date(),
        stocks: [],
    });
};

export const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        console.log({ ...doc.data(), docId: doc.id });
    });
};

export const getUser = async (userId: string | undefined) => {
    if (!userId) return { error: "No ID provided" };
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return { error: "No user found" };

    updateDoc(docRef, { lastLogin: new Date() });
    return docSnap.data();
};

// export const getUserByEmail = async (user: User) => {
//     const q = query(collection(db, "users"), where("email", "==", user.email));
//     const querySnapshot = await getDocs(q);
//     let userId;

//     if (querySnapshot.size > 1)
//         return { error: "No unique user with this email" };
//     else if (querySnapshot.size < 1) {
//         const newUser = await addDoc(collection(db, "users"), {
//             name: user.name,
//             email: user.email,
//             lastLogin: new Date(),
//             stocks: [],
//         });
//         userId = newUser.id;
//     } else
//         querySnapshot.forEach((doc) => {
//             userId = doc.id;
//         });
//     return userId;
// };

export const getUserStocks = async (userId: string | undefined) => {
    if (!userId) return { error: "No ID provided" };
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return { error: "No user found" };

    return docSnap
        .data()
        .stocks.sort((a: Stock, b: Stock) => a.ticker.localeCompare(b.ticker));
};

export const getUserStock = async (
    ticker: string,
    userId: string | undefined
) => {
    if (!userId) return { error: "No ID provided" };
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return { error: "No user found" };

    const savedStock = docSnap
        .data()
        .stocks.find((_stock: Stock) => _stock.ticker == ticker);
    if (!savedStock) return { error: "Stock not in portfolio" };
    return savedStock;
};

export const addStock = async (stock: Stock, userId: string | undefined) => {
    try {
        if (!userId) return { error: "No user ID provided" };
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

export const updateStock = async (
    newStock: Partial<Stock>,
    ticker: string,
    userId: string | undefined
) => {
    try {
        if (!userId) return { error: "No ID provided" };
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { error: "No user found" };

        const existingStock: Stock = docSnap
            ?.data()
            ?.stocks.find((saved: Stock) => saved.ticker === ticker);
        console.log(existingStock, newStock);
        const updatedStock: Stock = {
            ...existingStock,
            ...newStock,
            updatedDate: Date.now(),
        };
        const updatedStocksArray = [
            ...docSnap
                ?.data()
                ?.stocks.filter((saved: Stock) => saved.ticker !== ticker),
            updatedStock,
        ];
        console.log(updatedStocksArray);

        return updateDoc(docRef, { stocks: updatedStocksArray });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const removeStock = async (
    ticker: string,
    userId: string | undefined
) => {
    try {
        if (!userId) return { error: "No ID provided" };
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
