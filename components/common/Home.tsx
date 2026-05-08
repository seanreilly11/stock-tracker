'use client'
import React from 'react'
import TopBar from '@/components/common/TopBar'
import SearchBar from '@/components/stock-list/SearchBar'
import NextToBuy from '@/components/stock-list/NextToBuy'
import StockList from '@/components/stock-list/StockList'
import useFetchUserStocks from '@/lib/queries/useFetchUserStocks'
import MenuDropdown from '@/components/ui/MenuDropdown'

const Home = () => {
  const { data: savedStocks } = useFetchUserStocks()
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning.' : now.getHours() < 17 ? 'Good afternoon.' : 'Good evening.'

  return (
    <div className="flex flex-col h-full bg-[var(--paper)]">
      <TopBar
        breadcrumbs={[
          <span key="brand">Bullrush</span>,
          <span key="date">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>,
        ]}
        actions={<MenuDropdown />}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 pb-20">
          {/* Hero */}
          <header className="pt-8 pb-6">
            <div className="flex items-center gap-2 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)] mb-3">
              <span>Bullrush</span>
              <span className="w-1 h-1 rounded-full bg-[var(--ink-4)]" />
              <span>{now.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}</span>
            </div>
            <h1 className="font-[family-name:var(--serif)] text-4xl font-medium leading-tight tracking-tight text-[var(--ink)] mb-5">
              {greeting}
            </h1>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[var(--rule)] border border-[var(--rule)] rounded-lg overflow-hidden">
              {[
                { num: savedStocks?.length ?? 0, label: 'tracked' },
                { num: 0, label: 'alerts' },
                { num: 0, label: 'in target range' },
                { num: 0, label: 'notes total' },
              ].map(({ num, label }) => (
                <div key={label} className="bg-[var(--paper)] px-5 py-4">
                  <div className="font-[family-name:var(--mono)] text-2xl font-medium text-[var(--ink)]">{num}</div>
                  <div className="font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-[0.08em] text-[var(--ink-3)] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </header>

          {/* Search */}
          <div className="mb-2">
            <SearchBar />
          </div>

          {/* Next to buy */}
          <NextToBuy />

          {/* Watchlist section */}
          <section className="mt-10">
            <div className="flex items-end justify-between border-b border-[var(--rule)] pb-0 mb-0 gap-4">
              <div className="flex gap-4">
                <button className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.06em] pb-3 text-[var(--ink)] border-b border-[var(--ink)]">
                  All
                </button>
              </div>
            </div>
            <StockList />
          </section>
        </div>
      </main>
    </div>
  )
}

export default Home
