import { useQuery } from "@tanstack/react-query";
import { TStockDetails } from "@/utils/types";
import { standardStockFetch } from "@/server/queries";

const useFetchStockDetails = (ticker: string) => {
    return useQuery<TStockDetails>({
        queryKey: ["stockDetails", ticker],
        queryFn: async () => {
            const urlParams = new URLSearchParams({});
            return await standardStockFetch(
                `/v3/reference/tickers/${ticker}`,
                urlParams,
                "Failed to fetch stock details",
            );
        },
        enabled: !!ticker,
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
};

export default useFetchStockDetails;
