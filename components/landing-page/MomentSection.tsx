import { APP_TITLE } from "@/lib/utils/constants";

const MomentSection = () => (
  <section
    id="moment"
    className="py-24 border-t border-[var(--rule-soft)]"
  >
    <div className="max-w-[1200px] mx-auto px-10">
      <div className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.10em] text-[var(--ink-3)] mb-6 flex items-center gap-3.5">
        <span className="w-8 h-px bg-[var(--ink-4)]" />
        The moment that matters
      </div>

      <div className="grid gap-20 items-start" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
        {/* Copy */}
        <div>
          <h2
            className="font-[family-name:var(--serif)] font-normal text-[var(--ink)] m-0 mb-7"
            style={{ fontSize: "clamp(34px, 4.4vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.02em" }}
          >
            Three months ago
            <br />
            you wrote the thesis.
          </h2>
          <p className="font-[family-name:var(--serif)] text-[18.5px] leading-[1.55] text-[var(--ink-2)] mb-4">
            You had time. You read the earnings call, traced the supply chain, talked yourself
            through the bear case. You wrote it down — what you believed, the price you&apos;d act
            on, the risk that would change your mind.
          </p>
          <p
            className="font-[family-name:var(--serif)] italic text-[var(--ink-3)] border-l-2 border-[var(--rule)] pl-4 my-6 text-[18.5px] leading-[1.55]"
          >
            Then life moved on. You forgot the details. You opened the app twice in October.
          </p>

          <h2
            className="font-[family-name:var(--serif)] font-normal text-[var(--ink)] mb-7 mt-12"
            style={{ fontSize: "clamp(34px, 4.4vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.02em" }}
          >
            Today the stock moves.
            <br />
            Or the news breaks.
          </h2>
          <p className="font-[family-name:var(--serif)] text-[18.5px] leading-[1.55] text-[var(--ink-2)] mb-4">
            And here&apos;s where trades are won and lost — not in the research, in the{" "}
            <em>response.</em>
          </p>
          <p className="font-[family-name:var(--serif)] text-[18.5px] leading-[1.55] text-[var(--ink-2)] mb-4">
            The unprepared version of you scrambles. The move happens <em>to</em> you.
          </p>
          <p className="font-[family-name:var(--serif)] text-[18.5px] leading-[1.55] text-[var(--ink-2)] mb-4">
            The prepared version opens one email. Your thesis is there. Your targets are there.
            You act — on a decision you already made, calmly, months ago.
          </p>
          <div className="mt-7 px-[22px] py-5 bg-[var(--paper-2)] border-l-[3px] border-[var(--ink)] font-[family-name:var(--serif)] text-[17px] text-[var(--ink)]">
            <strong>That&apos;s the whole product.</strong> {APP_TITLE} doesn&apos;t predict the move.
            It makes sure that when the move comes, you meet it with a plan instead of a panic.
          </div>
        </div>

        {/* Visual */}
        <div
          className="relative bg-[var(--paper-2)] border border-[var(--rule)] rounded-lg p-7 top-[100px] sticky"
        >
          <div className="flex flex-col gap-0">
            {/* Thesis card */}
            <div
              className="bg-[var(--paper)] border border-[var(--rule)] rounded-md p-4 font-[family-name:var(--sans)]"
              style={{ animation: "ln-rise 0.8s 0.1s both" }}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="font-[family-name:var(--mono)] text-[9.5px] uppercase tracking-[0.08em] px-[7px] py-0.5 border border-[var(--ink)] text-[var(--ink)] bg-[var(--paper-2)]">
                  plan
                </span>
                <span className="font-[family-name:var(--mono)] text-[10.5px] text-[var(--ink-3)] ml-auto">Jan 15 · 10:42</span>
              </div>
              <p className="font-[family-name:var(--serif)] text-[15px] leading-[1.5] text-[var(--ink-2)] italic m-0">
                &quot;Buy if pullback to $108 — but only if datacenter capex guide holds in Q4 print.
                Stop $96 if guide cuts.&quot;
              </p>
              <div className="flex gap-1.5 mt-2.5">
                {["thesis", "target-buy"].map((t) => (
                  <span key={t} className="font-[family-name:var(--mono)] text-[9.5px] text-[var(--ink-3)] px-1.5 py-0.5 bg-[var(--paper-2)] rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Spine */}
            <div className="relative py-[18px] pl-7 ml-[22px] border-l border-dashed border-[var(--rule)]">
              <span
                className="absolute left-[-5px] top-2 w-[9px] h-[9px] rounded-full bg-[var(--ink-4)]"
              />
              <span
                className="absolute left-[-5px] bottom-2 w-[9px] h-[9px] rounded-full bg-[var(--accent)]"
              />
              <div className="flex gap-[18px] font-[family-name:var(--mono)] text-[11px] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                <span>Feb</span><span>Mar</span><span>Apr</span>
              </div>
              <p className="font-[family-name:var(--serif)] italic text-[13px] text-[var(--ink-3)] mt-1 m-0">
                98 days pass
              </p>
            </div>

            {/* Email card */}
            <div
              className="bg-[var(--paper)] border border-[var(--rule)] rounded-md p-4 font-[family-name:var(--sans)]"
              style={{
                animation: "ln-rise 0.8s 0.8s both",
                boxShadow: "0 10px 40px -16px oklch(20% 0.02 60 / 0.18)",
              }}
            >
              <div className="flex justify-between pb-2 mb-2.5 border-b border-[var(--rule-soft)] font-[family-name:var(--mono)] text-[10.5px] text-[var(--ink-3)] uppercase tracking-[0.04em]">
                <span>{APP_TITLE} · alerts</span>
                <span>Apr 22 · 09:14</span>
              </div>
              <div className="font-[family-name:var(--serif)] text-[17px] font-medium text-[var(--ink)] mb-3 tracking-[-0.01em]">
                BUY target hit · NVDA at $108.40
              </div>
              <div className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.10em] text-[var(--ink-4)] mb-1.5">
                Your thesis, written 98 days ago:
              </div>
              <p className="font-[family-name:var(--serif)] italic text-[14.5px] leading-[1.5] text-[var(--ink-2)] border-l-2 border-[var(--accent-line)] pl-3 mb-3 m-0">
                &quot;Buy if pullback to $108 — but only if datacenter capex guide holds in Q4 print.&quot;
              </p>
              <div className="flex gap-2.5 items-center font-[family-name:var(--mono)] text-[10.5px] text-[var(--ink-3)]">
                <span>Q4 capex guide · held +18% YoY</span>
                <span className="w-[3px] h-[3px] rounded-full bg-[var(--ink-4)]" />
                <span>Read in 90 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default MomentSection;
