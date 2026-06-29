"use client";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { APP_TITLE } from "@/lib/utils/constants";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => (
  <section
    className="pt-[88px] pb-[80px] relative"
    style={{
      background:
        "radial-gradient(60% 80% at 80% 0%, color-mix(in oklch, var(--accent-soft) 50%, transparent) 0%, transparent 70%), var(--paper)",
    }}
  >
    <div className="max-w-[1200px] mx-auto px-10">
      <div
        className="inline-flex items-center gap-2 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.10em] text-[var(--ink-3)] px-3 py-1.5 border border-[var(--rule)] rounded-full bg-[var(--paper)] mb-8"
      >
        <span
          className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0"
          style={{ boxShadow: "0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent)" }}
        />
        A research notebook · not a tipster
      </div>

      <h1
        className="font-[family-name:var(--serif)] font-normal text-[var(--ink)] mb-7 max-w-[14ch]"
        style={{
          fontSize: "clamp(54px, 8vw, 108px)",
          lineHeight: 0.96,
          letterSpacing: "-0.028em",
        }}
      >
        Be ready before
        <br />
        the market moves.
      </h1>

      <h2
        className="font-[family-name:var(--sans)] text-[var(--ink-3)] mb-6"
        style={{ fontSize: 16, fontWeight: 400 }}
      >
        The stock tracker built for investors who think before they trade.
      </h2>

      <p
        className="font-[family-name:var(--serif)] text-[var(--ink-2)] mb-10 max-w-[640px]"
        style={{ fontSize: 20, lineHeight: 1.55 }}
      >
        {APP_TITLE}{" "}is a research notebook for traders who&apos;d rather be prepared than fast.
        Write your thesis. Set your buy, sell, and stop targets. When the price moves or the news
        breaks, you already know what to do — because you decided when you were calm.
      </p>

      <div className="flex items-center gap-[18px] flex-wrap">
        <Button variant="primary" size="md" onClick={onGetStarted}>
          Get started — free <ArrowRight size={14} />
        </Button>
        <span className="font-[family-name:var(--mono)] text-[11.5px] text-[var(--ink-3)] tracking-[0.02em]">
          No card. No plans to choose. Just a notebook.
        </span>
      </div>

      <HeroVisual />
    </div>
  </section>
);

function HeroVisual() {
  const watchlist = [
    { t: "NVDA", n: "NVIDIA Corp.", c: "+1.84%", up: true, sel: false, alert: false },
    { t: "NET",  n: "Cloudflare Inc.", c: "+0.04%", up: true, sel: false, alert: false },
    { t: "TSLA", n: "Tesla Inc.", c: "−2.61%", up: false, sel: true, alert: true },
    { t: "COST", n: "Costco Wholesale", c: "+0.62%", up: true, sel: false, alert: false },
    { t: "CMG",  n: "Chipotle", c: "+0.12%", up: true, sel: false, alert: false },
    { t: "META", n: "Meta Platforms", c: "+1.21%", up: true, sel: false, alert: false },
  ];

  return (
    <div className="mt-16 relative rounded-xl bg-[var(--paper)]" aria-hidden="true">
      <div className="border border-[var(--rule)] rounded-lg bg-[var(--paper)] overflow-hidden" style={{ boxShadow: "0 1px 0 var(--rule-soft), 0 24px 60px -30px oklch(20% 0.02 60 / 0.25), 0 60px 120px -40px oklch(20% 0.02 60 / 0.15)" }}>
        {/* Chrome bar */}
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-[var(--rule)] bg-[var(--paper-2)]">
          <span className="w-[9px] h-[9px] rounded-full bg-[var(--rule)]" />
          <span className="w-[9px] h-[9px] rounded-full bg-[var(--rule)]" />
          <span className="w-[9px] h-[9px] rounded-full bg-[var(--rule)]" />
          <span className="mx-auto font-[family-name:var(--mono)] text-[10.5px] text-[var(--ink-3)] tracking-[0.04em]">
            {`${APP_TITLE.toLowerCase()} / dashboard`}
          </span>
        </div>

        {/* Body */}
        <div className="grid min-h-[460px]" style={{ gridTemplateColumns: "240px minmax(0,1fr)" }}>
          {/* Sidebar */}
          <div className="border-r border-[var(--rule)] py-3.5 bg-[var(--paper-2)]">
            <div className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.10em] text-[var(--ink-4)] px-4 pb-2.5">
              Watchlist
            </div>
            {watchlist.map((r) => (
              <div
                key={r.t}
                className="grid items-center px-4 py-2.5 gap-2 border-b border-[var(--rule-soft)] font-[family-name:var(--mono)] text-[11.5px] relative"
                style={{
                  gridTemplateColumns: "50px 1fr auto",
                  background: r.alert ? "var(--accent-soft)" : r.sel ? "var(--paper)" : undefined,
                }}
              >
                {r.alert && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)]" />
                )}
                <span className="text-[var(--ink)] tracking-[0.04em]">{r.t}</span>
                <span className="font-[family-name:var(--sans)] text-[11px] text-[var(--ink-3)] overflow-hidden text-ellipsis whitespace-nowrap">{r.n}</span>
                <span className={`text-[10.5px] ${r.up ? "text-[var(--green)]" : "text-[var(--accent)]"}`}>{r.c}</span>
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="p-[22px_26px]">
            <div className="flex items-center gap-2 font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-[0.08em] text-[var(--ink-3)] mb-3">
              <span>Auto/EV</span>
              <span className="w-[3px] h-[3px] rounded-full bg-[var(--ink-4)]" />
              <span>TSLA</span>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
              <h3 className="font-[family-name:var(--serif)] font-medium text-[26px] leading-[1.1] tracking-[-0.02em] m-0 text-[var(--ink)]">Tesla Inc.</h3>
              <span className="font-[family-name:var(--mono)] text-[12px] text-[var(--ink-3)] tracking-[0.04em]">TSLA</span>
            </div>
            <div className="flex gap-3 items-baseline mb-4 font-[family-name:var(--mono)]">
              <span className="text-[18px] text-[var(--ink)]">$188.40</span>
              <span className="text-[10.5px] text-[var(--accent)]">▼ 2.61%</span>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2.5 mb-5 text-[12.5px] text-[var(--ink-2)] rounded bg-[var(--accent-soft)] border border-[var(--accent-line)]">
              <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.10em] text-[var(--accent)] font-medium">Alert</span>
              <span><strong>BUY target $190</strong> within reach — your March thesis is ready for you.</span>
            </div>

            {/* Target rail */}
            <div className="relative h-[70px] mx-[18px] mb-7 pt-3">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-[var(--rule)]" />
              {[
                { kind: "stop", left: "6%",  label: "Stop $160" },
                { kind: "buy",  left: "22%", label: "Buy $190" },
                { kind: "now",  left: "28%", label: "$188.40" },
                { kind: "sell", left: "64%", label: "Sell $245" },
              ].map((pip) => (
                <div
                  key={pip.kind}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    left: pip.left,
                    width: pip.kind === "now" ? 13 : 11,
                    height: pip.kind === "now" ? 13 : 11,
                    background: pip.kind === "now" ? "var(--ink)" : "var(--paper)",
                    border: `2px solid ${
                      pip.kind === "now" ? "var(--ink)" :
                      pip.kind === "buy" ? "var(--green)" :
                      pip.kind === "stop" ? "var(--accent)" : "var(--ink-2)"
                    }`,
                  }}
                >
                  <span
                    className="absolute left-1/2 -translate-x-1/2 font-[family-name:var(--mono)] text-[9.5px] uppercase tracking-[0.06em] whitespace-nowrap"
                    style={{
                      top: pip.kind === "now" ? -22 : 18,
                      color: pip.kind === "now" ? "var(--ink)" : "var(--ink-3)",
                      fontWeight: pip.kind === "now" ? 500 : undefined,
                    }}
                  >
                    {pip.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Thesis */}
            <div className="pt-4 border-t border-[var(--rule)]">
              <div className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.10em] text-[var(--ink-4)] mb-2">
                Thesis · written March 14
              </div>
              <p className="font-[family-name:var(--serif)] text-[14px] leading-[1.5] text-[var(--ink-2)] m-0">
                AV optionality is the only thing here. If FSD ships v13 with credible
                miles-between-disengagement data, the auto narrative reopens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
