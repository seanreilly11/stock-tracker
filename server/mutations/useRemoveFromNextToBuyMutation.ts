import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromNextToBuy } from "@/server/actions/db";
import useAuth from "../../hooks/useAuth";

type Options = {
    onMutate?: () => void;
    onSuccess?: () => void;
};

const useRemoveFromNextToBuyMutation = (options?: Options) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["removeFromNextToBuy"],
        mutationFn: (ticker: string) => {
            options?.onMutate?.();
            return removeFromNextToBuy(ticker, user?.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["nextStocks", user?.uid],
            });
            options?.onSuccess?.();
        },
    });
};

export default useRemoveFromNextToBuyMutation;
