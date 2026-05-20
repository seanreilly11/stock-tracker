"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { AuthError } from "@supabase/supabase-js";
import { signIn, signUp } from "@/server/actions/auth";
import { APP_TITLE } from "@/lib/utils/constants";

type Mode = "login" | "register";

interface AuthModalProps {
  open: boolean;
  mode: Mode;
  onClose: () => void;
  onSwitchMode: (mode: Mode) => void;
}

export default function AuthModal({
  open,
  mode,
  onClose,
  onSwitchMode,
}: AuthModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const isRegister = mode === "register";

  useEffect(() => {
    setError(null);
  }, [mode]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => emailRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validName = !isRegister || name.trim().length >= 2;
  const validAgree = !isRegister || agree;
  const canSubmit = validEmail && validName && validAgree && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      if (!validEmail) setError("That email doesn’t look right.");
      else if (!validName) setError("Tell us what to call you.");
      else if (!validAgree) setError("Please accept the terms to continue.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      if (isRegister) {
        await signUp(email.trim(), password, name.trim());
      } else {
        await signIn(email.trim(), password);
      }
      onClose();
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof AuthError ? err.message : "Something went wrong";
      setError(
        msg.includes("Invalid login credentials")
          ? "Invalid email or password"
          : msg.includes("User already registered")
            ? "An account with this email already exists"
            : msg,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{
        background: "oklch(20% 0.012 60 / 0.42)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "au-fade 0.18s ease-out",
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[920px] bg-[var(--paper)] border border-[var(--rule)] rounded-lg overflow-hidden grid"
        style={{
          gridTemplateColumns: "minmax(0,360px) minmax(0,1fr)",
          maxHeight: "calc(100vh - 48px)",
          boxShadow:
            "0 1px 0 var(--rule-soft), 0 30px 80px -30px oklch(20% 0.02 60 / 0.35), 0 60px 160px -50px oklch(20% 0.02 60 / 0.2)",
          animation: "au-rise 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          className="absolute top-3.5 right-3.5 w-[30px] h-[30px] rounded-full border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink-3)] inline-flex items-center justify-center cursor-pointer z-10 transition-colors hover:bg-[var(--paper-2)] hover:text-[var(--ink)] hover:border-[var(--ink-3)]"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 1l10 10M11 1L1 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Editorial sidebar */}
        <aside
          className="border-r border-[var(--rule)] p-[36px_32px_28px] flex flex-col gap-6"
          style={{
            background:
              "radial-gradient(80% 60% at 0% 100%, color-mix(in oklch, var(--accent-soft) 60%, transparent) 0%, transparent 70%), var(--paper-2)",
          }}
          aria-hidden="true"
        >
          <div className="flex items-center gap-2.5 font-[family-name:var(--serif)] text-[17px] text-[var(--ink)]">
            <span className="w-[9px] h-[9px] rounded-[2px] bg-[var(--ink)] flex-shrink-0" />
            <span className="font-medium">{APP_TITLE}</span>
          </div>

          <blockquote className="m-0 p-0 border-l-2 border-[var(--ink)] pl-4">
            <p
              className="m-0 font-[family-name:var(--serif)] text-[19px] leading-[1.45] tracking-[-0.005em] text-[var(--ink)] italic"
              style={{ textWrap: "pretty" } as React.CSSProperties}
            >
              &ldquo;The move is coming either way. The only question is whether
              it happens <em className="text-[var(--accent)]">to</em> you, or
              whether you meet it with a plan.&rdquo;
            </p>
          </blockquote>

          <ul className="list-none m-0 p-0 flex flex-col gap-3.5">
            {[
              "Write your thesis before you trade.",
              "Set buy, sell and stop targets.",
              "Get one calm email when it’s time.",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 font-[family-name:var(--serif)] text-[14.5px] text-[var(--ink-2)] leading-[1.45]"
              >
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] flex-shrink-0 mt-[6px]" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6 border-t border-dashed border-[var(--rule)] font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--ink-4)]">
            Not financial advice · Not a brokerage · A notebook
          </div>
        </aside>

        {/* Form pane */}
        <section className="p-[30px_40px_32px] overflow-y-auto flex flex-col">
          {/* Tabs */}
          <div className="inline-flex self-start bg-[var(--paper-2)] border border-[var(--rule)] rounded-full p-[3px] mb-5">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                type="button"
                key={m}
                role="tab"
                aria-selected={mode === m}
                className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] px-4 py-[7px] rounded-full cursor-pointer border-0 transition-all"
                style={{
                  background: mode === m ? "var(--paper)" : "transparent",
                  color: mode === m ? "var(--ink)" : "var(--ink-3)",
                  boxShadow:
                    mode === m
                      ? "0 1px 0 var(--rule-soft), 0 2px 6px oklch(20% 0.02 60 / 0.06)"
                      : "none",
                }}
                onClick={() => onSwitchMode(m)}
              >
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {/* Header */}
          <header className="mb-[22px]">
            <div className="inline-flex items-center gap-3 font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-[0.10em] text-[var(--ink-3)] mb-3">
              <span className="w-6 h-px bg-[var(--ink-4)]" />
              {isRegister ? "Welcome" : "Welcome back"}
            </div>
            <h2 className="m-0 mb-2 font-[family-name:var(--serif)] font-medium text-[34px] leading-[1.08] tracking-[-0.02em] text-[var(--ink)]">
              {isRegister ? (
                "Start your notebook."
              ) : (
                <>
                  Pick up where
                  <br />
                  you left off.
                </>
              )}
            </h2>
            <p className="m-0 font-[family-name:var(--serif)] text-[14.5px] leading-[1.5] text-[var(--ink-3)] max-w-[38ch]">
              {isRegister
                ? "Two minutes to set up. Free, always. No card, no plans."
                : "Your theses, your targets, your notes — right where you left them."}
            </p>
          </header>

          <form
            className="flex flex-col gap-3.5"
            onSubmit={handleSubmit}
            noValidate
          >
            {isRegister && (
              <label className="flex flex-col gap-1.5">
                <FieldLabel>Your name</FieldLabel>
                <input
                  type="text"
                  className="au-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Casey Lin"
                  autoComplete="name"
                />
                <span className="font-[family-name:var(--serif)] italic text-[12px] text-[var(--ink-4)] leading-[1.35]">
                  So your alert emails feel less like spam.
                </span>
              </label>
            )}

            <label className="flex flex-col gap-1.5">
              <FieldLabel>Email</FieldLabel>
              <input
                ref={emailRef}
                type="email"
                className="au-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourdomain.com"
                autoComplete="email"
                inputMode="email"
              />
              <span className="font-[family-name:var(--serif)] italic text-[12px] text-[var(--ink-4)] leading-[1.35]">
                Where alerts arrive when your targets hit.
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <FieldLabel>Password</FieldLabel>
                {!isRegister && (
                  <button
                    type="button"
                    className="font-[family-name:var(--mono)] text-[10.5px] text-[var(--ink-3)] cursor-pointer border-0 bg-transparent p-0 underline underline-offset-[2px] hover:text-[var(--accent)] transition-colors"
                    onClick={() =>
                      setError("Check your email for a reset link.")
                    }
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <PasswordInput
                value={password}
                onChange={setPassword}
                autoComplete={isRegister ? "new-password" : "current-password"}
                placeholder={
                  isRegister ? "At least 8 characters" : "Your password"
                }
              />
              {isRegister && <PasswordMeter value={password} />}
            </label>

            <div className="mt-0.5">
              {isRegister ? (
                <CheckRow checked={agree} onChange={setAgree}>
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="text-[var(--ink)] underline underline-offset-[2px] decoration-[var(--ink-4)] hover:decoration-[var(--accent)]"
                  >
                    terms
                  </a>{" "}
                  and the{" "}
                  <a
                    href="/privacy"
                    className="text-[var(--ink)] underline underline-offset-[2px] decoration-[var(--ink-4)] hover:decoration-[var(--accent)]"
                  >
                    privacy promise
                  </a>
                  .
                </CheckRow>
              ) : (
                <CheckRow checked={remember} onChange={setRemember}>
                  Keep me signed in on this device
                </CheckRow>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 font-[family-name:var(--serif)] text-[13px] text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--accent-line)] rounded px-3 py-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md font-[family-name:var(--sans)] text-[15px] font-medium text-[var(--paper)] bg-[var(--ink)] border border-[var(--ink)] cursor-pointer transition-all hover:bg-[var(--ink-2)] hover:border-[var(--ink-2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? isRegister
                  ? "Creating your notebook…"
                  : "Signing in…"
                : isRegister
                  ? "Create account"
                  : "Sign in"}
              {!submitting && (
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 5h12M9 1l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <div className="mt-3.5 font-[family-name:var(--serif)] text-[13.5px] text-[var(--ink-3)] text-center">
              {isRegister ? (
                <>
                  Already have a notebook?{" "}
                  <button
                    type="button"
                    className="border-0 bg-transparent p-0 font-inherit text-[var(--ink)] cursor-pointer underline underline-offset-[3px] decoration-[var(--accent)] hover:text-[var(--accent)]"
                    onClick={() => onSwitchMode("login")}
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New here?{" "}
                  <button
                    type="button"
                    className="border-0 bg-transparent p-0 font-inherit text-[var(--ink)] cursor-pointer underline underline-offset-[3px] decoration-[var(--accent)] hover:text-[var(--accent)]"
                    onClick={() => onSwitchMode("register")}
                  >
                    Create an account
                  </button>
                </>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
      {children}
    </span>
  );
}

function PasswordInput({
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className="au-input w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[30px] h-[30px] inline-flex items-center justify-center bg-transparent border-0 text-[var(--ink-4)] cursor-pointer rounded hover:text-[var(--ink-2)] hover:bg-[var(--paper-2)]"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function PasswordMeter({ value }: { value: string }) {
  const score = scorePassword(value);
  const labels = ["too short", "weak", "fair", "good", "strong"];
  const colors = [
    "",
    "var(--accent)",
    "oklch(70% 0.13 75)",
    "oklch(60% 0.12 130)",
    "var(--green)",
  ];
  return (
    <div className="flex items-center gap-2.5 mt-1" aria-hidden="true">
      <div className="flex gap-1 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="flex-1 h-[3px] rounded-sm transition-colors"
            style={{ background: i < score ? colors[score] : "var(--rule)" }}
          />
        ))}
      </div>
      <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--ink-4)] min-w-[56px] text-right">
        {value.length === 0 ? " " : labels[score]}
      </span>
    </div>
  );
}

function scorePassword(p: string): number {
  if (!p || p.length < 8) return 0;
  let s = 1;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  if (p.length >= 14) s = Math.min(4, s + 1);
  return Math.min(4, Math.max(1, s));
}

function CheckRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="inline-flex items-start gap-2.5 font-[family-name:var(--serif)] text-[13.5px] text-[var(--ink-2)] leading-[1.4] cursor-pointer select-none relative">
      <input
        type="checkbox"
        className="absolute opacity-0 pointer-events-none"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className="w-4 h-4 flex-shrink-0 border border-[var(--ink-3)] rounded-[3px] bg-[var(--paper)] mt-0.5 relative transition-colors"
        style={
          checked ? { background: "var(--ink)", borderColor: "var(--ink)" } : {}
        }
      >
        {checked && (
          <span
            className="absolute"
            style={{
              left: 4,
              top: 0.5,
              width: 5,
              height: 9,
              border: "solid var(--paper)",
              borderWidth: "0 1.5px 1.5px 0",
              transform: "rotate(40deg)",
            }}
          />
        )}
      </span>
      <span>{children}</span>
    </label>
  );
}
