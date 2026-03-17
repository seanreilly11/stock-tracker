import { useQuery } from "@tanstack/react-query";
import { TStockDetails } from "@/utils/types";

const useFetchStockDetails = (ticker: string) => {
    return useQuery<TStockDetails>({
        queryKey: ["stockDetails", ticker],
        queryFn: async () => {
            const res = await fetch(`/api/stocks/details/${ticker}`);
            if (!res.ok) throw new Error("Failed to fetch stock details");
            return res.json();
        },
        enabled: !!ticker,
        staleTime: Infinity,
    });
};

export default useFetchStockDetails;
