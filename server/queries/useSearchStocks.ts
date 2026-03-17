import { useQuery } from "@tanstack/react-query";

const useSearchStocks = (search: string) => {
    return useQuery({
        queryKey: ["search", search],
        queryFn: async () => {
            const params = new URLSearchParams({ search });
            const res = await fetch(
                `/api/stocks/search?${params.toString()}`,
            );
            if (!res.ok) throw new Error("Failed to search stocks");
            return res.json();
        },
        enabled: !!search,
    });
};

export default useSearchStocks;
