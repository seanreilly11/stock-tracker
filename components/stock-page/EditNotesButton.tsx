'use client'
import React, { useState, useTransition } from 'react'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { TNote, TStock } from '@/types'
import { deleteNoteAction } from '@/lib/actions/stocks'

interface EditNotesButtonProps {
  note: TNote
  stock: TStock
  ticker: string
}

const EditNotesButton = ({ note, stock, ticker }: EditNotesButtonProps) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--ink-4)] hover:bg-[var(--paper-2)] hover:text-[var(--ink-2)] transition-colors"
        onClick={() => setOpen(prev => !prev)}
        aria-label="Note options"
      >
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <>
          <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border border-[var(--rule)] bg-[var(--paper)] shadow-lg overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors disabled:opacity-50"
              disabled={isPending}
              onClick={() => {
                setOpen(false)
                startTransition(() => deleteNoteAction(note.id, ticker))
              }}
            >
              <Trash2 size={13} /> Delete note
            </button>
          </div>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
        </>
      )}
    </div>
  )
}

export default EditNotesButton
