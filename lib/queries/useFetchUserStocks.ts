import { useQuery } from "@tanstack/react-query";
import { getUserStocks } from "@/lib/db";
import useAuth from "../../hooks/useAuth";
import { TStock } from "@/lib/schemas/stocks/stock.schema";

const useFetchUserStocks = () => {
    const { user } = useAuth();
    return useQuery<TStock[]>({
        queryKey: ["savedStocks", user?.uid],
        queryFn: async () => {
            const result = await getUserStocks(user?.uid);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        enabled: !!user?.uid,
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
};

export default useFetchUserStocks;
