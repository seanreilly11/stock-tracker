import { useMutation } from "@tanstack/react-query";
import { standardAPIFetch } from "../queries";

const useHandlePriceTargetChecks = () => {
    return useMutation({
        mutationFn: async () => {
            return await standardAPIFetch(
                "/price-target",
                "GET",
                {},
                "Failed to check price targets",
            );
        },
    });
};

export default useHandlePriceTargetChecks;
