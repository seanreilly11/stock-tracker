import { useQuery } from "@tanstack/react-query";
import { TStockPrice } from "@/lib/schemas/stocks/polygon.schema";

const useFetchStockPrices = (ticker: string) => {
    return useQuery<TStockPrice>({
        queryKey: ["search", ticker],
        queryFn: async () => {
            const res = await fetch(`/api/stocks/prices/${ticker}`);
            if (!res.ok) throw new Error("Failed to fetch stock prices");
            return res.json();
        },
        staleTime: 120 * 1000, // 2 minute or infinity
        // could be set to a minute ish to help with live but might just leave. COuld make a minute if local time is during the day
    });
};

export default useFetchStockPrices;
