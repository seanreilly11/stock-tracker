export default function Loading() {
  return (
    <div className="flex flex-col h-full bg-[var(--paper)] animate-pulse">
      <div className="h-10 border-b border-[var(--rule)] bg-[var(--paper-2)]" />
      <div className="flex flex-1 min-h-0">
        <div className="w-52 border-r border-[var(--rule)] bg-[var(--paper-2)]" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-9 pb-6">
            <div className="h-4 bg-[var(--paper-3)] rounded w-1/4 mb-3" />
            <div className="h-10 bg-[var(--paper-3)] rounded w-1/2 mb-4" />
            <div className="h-6 bg-[var(--paper-3)] rounded w-1/4" />
          </div>
        </main>
      </div>
    </div>
  );
}
