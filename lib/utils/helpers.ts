export function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return ""
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60)    return `${Math.floor(diff)}s ago`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export const formatPrice = (value: number) => {
  if (!value) return "$--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
};

export const getChangePerc = (change: number) => {
  if (!change) return;
  // "↑" : "↓"
  // "▲" "▼"
  const positive = change >= 0;
  return `${positive ? "▲" : "▼"}${" "}${Math.abs(change).toFixed(2)}%`;
};

export const getChangeColour = (change: number) => {
  if (!change) return;
  return change >= 0 ? "text-green-500" : "text-red-500";
};
