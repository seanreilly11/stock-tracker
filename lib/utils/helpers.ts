export async function fetchSafe<T>(fn: () => Promise<Response | T>): Promise<T | null> {
    try {
        const result = await fn();
        if (result instanceof Response) {
            if (!result.ok) throw new Error(`${result.status} ${result.statusText}`);
            return result.json() as Promise<T>;
        }
        return result as T;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const formatPrice = (value: number) => {
    if (!value) return "$--";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value || 0);
};

export const getChangePerc = (change: number) => {
    if (!change) return;
    // "↑" : "↓"
    // "▲" "▼"
    const positive = change >= 0;
    return `${positive ? "▲" : "▼"}${" "}${Math.abs(
        change
    ).toFixed(2)}%`;
};

export const getChangeColour = (change: number) => {
    if (!change) return;
    return change >= 0 ? "text-green-500" : "text-red-500";
};
