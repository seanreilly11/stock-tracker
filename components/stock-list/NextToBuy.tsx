"use client";
import React, { useState, useTransition } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { NextBuyStock } from "@/lib/data";
import EditNextToBuyModal from "./EditNextToBuyModal";
import { removeFromNextToBuyAction } from "@/lib/actions/stocks";

interface NextToBuyProps {
  nextStocks: NextBuyStock[];
}

const NextToBuy = ({ nextStocks }: NextToBuyProps) => {
  const [showModal, setShowModal] = useState(false);
  const [, startTransition] = useTransition();

  const slots: (NextBuyStock | null)[] = [...nextStocks, null, null, null].slice(0, 3);

  return (
    <>
      <EditNextToBuyModal
        nextStocks={nextStocks.map(s => s.ticker)}
        showModal={showModal}
        setShowModal={setShowModal}
      />

      <section>
        <div className="flex items-baseline justify-between border-b border-[var(--rule)] pb-2 mb-1">
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
              Next to buy
            </span>
            <span className="font-[family-name:var(--serif)] italic text-sm text-[var(--ink-4)]">
              — when the paycheck lands
            </span>
          </div>
          <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--ink-4)]">
            max 3
          </span>
        </div>

        <ol className="flex flex-col border-t border-[var(--rule-soft)] list-none p-0 m-0">
          {slots.map((stock, i) => {
            if (!stock) {
              return (
                <li key={`empty-${i}`}>
                  <button
                    className="w-full grid items-center gap-3 px-1 py-2.5 border-b border-[var(--rule-soft)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)] transition-colors text-left"
                    style={{ gridTemplateColumns: "18px 1fr" }}
                    onClick={() => setShowModal(true)}
                  >
                    <span className="font-[family-name:var(--serif)] italic text-sm text-[var(--ink-4)] text-center">
                      {i + 1}
                    </span>
                    <span className="text-[12.5px] flex items-center gap-1.5">
                      + Pick a stock
                    </span>
                  </button>
                </li>
              );
            }

            const distance =
              stock.mostRecentPrice && stock.topBuyTarget
                ? ((stock.mostRecentPrice - stock.topBuyTarget) / stock.topBuyTarget) * 100
                : null;

            return (
              <li key={stock.ticker} className="group">
                <div
                  className="grid items-center gap-3 px-1 py-2.5 border-b border-[var(--rule-soft)] hover:bg-[var(--paper-2)] transition-colors"
                  style={{ gridTemplateColumns: "18px 52px 1fr auto 22px" }}
                >
                  <span className="font-[family-name:var(--serif)] italic text-sm text-[var(--ink-4)] text-center">
                    {i + 1}
                  </span>
                  <Link
                    href={`/stocks/${stock.ticker}`}
                    className="font-[family-name:var(--mono)] font-medium text-[12.5px] text-[var(--ink)] tracking-[0.02em] hover:text-[var(--ink-2)]"
                  >
                    {stock.ticker}
                  </Link>
                  {stock.topBuyTarget ? (
                    <span className="font-[family-name:var(--mono)] text-[12px] text-[var(--ink-2)]">
                      buy <strong className="text-[var(--ink)] font-medium">${stock.topBuyTarget.toFixed(2)}</strong>
                    </span>
                  ) : (
                    <span className="font-[family-name:var(--mono)] text-[12px] text-[var(--ink-3)]">
                      no buy target{stock.mostRecentPrice ? ` · $${stock.mostRecentPrice.toFixed(2)}` : ""}
                    </span>
                  )}
                  {distance !== null ? (
                    <span
                      className={`font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-[0.04em] text-right ${
                        distance <= 0 ? "text-[var(--green)]" : "text-[var(--ink-3)]"
                      }`}
                    >
                      {distance <= 0
                        ? `${Math.abs(distance).toFixed(1)}% in range`
                        : `${distance.toFixed(1)}% to go`}
                    </span>
                  ) : (
                    <span />
                  )}
                  <button
                    className="w-[20px] h-[20px] inline-flex items-center justify-center rounded text-[var(--ink-4)] hover:text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => startTransition(() => removeFromNextToBuyAction(stock.ticker))}
                    title="Remove"
                  >
                    <X size={11} />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
};

export default NextToBuy;
