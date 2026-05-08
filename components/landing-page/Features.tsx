import React from 'react'
import PremiumBadge from './PremiumBadge'

const FEATURES = [
  {
    id: 1,
    title: 'Real-time data',
    premium: false,
    content: 'Track your stocks alongside real-time prices for over 10,000 US equities. Set price targets and watch them tick.',
  },
  {
    id: 2,
    title: 'AI-powered insights',
    premium: true,
    content: 'Get AI-generated suggestions and insights about any company or ETF — straight into your notes, one click to save.',
  },
  {
    id: 3,
    title: 'Next-to-buy list',
    premium: false,
    content: "Never miss out on the stocks you plan to buy. Keep a ranked list of your next intended purchases, so you're ready to act when you get paid.",
  },
]

const Features = () => (
  <div className="max-w-4xl mx-auto px-4">
    <div className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)] text-center mb-8">
      What you get
    </div>
    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      {FEATURES.map(feature => (
        <PremiumBadge key={feature.id} premium={feature.premium}>
          <div className="flex flex-col gap-3">
            <dt className="font-[family-name:var(--serif)] text-xl font-medium text-[var(--ink)]">
              {feature.title}
            </dt>
            <dd className="text-sm text-[var(--ink-2)] leading-relaxed">
              {feature.content}
            </dd>
          </div>
        </PremiumBadge>
      ))}
    </dl>
  </div>
)

export default Features
