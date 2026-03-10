import { useQuery } from "@tanstack/react-query";
import { AINotes } from "@/utils/types";
import { standardAIPost } from "@/server/queries";

const useFetchAINotes = (ticker: string, type: string) => {
    return useQuery<AINotes[]>({
        queryKey: ["AINotes", ticker],
        queryFn: async () => {
            return await standardAIPost(
                "/notes",
                { ticker, type },
                "Failed to fetch AI notes",
            );
        },
        enabled: !!ticker && !!type,
        staleTime: Infinity,
    });
};

export default useFetchAINotes;
