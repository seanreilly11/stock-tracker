import { useQuery } from "@tanstack/react-query";
import { TStockPrice } from "@/utils/types";
import { standardStockFetch } from "../queries";

const useFetchStockPrices = (ticker: string) => {
    return useQuery<TStockPrice>({
        queryKey: ["search", ticker],
        queryFn: async () => {
            const urlParams = new URLSearchParams({
                adjusted: "true",
            });
            // other url
            // v2/snapshot/locale/us/markets/stocks/tickers/${ticker}
            return await standardStockFetch(
                `/v2/aggs/ticker/${ticker}/prev`,
                urlParams,
                "Failed to fetch stock prices",
            );
        },
        staleTime: 120 * 1000, // 2 minute or infinity
        // could be set to a minute ish to help with live but might just leave. COuld make a minute if local time is during the day
    });
};

export default useFetchStockPrices;
