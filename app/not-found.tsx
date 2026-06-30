import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-[var(--ink-3)] uppercase tracking-widest mb-3">
        404
      </p>
      <h1
        className="text-3xl mb-4 text-[var(--ink)]"
        style={{ fontFamily: "var(--serif)" }}
      >
        Page not found
      </h1>
      <p className="text-sm text-[var(--ink-3)] mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--ink-2)] transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
