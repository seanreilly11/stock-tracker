import { ReactNode } from "react";

type Size = "sm" | "md" | "lg";
type Variant = "card" | "inline" | "plain";

interface EmptyStateProps {
  icon?: ReactNode;
  eyebrow?: string;
  title: string;
  body?: string;
  action?: ReactNode;
  size?: Size;
  variant?: Variant;
  className?: string;
}

const SIZE_PADDING: Record<Size, string> = {
  sm: "py-4 px-4",
  md: "py-9 px-6",
  lg: "py-[72px] px-8",
};
const SIZE_GAP: Record<Size, string> = {
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-3",
};
const SIZE_ICON: Record<Size, string> = {
  sm: "w-8 h-8",
  md: "w-14 h-14",
  lg: "w-[72px] h-[72px]",
};
const SIZE_TITLE: Record<Size, string> = {
  sm: "text-[15px]",
  md: "text-[22px]",
  lg: "text-[32px]",
};
const SIZE_BODY: Record<Size, string> = {
  sm: "text-[12.5px] max-w-[28ch]",
  md: "text-[14.5px] max-w-[38ch]",
  lg: "text-[17px] max-w-[46ch]",
};
const SIZE_ACTION_MT: Record<Size, string> = {
  sm: "mt-2",
  md: "mt-3.5",
  lg: "mt-3.5",
};

const VARIANT_WRAP: Record<Variant, string> = {
  card: "bg-[var(--paper)] border border-dashed border-[var(--rule)] rounded-[6px]",
  inline: "",
  plain: "",
};

const EmptyState = ({
  icon,
  eyebrow,
  title,
  body,
  action,
  size = "md",
  variant = "inline",
  className = "",
}: EmptyStateProps) => {
  const isPlain = variant === "plain";

  return (
    <div
      className={[
        "flex flex-col",
        isPlain ? "items-start text-left" : "items-center text-center",
        SIZE_PADDING[size],
        SIZE_GAP[size],
        VARIANT_WRAP[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && (
        <div className={`${SIZE_ICON[size]} text-[var(--ink-4)] mb-1 shrink-0`}>
          {icon}
        </div>
      )}
      {eyebrow && (
        <div className="font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-[0.10em] text-[var(--ink-4)]">
          {eyebrow}
        </div>
      )}
      <h3
        className={`font-[family-name:var(--serif)] font-medium text-[var(--ink)] tracking-[-0.01em] leading-[1.15] m-0 ${SIZE_TITLE[size]}`}
      >
        {title}
      </h3>
      {body && (
        <p
          className={`font-[family-name:var(--serif)] text-[var(--ink-3)] leading-[1.55] mt-1 ${SIZE_BODY[size]}`}
        >
          {body}
        </p>
      )}
      {action && <div className={SIZE_ACTION_MT[size]}>{action}</div>}
    </div>
  );
};

export default EmptyState;
