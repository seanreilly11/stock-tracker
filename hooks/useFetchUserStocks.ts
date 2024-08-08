import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserStocks } from "@/server/actions/db";
import useAuth from "./useAuth";

const useFetchUserStocks = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ["savedStocks", user?.uid],
        queryFn: () => getUserStocks(user?.uid),
        enabled: !!user?.uid,
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
};

export default useFetchUserStocks;
