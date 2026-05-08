'use client'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { AINotes, TStock } from '@/types'
import { useAuth } from '@/lib/hooks/useAuth'
import { addNote } from '@/lib/api/db'
import useFetchAINotes from '@/lib/queries/useFetchAINotes'

interface AINotesListProps {
  ticker: string
  name: string
  type: string
  stock: TStock
}

const AINotesList = ({ ticker, name, type, stock }: AINotesListProps) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [addedIndexes, setAddedIndexes] = useState<number[]>([])
  const { data: aiNotes, error, isLoading } = useFetchAINotes(ticker, type)

  const addNoteMutation = useMutation({
    mutationFn: (text: string) => addNote(stock.id, user!.id, text),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes', stock.id] }),
  })

  if (error) return null

  return (
    <div className="mt-4">
      <p className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--ink-3)] mb-2">
        AI suggested
      </p>
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-10 rounded-md bg-[var(--paper-2)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {aiNotes?.map((note: AINotes, i: number) =>
            addedIndexes.includes(i) ? null : (
              <div
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-md border border-[var(--rule)] bg-[var(--paper-2)] text-sm text-[var(--ink-2)]"
              >
                <span className="flex-1 font-[family-name:var(--serif)] text-sm leading-snug">
                  {note.explanation}
                </span>
                <button
                  className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md border border-[var(--rule)] hover:bg-[var(--paper-3)] text-[var(--ink-2)]"
                  onClick={() => {
                    setAddedIndexes(prev => [...prev, i])
                    addNoteMutation.mutate(note.explanation)
                  }}
                >
                  <Plus size={12} />
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default AINotesList
