'use client'
import React, { useState, useMemo } from 'react'
import { ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Link from 'next/link'
import { TNewsArticle, TNoteSentiment } from '@/types'
import { timeAgo } from '@/lib/utils/helpers'

type NewsFilter = 'all' | 'positive' | 'negative'

interface CollapsedNewsBarProps {
  ticker: string
  news: { results?: TNewsArticle[] } | null
}

const getSentiment = (article: TNewsArticle, ticker: string): TNoteSentiment | null =>
  article.insights?.find(i => i.ticker === ticker)?.sentiment ?? null

const SentimentPip = ({ sentiment }: { sentiment: TNoteSentiment | null }) => {
  const color =
    sentiment === 'positive' ? 'bg-[var(--green)]'
    : sentiment === 'negative' ? 'bg-[var(--accent)]'
    : 'bg-[var(--ink-4)]'
  return <span className={`inline-block w-[7px] h-[7px] rounded-full flex-shrink-0 ${color}`} />
}

const SentimentBadge = ({ sentiment }: { sentiment: TNoteSentiment | null }) => {
  const cls =
    sentiment === 'positive'
      ? 'bg-[var(--green-soft)] text-[var(--green)] border-[var(--green-line)]'
      : sentiment === 'negative'
      ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-line)]'
      : 'bg-[var(--paper-2)] text-[var(--ink-3)] border-[var(--rule)]'
  const Icon =
    sentiment === 'positive' ? TrendingUp
    : sentiment === 'negative' ? TrendingDown
    : Minus
  return (
    <span className={`w-[22px] h-[22px] rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${cls}`}>
      <Icon size={10} />
    </span>
  )
}

const CollapsedNewsBar = ({ ticker, news }: CollapsedNewsBarProps) => {
  const [expanded, setExpanded] = useState(false)
  const [filter, setFilter] = useState<NewsFilter>('all')

  const articles = useMemo(() => news?.results ?? [], [news])

  const counts = useMemo(() => ({
    all: articles.length,
    positive: articles.filter(a => getSentiment(a, ticker) === 'positive').length,
    negative: articles.filter(a => getSentiment(a, ticker) === 'negative').length,
  }), [articles, ticker])

  const filtered = useMemo(() =>
    filter === 'all' ? articles
    : articles.filter(a => getSentiment(a, ticker) === filter),
    [articles, filter, ticker]
  )

  const topItem = articles[0] ?? null
  const topSentiment = topItem ? getSentiment(topItem, ticker) : null

  return (
    <section className="mt-7 mb-1">
      {/* Collapsed bar */}
      <button
        type="button"
        className="w-full flex items-center gap-3 px-3.5 py-2.5 bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded-md cursor-pointer text-left transition-colors hover:bg-[var(--paper-3)]"
        onClick={() => setExpanded(v => !v)}
      >
        {/* Left: label + count + sentiment tags */}
        <span className="flex items-center gap-2.5 flex-shrink-0">
          <span className="font-[family-name:var(--mono)] text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-2)]">
            Recent news
          </span>
          <span className="font-[family-name:var(--mono)] text-[11px] px-1.5 py-0.5 rounded-full bg-[var(--paper-3)] text-[var(--ink-3)] border border-[var(--rule-soft)]">
            {counts.all}
          </span>
          {counts.negative > 0 && (
            <span className="hidden sm:inline text-[10.5px] px-1.5 py-0.5 rounded font-medium tracking-[0.03em] bg-[var(--accent-soft)] text-[var(--accent)]">
              {counts.negative} risk
            </span>
          )}
          {counts.positive > 0 && (
            <span className="hidden sm:inline text-[10.5px] px-1.5 py-0.5 rounded font-medium tracking-[0.03em] bg-[oklch(94%_0.04_145)] text-[var(--green)]">
              {counts.positive} tailwind
            </span>
          )}
        </span>

        {/* Center: headline peek */}
        {topItem && !expanded && (
          <span className="flex-1 min-w-0 flex items-center gap-2 text-[var(--ink-3)]">
            <SentimentPip sentiment={topSentiment} />
            <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-[var(--ink-2)]">
              {topItem.title}
            </span>
            <span className="text-[11px] text-[var(--ink-3)] flex-shrink-0" suppressHydrationWarning>
              {timeAgo(topItem.published_utc)}
            </span>
          </span>
        )}

        {/* Chevron */}
        <ChevronRight
          size={13}
          className={`flex-shrink-0 text-[var(--ink-3)] transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="pt-3.5 pb-2.5 border-b border-[var(--rule-soft)]">
          {/* Filter tabs */}
          <div className="flex gap-1 mb-2">
            {(['all', 'positive', 'negative'] as NewsFilter[]).map(f => (
              <button
                type="button"
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

          {/* News list */}
          <div>
            {filtered.length === 0 ? (
              <p className="py-6 text-sm text-[var(--ink-3)] text-center font-[family-name:var(--serif)] italic">
                No news in this filter.
              </p>
            ) : (
              filtered.map(article => {
                const sentiment = getSentiment(article, ticker)
                return (
                  <article
                    key={article.id}
                    className={`grid gap-3.5 py-3.5 border-b border-[var(--rule-soft)] items-start`}
                    style={{ gridTemplateColumns: '3px 1fr 24px' }}
                  >
                    <div className={`self-stretch rounded-sm ${
                      sentiment === 'positive' ? 'bg-[var(--green)]'
                      : sentiment === 'negative' ? 'bg-[var(--accent)]'
                      : 'bg-[var(--rule)]'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-[family-name:var(--mono)] text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--ink-2)]">
                          {article.publisher.name}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[var(--ink-4)]" />
                        <span className="font-[family-name:var(--mono)] text-[11px] text-[var(--ink-3)]" suppressHydrationWarning>
                          {timeAgo(article.published_utc)}
                        </span>
                      </div>
                      <Link
                        href={article.article_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-[family-name:var(--serif)] text-[17px] leading-snug text-[var(--ink)] font-medium hover:text-[var(--ink-2)] transition-colors block mb-1"
                      >
                        {article.title}
                      </Link>
                      {article.description && (
                        <p className="text-sm text-[var(--ink-2)] leading-relaxed line-clamp-2">
                          {article.description}
                        </p>
                      )}
                    </div>
                    <SentimentBadge sentiment={sentiment} />
                  </article>
                )
              })
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default CollapsedNewsBar
