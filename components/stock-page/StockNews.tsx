'use client'
import React, { useState } from 'react'
import NewsItem from './NewsItem'
import { TNewsArticle } from '@/types'

type NewsFilter = 'all' | 'positive' | 'negative'

interface StockNewsProps {
  ticker: string
  news: { results?: TNewsArticle[] } | null
}

const StockNews = ({ ticker, news }: StockNewsProps) => {
  const [filter, setFilter] = useState<NewsFilter>('all')

  const articles = news?.results ?? []
  const filtered = filter === 'all' ? articles
    : articles.filter((a: TNewsArticle) =>
        a.insights?.some(i => i.ticker === ticker && i.sentiment === filter)
      )

  const counts = {
    all: articles.length,
    positive: articles.filter((a: TNewsArticle) => a.insights?.some(i => i.ticker === ticker && i.sentiment === 'positive')).length,
    negative: articles.filter((a: TNewsArticle) => a.insights?.some(i => i.ticker === ticker && i.sentiment === 'negative')).length,
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between border-b border-[var(--rule)] pb-2 mb-0">
        <span className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
          Recent news
        </span>
        <div className="flex gap-1">
          {(['all', 'positive', 'negative'] as NewsFilter[]).map(f => (
            <button
              key={f}
              className={`font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.04em] px-2.5 py-1 rounded-md border transition-colors ${
                filter === f
                  ? 'text-[var(--ink)] bg-[var(--paper-3)] border-[var(--rule)]'
                  : 'text-[var(--ink-3)] border-transparent hover:bg-[var(--paper-2)] hover:text-[var(--ink-2)]'
              }`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'positive' ? 'Tailwind' : 'Risk'}
              <span className="ml-1 text-[var(--ink-4)]">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        {filtered.length === 0 ? (
          <p className="py-6 text-sm text-[var(--ink-3)] text-center font-[family-name:var(--serif)] italic">No news in this filter.</p>
        ) : (
          filtered.map((article: TNewsArticle) => (
            <NewsItem key={article.id} article={article} ticker={ticker} />
          ))
        )}
      </div>
    </section>
  )
}

export default StockNews
