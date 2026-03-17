import { useMutation } from "@tanstack/react-query";
import { standardAPIFetch } from "../api";

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
