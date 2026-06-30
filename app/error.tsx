"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-[var(--accent)] uppercase tracking-widest mb-3">
        Error
      </p>
      <h1
        className="text-3xl mb-4 text-[var(--ink)]"
        style={{ fontFamily: "var(--serif)" }}
      >
        Something went wrong
      </h1>
      <p className="text-sm text-[var(--ink-3)] mb-8 max-w-sm">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
