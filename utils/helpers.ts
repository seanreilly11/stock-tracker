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

export const timeSince = (inputDate: number) => {
    const date = new Date(inputDate);
    const now = new Date();

    // Zero out times for fair comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const diffTime = today.getTime() - inputDay.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return "Today";
    } else if (diffDays === 1) {
        return "Yesterday";
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? "Last week" : `${weeks} weeks ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return months === 1 ? "Last month" : `${months} months ago`;
    } else {
        const years = Math.floor(diffDays / 365);
        return years === 1 ? "Last year" : `${years} years ago`;
    }
};
