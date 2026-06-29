import { APP_TITLE } from "@/lib/utils/constants";

const WHY_POINTS = [
  {
    num: "01",
    h: "You respond on time.",
    p: "The alert reaches you the moment your price is hit — not an hour later when you happen to check.",
  },
  {
    num: "02",
    h: "You respond correctly.",
    p: "Not from memory, not from vibes — from the reasoning you wrote down when you were thinking clearly.",
  },
  {
    num: "03",
    h: "You respond at all.",
    p: "No freezing, no \"I'll look at it tonight.\" The decision is already made. The alert just tells you it's time.",
  },
];

const WhySection = () => (
  <section className="py-24 bg-[var(--paper-2)] border-t border-[var(--rule-soft)] border-b border-b-[var(--rule-soft)]">
    <div className="max-w-[1200px] mx-auto px-10">
      <div className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.10em] text-[var(--ink-3)] mb-6 flex items-center gap-3.5">
        <span className="w-8 h-px bg-[var(--ink-4)]" />
        Why preparation wins
      </div>

      <h2
        className="font-[family-name:var(--serif)] font-normal text-[var(--ink)] mb-7 max-w-[920px]"
        style={{ fontSize: "clamp(34px, 4.4vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.02em" }}
      >
        Most tools treat trading like a <em className="italic text-[var(--accent)]">picking</em> problem.
        <br />
        But picking isn&apos;t usually where it goes wrong.
      </h2>

      <div className="grid gap-[60px] mt-3" style={{ gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)" }}>
        <div>
          <p className="font-[family-name:var(--serif)] text-[18.5px] leading-[1.55] text-[var(--ink-2)] mb-4">
            Find the right stock, the right entry, the right indicator — that&apos;s what every other
            tool tries to help with. <strong className="text-[var(--ink)] font-medium">Executing your
            own plan is</strong> where it actually breaks.
          </p>
          <p className="font-[family-name:var(--serif)] text-[18.5px] leading-[1.55] text-[var(--ink-2)] mb-4">
            You had a target and didn&apos;t act on it, because in the moment you second-guessed it.
            You meant to sell into strength and held too long. You bought the dip — the wrong dip —
            because the plan was in your head, not in front of you.
          </p>
          <p className="font-[family-name:var(--serif)] text-[18.5px] leading-[1.55] text-[var(--ink-2)]">
            None of that is a research failure. It&apos;s a <em>preparation</em> failure. The plan
            existed; it just wasn&apos;t ready when you needed it.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {WHY_POINTS.map((pt) => (
            <div key={pt.num} className="bg-[var(--paper)] border border-[var(--rule)] p-[22px_24px_24px] relative">
              <span className="absolute top-4 right-[18px] font-[family-name:var(--mono)] text-[10.5px] text-[var(--ink-4)] tracking-[0.06em]">
                {pt.num}
              </span>
              <h3 className="font-[family-name:var(--serif)] font-medium text-[22px] text-[var(--ink)] tracking-[-0.01em] mb-1.5 mt-0">
                {pt.h}
              </h3>
              <p className="font-[family-name:var(--serif)] text-[15px] leading-[1.55] text-[var(--ink-2)] m-0">
                {pt.p}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contrast */}
      <div className="mt-14 relative bg-[var(--paper)] border border-[var(--rule)] p-7 rounded-lg">
        <div className="grid gap-7" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Unprepared */}
          <div
            className="p-[22px] border border-[oklch(86%_0.04_35)] rounded-md flex flex-col min-h-[320px]"
            style={{ background: "oklch(96% 0.018 35)" }}
          >
            <div className="flex justify-between items-baseline mb-[18px]">
              <span className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.10em] text-[var(--ink)]">Unprepared</span>
              <span className="font-[family-name:var(--mono)] text-[10.5px] text-[var(--ink-3)]">11:47pm · scrambling</span>
            </div>
            <div className="relative flex-1 min-h-[180px]">
              {[
                { text: "CNBC · live",      top: "0%",  left: "4%",  rot: "-3deg" },
                { text: "@stockguy42",      top: "8%",  left: "38%", rot: "2deg" },
                { text: "earnings PDF",     top: "22%", left: "12%", rot: "-1deg" },
                { text: "old DM",           top: "38%", left: "46%", rot: "4deg" },
                { text: "discord",          top: "50%", left: "8%",  rot: "-2deg" },
                { text: "screener",         top: "62%", left: "40%", rot: "3deg" },
                { text: "\"what did i think?\"", top: "74%", left: "6%", rot: "-3deg", accent: true },
                { text: "price chart",      top: "86%", left: "38%", rot: "1deg" },
              ].map((tab) => (
                <span
                  key={tab.text}
                  className="absolute font-[family-name:var(--sans)] text-[11px] px-2.5 py-1 bg-[var(--paper)] border border-[var(--rule)] rounded-[2px] text-[var(--ink-2)] whitespace-nowrap"
                  style={{
                    top: tab.top,
                    left: tab.left,
                    transform: `rotate(${tab.rot})`,
                    boxShadow: "0 2px 6px oklch(20% 0.02 60 / 0.06)",
                    ...(tab.accent ? { borderColor: "var(--accent-line)", color: "var(--accent)", background: "var(--accent-soft)" } : {}),
                  }}
                >
                  {tab.text}
                </span>
              ))}
              <span
                className="absolute right-[6%] top-[32%] font-[family-name:var(--serif)] italic text-[var(--accent)] leading-none"
                style={{ fontSize: 80, opacity: 0.5 }}
              >
                ??
              </span>
            </div>
            <div className="font-[family-name:var(--mono)] text-[10.5px] text-[var(--ink-3)] tracking-[0.04em] text-center pt-4 border-t border-dashed border-[var(--rule)] mt-4">
              Acted late · acted nervous · or didn&apos;t act at all
            </div>
          </div>

          {/* Prepared */}
          <div className="p-[22px] bg-[var(--paper)] border border-[var(--rule)] rounded-md flex flex-col min-h-[320px]">
            <div className="flex justify-between items-baseline mb-[18px]">
              <span className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.10em] text-[var(--ink)]">Prepared</span>
              <span className="font-[family-name:var(--mono)] text-[10.5px] text-[var(--ink-3)]">09:14am · on plan</span>
            </div>
            <div className="flex-1">
              <div className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.10em] text-[var(--ink-4)] mb-2">
                Your thesis · written 98 days ago
              </div>
              <p className="font-[family-name:var(--serif)] italic text-[15px] leading-[1.55] text-[var(--ink-2)] border-l-2 border-[var(--ink)] pl-3 mb-[18px]">
                &quot;Buy if pullback to $108 — but only if datacenter capex guide holds. Stop $96 if guide cuts.&quot;
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { kind: "buy",  price: "$108", note: "capex guide holds" },
                  { kind: "sell", price: "$185", note: "fair value" },
                  { kind: "stop", price: "$96",  note: "thesis breaks" },
                ].map((t) => (
                  <div key={t.kind} className="grid items-center gap-2.5 px-2.5 py-2 bg-[var(--paper-2)] rounded-[3px] font-[family-name:var(--mono)] text-[12px]" style={{ gridTemplateColumns: "48px 64px 1fr" }}>
                    <span
                      className="text-[9.5px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-[2px] text-center text-[var(--paper)]"
                      style={{ background: t.kind === "buy" ? "var(--green)" : t.kind === "sell" ? "var(--ink)" : "var(--accent)" }}
                    >
                      {t.kind}
                    </span>
                    <span>{t.price}</span>
                    <span className="font-[family-name:var(--serif)] italic text-[12px] text-[var(--ink-3)]">{t.note}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="font-[family-name:var(--mono)] text-[10.5px] text-[var(--ink-3)] tracking-[0.04em] text-center pt-4 border-t border-dashed border-[var(--rule)] mt-4">
              On time · on purpose · on a decision you already made
            </div>
          </div>
        </div>
      </div>

      <p className="font-[family-name:var(--serif)] text-[17px] leading-[1.55] text-[var(--ink-2)] mt-12 max-w-[780px]">
        Preparation won&apos;t promise you profits — nobody honest can. But being{" "}
        <em>unprepared</em>{" "}will quietly cost you them.{" "}{APP_TITLE}{" "}is the difference between
        watching the move happen and being ready for it.
      </p>
    </div>
  </section>
);

export default WhySection;
