import React from "react";
import AMZN_details from "@/app/assets/landing-images/amzn_details.jpg";
import NVDA_notes from "@/app/assets/landing-images/nvda_ai_notes.jpg";
import MSFT_item from "@/app/assets/landing-images/msft_list_item.jpg";
import Image from "next/image";
import PremiumBadge from "./PremiumBadge";

const Features = () => {
    //     Headline: Investing Without a Plan Leads to Costly Mistakes
    // Body:
    // Most investors get caught up in the noise of the markets. They buy too late, sell too soon, or freeze when things get volatile. Without a clear plan, emotions drive decisions — and emotions rarely lead to great outcomes.

    // CTA: Create your plan today.
    //     Headline: InvestPrep Brings Discipline to Your Portfolio
    // Body:
    // InvestPrep is designed to help you record your strategy, define your targets, and stick to your plan. No predictions. No hype. Just clarity and confidence.

    // Feature Highlights (icons + short text):

    // ✍️ Structured Notes – Document your reasons for buying and your exit strategy.

    // 🎯 Price Targets – Set buy and sell levels so you always know what’s next.

    // 📊 Portfolio Overview – Track your holdings and strategies in one place.

    // 🔔 Smart Alerts – Get notified when your targets are hit.

    // 🧠 AI Support – Summaries and insights that keep your plan sharp.
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
        {
            id: 4,
            title: "Next-to-buy stocks",
            image: MSFT_item,
            premium: false,
            content:
                "Never miss out on the stocks you plan to buy. Keep a dedicated list of your next intended purchases, so you're ready to act as soon as you get paid.",
        },
    ];

    return (
        <dl className="grid grid-cols-1 gap-x-12 gap-y-16 text-justify sm:grid-cols-3">
            {features.map((feature) => (
                <PremiumBadge key={feature.id} className="basis-full">
                    <div className="basis-full">
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
