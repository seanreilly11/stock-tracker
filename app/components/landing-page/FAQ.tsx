import { Collapse } from "antd";
import React from "react";

function FAQSection() {
    const faqs = [
        {
            key: 1,
            label: "Is InvestPrep giving me financial advice?",
            children: (
                <p>
                    No. InvestPrep is a planning tool to help you organize your
                    own investment strategies and stay disciplined. We
                    don&apos;t tell you what to buy — we help you stick to your
                    plan.
                </p>
            ),
        },
        {
            key: 2,
            label: "Do I need to link my brokerage account?",
            children: (
                <p>
                    No. InvestPrep is independent of your broker. You enter the
                    stocks or ETFs you&apos;re following, along with your
                    targets and notes, and we help you track them.
                </p>
            ),
        },
        {
            key: 3,
            label: "Who is this app for?",
            children: (
                <p>
                    Anyone who invests — from beginners learning discipline to
                    experienced investors who want a structured way to track
                    their strategies.
                </p>
            ),
        },
        // {
        //     key: 4,
        //     label: "How much will it cost?",
        //     children: "We're still finalizing pricing, but InvestPrep will have a free tier plus affordable premium features for serious investors.",
        // },
        {
            key: 5,
            label: "Is my data safe?",
            children: (
                <p>
                    Yes. Your data is private and secure. We never sell it, and
                    you are always in control of what you add.
                </p>
            ),
        },
    ];

    return (
        <section>
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                    ❓ FAQ Section
                </h2>

                <Collapse accordion items={faqs} />
            </div>
        </section>
    );
}

export default FAQSection;
