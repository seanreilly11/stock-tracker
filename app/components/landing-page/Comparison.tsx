import { APP_NAME } from "@/utils/constants";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import React from "react";

const Comparison = () => {
    return (
        <div className="flex">
            <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                    Investing without a plan
                </h3>
                <ul>
                    <li>Emotional, spur-of-the-moment trades</li>
                    <li>Forgetting why you bought a stock</li>
                    <li>Selling too early or holding too long</li>
                    <li>Missing buy opportunities</li>
                    <li>Unorganized notes scattered in different places</li>
                </ul>
            </div>
            <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                    With {APP_NAME}
                </h3>
                <ul className="list-disc">
                    <li>Every stock has a clear strategy and target</li>
                    <li>Notes and thoughts in one central place</li>
                    <li>Reminders keep you disciplined</li>
                    <li>Next-to-Buy list highlights priorities</li>
                    <li>Confidence when markets move</li>
                </ul>
            </div>
        </div>
    );
};

export default Comparison;

export function ComparisonSection() {
    const features = [
        {
            text: "Pre-plan your stock decisions before emotions kick in",
            investPrep: true,
            others: false,
        },
        {
            text: "AI-powered insights tailored to your portfolio",
            investPrep: true,
            others: false,
        },
        {
            text: "Simple, intuitive notes for every stock or ETF",
            investPrep: true,
            others: false,
        },
        {
            text: "Suggested 'Next to Buy' list based on your strategy",
            investPrep: true,
            others: false,
        },
        {
            text: "Clean, distraction-free design built for clarity",
            investPrep: true,
            others: false,
        },
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-[#F9FAFB] to-[#FAFAF7]">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                    Why Choose{" "}
                    <span className="text-indigo-600">InvestPrep</span>?
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse rounded-2xl shadow-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-4 text-gray-700 font-medium">
                                    Features
                                </th>
                                <th className="p-4 text-center text-indigo-600 font-semibold">
                                    InvestPrep
                                </th>
                                <th className="p-4 text-center text-gray-600 font-semibold">
                                    Others
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr
                                    key={index}
                                    className={`border-t ${
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                    }`}
                                >
                                    <td className="p-4 text-gray-800">
                                        {feature.text}
                                    </td>
                                    <td className="p-4 text-center">
                                        {feature.investPrep ? (
                                            <CheckOutlined
                                                style={{ color: "green" }}
                                            />
                                        ) : (
                                            <CloseOutlined
                                                style={{ color: "red" }}
                                            />
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        {feature.others ? (
                                            <CheckOutlined
                                                style={{ color: "green" }}
                                            />
                                        ) : (
                                            <CloseOutlined
                                                style={{ color: "red" }}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
