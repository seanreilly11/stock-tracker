'use client'
import { useRef, useEffect, useTransition, useState } from 'react'
import { TStock } from '@/types'
import { updateThesisAction } from '@/lib/actions/stocks'
import { EIPencil } from '@/components/ui/EmptyIcons'

interface ThesisSectionProps {
  stock: TStock | null
  ticker: string
}

const ThesisSection = ({ stock, ticker }: ThesisSectionProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [, startTransition] = useTransition()
  const [hasThesis, setHasThesis] = useState(!!stock?.thesis?.trim())

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = stock?.thesis ?? ''
    }
    setHasThesis(!!stock?.thesis?.trim())
  }, [stock?.id, stock?.thesis])

  const handleBlur = () => {
    if (!stock) return
    const text = ref.current?.textContent?.trim() ?? ''
    setHasThesis(!!text)
    startTransition(() => updateThesisAction(stock.id, text, ticker))
  }

  const handleInput = () => {
    if (!hasThesis) setHasThesis(true)
  }

  const focusEditor = () => {
    ref.current?.focus()
    const range = document.createRange()
    const sel = window.getSelection()
    if (ref.current && sel) {
      range.selectNodeContents(ref.current)
      range.collapse(false)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between border-b border-[var(--rule)] pb-2 mb-4">
        <span className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
          Thesis
        </span>
        <span className="font-[family-name:var(--mono)] text-[10px] text-[var(--ink-4)]">
          click to edit · auto-saves
        </span>
      </div>

      {!hasThesis && (
        <div
          role="button"
          tabIndex={0}
          className="border border-dashed border-[var(--rule)] rounded-[6px] px-6 py-[22px] bg-[var(--paper-2)] font-[family-name:var(--serif)] italic text-[15px] text-[var(--ink-4)] cursor-text min-h-[80px] flex items-center gap-3 hover:text-[var(--ink-3)] hover:border-[var(--ink-4)] transition-colors"
          onClick={focusEditor}
          onKeyDown={e => e.key === 'Enter' && focusEditor()}
        >
          <span className="w-[22px] h-[22px] flex-shrink-0 text-[var(--ink-4)]">
            <EIPencil />
          </span>
          <span>What has to be true? What would change your mind? Where would you size? — Click to start writing.</span>
        </div>
      )}

      {stock && (
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onInput={handleInput}
          className={`thesis-body${!hasThesis ? ' sr-only' : ''}`}
        />
      )}
    </section>
  )
}

export default ThesisSection
