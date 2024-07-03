import React, { useEffect, useState } from "react";
import { auth } from "../server/firebase";
import { User, onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    // TODO: might add an isLoggedIn flag with it stoed in localstorage
    // to combat the flashes between auth loading
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, loading, setLoading };
};

export default useAuth;
