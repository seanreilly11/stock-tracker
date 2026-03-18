import Banner from "./Banner";
import Features from "./Features";
import Stats from "./Stats";
import Pricing from "./Pricing";
import Comparison, { ComparisonSection } from "./Comparison";
import FAQSection from "./FAQ";
import LandingLoader from "./LandingLoader";

const Landing = () => {
    return (
        <>
            <LandingLoader />
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
