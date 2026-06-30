import { APP_TITLE } from "@/lib/utils/constants";

const FeelSection = () => (
  <section className="py-24">
    <div className="max-w-[1200px] mx-auto px-10">
      <div className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.10em] text-[var(--ink-3)] mb-6 flex items-center gap-3.5">
        <span className="w-8 h-px bg-[var(--ink-4)]" />
        What you&apos;ll feel
      </div>

      <h2
        className="font-[family-name:var(--serif)] font-normal text-[var(--ink)] mb-8"
        style={{
          fontSize: "clamp(34px, 4.4vw, 56px)",
          lineHeight: 1.06,
          letterSpacing: "-0.02em",
        }}
      >
        Three things you&apos;ll notice
        <br />
        after a month.
      </h2>

      <div
        className="grid gap-6 mt-8"
        style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}
      >
        {/* Prepared */}
        <div className="bg-[var(--paper)] border border-[var(--rule)] p-[28px_26px_26px] flex flex-col gap-3.5">
          <div className="font-[family-name:var(--serif)] font-medium text-[30px] text-[var(--ink)] tracking-[-0.02em] mb-1">
            Prepared.
          </div>
          <p className="font-[family-name:var(--serif)] text-[15.5px] leading-[1.55] text-[var(--ink-2)] m-0 flex-1">
            A target isn&apos;t a number. It&apos;s a price you decided was
            worth acting on, plus the reasoning that got you there. When the
            price arrives, the reasoning arrives with it - so you act on
            judgment, not impulse.
          </p>
          {/* Target rail vis */}
          <div className="relative mt-3 p-[28px_16px_16px] bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded min-h-[110px] overflow-hidden">
            <div className="relative h-14 mx-1.5 mt-3.5">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-[var(--rule)]" />
              {[
                { kind: "stop", left: "8%", label: "stop $96" },
                { kind: "buy", left: "30%", label: "buy $108" },
                { kind: "now", left: "46%", label: "$117" },
                { kind: "sell", left: "78%", label: "sell $155" },
              ].map((p) => (
                <span
                  key={p.kind}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    left: p.left,
                    width: p.kind === "now" ? 11 : 9,
                    height: p.kind === "now" ? 11 : 9,
                    background:
                      p.kind === "now" ? "var(--ink)" : "var(--paper)",
                    border: `2px solid ${p.kind === "now" ? "var(--ink)" : p.kind === "buy" ? "var(--green)" : p.kind === "stop" ? "var(--accent)" : "var(--ink-2)"}`,
                  }}
                >
                  <span
                    className="absolute left-1/2 -translate-x-1/2 font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.06em] whitespace-nowrap text-[var(--ink-3)]"
                    style={{
                      top: p.kind === "now" ? -16 : 14,
                      color: p.kind === "now" ? "var(--ink)" : undefined,
                      fontWeight: p.kind === "now" ? 500 : undefined,
                    }}
                  >
                    {p.label}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Patient */}
        <div className="bg-[var(--paper)] border border-[var(--rule)] p-[28px_26px_26px] flex flex-col gap-3.5">
          <div className="font-[family-name:var(--serif)] font-medium text-[30px] text-[var(--ink)] tracking-[-0.02em] mb-1">
            Patient.
          </div>
          <p className="font-[family-name:var(--serif)] text-[15.5px] leading-[1.55] text-[var(--ink-2)] m-0 flex-1">
            You&apos;re not watching prices all day. You&apos;re not refreshing
            the news. You wrote down what you&apos;re waiting for, and the
            notebook is watching. Open it when there&apos;s something to
            actually do.
          </p>
          {/* Timeline vis */}
          <div className="relative mt-3 p-[28px_16px_16px] bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded min-h-[110px]">
            <div className="flex flex-col gap-2 mt-1">
              {[
                {
                  kind: "plan",
                  when: "Jan 15",
                  body: "Initial thesis. Buy on $108 pullback.",
                },
                {
                  kind: "risk",
                  when: "Feb 22",
                  body: "Export rules - watch April ruling.",
                },
                {
                  kind: "alert",
                  when: "Apr 22",
                  body: "BUY $108 hit. Email sent.",
                },
              ].map((item) => (
                <div
                  key={item.when}
                  className="grid items-center gap-2 text-[12px] min-w-0"
                  style={{ gridTemplateColumns: "42px 46px 1fr" }}
                >
                  <span
                    className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.06em] px-[5px] py-0.5 rounded-[2px] text-center border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink-2)]"
                    style={
                      item.kind === "alert"
                        ? {
                            color: "var(--accent)",
                            borderColor: "var(--accent-line)",
                            background: "var(--accent-soft)",
                          }
                        : {}
                    }
                  >
                    {item.kind}
                  </span>
                  <span className="font-[family-name:var(--mono)] text-[10px] text-[var(--ink-4)]">
                    {item.when}
                  </span>
                  <span className="font-[family-name:var(--serif)] text-[12.5px] text-[var(--ink-2)] whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                    {item.body}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Honest */}
        <div className="bg-[var(--paper)] border border-[var(--rule)] p-[28px_26px_26px] flex flex-col gap-3.5">
          <div className="font-[family-name:var(--serif)] font-medium text-[30px] text-[var(--ink)] tracking-[-0.02em] mb-1">
            Honest with yourself.
          </div>
          <p className="font-[family-name:var(--serif)] text-[15.5px] leading-[1.55] text-[var(--ink-2)] m-0 flex-1">
            A note from March says &quot;I&apos;m worried about export
            rules.&quot; A note from May says &quot;I forgot why I was
            worried.&quot; The notebook keeps both. Theses age - and watching
            yours age is how you catch a plan that&apos;s quietly stopped making
            sense.
          </p>
          {/* Email vis */}
          <div className="relative mt-3 p-[28px_16px_16px] bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded min-h-[110px]">
            <div className="bg-[var(--paper)] border border-[var(--rule)] rounded p-[10px_12px]">
              <div className="flex justify-between pb-1.5 mb-1.5 border-b border-[var(--rule-soft)] font-[family-name:var(--mono)] text-[9.5px] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                <span>{APP_TITLE}</span>
                <span>09:14</span>
              </div>
              <div className="font-[family-name:var(--serif)] text-[13.5px] font-medium text-[var(--ink)]">
                BUY hit · NVDA $108.40
              </div>
              <p className="font-[family-name:var(--serif)] italic text-[12px] text-[var(--ink-2)] mt-1 border-l-2 border-[var(--accent-line)] pl-2 m-0">
                &quot;Buy if pullback to $108 - only if capex guide holds…&quot;
              </p>
              <div className="font-[family-name:var(--mono)] text-[9.5px] text-[var(--ink-4)] mt-1.5">
                thesis · 98 days ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FeelSection;
