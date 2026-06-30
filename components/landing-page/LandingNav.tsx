'use client'
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { APP_TITLE } from "@/lib/utils/constants";

interface LandingNavProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

const LandingNav = ({ onSignIn, onGetStarted }: LandingNavProps) => (
  <header
    className="sticky top-0 z-50 border-b border-[var(--rule-soft)]"
    style={{
      background: "color-mix(in oklch, var(--paper) 88%, transparent)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    }}
  >
    <div className="max-w-[1200px] mx-auto px-10 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5 font-[family-name:var(--serif)] text-[18px] text-[var(--ink)]">
        <span className="w-[9px] h-[9px] rounded-[2px] bg-[var(--ink)] inline-block flex-shrink-0" />
        <span className="font-medium">{APP_TITLE}</span>
        <span
          className="font-[family-name:var(--mono)] text-[9.5px] text-[var(--ink-4)] uppercase tracking-[0.10em] ml-1 pl-2.5 border-l border-[var(--rule)]"
        >
          Research notebook
        </span>
      </div>

      <nav className="flex items-center gap-7 font-[family-name:var(--mono)] text-[11.5px] uppercase tracking-[0.08em]">
        <a href="#moment" className="text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors hidden sm:block">
          How it works
        </a>
        <a href="#glimpses" className="text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors hidden sm:block">
          Glimpses
        </a>
        <a href="#faq" className="text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors hidden sm:block">
          Questions
        </a>
        <button
          type="button"
          onClick={onSignIn}
          className="text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors normal-case tracking-normal font-[family-name:var(--mono)] text-[11.5px] uppercase tracking-[0.08em]"
        >
          Sign in
        </button>
        <Button variant="primary" size="sm" onClick={onGetStarted}>
          Get started <ArrowRight size={12} />
        </Button>
      </nav>
    </div>
  </header>
);

export default LandingNav;
