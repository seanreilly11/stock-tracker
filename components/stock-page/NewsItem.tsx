import React from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { TNewsArticle } from '@/types'

interface NewsItemProps {
  article: TNewsArticle
  ticker: string
}

const getSentiment = (article: TNewsArticle, ticker: string) => {
  return article.insights?.find(i => i.ticker === ticker)?.sentiment ?? null
}

const SENT_CLASSES = {
  positive: { rail: 'bg-[var(--green)]',  badge: 'bg-[var(--green-soft)] text-[var(--green)] border-[var(--green-line)]',   icon: <TrendingUp size={10} /> },
  negative: { rail: 'bg-[var(--accent)]', badge: 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-line)]', icon: <TrendingDown size={10} /> },
  neutral:  { rail: 'bg-[var(--rule)]',   badge: 'bg-[var(--paper-2)] text-[var(--ink-3)] border-[var(--rule)]',             icon: <Minus size={10} /> },
}

const NewsItem = ({ article, ticker }: NewsItemProps) => {
  const sentiment = getSentiment(article, ticker)
  const sent = sentiment ? SENT_CLASSES[sentiment as keyof typeof SENT_CLASSES] ?? SENT_CLASSES.neutral : SENT_CLASSES.neutral
  const timeAgo = (() => {
    const diff = (Date.now() - new Date(article.published_utc).getTime()) / 1000
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  })()

  return (
    <article className="grid grid-cols-[3px_1fr_24px] gap-3.5 py-3.5 border-b border-[var(--rule-soft)] items-start">
      <div className={`self-stretch rounded-sm ${sent.rail}`} />
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-[family-name:var(--mono)] text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--ink-2)]">
            {article.publisher.name}
          </span>
          <span className="w-1 h-1 rounded-full bg-[var(--ink-4)]" />
          <span className="font-[family-name:var(--mono)] text-[11px] text-[var(--ink-3)]">{timeAgo}</span>
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
          <p className="text-sm text-[var(--ink-2)] leading-relaxed line-clamp-2">{article.description}</p>
        )}
      </div>
      <div className={`w-6 h-6 rounded-full border flex items-center justify-center mt-0.5 ${sent.badge}`}
        title={sentiment ?? 'neutral'}>
        {sent.icon}
      </div>
    </article>
  )
}

export default NewsItem
