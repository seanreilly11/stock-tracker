import { useQuery } from "@tanstack/react-query";
import { getAISuggestions } from "@/lib/api/ai";
import { AISuggestion, AISuggestionOption } from "@/types";

const useFetchAISuggestions = (option: AISuggestionOption) => {
  return useQuery({
    queryKey: ["AISuggestions", option],
    queryFn: (): Promise<AISuggestion[]> => getAISuggestions(option),
    enabled: !!option,
    staleTime: Infinity,
  });
};

export default useFetchAISuggestions;
