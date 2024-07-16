import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAISuggestions } from "@/server/actions/ai";
import { AISuggestion, AISuggestionOption } from "@/utils/types";

const useFetchAISuggestions = (option: AISuggestionOption) => {
    return useQuery({
        queryKey: ["AISuggestions", option],
        queryFn: (): Promise<AISuggestion[]> => getAISuggestions(option),
        enabled: !!option,
        staleTime: Infinity,
    });
};

export default useFetchAISuggestions;
