import React, { useEffect, useState } from "react";
import { auth } from "../server/firebase";
import { User, onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    // const [loading, setLoading] = useState<boolean>(false);
    // TODO: add loading to auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) setUser(user);
            else setUser(null);
        });

        return () => unsubscribe();
    }, []);

    return user;
};

export default useAuth;
