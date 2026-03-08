import React from "react";
import { useQuery } from "@tanstack/react-query";
import { searchStocks } from "@/server/actions/stocks";

const useSearchStocks = (search: string) => {
    return useQuery({
        queryKey: ["search", search],
        queryFn: () => searchStocks(search),
        enabled: !!search,
    });
};

export default useSearchStocks;
