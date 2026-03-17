import { useEffect, useState } from "react";
import { auth } from "@/server/firebase";
import { User, onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                document.cookie =
                    "loggedIn=true; path=/; SameSite=Strict; max-age=604800";
            } else {
                document.cookie =
                    "loggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const isLoggedIn = !!user;

    return { user, isLoggedIn, loading, setLoading };
};

export default useAuth;
