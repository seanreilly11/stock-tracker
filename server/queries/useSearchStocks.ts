import { useQuery } from "@tanstack/react-query";
import { standardStockFetch } from "../queries";

const useSearchStocks = (search: string) => {
    return useQuery({
        queryKey: ["search", search],
        queryFn: async () => {
            const urlParams = new URLSearchParams({
                search,
                market: "stocks",
                active: "true",
                sort: "ticker",
                order: "desc",
                limit: "25",
            });

            return await standardStockFetch(
                `v3/reference/tickers`,
                urlParams,
                "Failed to fetch stock prices",
            );
        },
        enabled: !!search,
    });
};

export default useSearchStocks;
