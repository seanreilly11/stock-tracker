import { useQuery } from "@tanstack/react-query";
import { standardStockFetch } from "../queries";

const useFetchRelatedCompanies = (ticker: string) => {
    return useQuery({
        queryKey: ["relatedCompanies", ticker],
        queryFn: async () => {
            const urlParams = new URLSearchParams({});

            return await standardStockFetch(
                `/v1/related-companies/${ticker.toUpperCase()}`,
                urlParams,
                "Failed to fetch related companies",
            );
        },
        enabled: !!ticker,
        staleTime: Infinity,
    });
};

export default useFetchRelatedCompanies;
