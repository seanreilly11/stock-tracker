'use client'
import React, { use, useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import { AINotes, TStock } from '@/types'
import { addNoteAction } from '@/lib/actions/stocks'

interface AINotesListProps {
  ticker: string
  name: string
  type: string
  stock: TStock
  aiNotesPromise: Promise<AINotes[] | null>
}

const AINotesList = ({ ticker, stock, aiNotesPromise }: AINotesListProps) => {
  const [addedIndexes, setAddedIndexes] = useState<number[]>([])
  const [isPending, startTransition] = useTransition()

  const aiNotes = use(aiNotesPromise)

  if (!aiNotes) return null

  return (
    <div className="mt-4">
      <p className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--ink-3)] mb-2">
        AI suggested
      </p>
      <div className="flex flex-col gap-2">
        {aiNotes.map((note: AINotes, i: number) =>
          addedIndexes.includes(i) ? null : (
            <div
              key={i}
              className="flex items-start gap-2 p-2.5 rounded-md border border-[var(--rule)] bg-[var(--paper-2)] text-sm text-[var(--ink-2)]"
            >
              <span className="flex-1 font-[family-name:var(--serif)] text-sm leading-snug">
                {note.explanation}
              </span>
              <button
                type="button"
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md border border-[var(--rule)] hover:bg-[var(--paper-3)] text-[var(--ink-2)] disabled:opacity-50"
                disabled={isPending}
                onClick={() => {
                  setAddedIndexes(prev => [...prev, i])
                  startTransition(() => addNoteAction(stock.id, note.explanation, ticker))
                }}
              >
                <Plus size={12} />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default AINotesList
