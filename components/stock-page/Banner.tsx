"use client";
import React, { use, useTransition } from "react";
import { TrendingUp, TrendingDown, Check } from "lucide-react";
import StockOptionsButton from "./StockOptionsButton";
import TargetRail from "./TargetRail";
import TargetsList from "./TargetsList";
import usePopup from "@/lib/hooks/usePopup";
import { TStock, TTarget } from "@/types";
import { acknowledgeTargetAction } from "@/lib/actions/stocks";

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60)    return `${Math.floor(diff)}s ago`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

interface BannerDetails {
  homepage_url?: string;
  name?: string;
  description?: string;
  sic_description?: string;
  branding?: { logo_url?: string; icon_url?: string };
  type?: string;
}

interface PrevResult {
  c: number;
  o: number;
}

interface BannerProps {
  name?: string;
  ticker: string;
  details?: BannerDetails;
  savedStock: TStock | null;
  nextStocks: string[];
  pricePromise: Promise<{ results?: PrevResult[] } | null>;
  targets: TTarget[];
  lastNoteDate?: string | null;
}

const TAG_CLASSES: Record<string, string> = {
  core: "border-[var(--ink)] text-[var(--ink)]",
  starter: "border-[var(--rule)] bg-[var(--paper-2)] text-[var(--ink-2)]",
  speculative:
    "border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--accent)]",
  watch: "border-[var(--rule)] text-[var(--ink-3)]",
};

const Banner = ({
  ticker,
  name,
  details,
  savedStock,
  nextStocks,
  pricePromise,
  targets,
  lastNoteDate,
}: BannerProps) => {
  const { messagePopup, contextHolder } = usePopup();
  const [, startTransition] = useTransition();
  const firstTriggered = targets.find(t => t.status === 'triggered') ?? null;

  const priceData = use(pricePromise);
  const result = priceData?.results?.[0] ?? null;
  const currentPrice = result?.c ?? undefined;
  const changePerc = result ? ((result.c - result.o) / result.o) * 100 : 0;
  const isUp = changePerc >= 0;

  const tag = savedStock?.tag;
  const conviction = savedStock?.conviction;

  return (
    <>
      {contextHolder}
      <header className="pt-5 sm:pt-9 pb-5 sm:pb-6 border-b border-[var(--rule)]">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3.5 font-[family-name:var(--mono)] text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)] mb-3">
          {tag && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 border rounded text-[10px] font-[family-name:var(--mono)] ${TAG_CLASSES[tag] ?? TAG_CLASSES.watch}`}
            >
              {tag}
            </span>
          )}
          {conviction && <span>conviction: {conviction}</span>}
          {lastNoteDate && <span>reviewed {timeAgo(lastNoteDate)}</span>}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-3.5">
            <h1 className="font-[family-name:var(--serif)] text-[26px] sm:text-4xl font-medium leading-snug sm:leading-tight tracking-tight text-[var(--ink)]">
              {name ?? ticker}
            </h1>
            <span className="font-[family-name:var(--mono)] text-[13px] sm:text-base text-[var(--ink-3)] tracking-[0.04em]">
              {ticker}
            </span>
          </div>

          <StockOptionsButton
            name={name ?? ticker}
            ticker={ticker}
            savedStock={savedStock ?? { error: "not found" }}
            nextStocks={nextStocks}
            messagePopup={messagePopup}
          />
        </div>

        {currentPrice && (
          <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-4 mt-3 sm:mt-3.5 font-[family-name:var(--mono)]">
            <span className="text-[20px] sm:text-[22px] text-[var(--ink)]">
              ${currentPrice.toFixed(2)}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-sm ${isUp ? "text-[var(--green)]" : "text-[var(--accent)]"}`}
            >
              {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {Math.abs(changePerc).toFixed(2)}%
            </span>
          </div>
        )}

        {firstTriggered && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 px-3 sm:px-3.5 py-2.5 rounded-md bg-[var(--accent-soft)] border border-[var(--accent-line)] text-sm text-[var(--ink)]">
            <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 bg-[var(--accent)] text-[var(--paper)] rounded flex-shrink-0">
              Alert
            </span>
            <span className="flex-1">
              <strong>{firstTriggered.kind.toUpperCase()} target ${firstTriggered.price.toFixed(2)}</strong>
              {' '}hit{firstTriggered.triggered_at ? ` ${timeAgo(firstTriggered.triggered_at)}` : ''} — email sent.
            </span>
            <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0 justify-end sm:ml-auto">
              <button
                className="inline-flex items-center gap-1 font-[family-name:var(--mono)] text-[11px] px-2.5 py-1 rounded border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink-2)] hover:bg-[var(--paper-2)] transition-colors"
                onClick={() => startTransition(() => acknowledgeTargetAction(firstTriggered.id, ticker))}
              >
                <Check size={11} /> Acknowledge
              </button>
              <button className="font-[family-name:var(--mono)] text-[11px] px-2.5 py-1 rounded border border-transparent text-[var(--ink-3)] hover:bg-[var(--paper-2)] transition-colors">
                Snooze 1d
              </button>
            </div>
          </div>
        )}

        {savedStock && (
          <>
            <TargetRail targets={targets} currentPrice={currentPrice} />
            <TargetsList
              stock={savedStock}
              ticker={ticker}
              targets={targets}
              currentPrice={currentPrice}
            />
          </>
        )}
      </header>
    </>
  );
};

export default Banner;
