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
