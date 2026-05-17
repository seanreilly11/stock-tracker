import { ReactNode } from "react";

interface GlimpseCardProps {
  number: string;
  title: string;
  caption: ReactNode;
  visual: ReactNode;
  flip?: boolean;
}

function GlimpseCard({ number, title, caption, visual, flip }: GlimpseCardProps) {
  return (
    <figure
      className="grid gap-[60px] items-center m-0"
      style={{ gridTemplateColumns: flip ? "minmax(0,1fr) minmax(0,1.4fr)" : "minmax(0,1.4fr) minmax(0,1fr)" }}
    >
      <div style={{ order: flip ? 2 : 0 }}>
        <div
          className="bg-[var(--paper-2)] border border-[var(--rule)] rounded-lg p-6 relative"
          style={{ boxShadow: "0 20px 50px -30px oklch(20% 0.02 60 / 0.2)" }}
        >
          {visual}
        </div>
      </div>
      <figcaption className="px-3" style={{ order: flip ? 1 : 1 }}>
        <div className="font-[family-name:var(--mono)] text-[11px] text-[var(--accent)] tracking-[0.08em] mb-2">
          {number}
        </div>
        <div
          className="font-[family-name:var(--serif)] font-medium text-[var(--ink)] mb-4 leading-[1.15] tracking-[-0.02em]"
          style={{ fontSize: 32 }}
        >
          {title}
        </div>
        <p className="font-[family-name:var(--serif)] text-[17px] leading-[1.55] text-[var(--ink-2)] m-0 max-w-[38ch]">
          {caption}
        </p>
      </figcaption>
    </figure>
  );
}

function GlimpseNotebook() {
  return (
    <div className="bg-[var(--paper)] border border-[var(--rule)] rounded-md p-[22px_24px] font-[family-name:var(--sans)]">
      <div className="flex items-center gap-2 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.10em] text-[var(--ink-3)] mb-2.5">
        <span>Semis</span>
        <span className="w-[3px] h-[3px] rounded-full bg-[var(--ink-4)]" />
        <span>NVDA</span>
      </div>
      <div className="flex items-baseline gap-2.5 flex-wrap mb-1.5">
        <h3 className="font-[family-name:var(--serif)] font-medium text-[26px] leading-[1.1] tracking-[-0.02em] m-0 text-[var(--ink)]">NVIDIA Corp.</h3>
        <span className="font-[family-name:var(--mono)] text-[11px] text-[var(--ink-3)] tracking-[0.04em]">NVDA</span>
      </div>
      <div className="flex gap-3 items-baseline mb-4 font-[family-name:var(--mono)] text-[13px]">
        <span className="text-[17px] text-[var(--ink)]">$142.30</span>
        <span className="text-[var(--green)]">▲ 1.84%</span>
      </div>
      <div className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.10em] text-[var(--ink-4)] mt-[18px] mb-2 pb-1.5 border-b border-[var(--rule-soft)]">
        Thesis · written March 14
      </div>
      <p className="font-[family-name:var(--serif)] text-[14px] leading-[1.5] text-[var(--ink-2)] m-0">
        Datacenter capex isn&apos;t peaking yet. Hyperscalers guided +30% capex for FY26.
      </p>
      <div className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.10em] text-[var(--ink-4)] mt-[18px] mb-2 pb-1.5 border-b border-[var(--rule-soft)]">
        Notes · 3 of 12
      </div>
      <div className="flex flex-col gap-2 mt-1">
        {[
          { kind: "plan",  when: "Mar 14", body: "Buy on pullback to $120…" },
          { kind: "risk",  when: "Apr 02", body: "Export ruling — watch April…" },
          { kind: "alert", when: "Apr 22", body: "BUY $120 hit. Email sent." },
        ].map((n) => (
          <div key={n.when} className="flex items-baseline gap-2 font-[family-name:var(--serif)] text-[13px] text-[var(--ink-2)]">
            <span
              className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.06em] px-[5px] py-0.5 rounded-[2px] bg-[var(--paper-2)] border border-[var(--rule)] text-[var(--ink-2)]"
              style={n.kind === "alert" ? { background: "var(--accent-soft)", borderColor: "var(--accent-line)", color: "var(--accent)" } : {}}
            >
              {n.kind}
            </span>
            <span className="font-[family-name:var(--mono)] text-[10px] text-[var(--ink-4)]">{n.when}</span>
            {n.body}
          </div>
        ))}
      </div>
    </div>
  );
}

function GlimpseTargets() {
  const rows = [
    { k: "buy",  p: "$165", l: "Pullback / accumulate", n: "21d MA + multiple support" },
    { k: "sell", p: "$200", l: "Trim into strength",    n: "Fair value mid-case" },
    { k: "sell", p: "$245", l: "Full exit",             n: "Bull-case price target" },
    { k: "stop", p: "$108", l: "Thesis broken",         n: "Cuts datacenter guide" },
  ];
  return (
    <div className="bg-[var(--paper)] border border-[var(--rule)] rounded-md p-[22px_24px]">
      <div className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.10em] text-[var(--ink-4)] mb-2 pb-1.5 border-b border-[var(--rule-soft)]">
        Targets · 4 armed
      </div>
      <div className="flex flex-col gap-1.5 mt-1">
        {rows.map((r) => (
          <div
            key={r.p + r.l}
            className="grid items-center gap-3 px-3 py-2.5 bg-[var(--paper-2)] rounded"
            style={{ gridTemplateColumns: "56px 64px 1fr 14px" }}
          >
            <span
              className="font-[family-name:var(--mono)] text-[9.5px] uppercase tracking-[0.08em] px-1.5 py-0.5 text-center rounded-[2px] text-[var(--paper)]"
              style={{ background: r.k === "buy" ? "var(--green)" : r.k === "sell" ? "var(--ink)" : "var(--accent)" }}
            >
              {r.k}
            </span>
            <span className="font-[family-name:var(--mono)] text-[14px] text-[var(--ink)]">{r.p}</span>
            <div className="flex flex-col gap-0.5">
              <span className="font-[family-name:var(--sans)] text-[13px] text-[var(--ink)]">{r.l}</span>
              <span className="font-[family-name:var(--serif)] italic text-[12px] text-[var(--ink-3)]">{r.n}</span>
            </div>
            <span className="w-[7px] h-[7px] rounded-full bg-[var(--green)]" />
          </div>
        ))}
      </div>
      <div className="mt-2.5 font-[family-name:var(--mono)] text-[11px] text-[var(--ink-3)] border border-dashed border-[var(--rule)] px-3 py-2 rounded">
        + Add target
      </div>
    </div>
  );
}

function GlimpseEmail() {
  return (
    <div className="bg-[var(--paper)] border border-[var(--rule)] rounded-md overflow-hidden">
      <div className="grid" style={{ gridTemplateColumns: "200px 1fr", minHeight: 360 }}>
        <div className="bg-[var(--paper-2)] border-r border-[var(--rule)]">
          {[
            { from: "InvestPrep", subj: "BUY $120 hit · NVDA — your thesis", when: "9:14", active: true },
            { from: "Patagonia",  subj: "Spring arrivals",                    when: "8:42", active: false },
            { from: "Stripe",     subj: "Weekly summary",                     when: "7:30", active: false },
            { from: "Bookshop",   subj: "Your hold is in",                    when: "7:02", active: false },
          ].map((row) => (
            <div
              key={row.from}
              className="px-3 py-2.5 border-b border-[var(--rule-soft)] grid gap-x-2 gap-y-1 text-[10.5px] relative"
              style={{
                gridTemplateColumns: "1fr auto",
                background: row.active ? "var(--paper)" : undefined,
              }}
            >
              {row.active && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)]" />}
              <span className="font-medium text-[var(--ink)] font-[family-name:var(--sans)]">{row.from}</span>
              <span className="font-[family-name:var(--mono)] text-[var(--ink-4)]">{row.when}</span>
              <span className="col-span-2 font-[family-name:var(--serif)] text-[12px] text-[var(--ink-2)] whitespace-nowrap overflow-hidden text-ellipsis">{row.subj}</span>
            </div>
          ))}
        </div>
        <div className="p-[18px_22px]">
          <div className="flex justify-between items-baseline pb-3 mb-4 border-b border-[var(--rule-soft)]">
            <span className="font-[family-name:var(--serif)] text-[18px] font-medium text-[var(--ink)] tracking-[-0.01em]">BUY $120 hit · NVDA — your thesis</span>
            <span className="font-[family-name:var(--mono)] text-[10.5px] text-[var(--ink-3)]">Apr 22 · 9:14am</span>
          </div>
          <div className="bg-[var(--paper-2)] border-l-[3px] border-[var(--accent)] px-3.5 py-3 mb-3.5">
            <div className="font-[family-name:var(--mono)] text-[9.5px] uppercase tracking-[0.10em] text-[var(--ink-4)] mb-1.5">Your thesis · written Mar 14 · 98 days ago</div>
            <p className="font-[family-name:var(--serif)] italic text-[13px] leading-[1.5] text-[var(--ink-2)] m-0">
              Datacenter capex isn&apos;t peaking yet. Hyperscalers guided +30% capex for FY26.
            </p>
          </div>
          <div className="font-[family-name:var(--mono)] text-[9.5px] uppercase tracking-[0.10em] text-[var(--ink-4)] mb-1.5">Notes · most recent first</div>
          {[
            { kind: "risk",  when: "Apr 02", body: "Export ruling — watch April. If chips banned to China, reset target $108." },
            { kind: "idea",  when: "Mar 28", body: "Q1 print: capex +34% YoY beat. Thesis still intact." },
            { kind: "plan",  when: "Mar 14", body: "Buy on pullback to $120 if capex guide holds." },
          ].map((n) => (
            <div key={n.when} className="flex gap-2 items-baseline font-[family-name:var(--serif)] text-[12.5px] py-1.5 border-b border-[var(--rule-soft)] text-[var(--ink-2)] last:border-0">
              <span
                className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.06em] px-[5px] py-0.5 rounded-[2px] bg-[var(--paper-2)] border border-[var(--rule)] text-[var(--ink-2)] flex-shrink-0"
                style={n.kind === "risk" ? { color: "var(--accent)", borderColor: "var(--accent-line)" } : {}}
              >
                {n.kind}
              </span>
              <span className="font-[family-name:var(--mono)] text-[10px] text-[var(--ink-4)] flex-shrink-0">{n.when}</span>
              {n.body}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GlimpseShelf() {
  const slots = [
    { rank: "01", tick: "NVDA", name: "NVIDIA Corp.",    meta: "buy $120 · ~$3.4k", fill: "72%",  foot: "$2,420 of $3,400 saved", top: true },
    { rank: "02", tick: "NET",  name: "Cloudflare Inc.", meta: "buy $78 · ~$1.6k",  fill: "40%",  foot: "$640 of $1,600 saved",   top: false },
    { rank: "03", tick: "COST", name: "Costco",          meta: "buy $820 · ~$2.5k", fill: "12%",  foot: "$300 of $2,500 saved",   top: false },
  ];
  return (
    <div className="bg-[var(--paper)] border border-[var(--rule)] rounded-md p-[22px_24px]">
      <div className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.10em] text-[var(--ink-4)] mb-2 pb-1.5 border-b border-[var(--rule-soft)]">
        Next to buy · 3 slots
      </div>
      <div className="grid gap-2.5 mt-2" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {slots.map((s) => (
          <div
            key={s.rank}
            className="bg-[var(--paper-2)] border border-[var(--rule)] rounded p-[14px_14px_12px] relative"
            style={s.top ? { background: "var(--paper)", borderColor: "var(--ink-3)" } : {}}
          >
            <div
              className="font-[family-name:var(--mono)] text-[10px] text-[var(--ink-4)] tracking-[0.06em] mb-1.5"
              style={s.top ? { color: "var(--accent)" } : {}}
            >
              {s.rank}
            </div>
            <div className="font-[family-name:var(--mono)] text-[14px] text-[var(--ink)] tracking-[0.04em] font-medium">{s.tick}</div>
            <div className="text-[11.5px] text-[var(--ink-3)] mt-0.5">{s.name}</div>
            <div className="font-[family-name:var(--mono)] text-[10px] text-[var(--ink-3)] mt-2 mb-1.5">{s.meta}</div>
            <div className="h-[3px] bg-[var(--rule-soft)] rounded overflow-hidden mb-1.5">
              <div
                className="h-full rounded"
                style={{ width: s.fill, background: s.top ? "var(--accent)" : "var(--ink-2)" }}
              />
            </div>
            <div className="font-[family-name:var(--mono)] text-[9.5px] text-[var(--ink-4)] tracking-[0.02em]">{s.foot}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const GlimpsesSection = () => (
  <section id="glimpses" className="py-24">
    <div className="max-w-[1200px] mx-auto px-10">
      <div className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.10em] text-[var(--ink-3)] mb-6 flex items-center gap-3.5">
        <span className="w-8 h-px bg-[var(--ink-4)]" />
        Glimpses
      </div>

      <h2
        className="font-[family-name:var(--serif)] font-normal text-[var(--ink)] mb-10"
        style={{ fontSize: "clamp(34px, 4.4vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.02em" }}
      >
        Four looks at the notebook.
      </h2>

      <div className="flex flex-col gap-20">
        <GlimpseCard
          number="01"
          title="A stock you're watching"
          caption={<><strong className="text-[var(--ink)] font-medium">A research notebook, not a watchlist.</strong> Every stock has a thesis, a list of buy/sell/stop targets with the reasoning for each, and a timeline of your notes.</>}
          visual={<GlimpseNotebook />}
        />
        <GlimpseCard
          number="02"
          title="The targets you've set"
          caption={<><strong className="text-[var(--ink)] font-medium">A plan for up, down, and sideways.</strong> Buy at $165 if it pulls back. Trim at $200. Stop at $108 if the thesis breaks. You decide your response to every direction — once, in advance.</>}
          visual={<GlimpseTargets />}
          flip
        />
        <GlimpseCard
          number="03"
          title="The email when it triggers"
          caption={<><strong className="text-[var(--ink)] font-medium">Your thesis, returned to you on time.</strong> Every alert email contains every note you&apos;ve written on the stock, newest first. Everything you need to respond correctly, the moment it matters.</>}
          visual={<GlimpseEmail />}
        />
        <GlimpseCard
          number="04"
          title="Your next-to-buy shelf"
          caption={<><strong className="text-[var(--ink)] font-medium">Three slots, ranked.</strong> What you&apos;re saving for. What your next paycheck is going toward. A deliberate shortlist, not an endless list.</>}
          visual={<GlimpseShelf />}
          flip
        />
      </div>
    </div>
  </section>
);

export default GlimpsesSection;
