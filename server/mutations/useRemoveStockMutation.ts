import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeStock } from "@/server/actions/db";
import { DbResult } from "@/utils/types";
import useAuth from "@/hooks/useAuth";

type Options = {
    onMutate?: () => void;
    onSuccess?: (data: DbResult) => void;
};

const useRemoveStockMutation = (ticker: string, options?: Options) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => {
            options?.onMutate?.();
            return removeStock(ticker, user?.uid);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
            options?.onSuccess?.(data);
        },
    });
};

export default useRemoveStockMutation;
