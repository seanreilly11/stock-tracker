export const formatPrice = (value: number) => {
    if (!value) return "$--";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value || 0);
};

export const getChangePerc = (change: number) => {
    if (!change) return;
    // "\u2191" : "\u2193"
    // "\u25B2" "\u25BC"
    const positive = change >= 0;
    return `${positive ? "\u25B2" : "\u25BC"}${"\u00A0"}${Math.abs(
        change
    ).toFixed(2)}%`;
};

export const getChangeColour = (change: number) => {
    if (!change) return;
    return change >= 0 ? "text-green-500" : "text-red-500";
};
