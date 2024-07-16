import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserStock } from "@/server/actions/db";
import useAuth from "./useAuth";

const useFetchUserStock = (ticker: string) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ["savedStocks", user?.uid],
        queryFn: () => getUserStock(ticker, user?.uid),
        enabled: !!user?.uid,
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
};

export default useFetchUserStock;
