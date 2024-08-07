import React from "react";
import PricingItem from "./PricingItem";
import PremiumBadge from "./PremiumBadge";

type TPricing = {
    id: number;
    title: string;
    subtext: string;
    premiumText: string;
    price: string;
    priceFrequency: string;
    features: string[];
};

const Pricing = () => {
    const prices: TPricing[] = [
        {
            id: 1,
            title: "Basic",
            subtext: "Best option for personal use & for your next project.",
            premiumText: "",
            price: "0",
            priceFrequency: "month",
            features: ["Unlimited access"],
        },
        {
            id: 2,
            title: "Premium",
            subtext: "Best option for personal use & for your next project.",
            premiumText: "Most Popular",
            price: "4.99",
            priceFrequency: "month",
            features: ["Unlimited access"],
        },
        {
            id: 3,
            title: "Lifetime Premium",
            subtext: "Best option for personal use & for your next project.",
            premiumText: "One-Time Payment",
            price: "99",
            priceFrequency: "one time",
            features: ["Limited time only", "Unlimited access"],
        },
    ];
    return (
        <div className="space-y-8 sm:flex sm:gap-6 xl:gap-10 sm:space-y-0">
            {prices.map((price) => (
                <PremiumBadge
                    key={price.id}
                    premium={!!price.premiumText}
                    text={price.premiumText}
                >
                    <PricingItem item={price} />
                </PremiumBadge>
            ))}
        </div>
    );
};

export default Pricing;
