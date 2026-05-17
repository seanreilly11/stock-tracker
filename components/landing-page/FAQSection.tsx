"use client";
import { useState } from "react";

const QS = [
  { q: "Is this financial advice?",   a: "No. InvestPrep is a notebook. We don't recommend trades. We help you record the decisions you make, and reach you when your own conditions are met." },
  { q: "Will this make me money?",    a: "We won't promise that — anyone who does is selling something. What InvestPrep does is narrower and more honest: it makes sure you respond to your stocks on time and on plan, instead of late and from memory. What that's worth is up to you and your judgment." },
  { q: "Do you connect to my broker?", a: "No. We don't move money. Alerts are notifications — what you do with them is up to you." },
  { q: "Do you track my portfolio?",  a: "No. We don't ask about shares owned, entry prices, or returns. This is deliberate. It's a research and planning tool, not a P&L dashboard." },
  { q: "Why does writing notes matter?", a: "Because in three months you won't remember why you set the target. The notebook will — and it hands the reasoning back to you exactly when you need it." },
  { q: "Who's it for?",               a: "Swing traders. Position traders. Anyone who holds opinions about stocks long enough that having the plan written down pays off." },
  { q: "Is it free?",                 a: "Yes. Pro features will come later — extra alert types, AI helpers — but the notebook itself is free, and stays that way." },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" className="py-24 bg-[var(--paper-2)] border-t border-[var(--rule-soft)] border-b border-b-[var(--rule-soft)]">
      <div className="max-w-[820px] mx-auto px-10">
        <div className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.10em] text-[var(--ink-3)] mb-6 flex items-center gap-3.5">
          <span className="w-8 h-px bg-[var(--ink-4)]" />
          Common questions
        </div>

        <h2
          className="font-[family-name:var(--serif)] font-normal text-[var(--ink)] mb-8"
          style={{ fontSize: "clamp(34px, 4.4vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.02em" }}
        >
          Asked, and honestly answered.
        </h2>

        <div className="mt-8 border-t border-[var(--rule)]">
          {QS.map((it, i) => (
            <div key={i} className="border-b border-[var(--rule)]">
              <button
                className="grid w-full text-left py-[22px] px-1 bg-transparent border-0 cursor-pointer transition-colors hover:bg-[oklch(96%_0.008_75)]"
                style={{ gridTemplateColumns: "36px 1fr 24px", gap: 16, alignItems: "center" }}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span className="font-[family-name:var(--mono)] text-[11px] text-[var(--ink-4)] tracking-[0.06em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-[family-name:var(--serif)] text-[22px] text-[var(--ink)] tracking-[-0.01em] font-normal">
                  {it.q}
                </span>
                <span
                  className="font-[family-name:var(--serif)] text-[24px] leading-none"
                  style={{ color: open === i ? "var(--accent)" : "var(--ink-3)" }}
                >
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="font-[family-name:var(--serif)] text-[17px] leading-[1.55] text-[var(--ink-2)] pb-6 pl-[52px] pr-6 max-w-[700px]">
                  {it.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
