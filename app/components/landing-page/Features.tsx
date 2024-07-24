import React from "react";
import AMZN_details from "@/app/assets/landing-images/amzn_details.jpg";
import NVDA_notes from "@/app/assets/landing-images/nvda_ai_notes.jpg";
import MSFT_item from "@/app/assets/landing-images/msft_list_item.jpg";
import Image from "next/image";

const Features = () => {
    const features = [
        {
            id: 1,
            title: "Real-time data",
            image: AMZN_details,
            content:
                "Keep track of your stocks and their respective price targets right next to real-time prices of over 10,000 US equities.",
        },
        {
            id: 2,
            title: "AI-suggested notes",
            image: NVDA_notes,
            content:
                "Have all your personal notes about a stock in one place and get even more suggestions about the company or ETF from AI to be better equipped with the knowledge to make decisions.",
        },
        {
            id: 3,
            title: "Up-to-date news articles",
            image: MSFT_item,
            content:
                "Something about the most recent news articles about a given stock that links to the original article(probs not important) and gives the respective sentiment on the article.",
        },
    ];
    return (
        <dl className="flex flex-col justify-between sm:flex-row gap-x-12 gap-y-8">
            {features.map((feature) => (
                <div key={feature.id} className="flex-1">
                    <Image src={feature.image} alt={feature.title} />
                    <dt className="text-2xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                    </dt>
                    <dd className="text-gray-600 leading-7">
                        {feature.content}
                    </dd>
                </div>
            ))}
        </dl>
    );
};

export default Features;
