import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getStockDetails } from "@/server/actions/stocks";
import { TStockDetails } from "@/utils/types";

const useFetchStockDetails = (ticker: string) => {
    return useQuery<TStockDetails>({
        queryKey: ["stockDetails", ticker],
        queryFn: () => getStockDetails(ticker),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
};

export default useFetchStockDetails;
