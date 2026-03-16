import { useQuery } from "@tanstack/react-query";
import { AINotes } from "@/utils/types";
import { standardAPIFetch } from "@/server/queries";

const useFetchAINotes = (
    ticker: string,
    type: string,
    isEnabled?: boolean,
) => {
    return useQuery<AINotes[]>({
        queryKey: ["AINotes", ticker],
        queryFn: async () => {
            return await standardAPIFetch(
                "/ai/notes",
                "POST",
                { ticker, type },
                "Failed to fetch AI notes",
            );
        },
        enabled: !!ticker && !!type && isEnabled !== false,
        staleTime: Infinity,
    });
};

export default useFetchAINotes;
