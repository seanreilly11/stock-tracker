'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import AuthWrapper from '@/components/common/AuthWrapper'
import Banner from '@/components/stock-page/Banner'
import StockNews from '@/components/stock-page/StockNews'
import StockNotes from '@/components/stock-page/StockNotes'
import TopBar from '@/components/common/TopBar'
import MenuDropdown from '@/components/ui/MenuDropdown'
import useFetchStockDetails from '@/lib/queries/useFetchStockDetails'
import useFetchUserStock from '@/lib/queries/useFetchUserStock'
import NotFound from '@/components/stock-page/NotFound'

interface PageProps {
  params: { ticker: string }
}

const StockPage = ({ params }: PageProps) => {
  const { ticker } = params
  const { data: details } = useFetchStockDetails(ticker)
  const { data: savedStock } = useFetchUserStock(ticker)

  useEffect(() => {
    document.title = `${ticker} | Bullrush`
  }, [ticker])

  return (
    <AuthWrapper>
      <div className="flex flex-col h-full bg-[var(--paper)]">
        <TopBar
          breadcrumbs={[
            <Link key="home" href="/" className="hover:text-[var(--ink)] transition-colors">← Home</Link>,
            ...(savedStock?.sector ? [<span key="sector">{savedStock.sector}</span>] : []),
            <span key="ticker">{ticker}</span>,
          ]}
          actions={<MenuDropdown />}
        />

        <main className="flex-1 overflow-y-auto">
          {details?.status === 'NOT_FOUND' ? (
            <NotFound error={details} />
          ) : (
            <div className="max-w-3xl mx-auto px-8 pb-20">
              <Banner
                ticker={ticker}
                name={details?.results?.name}
                details={details?.results}
              />
              <StockNews ticker={ticker} />
              {savedStock && (
                <StockNotes
                  ticker={ticker}
                  name={details?.results?.name ?? ''}
                  type={details?.results?.type ?? ''}
                  stock={savedStock}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </AuthWrapper>
  )
}

export default StockPage
