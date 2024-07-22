import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AINotes } from "@/utils/types";
import { getAINotes } from "@/server/actions/ai";

const useFetchAINotes = (ticker: string, type: string) => {
    return useQuery({
        queryKey: ["AINotes", ticker],
        queryFn: (): Promise<AINotes[]> => getAINotes(ticker, type),
        enabled: !!ticker && !!type,
        staleTime: Infinity,
    });
};

export default useFetchAINotes;
