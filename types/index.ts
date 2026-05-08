export interface TStock {
  id: string
  user_id: string
  ticker: string
  name: string
  most_recent_price: number | null
  created_at: string
  updated_at: string
  // New fields (optional until DB migration)
  conviction?: 'low' | 'medium' | 'high'
  tag?: 'core' | 'starter' | 'speculative' | 'watch'
  sector?: string
}

export interface TNote {
  id: string
  stock_id: string
  user_id: string
  text: string
  created_at: string
  updated_at: string
  // New fields (optional until DB migration)
  kind?: TNoteKind
  tags?: string[]
}

export type TNoteKind = 'observation' | 'thesis' | 'plan' | 'alert' | 'earnings' | 'target'

export interface TTarget {
  id: string
  stock_id: string
  user_id: string
  kind: 'buy' | 'sell' | 'stop'
  price: number
  label?: string
  note?: string
  status: 'armed' | 'triggered'
  triggered_at?: string | null
  created_at: string
}

export interface TNewsArticle {
  id: string
  title: string
  description: string
  article_url: string
  published_utc: string
  image_url: string
  publisher: {
    name: string
  }
  insights: {
    sentiment: string
    sentiment_reasoning: string
    ticker: string
  }[]
}

export type AISuggestion = {
  name: string
  ticker: string
  reason: string
}

export type AISuggestionOption = 'popular' | 'upside'

export type AINotes = {
  explanation: string
  impact: 'increase' | 'decrease'
}

export interface TStockPrice {
  ticker: {
    ticker: string
    todaysChangePerc: number
    todaysChange: number
    updated: number
    day: {
      o: number
      h: number
      l: number
      c: number
      v: number
      vw: number
    }
    prevDay: {
      o: number
      h: number
      l: number
      c: number
      v: number
      vw: number
    }
  }
  status: string
}

export interface SearchedStockPolygon {
  active: boolean
  cik: string
  composite_figi: string
  currency_name: string
  last_updated_utc: string
  locale: string
  market: string
  name: string
  primary_exchange: string
  share_class_figi: string
  ticker: string
  type: string
}
