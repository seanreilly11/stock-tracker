import React from "react";

type Props = {
    value: number;
};

const Price = ({ value }: Props) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value || 0);
    // <p className={`text-2xl font-semibold text-indigo-600 m${margin}-2`}>

    // </p>
};

export default Price;
