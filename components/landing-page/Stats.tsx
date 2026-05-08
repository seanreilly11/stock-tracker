import React from "react";

const Stats = () => {
    const stats = [
        {
            id: 1,
            name: "US Market coverage",
            value: "100%",
        },
        {
            id: 2,
            name: "Usage",
            value: "Unlimited",
        },
        {
            id: 3,
            name: "Market data",
            value: "Real-time",
        },
    ];
    return (
        <dl className="grid grid-cols-1 gap-x-12 gap-y-16 text-center sm:grid-cols-3">
            {stats.map((stat) => (
                <div key={stat.id} className="mx-auto flex flex-col gap-y-4">
                    <dt className="text-base leading-7 text-gray-600">
                        {stat.name}
                    </dt>
                    <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        {stat.value}
                    </dd>
                </div>
            ))}
        </dl>
    );
};

export default Stats;
