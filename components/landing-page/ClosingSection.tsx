import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

interface ClosingSectionProps {
  onGetStarted: () => void;
}

const ClosingSection = ({ onGetStarted }: ClosingSectionProps) => (
  <section
    className="py-[120px] relative"
    style={{
      background:
        "radial-gradient(60% 80% at 50% 100%, color-mix(in oklch, var(--accent-soft) 60%, transparent) 0%, transparent 70%), var(--paper)",
    }}
  >
    <div className="max-w-[820px] mx-auto px-10 text-center">
      <div className="flex items-center justify-center gap-3.5 font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.10em] text-[var(--ink-3)] mb-6">
        <span className="w-[60px] h-px bg-[var(--ink-4)]" />
        One last thing
        <span className="w-[60px] h-px bg-[var(--ink-4)]" />
      </div>

      <h2
        className="font-[family-name:var(--serif)] font-normal text-[var(--ink)] mb-6"
        style={{
          fontSize: "clamp(46px, 6vw, 80px)",
          lineHeight: 1.06,
          letterSpacing: "-0.02em",
        }}
      >
        The move is coming
        <br />
        either way.
      </h2>

      <p
        className="font-[family-name:var(--serif)] text-[var(--ink-2)] mx-auto mb-9 max-w-[580px]"
        style={{ fontSize: 22, lineHeight: 1.55 }}
      >
        The only question is whether it happens <em>to</em> you, or whether you
        meet it with a plan.
      </p>

      <Button variant="primary" size="md" onClick={onGetStarted}>
        Get started - free <ArrowRight size={14} />
      </Button>

      <div className="mt-[18px] font-[family-name:var(--mono)] text-[11px] text-[var(--ink-4)] uppercase tracking-[0.08em]">
        The notebook is free. Always.
      </div>
    </div>
  </section>
);

export default ClosingSection;
