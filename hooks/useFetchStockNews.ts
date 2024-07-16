import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getStockNews } from "@/server/actions/stocks";

const useFetchStockNews = (ticker: string) => {
    return useQuery({
        queryKey: ["stockNews", ticker],
        queryFn: () => getStockNews(ticker),
        staleTime: Infinity,
    });
};

export default useFetchStockNews;
