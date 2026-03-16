import { useEffect, useState } from "react";
import { auth } from "@/server/firebase";
import { User, onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if (typeof window !== "undefined") {
                if (firebaseUser) {
                    localStorage.setItem("loggedIn", "true");
                } else {
                    localStorage.removeItem("loggedIn");
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const isLoggedIn = !!user;

    return { user, isLoggedIn, loading, setLoading };
};

export default useAuth;
