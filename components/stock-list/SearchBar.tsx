'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { Search, Plus, Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SearchedStockPolygon, TStock } from '@/types'
import { addStock, addToNextToBuy } from '@/lib/api/db'
import { useAuth } from '@/lib/hooks/useAuth'
import useFetchUserStocks from '@/lib/queries/useFetchUserStocks'
import useSearchStocks from '@/lib/queries/useSearchStocks'

interface SearchBarProps {
  nextToBuy?: boolean
  setError?: React.Dispatch<React.SetStateAction<string | null>>
}

const SearchBar = ({ nextToBuy, setError }: SearchBarProps) => {
  const { user } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debouncedSearch = useDebounce<string>(search, 500)

  const { data: searchedStocks, isLoading } = useSearchStocks(debouncedSearch)
  const { data: savedStocks } = useFetchUserStocks()

  const addStockMutation = useMutation({
    mutationFn: ({ ticker, name }: { ticker: string; name: string }) =>
      addStock(user!.id, ticker, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stocks', user?.id] }),
  })

  const addNextToBuyMutation = useMutation({
    mutationFn: (ticker: string) => addToNextToBuy(user!.id, ticker),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nextStocks', user?.id] }),
    onError: (err: Error) => setError?.(err.message),
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const results = searchedStocks?.results ?? []
  const savedTickers = savedStocks?.map((s: TStock) => s.ticker) ?? []

  const handleSelect = (stock: SearchedStockPolygon) => {
    setSearch('')
    setOpen(false)
    router.push(`/stocks/${stock.ticker}`)
  }

  const handleAdd = (e: React.MouseEvent, stock: SearchedStockPolygon) => {
    e.stopPropagation()
    setSearch('')
    setOpen(false)
    if (nextToBuy) {
      addNextToBuyMutation.mutate(stock.ticker)
    } else {
      addStockMutation.mutate({ ticker: stock.ticker, name: stock.name })
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--rule)] bg-[var(--paper)] focus-within:border-[var(--ink-3)] transition-colors">
        {isLoading && debouncedSearch ? (
          <Loader2 size={14} className="text-[var(--ink-3)] animate-spin shrink-0" />
        ) : (
          <Search size={14} className="text-[var(--ink-3)] shrink-0" />
        )}
        <input
          className="flex-1 bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none"
          placeholder={nextToBuy ? 'Search to add to next-to-buy…' : 'Search stocks and ETFs…'}
          value={search}
          onChange={e => { setSearch(e.target.value); setOpen(true) }}
          onFocus={() => search && setOpen(true)}
        />
        {search && (
          <button
            className="text-[var(--ink-4)] hover:text-[var(--ink-2)]"
            onClick={() => { setSearch(''); setOpen(false) }}
          >
            ×
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-md border border-[var(--rule)] bg-[var(--paper)] shadow-lg overflow-hidden max-h-72 overflow-y-auto">
          {results.map((stock: SearchedStockPolygon) => {
            const alreadySaved = savedTickers.includes(stock.ticker)
            return (
              <button
                key={stock.ticker}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-[var(--paper-2)] transition-colors"
                onClick={() => handleSelect(stock)}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="font-[family-name:var(--mono)] text-sm font-medium text-[var(--ink)] shrink-0">
                    {stock.ticker}
                  </span>
                  <span className="text-sm text-[var(--ink-3)] truncate">{stock.name}</span>
                </span>
                <button
                  className="shrink-0 flex items-center justify-center w-6 h-6 rounded border border-[var(--rule)] bg-[var(--paper)] hover:bg-[var(--paper-2)] text-[var(--ink-2)]"
                  onClick={e => handleAdd(e, stock)}
                  title={nextToBuy ? 'Add to next to buy' : alreadySaved ? 'Already added' : 'Add to watchlist'}
                >
                  {alreadySaved && !nextToBuy ? <Check size={11} /> : <Plus size={11} />}
                </button>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchBar
