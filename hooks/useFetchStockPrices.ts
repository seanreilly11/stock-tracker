import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getStockPrices } from "@/server/actions/stocks";

const useFetchStockPrices = (ticker: string) => {
    return useQuery({
        queryKey: ["search", ticker],
        queryFn: () => getStockPrices(ticker),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave. COuld make a minute if local time is during the day
    });
};

export default useFetchStockPrices;
