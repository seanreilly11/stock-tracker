import React, { useEffect, useState } from "react";
import { auth } from "@/server/firebase";
import { User, onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoggedIn, setisLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                localStorage.setItem("loggedIn", "true");
                setLoading(false);
            } else {
                setUser(null);
                localStorage.removeItem("loggedIn");
                setLoading(false);
            }
        });

        setisLoggedIn(
            !!user ||
                (typeof window !== "undefined" &&
                    localStorage?.getItem("loggedIn") === "true")
        );

        return () => unsubscribe();
    }, [user]);

    return { user, isLoggedIn, loading, setLoading };
};

export default useAuth;
