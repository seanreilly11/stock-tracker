import { APP_TITLE } from "@/lib/utils/constants";

const LandingFooter = () => (
  <footer className="py-8 border-t border-[var(--rule)]">
    <div className="max-w-[1200px] mx-auto px-10 flex justify-between items-center gap-4">
      <div className="flex items-center gap-2.5 font-[family-name:var(--serif)] text-[18px] text-[var(--ink)]">
        <span className="w-[9px] h-[9px] rounded-[2px] bg-[var(--ink)] inline-block flex-shrink-0" />
        <span className="font-medium">{APP_TITLE}</span>
      </div>
      <div className="font-[family-name:var(--mono)] text-[10.5px] text-[var(--ink-4)] tracking-[0.06em]">
        Not financial advice · Not a brokerage · A notebook
      </div>
    </div>
  </footer>
);

export default LandingFooter;
