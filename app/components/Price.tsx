import React from "react";

type Props = {
    value: number;
    margin: string;
};

const Price = ({ value, margin }: Props) => {
    return (
        <p className={`text-xl font-medium m${margin}-2`}>
            {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(value)}
        </p>
    );
};

export default Price;
