import React from "react";
import Link from "next/link";
import { APP_TITLE } from "@/lib/utils/constants";

const Footer = () => (
  <footer className="border-t border-[var(--rule)] bg-[var(--paper)] py-8 px-8">
    <div className="max-w-5xl mx-auto flex flex-col gap-4">
      <p className="text-xs text-[var(--ink-3)] leading-5 max-w-2xl">
        The information on this site is for informational and note-taking
        purposes only and should not be construed as financial advice. We do not
        guarantee the accuracy or completeness of any data. Always consult a
        qualified financial advisor before making investment decisions.
      </p>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-[2px] bg-[var(--ink)]" />
          <span className="font-[family-name:var(--serif)] font-medium text-[var(--ink)]">
            {APP_TITLE}
          </span>
        </Link>
        <span className="text-[var(--ink-3)]">© 2025</span>
        <Link
          href="/contact"
          className="text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
        >
          Contact
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
