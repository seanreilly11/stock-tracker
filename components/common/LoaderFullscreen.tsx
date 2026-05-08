import Spinner from "@/components/ui/Spinner";
import { APP_TITLE } from "@/lib/utils/constants";

const LoaderFullscreen = () => (
  <div className="fixed inset-0 z-50 bg-[var(--paper)] flex flex-col items-center justify-center gap-4">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--ink)] inline-block" />
      <span className="font-[family-name:var(--serif)] text-xl font-medium tracking-[-0.01em] text-[var(--ink)]">
        {APP_TITLE}
      </span>
    </div>
    <Spinner size="large" />
  </div>
);

export default LoaderFullscreen;
