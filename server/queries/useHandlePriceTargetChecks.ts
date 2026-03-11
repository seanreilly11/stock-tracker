import { useMutation } from "@tanstack/react-query";
import { standardAPIFetch } from "../queries";

const useHandlePriceTargetChecks = () => {
    return useMutation({
        mutationFn: async () => {
            return await standardAPIFetch(
                "/price-target",
                "GET"
                {},
                "Failed to fetch AI notes",
            );
        },
        onSuccess: (data) => data,
    });
};

export default useHandlePriceTargetChecks;
