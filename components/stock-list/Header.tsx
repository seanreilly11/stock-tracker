import { useAuth } from "@/lib/hooks/useAuth";
import useFetchUserStocks from "@/lib/queries/useFetchUserStocks";

const Header = () => {
  const { data: savedStocks } = useFetchUserStocks();
  const { user } = useAuth();
  const now = new Date();
  const greeting = `${
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 17
        ? "Good afternoon"
        : "Good evening"
  }${user?.user_metadata?.name ? `, ${user.user_metadata.name.split(" ")[0]}.` : "."}`;

  return (
    <header className="pt-8 pb-6">
      <h1 className="font-[family-name:var(--serif)] text-4xl font-medium leading-tight tracking-tight text-[var(--ink)] mb-5">
        {greeting}
      </h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[var(--rule)] border border-[var(--rule)] rounded-lg overflow-hidden">
        {[
          { num: savedStocks?.length ?? 0, label: "tracked" },
          { num: 0, label: "alerts" },
          { num: 0, label: "in target range" },
          { num: 0, label: "notes total" },
        ].map(({ num, label }) => (
          <div key={label} className="bg-[var(--paper)] px-5 py-4">
            <div className="font-[family-name:var(--mono)] text-2xl font-medium text-[var(--ink)]">
              {num}
            </div>
            <div className="font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-[0.08em] text-[var(--ink-3)] mt-1">
              {label}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;
