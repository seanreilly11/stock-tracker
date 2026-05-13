'use client'
import { useRef, useEffect, useTransition } from 'react'
import { TStock } from '@/types'
import { updateThesisAction } from '@/lib/actions/stocks'

interface ThesisSectionProps {
  stock: TStock
  ticker: string
}

const ThesisSection = ({ stock, ticker }: ThesisSectionProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = stock.thesis ?? ''
    }
  }, [stock.id, stock.thesis])

  const handleBlur = () => {
    const text = ref.current?.textContent?.trim() ?? ''
    startTransition(() => updateThesisAction(stock.id, text, ticker))
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
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        className="thesis-body"
      />
    </section>
  )
}

export default ThesisSection
