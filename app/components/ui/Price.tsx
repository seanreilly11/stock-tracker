import React from "react";

type Props = {
    value: number;
};

const Price = ({ value }: Props) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value || 0);
};

export default Price;
