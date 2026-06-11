"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";

export function AdminLoginClient() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to sign in.");
      }

      router.replace("/admin/orders");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[65vh] max-w-md items-center px-5 py-12">
      <form onSubmit={submit} className="w-full rounded-lg border border-line bg-white p-7 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded bg-cream text-navy">
          <LockKeyhole size={20} aria-hidden="true" />
        </div>
        <p className="mt-6 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">Private Access</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">Order Admin</h1>
        <p className="mt-3 text-sm leading-6 text-muted">Sign in to review KENSYDE orders and payment status.</p>

        <label className="mt-7 block">
          <span className="font-heading text-sm font-semibold text-charcoal">Admin password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 min-h-12 w-full rounded border border-line bg-cream px-4 outline-none focus:border-sand"
          />
        </label>

        <Button type="submit" variant="secondary" className="mt-5 w-full" disabled={submitting}>
          {submitting ? "Signing In..." : "Sign In"}
        </Button>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      </form>
    </section>
  );
}
