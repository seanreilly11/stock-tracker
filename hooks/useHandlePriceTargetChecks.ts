import { useMutation } from "@tanstack/react-query";
import { checkPriceTargets } from "@/server/actions/stocks";

const useHandlePriceTargetChecks = () => {
    return useMutation({
        mutationFn: () => checkPriceTargets(),
        onSuccess: (data) => data,
    });
};

export default useHandlePriceTargetChecks;
