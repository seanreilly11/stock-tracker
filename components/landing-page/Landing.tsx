import React, { useEffect, useState } from "react";
import Banner from "@/components/landing-page/Banner";
import Features from "@/components/landing-page/Features";
import Stats from "@/components/landing-page/Stats";
import LoaderFullscreen from "@/components/common/LoaderFullscreen";
import { useAuth } from "@/lib/hooks/useAuth";
import Pricing from "@/components/landing-page/Pricing";

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
                <Features />
                {/* <Pricing /> */}
            </div>
        </>
    );
};

export default Landing;
