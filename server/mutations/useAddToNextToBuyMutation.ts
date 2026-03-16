import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToNextToBuy } from "@/server/actions/db";
import useAuth from "@/hooks/useAuth";

type Options = {
    onMutate?: () => void;
    onSuccess?: (data: void | { error: string } | undefined) => void;
    onSettled?: (data: void | { error: string } | undefined) => void;
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
