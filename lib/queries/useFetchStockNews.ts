import { useQuery } from "@tanstack/react-query";
import { TNewsList } from "@/lib/schemas/news/news.schema";
import { NEWS_FETCH_LIMIT } from "@/utils/constants";

const useFetchStockNews = (ticker: string) => {
    return useQuery<TNewsList>({
        queryKey: ["stockNews", ticker],
        queryFn: async () => {
            const params = new URLSearchParams({
                ticker: ticker.toUpperCase(),
                limit: String(NEWS_FETCH_LIMIT),
            });
            const res = await fetch(`/api/stocks/news?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch stock news");
            return res.json();
        },
        enabled: !!ticker,
        staleTime: Infinity,
    });
};

export default useFetchStockNews;
