"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import MenuDropdown from "@/components/ui/MenuDropdown";
import { APP_TITLE } from "@/lib/utils/constants";

const Nav = () => {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-[var(--rule)] bg-[var(--paper)]">
      <Link href="/" className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-[2px] bg-[var(--ink)] inline-block" />
        <span className="font-[family-name:var(--serif)] text-lg font-medium tracking-[-0.01em] text-[var(--ink)]">
          {APP_TITLE}
        </span>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <MenuDropdown name={user.user_metadata?.name} email={user.email} />
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-md border border-transparent bg-transparent px-2.5 py-1 text-xs font-medium text-[var(--ink-2)] transition-colors hover:bg-[var(--paper-2)]"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
