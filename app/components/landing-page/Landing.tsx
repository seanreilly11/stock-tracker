import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import Features from "./Features";
import Stats from "./Stats";
import LoaderFullscreen from "../common/LoaderFullscreen";
import useAuth from "@/hooks/useAuth";
import Pricing from "./Pricing";
import Comparison, { ComparisonSection } from "./Comparison";
import FAQSection from "./FAQ";

const Landing = () => {
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

    return (
        <>
            {showLoader ? <LoaderFullscreen /> : null}
            <Banner />
            <div className="space-y-32">
                <Stats />
                <Features />
                <FAQSection />
                {/* <Comparison /> */}
                <ComparisonSection />
                {/* <Pricing /> */}
            </div>
        </>
    );
};

export default Landing;
