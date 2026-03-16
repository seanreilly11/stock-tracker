import { useQuery } from "@tanstack/react-query";
import { TNewsList } from "@/utils/types";
import { standardStockFetch } from "../queries";
import { NEWS_FETCH_LIMIT } from "@/utils/constants";

const useFetchStockNews = (ticker: string) => {
    return useQuery<TNewsList>({
        queryKey: ["stockNews", ticker],
        queryFn: async () => {
            const urlParams = new URLSearchParams({
                ticker: ticker.toUpperCase(),
                limit: String(NEWS_FETCH_LIMIT),
            });

            return await standardStockFetch(
                `/v2/reference/news`,
                urlParams,
                "Failed to fetch stock news",
            );
        },
        enabled: !!ticker,
        staleTime: Infinity,
    });
};

export default useFetchStockNews;
