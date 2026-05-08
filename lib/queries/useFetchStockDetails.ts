import { useQuery } from "@tanstack/react-query";
import { getStockDetails } from "@/lib/api/stocks";

const useFetchStockDetails = (ticker: string) => {
  return useQuery({
    queryKey: ["stockDetails", ticker],
    queryFn: () => getStockDetails(ticker),
    staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
  });
};

export default useFetchStockDetails;
