export const formatPrice = (value: number) => {
    if (!value && value !== 0) return "$--";
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
        change,
    ).toFixed(2)}%`;
};

export const getChangeColour = (change: number) => {
    if (!change) return;
    return change >= 0 ? "text-green-500" : "text-red-500";
};

export const truncate = (text: string, maxLength: number): string =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export const timeSince = (inputDate: number): string => {
    const diffMs = inputDate - Date.now();
    const diffSecs = Math.round(diffMs / 1000);
    const diffMins = Math.round(diffSecs / 60);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    const diffWeeks = Math.round(diffDays / 7);
    const diffMonths = Math.round(diffDays / 30);
    const diffYears = Math.round(diffDays / 365);

    if (Math.abs(diffSecs) < 60) return rtf.format(diffSecs, "second");
    if (Math.abs(diffMins) < 60) return rtf.format(diffMins, "minute");
    if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
    if (Math.abs(diffDays) < 7) return rtf.format(diffDays, "day");
    if (Math.abs(diffWeeks) < 5) return rtf.format(diffWeeks, "week");
    if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month");
    return rtf.format(diffYears, "year");
};
