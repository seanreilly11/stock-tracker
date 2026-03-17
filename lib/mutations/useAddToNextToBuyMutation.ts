import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToNextToBuy } from "@/lib/db";
import { DbResult } from "@/lib/schemas/common/response.schema";
import useAuth from "@/hooks/useAuth";

type Options = {
    onMutate?: () => void;
    onSuccess?: (data: DbResult) => void;
    onSettled?: (data: DbResult | undefined) => void;
};

const useAddToNextToBuyMutation = (options?: Options) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ticker: string) => {
            options?.onMutate?.();
            return addToNextToBuy(ticker, user?.uid);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["nextStocks", user?.uid],
            });
            options?.onSuccess?.(data);
        },
        onSettled: options?.onSettled
            ? (data) => options.onSettled?.(data)
            : undefined,
    });
};

export default useAddToNextToBuyMutation;
