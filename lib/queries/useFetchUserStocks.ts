import { getUserStocks } from "@/lib/api/db"
import { useAuth } from "@/lib/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"

export function useFetchUserStocks() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ["stocks", user?.id],
    queryFn: () => getUserStocks(user!.id),
    enabled: !!user,
  })
}

export default useFetchUserStocks
