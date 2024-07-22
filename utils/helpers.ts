export const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value || 0);
};

export const getPercChange = (change: number) => {
    const positive = change > 0;
    // "\u2191" : "\u2193"
    // "\u25B2" "\u25BC"
    return `${positive ? "\u25B2" : "\u25BC"} ${Math.abs(change).toFixed(2)}%`;
};
