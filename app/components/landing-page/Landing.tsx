import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import Features from "./Features";
import Stats from "./Stats";
import LoaderFullscreen from "../common/LoaderFullscreen";
import useAuth from "@/hooks/useAuth";

const Landing = () => {
    const [showLoader, setShowLoader] = useState(true);
    const { user } = useAuth();
    useEffect(() => {
        user && setShowLoader(false);

        setTimeout(() => setShowLoader(false), 1000);
    }, [user]);

    return (
        <>
            {showLoader ? <LoaderFullscreen /> : null}
            <Banner />
            <div className="space-y-32">
                <Stats />
                {/* <Features /> */}
            </div>
        </>
    );
};

export default Landing;
