import React from 'react'

type EmptyPage = 'Home' | 'Notes' | 'NextToBuy'

interface EmptyStateProps {
  page: EmptyPage
}

const COPY: Record<EmptyPage, { title: string; body: string }> = {
  Home: {
    title: 'No stocks tracked yet.',
    body: 'Search for a stock above to add it to your watchlist.',
  },
  Notes: {
    title: 'No notes yet.',
    body: 'Write your first observation in the composer below.',
  },
  NextToBuy: {
    title: 'Nothing queued yet.',
    body: 'Search for stocks to add them to your next-to-buy list.',
  },
}

const EmptyState = ({ page }: EmptyStateProps) => {
  const { title, body } = COPY[page]
  return (
    <div className="py-12 text-center">
      <p className="font-[family-name:var(--serif)] text-lg text-[var(--ink-2)] mb-1">{title}</p>
      <p className="text-sm text-[var(--ink-3)]">{body}</p>
    </div>
  )
}

export default EmptyState
