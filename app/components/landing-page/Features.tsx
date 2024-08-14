import React from "react";
import AMZN_details from "@/app/assets/landing-images/amzn_details.jpg";
import NVDA_notes from "@/app/assets/landing-images/nvda_ai_notes.jpg";
import MSFT_item from "@/app/assets/landing-images/msft_list_item.jpg";
import Image from "next/image";
import PremiumBadge from "./PremiumBadge";

const Features = () => {
    const features = [
        {
            id: 1,
            title: "Real-time data",
            image: AMZN_details,
            premium: false,
            content:
                "Keep track of your stocks and their respective price targets right next to real-time prices of over 10,000 US equities.",
        },
        {
            id: 2,
            title: "AI-powered insights",
            image: NVDA_notes,
            premium: true,
            content:
                "Have all your personal notes about a stock in one place and get AI-generated suggestions and insights about the company or ETF to be better equipped with the knowledge to make decisions.",
        },
        // {
        //     id: 3,
        //     title: "Up-to-date news articles",
        //     image: MSFT_item,
        //     premium: false,
        //     content:
        //         "Something about the most recent news articles about a given stock that links to the original article(probs not important) and gives the respective sentiment on the article.",
        // },
        {
            id: 4,
            title: "Next-to-buy stocks",
            image: MSFT_item,
            premium: false,
            content:
                "Never miss out on the stocks you plan to buy. Keep a dedicated list of your next intended purchases, so you're ready to act as soon as you get paid.",
        },
    ];

    // Track your stocks alongside their price targets, with real-time pricing data for over 10,000 U.S. equities, all in one convenient view.
    // Keep all your personal notes on a stock in one place, and receive tailored AI-generated suggestions and insights to make more informed investment decisions.
    // Never miss out on the stocks you plan to buy. Keep a dedicated list of your intended purchases, so you're ready to act as soon as you get paid.
    // Be sure to buy the stocks you really wanted to next time you get paid with our seperate section of the stocks that you plan to buy next so you never forget your plans.
    return (
        <dl className="grid grid-cols-1 gap-x-12 gap-y-16 text-justify sm:grid-cols-3">
            {/* <dl className="flex flex-col justify-between sm:flex-row gap-x-8 gap-y-8"> */}
            {features.map((feature) => (
                <PremiumBadge
                    key={feature.id}
                    className="basis-full"
                    // premium={feature.premium}
                >
                    <div key={feature.id} className="basis-full">
                        {/* <Image src={feature.image} alt={feature.title} /> */}
                        <dt className="text-2xl font-semibold text-gray-900 mb-2">
                            {feature.title}
                        </dt>
                        <dd className="text-gray-600 leading-7">
                            {feature.content}
                        </dd>
                    </div>
                </PremiumBadge>
            ))}
        </dl>
    );
};

export default Features;
