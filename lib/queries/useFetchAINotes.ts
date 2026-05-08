import { useQuery } from "@tanstack/react-query";
import { AINotes } from "@/types";
import { getAINotes } from "@/lib/api/ai";

const useFetchAINotes = (ticker: string, type: string) => {
  return useQuery({
    queryKey: ["AINotes", ticker],
    queryFn: (): Promise<AINotes[]> => getAINotes(ticker, type),
    enabled: !!ticker && !!type,
    staleTime: Infinity,
  });
};

export default useFetchAINotes;
