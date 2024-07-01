import React from "react";

type Props = {
    value: number;
    margin: string;
};

const Price = ({ value, margin = "l" }: Props) => {
    return (
        <p className={`text-2xl font-semibold text-indigo-600 m${margin}-2`}>
            {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(value)}
        </p>
    );
};

export default Price;
