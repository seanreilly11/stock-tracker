"use client";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import LoaderFullscreen from "../common/LoaderFullscreen";

const LandingLoader = () => {
    const [showLoader, setShowLoader] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setShowLoader(false);
        } else {
            const t = setTimeout(() => setShowLoader(false), 1000);
            return () => clearTimeout(t);
        }
    }, [user]);

    return showLoader ? <LoaderFullscreen /> : null;
};

export default LandingLoader;
