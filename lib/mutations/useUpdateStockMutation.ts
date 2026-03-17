import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStock } from "@/lib/db";
import { DbResult, TStock } from "@/utils/types";
import useAuth from "@/hooks/useAuth";

type Options = {
    onMutate?: () => void;
    onSuccess?: (data: DbResult) => void;
    onSettled?: () => void;
};

const useUpdateStockMutation = (ticker: string, options?: Options) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (_stock: Partial<TStock>) => {
            options?.onMutate?.();
            return updateStock(_stock, ticker, user?.uid);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
            options?.onSuccess?.(data);
        },
        onSettled: options?.onSettled,
    });
};

export default useUpdateStockMutation;
