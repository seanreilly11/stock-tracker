import { getUserStock } from "@/lib/api/db"
import { useAuth } from "@/lib/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"

export function useFetchUserStock(ticker: string) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ["stock", user?.id, ticker],
    queryFn: () => getUserStock(user!.id, ticker),
    enabled: !!user,
    staleTime: Infinity,
  })
}

export default useFetchUserStock
