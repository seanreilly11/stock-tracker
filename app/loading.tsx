import Spinner from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center">
      <Spinner size="large" />
    </div>
  );
}
