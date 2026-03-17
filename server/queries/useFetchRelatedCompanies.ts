import { useQuery } from "@tanstack/react-query";

const useFetchRelatedCompanies = (ticker: string) => {
    return useQuery({
        queryKey: ["relatedCompanies", ticker],
        queryFn: async () => {
            const res = await fetch(
                `/api/stocks/related/${ticker.toUpperCase()}`,
            );
            if (!res.ok) throw new Error("Failed to fetch related companies");
            return res.json();
        },
        enabled: !!ticker,
        staleTime: Infinity,
    });
};

export default useFetchRelatedCompanies;
