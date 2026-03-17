import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStock } from "@/lib/db";
import { DbResult } from "@/lib/schemas/common/response.schema";
import { TStock } from "@/lib/schemas/stocks/stock.schema";
import useAuth from "@/hooks/useAuth";

type Options = {
    onMutate?: () => void;
    onSuccess?: (data: DbResult) => void;
};

const useAddStockMutation = (options?: Options) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (stock: TStock) => {
            options?.onMutate?.();
            return addStock(stock, user?.uid);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
            options?.onSuccess?.(data);
        },
    });
};

export default useAddStockMutation;
