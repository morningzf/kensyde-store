"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/Button";

export function ContactClient() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    setStatus("");
    setError("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Please try again.");
      return;
    }

    setStatus("Message sent. The KENSYDE team will follow up by email.");
    formElement.reset();
  };

  return (
    <div className="bg-cream">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.75fr_1fr] lg:px-8">
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">Contact</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-navy md:text-5xl">How Can We Help?</h1>
          <p className="mt-5 leading-7 text-muted">
            Send product questions, order support requests, or partnership inquiries through the form.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-lg border border-line bg-white p-5">
            <Mail size={22} className="text-sand" aria-hidden="true" />
            <a href="mailto:support@kensyde.com" className="font-heading font-semibold text-navy">
              support@kensyde.com
            </a>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-lg border border-line bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="font-heading text-sm font-semibold text-charcoal">Name</span>
              <input name="name" required className="mt-2 min-h-12 w-full rounded border border-line bg-cream px-4 outline-none focus:border-sand" />
            </label>
            <label>
              <span className="font-heading text-sm font-semibold text-charcoal">Email</span>
              <input name="email" type="email" required className="mt-2 min-h-12 w-full rounded border border-line bg-cream px-4 outline-none focus:border-sand" />
            </label>
            <label className="md:col-span-2">
              <span className="font-heading text-sm font-semibold text-charcoal">Subject</span>
              <input name="subject" required className="mt-2 min-h-12 w-full rounded border border-line bg-cream px-4 outline-none focus:border-sand" />
            </label>
            <label className="md:col-span-2">
              <span className="font-heading text-sm font-semibold text-charcoal">Message</span>
              <textarea name="message" required rows={7} className="mt-2 w-full rounded border border-line bg-cream px-4 py-3 outline-none focus:border-sand" />
            </label>
          </div>
          <Button type="submit" variant="secondary" className="mt-6">
            Send Message
          </Button>
          {status && <p className="mt-4 text-sm text-muted">{status}</p>}
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        </form>
      </section>
    </div>
  );
}
