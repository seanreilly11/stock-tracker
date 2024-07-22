export const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value || 0);
};

export const getPercChange = (close: number, open: number) => {
    const value = parseFloat(
        ((Math.abs(close - open) / open) * 100).toFixed(2)
    );
    const change = isNaN(value) ? "--" : value;
    const positive = close > open;
    // "\u2191" : "\u2193"
    // "\u25B2" "\u25BC"
    return `${positive ? "\u25B2" : "\u25BC"} ${change}%`;
};
