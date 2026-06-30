"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { updatePassword } from "@/lib/actions/auth";
import Button from "@/components/ui/Button";

type FormData = { password: string; confirm: string };

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async ({ password }) => {
    setError("");
    setLoading(true);
    try {
      await updatePassword(password);
      setDone(true);
      setTimeout(() => router.replace("/"), 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Reset link expired or invalid. Request a new one.",
      );
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper)] px-8 py-8">
        <div className="mb-6">
          <h1 className="font-[family-name:var(--serif)] text-2xl font-medium text-[var(--ink)] mb-1">
            Set a new password
          </h1>
          <p className="text-sm text-[var(--ink-3)]">
            {done
              ? "Password updated. Taking you in…"
              : "Choose a password you’ll remember."}
          </p>
        </div>

        {done ? (
          <div className="p-4 rounded-md bg-[var(--green-soft)] border border-[var(--green-line)] text-sm text-[var(--green)]">
            Password updated successfully.
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                New password
              </label>
              <input
                className={[
                  "w-full rounded-md border px-3 py-2 text-sm bg-[var(--paper)] text-[var(--ink)]",
                  "placeholder:text-[var(--ink-4)] outline-none focus:border-[var(--ink-3)] transition-colors",
                  errors.password
                    ? "border-[var(--accent)]"
                    : "border-[var(--rule)]",
                ].join(" ")}
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                {...register("password", {
                  required: { value: true, message: "Please enter a password" },
                  minLength: { value: 8, message: "At least 8 characters" },
                })}
              />
              {errors.password && (
                <p className="text-xs text-[var(--accent)]">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                Confirm password
              </label>
              <input
                className={[
                  "w-full rounded-md border px-3 py-2 text-sm bg-[var(--paper)] text-[var(--ink)]",
                  "placeholder:text-[var(--ink-4)] outline-none focus:border-[var(--ink-3)] transition-colors",
                  errors.confirm
                    ? "border-[var(--accent)]"
                    : "border-[var(--rule)]",
                ].join(" ")}
                type="password"
                placeholder="Re-enter password"
                autoComplete="new-password"
                {...register("confirm", {
                  required: {
                    value: true,
                    message: "Please confirm your password",
                  },
                  validate: (v) =>
                    v === getValues("password") || "Passwords don’t match",
                })}
              />
              {errors.confirm && (
                <p className="text-xs text-[var(--accent)]">
                  {errors.confirm.message}
                </p>
              )}
            </div>

            {error && <p className="text-xs text-[var(--accent)]">{error}</p>}

            <Button
              loading={loading}
              type="submit"
              variant="primary"
              className="w-full justify-center"
            >
              Update password
            </Button>
          </form>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-[var(--ink-3)]">
        <Link
          href="/"
          className="text-[var(--ink)] font-medium hover:underline"
        >
          Back to app
        </Link>
      </p>
    </div>
  );
};

export default Page;
