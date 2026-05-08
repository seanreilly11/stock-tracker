import React from 'react'

const STATS = [
  { value: '100%', label: 'US market coverage' },
  { value: 'Unlimited', label: 'Usage' },
  { value: 'Real-time', label: 'Market data' },
]

const Stats = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--rule)] border border-[var(--rule)] rounded-lg overflow-hidden max-w-3xl mx-auto">
    {STATS.map(({ value, label }) => (
      <div key={label} className="bg-[var(--paper)] px-8 py-8 text-center">
        <div className="font-[family-name:var(--mono)] text-4xl font-medium text-[var(--ink)] mb-2">
          {value}
        </div>
        <div className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
          {label}
        </div>
      </div>
    ))}
  </div>
)

export default Stats
