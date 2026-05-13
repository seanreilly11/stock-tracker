"use client";

interface HeaderProps {
    stockCount: number;
    userName: string | null;
    triggeredCount: number;
}

const Header = ({ stockCount, userName, triggeredCount }: HeaderProps) => {
    const now = new Date();
    const greeting = `${
        now.getHours() < 12
            ? "Good morning"
            : now.getHours() < 17
              ? "Good afternoon"
              : "Good evening"
    }${userName ? `, ${userName.split(" ")[0]}.` : "."}`;

    return (
        <header className="pt-5 sm:pt-8 pb-4 sm:pb-6">
            <h1 className="font-[family-name:var(--serif)] text-2xl sm:text-4xl font-medium leading-snug sm:leading-tight tracking-tight text-[var(--ink)] mb-4 sm:mb-5">
                {greeting}{" "}
                {triggeredCount > 0 && (
                    <span className="text-[var(--ink-3)]">
                        {triggeredCount} target{triggeredCount !== 1 ? "s" : ""} hit.
                    </span>
                )}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[var(--rule)] border border-[var(--rule)] rounded-lg overflow-hidden">
                {[
                    { num: stockCount, label: "tracked" },
                    { num: 0, label: "alerts" },
                    { num: 0, label: "in target range" },
                    { num: 0, label: "notes total" },
                ].map(({ num, label }) => (
                    <div key={label} className="bg-[var(--paper)] px-3.5 py-3 sm:px-5 sm:py-4">
                        <div className="font-[family-name:var(--mono)] text-[22px] sm:text-[28px] font-medium text-[var(--ink)]">
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
