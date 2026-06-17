"use client";

import Image from "next/image";
import { ArrowRight, Clock3, Handshake, Mail, MessageSquareText, PackageCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/Button";

const supportTopics = [
  {
    title: "Order Support",
    text: "Questions about checkout, payment status, shipping updates, or an existing order.",
    icon: PackageCheck
  },
  {
    title: "Product Questions",
    text: "Need help choosing a color, checking product details, or understanding everyday care.",
    icon: MessageSquareText
  },
  {
    title: "Partnerships",
    text: "Wholesale, collaboration, or brand inquiries can be sent through the same support line.",
    icon: Handshake
  }
];

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
    <div className="bg-[#f5f1e9] text-ink">
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex min-h-[430px] flex-col justify-end px-6 py-12 md:px-10 lg:px-14 lg:py-16">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-clay">KENSYDE Support</p>
            <h1 className="mt-5 max-w-xl text-5xl font-extrabold leading-[0.98] tracking-[-0.04em] text-black md:text-6xl lg:text-7xl">
              How can we help?
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-black/65 md:text-lg">
              Send us your product questions, order support requests, or partnership inquiries. The KENSYDE team will
              follow up by email.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href="mailto:support@kensyde.com"
                className="group flex min-h-16 items-center justify-between border border-black/15 bg-[#f8f5ef] px-5 text-sm font-bold text-black transition hover:border-black"
              >
                <span className="inline-flex items-center gap-3">
                  <Mail size={18} aria-hidden="true" />
                  support@kensyde.com
                </span>
                <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <div className="flex min-h-16 items-center gap-3 border border-black/15 bg-[#f8f5ef] px-5 text-sm font-bold text-black">
                <Clock3 size={18} aria-hidden="true" />
                Email support only
              </div>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden bg-black lg:min-h-[520px]">
            <Image
              src="/lifestyle/quiet-carry-v2/scene-work.jpg"
              alt="KENSYDE tumbler on a quiet work desk with daily carry essentials"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 border border-white/25 bg-black/45 p-5 text-white backdrop-blur-sm md:bottom-8 md:left-8 md:right-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/70">Before you write</p>
              <p className="mt-2 text-xl font-extrabold leading-tight md:text-2xl">
                Include your order number if your message is about a purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:px-10 lg:grid-cols-[0.72fr_1fr] lg:px-14 lg:py-16">
        <div className="space-y-4">
          {supportTopics.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="border border-black/10 bg-white p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-white">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-lg font-extrabold tracking-[-0.02em] text-black">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-black/60">{item.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="border border-black bg-black p-6 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/55">Support note</p>
            <p className="mt-3 text-sm leading-6 text-white/80">
              We do not list a phone number or physical address until official service details are finalized. For now,
              support@kensyde.com is the confirmed customer support contact.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(29,29,27,0.07)] md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-clay">Contact Form</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-black md:text-4xl">Send a message</h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-black/55">Fields marked by the form are required.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-black/70">Name</span>
              <input
                name="name"
                required
                className="mt-2 min-h-12 w-full border border-black/15 bg-[#f8f5ef] px-4 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </label>
            <label>
              <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-black/70">Email</span>
              <input
                name="email"
                type="email"
                required
                className="mt-2 min-h-12 w-full border border-black/15 bg-[#f8f5ef] px-4 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </label>
            <label className="md:col-span-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-black/70">Subject</span>
              <input
                name="subject"
                required
                className="mt-2 min-h-12 w-full border border-black/15 bg-[#f8f5ef] px-4 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </label>
            <label className="md:col-span-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-black/70">Message</span>
              <textarea
                name="message"
                required
                rows={8}
                className="mt-2 w-full resize-none border border-black/15 bg-[#f8f5ef] px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </label>
          </div>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button type="submit" className="min-w-44 rounded-none bg-black text-white hover:bg-black/85">
              Send Message
            </Button>
            <p className="text-sm leading-6 text-black/55">We will reply from support@kensyde.com.</p>
          </div>
          {status && <p className="mt-5 border border-sage/30 bg-sage/10 px-4 py-3 text-sm font-semibold text-black">{status}</p>}
          {error && <p className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
        </form>
      </section>
    </div>
  );
}
