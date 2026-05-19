import { APP_TITLE } from "@/lib/utils/constants";

const ITEMS = [
  {
    t: "A portfolio tracker.",
    b: "We don't ask how much you own, and we don't calculate your gains. This is about the next decision, not the running score.",
  },
  {
    t: "A charting tool.",
    b: "We don't draw lines on candlesticks. There are better tools for that.",
  },
  {
    t: "A trading platform.",
    b: "We don't connect to your broker. We don't execute. Your trades are yours — we just make sure you meet them prepared.",
  },
  {
    t: "A tipster.",
    b: "We don't tell you what to buy. We help you remember what you decided to buy, and why.",
  },
];

const NotListSection = () => (
  <section className="py-24 bg-[var(--paper-2)] border-t border-[var(--rule-soft)] border-b border-b-[var(--rule-soft)]">
    <div className="max-w-[1200px] mx-auto px-10">
      <div className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.10em] text-[var(--ink-3)] mb-6 flex items-center gap-3.5">
        <span className="w-8 h-px bg-[var(--ink-4)]" />
        For traders who&apos;d rather be ready than fast
      </div>

      <h2
        className="font-[family-name:var(--serif)] font-normal text-[var(--ink)] mb-3"
        style={{ fontSize: "clamp(34px, 4.4vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.02em" }}
      >
        {APP_TITLE} isn&apos;t —
      </h2>

      <div className="grid gap-x-12 gap-y-7 mt-3" style={{ gridTemplateColumns: "repeat(2, minmax(0,1fr))" }}>
        {ITEMS.map(({ t, b }) => (
          <div key={t} className="pt-[18px] border-t border-[var(--rule)]">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-[family-name:var(--serif)] text-[28px] leading-none text-[var(--accent)] flex-shrink-0" style={{ opacity: 0.7 }}>
                ×
              </span>
              <span className="font-[family-name:var(--serif)] text-[22px] leading-[1.2] tracking-[-0.01em] text-[var(--ink)] flex-1 min-w-0">
                {t}
              </span>
            </div>
            <p className="font-[family-name:var(--serif)] text-[16px] leading-[1.55] text-[var(--ink-2)] m-0 pl-7">
              {b}
            </p>
          </div>
        ))}
      </div>

      <p className="font-[family-name:var(--serif)] text-[19px] leading-[1.55] text-[var(--ink-2)] mt-14 max-w-[760px] border-t border-[var(--rule)] pt-7">
        {APP_TITLE} is one thing:{" "}
        <strong className="text-[var(--ink)] font-medium">
          the place where your plan lives between the research and the moment you need it.
        </strong>
      </p>
    </div>
  </section>
);

export default NotListSection;
