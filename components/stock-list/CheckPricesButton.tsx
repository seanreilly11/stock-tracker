"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkPricesAction } from "@/lib/actions/checkPrices";

const CheckPricesButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ triggered: number; checked: number } | null>(null);

  async function handleCheck() {
    setLoading(true);
    setResult(null);
    const data = await checkPricesAction();
    if ("triggered" in data) setResult({ triggered: data.triggered, checked: data.checked });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleCheck}
      disabled={loading}
      className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.06em] text-[var(--ink-3)] hover:text-[var(--ink)] disabled:opacity-40 transition-colors"
    >
      {loading
        ? "checking…"
        : result
          ? `${result.triggered} triggered / ${result.checked} checked`
          : "check prices"}
    </button>
  );
};

export default CheckPricesButton;
