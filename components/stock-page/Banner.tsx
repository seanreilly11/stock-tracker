"use client";
import React, { use, useState } from "react";
import Image from "next/image";
import { TrendingUp, TrendingDown } from "lucide-react";
import StockOptionsButton from "./StockOptionsButton";
import TargetRail from "./TargetRail";
import TargetsList from "./TargetsList";
import { updateStockAction } from "@/lib/actions/stocks";
import usePopup from "@/lib/hooks/usePopup";
import { TStock } from "@/types";

interface StockUpdates {
  most_recent_price?: number | null;
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
}: BannerProps) => {
  const { messagePopup, contextHolder } = usePopup();
  const [editTarget, setEditTarget] = useState(false);

  const priceData = use(pricePromise);
  const result = priceData?.results?.[0] ?? null;
  const currentPrice = result?.c ?? undefined;
  const changePerc = result ? ((result.c - result.o) / result.o) * 100 : 0;
  const isUp = changePerc >= 0;

  const handleUpdateStock = async (updates: StockUpdates) => {
    if (!savedStock?.id) return;
    setEditTarget(false);
    await updateStockAction(savedStock.id, updates, ticker);
    messagePopup("success", "Updated!");
  };

  const tag = savedStock?.tag;
  const conviction = savedStock?.conviction;

  return (
    <>
      {contextHolder}
      <header className="pt-9 pb-6 border-b border-[var(--rule)]">
        <div className="flex items-center gap-3.5 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)] mb-3">
          {tag && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 border rounded text-[10px] font-[family-name:var(--mono)] ${TAG_CLASSES[tag] ?? TAG_CLASSES.watch}`}
            >
              {tag}
            </span>
          )}
          {conviction && <span>conviction: {conviction}</span>}
          {details?.sic_description && <span>{details.sic_description}</span>}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-baseline gap-3.5">
            {/* {details?.branding?.icon_url && (
              <Image
                src={`/api/stocks/logo?url=${encodeURIComponent(details.branding.icon_url)}`}
                alt={`${name} logo`}
                width={32}
                height={32}
                className="rounded-sm"
              />
            )} */}
            <h1 className="font-[family-name:var(--serif)] text-4xl font-medium leading-tight tracking-tight text-[var(--ink)]">
              {name ?? ticker}
            </h1>
            <span className="font-[family-name:var(--mono)] text-base text-[var(--ink-3)] tracking-[0.04em]">
              {ticker}
            </span>
          </div>

          <StockOptionsButton
            name={name ?? ticker}
            ticker={ticker}
            savedStock={savedStock ?? { error: "not found" }}
            nextStocks={nextStocks}
            messagePopup={messagePopup}
            setEditTarget={setEditTarget}
          />
        </div>

        {currentPrice && (
          <div className="flex items-baseline gap-4 mt-3.5 font-[family-name:var(--mono)]">
            <span className="text-[22px] text-[var(--ink)]">
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

        {savedStock && (
          <>
            <TargetRail stock={savedStock} currentPrice={currentPrice} />
            <TargetsList
              stock={savedStock}
              currentPrice={currentPrice}
              onUpdate={handleUpdateStock}
              editTarget={editTarget}
              setEditTarget={setEditTarget}
            />
          </>
        )}
      </header>
    </>
  );
};

export default Banner;
