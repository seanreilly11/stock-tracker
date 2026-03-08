import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getStockNews } from "@/server/actions/stocks";
import { TNewsList } from "@/utils/types";

const useFetchStockNews = (ticker: string) => {
    return useQuery<TNewsList>({
        queryKey: ["stockNews", ticker],
        queryFn: () => getStockNews(ticker),
        staleTime: Infinity,
    });
};

export default useFetchStockNews;
