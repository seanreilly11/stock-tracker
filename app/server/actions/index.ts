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

    if (docSnap.exists()) {
        updateDoc(docRef, { lastLogin: new Date() });
        return docSnap.data();
    } else {
        console.log("No such document!");
    }
};

export const getUserStocks = async (id: string) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap
            .data()
            .stocks.sort((a, b) => a.ticker.localeCompare(b.ticker));
    } else {
        console.log("No such document!");
    }
};

export const addStock = async (stock: Stock, userId: string) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            updateDoc(docRef, {
                stocks: arrayUnion({ ...stock, createdDate: Date.now() }),
            });
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const updateStock = async (stock: Stock, userId: string) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        const updatedStocksArray = [
            ...docSnap
                ?.data()
                ?.stocks.filter(
                    (saved: Stock) => saved.ticker !== stock.ticker
                ),
            { ...stock, updatedDate: Date.now() },
        ];

        if (docSnap.exists()) {
            updateDoc(docRef, { stocks: updatedStocksArray });
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};
