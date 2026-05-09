'use client'
import React, { useState, FormEvent, Suspense } from 'react'
import { addNoteAction } from '@/lib/actions/stocks'
import { TStock, TNote, TNoteKind, AINotes } from '@/types'
import Button from '@/components/ui/Button'
import EditNotesButton from './EditNotesButton'
import AINotesList from './AINotesList'
import EmptyState from '@/components/common/EmptyState'
import KbdShortcut from '@/components/ui/KbdShortcut'

const NOTE_KINDS: TNoteKind[] = ['observation', 'thesis', 'plan']
const KIND_LABELS: Record<TNoteKind, string> = {
  observation: 'Observation', thesis: 'Thesis', plan: 'Plan',
  alert: 'Alert', earnings: 'Earnings', target: 'Target',
}
const KIND_COLOURS: Partial<Record<TNoteKind, string>> = {
  alert: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  target: 'bg-[var(--green-soft)] text-[var(--green)]',
  earnings: 'bg-[var(--ink)] text-[var(--paper)]',
}

interface StockNotesProps {
  ticker: string
  name: string
  type: string
  stock: TStock
  notes: TNote[]
  aiNotesPromise: Promise<AINotes[] | null>
}

const AINotesLoading = () => (
  <div className="mt-4 flex flex-col gap-2">
    {[0, 1, 2].map(i => (
      <div key={i} className="h-10 rounded-md bg-[var(--paper-2)] animate-pulse" />
    ))}
  </div>
)

const StockNotes = ({ ticker, name, type, stock, notes, aiNotesPromise }: StockNotesProps) => {
  const [noteText, setNoteText] = useState('')
  const [kind, setKind] = useState<TNoteKind>('observation')
  const [saving, setSaving] = useState(false)
  const NOTE_MAX = 500

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!noteText.trim()) return
    setSaving(true)
    try {
      await addNoteAction(stock.id, noteText.trim(), ticker)
      setNoteText('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between border-b border-[var(--rule)] pb-2 mb-5">
        <span className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
          Notes &amp; observations
        </span>
        <span className="font-[family-name:var(--mono)] text-[10px] text-[var(--ink-4)]">
          {notes.length} entries
        </span>
      </div>

      <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper)] mb-6 overflow-hidden">
        <textarea
          className="w-full px-4 py-3.5 font-[family-name:var(--serif)] text-base leading-relaxed bg-transparent text-[var(--ink)] placeholder:text-[var(--ink-4)] placeholder:italic outline-none resize-none min-h-[80px]"
          placeholder="What changed? What did you read? What are you watching for?"
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); handleSubmit(e as unknown as FormEvent) }}}
          maxLength={NOTE_MAX}
        />
        <div className="flex items-center justify-between px-3 py-2 border-t border-[var(--rule)] bg-[var(--paper-2)]">
          <div className="flex gap-1">
            {NOTE_KINDS.map(k => (
              <button
                key={k}
                className={`font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-[0.06em] px-2.5 py-1 rounded border transition-colors ${
                  kind === k
                    ? 'bg-[var(--paper)] border-[var(--rule)] text-[var(--ink)]'
                    : 'bg-transparent border-transparent text-[var(--ink-3)] hover:bg-[var(--paper-3)]'
                }`}
                onClick={() => setKind(k)}
                type="button"
              >
                {KIND_LABELS[k]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--ink-4)] font-[family-name:var(--mono)]">
              {noteText.length}/{NOTE_MAX}
            </span>
            <KbdShortcut>⌘↵</KbdShortcut>
            <Button size="sm" variant="primary" onClick={handleSubmit} loading={saving}>
              Save note
            </Button>
          </div>
        </div>
      </div>

      <Suspense fallback={<AINotesLoading />}>
        <AINotesList ticker={ticker} name={name} type={type} stock={stock} aiNotesPromise={aiNotesPromise} />
      </Suspense>

      {notes.length > 0 ? (
        <div className="relative pl-7 mt-6">
          <div className="absolute left-1.5 top-3.5 bottom-3.5 w-px bg-[var(--rule)]" />
          {notes.map((note: TNote) => {
            const noteKind = (note.kind ?? 'observation') as TNoteKind
            return (
              <article key={note.id} className="relative pb-5">
                <span className={`absolute -left-[22px] top-5 w-2.5 h-2.5 rounded-full border-[1.5px] ${KIND_COLOURS[noteKind] ? 'bg-[var(--accent)] border-[var(--accent)]' : 'bg-[var(--paper)] border-[var(--ink-3)]'}`} />
                <div className="flex items-baseline gap-2.5 font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-[0.06em] text-[var(--ink-3)] mb-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${KIND_COLOURS[noteKind] ?? 'bg-[var(--paper-3)] text-[var(--ink-2)]'}`}>
                    {KIND_LABELS[noteKind]}
                  </span>
                  <span className="text-[var(--ink-4)]">
                    {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-[family-name:var(--serif)] text-base leading-relaxed text-[var(--ink)] flex-1">
                    {note.text}
                  </p>
                  <EditNotesButton note={note} stock={stock} ticker={ticker} />
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <EmptyState page="Notes" />
      )}
    </section>
  )
}

export default StockNotes
