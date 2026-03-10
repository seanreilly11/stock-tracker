import { useQuery } from "@tanstack/react-query";
import { AISuggestion, AISuggestionOption } from "@/utils/types";
import { standardAIPost } from "@/api/queries";

const useFetchAISuggestions = (
    option: AISuggestionOption = "popular",
    enabled: boolean,
) => {
    return useQuery<AISuggestion[]>({
        queryKey: ["AISuggestions", option],
        queryFn: async () => {
            return await standardAIPost(
                "/suggestions",
                { option },
                "Failed to fetch AI suggestions",
            );
        },
        enabled: !!option && enabled,
        staleTime: Infinity,
    });
};

export default useFetchAISuggestions;
