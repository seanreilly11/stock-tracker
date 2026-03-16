import { useQuery } from "@tanstack/react-query";
import { getUserStock } from "@/server/actions/db";
import useAuth from "../../hooks/useAuth";
import { TStock } from "@/utils/types";

const useFetchUserStock = (ticker: string) => {
    const { user } = useAuth();
    return useQuery<TStock>({
        queryKey: ["savedStocks", user?.uid, ticker],
        queryFn: async () => {
            const result = await getUserStock(ticker, user?.uid);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        enabled: !!user?.uid,
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
};

export default useFetchUserStock;
