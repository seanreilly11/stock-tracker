import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
    });
};
