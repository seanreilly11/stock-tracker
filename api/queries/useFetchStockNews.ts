import { useQuery } from "@tanstack/react-query";
import { TNewsList } from "@/utils/types";
import { standardStockFetch } from "../queries";

const useFetchStockNews = (ticker: string) => {
    return useQuery<TNewsList>({
        queryKey: ["stockNews", ticker],
        queryFn: async () => {
            const urlParams = new URLSearchParams({
                ticker: ticker.toUpperCase(),
                limit: "10",
            });

            return await standardStockFetch(
                `/v2/reference/news`,
                urlParams,
                "Failed to fetch stock news",
            );
        },
        staleTime: Infinity,
    });
};

export default useFetchStockNews;
