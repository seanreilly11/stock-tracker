"use client";
import React, { useState, useTransition } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { NextBuyStock } from "@/lib/data";
import EditNextToBuyModal from "./EditNextToBuyModal";
import { removeFromNextToBuyAction } from "@/lib/actions/stocks";

interface NextToBuyProps {
  nextStocks: NextBuyStock[];
  compact?: boolean;
}

const NextToBuy = ({ nextStocks, compact = true }: NextToBuyProps) => {
  const [showModal, setShowModal] = useState(false);
  const [, startTransition] = useTransition();

  const slots: (NextBuyStock | null)[] = [
    ...nextStocks,
    null,
    null,
    null,
  ].slice(0, 3);

  return (
    <>
      <EditNextToBuyModal
        nextStocks={nextStocks.map((s) => s.ticker)}
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
              - when the paycheck lands
            </span>
          </div>
          <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--ink-4)]">
            max 3
          </span>
        </div>

        {/* Compact (vertical list) - used when alerts strip is visible */}
        {compact && (
          <ol className="flex flex-col border-t border-[var(--rule-soft)] list-none p-0 m-0">
            {slots.map((stock, i) => {
              if (!stock) {
                return (
                  <li key={`empty-${i}`}>
                    <button
                      type="button"
                      className="w-full grid items-center gap-2 sm:gap-3 px-1 py-2.5 border-b border-[var(--rule-soft)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)] transition-colors text-left grid-cols-[16px_1fr] sm:grid-cols-[18px_1fr]"
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
                  ? ((stock.mostRecentPrice - stock.topBuyTarget) /
                      stock.topBuyTarget) *
                    100
                  : null;
              return (
                <li key={stock.ticker} className="group">
                  <div className="grid items-center gap-2 sm:gap-3 px-1 py-2.5 border-b border-[var(--rule-soft)] hover:bg-[var(--paper-2)] transition-colors grid-cols-[16px_48px_1fr_auto] sm:grid-cols-[18px_52px_1fr_auto_22px]">
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
                        buy{" "}
                        <strong className="text-[var(--ink)] font-medium">
                          ${stock.topBuyTarget.toFixed(2)}
                        </strong>
                      </span>
                    ) : (
                      <span className="font-[family-name:var(--mono)] text-[12px] text-[var(--ink-3)]">
                        no buy target
                        {stock.mostRecentPrice
                          ? ` · $${stock.mostRecentPrice.toFixed(2)}`
                          : ""}
                      </span>
                    )}
                    {distance !== null ? (
                      <span
                        className={`font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-[0.04em] text-right ${distance <= 0 ? "text-[var(--green)]" : "text-[var(--ink-3)]"}`}
                      >
                        {distance <= 0
                          ? `${Math.abs(distance).toFixed(1)}% in range`
                          : `${distance.toFixed(1)}% to go`}
                      </span>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      className="hidden sm:inline-flex w-[20px] h-[20px] items-center justify-center rounded text-[var(--ink-4)] hover:text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        startTransition(() =>
                          removeFromNextToBuyAction(stock.ticker),
                        )
                      }
                      title="Remove"
                    >
                      <X size={11} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {/* Row layout - used when no alerts, desktop only */}
        {!compact && (
          <ol className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 list-none p-0 m-0">
            {slots.map((stock, i) => {
              if (!stock) {
                return (
                  <li key={`empty-${i}`} className="flex-1">
                    <button
                      type="button"
                      className="w-full h-full flex items-center gap-3 p-4 rounded-lg border border-dashed border-[var(--rule)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors text-left"
                      onClick={() => setShowModal(true)}
                    >
                      <span className="font-[family-name:var(--serif)] italic text-2xl text-[var(--ink-4)] leading-none">
                        {i + 1}
                      </span>
                      <span className="text-sm">+ Pick a stock</span>
                    </button>
                  </li>
                );
              }
              const distance =
                stock.mostRecentPrice && stock.topBuyTarget
                  ? ((stock.mostRecentPrice - stock.topBuyTarget) /
                      stock.topBuyTarget) *
                    100
                  : null;
              return (
                <li key={stock.ticker} className="flex-1 group">
                  <Link
                    href={`/stocks/${stock.ticker}`}
                    className="flex items-start gap-3 p-4 rounded-lg border border-[var(--rule)] bg-[var(--paper)] hover:-translate-y-px hover:border-[var(--ink-4)] hover:shadow-[0_8px_20px_-12px_oklch(20%_0.01_60_/_0.18)] transition-all"
                  >
                    <span className="font-[family-name:var(--serif)] italic text-2xl text-[var(--ink-4)] leading-none pt-0.5">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="block font-[family-name:var(--mono)] text-sm font-medium text-[var(--ink)]">
                        {stock.ticker}
                      </span>
                      {stock.topBuyTarget ? (
                        <span className="block font-[family-name:var(--mono)] text-[11px] text-[var(--ink-2)] mt-0.5">
                          buy{" "}
                          <strong className="font-medium">
                            ${stock.topBuyTarget.toFixed(2)}
                          </strong>
                        </span>
                      ) : (
                        <span className="block font-[family-name:var(--mono)] text-[11px] text-[var(--ink-3)] mt-0.5">
                          no buy target
                        </span>
                      )}
                      {distance !== null && (
                        <span
                          className={`block font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider mt-1 ${distance <= 0 ? "text-[var(--green)]" : "text-[var(--ink-4)]"}`}
                        >
                          {distance <= 0
                            ? `${Math.abs(distance).toFixed(1)}% in range`
                            : `${distance.toFixed(1)}% to go`}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="hidden sm:inline-flex w-5 h-5 items-center justify-center rounded text-[var(--ink-4)] hover:text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={(e) => {
                        e.preventDefault();
                        startTransition(() =>
                          removeFromNextToBuyAction(stock.ticker),
                        );
                      }}
                      title="Remove"
                    >
                      <X size={11} />
                    </button>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}

        {nextStocks.length === 0 && (
          <p className="mt-2.5 px-3 py-2.5 bg-[var(--paper-2)] border border-dashed border-[var(--rule)] rounded text-center font-[family-name:var(--serif)] italic text-[13.5px] text-[var(--ink-3)]">
            Three slots. The first one is yours.
          </p>
        )}
      </section>
    </>
  );
};

export default NextToBuy;
