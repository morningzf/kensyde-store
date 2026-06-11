"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { OrderSummary } from "@/components/OrderSummary";
import { useCart } from "@/context/CartContext";
import { trackEvent } from "@/lib/analytics";

const fields = [
  ["email", "Email", "email"],
  ["name", "Full Name", "text"],
  ["phone", "Phone Number", "tel"],
  ["address", "Address", "text"],
  ["city", "City", "text"],
  ["state", "State / Province", "text"],
  ["postal", "Postal Code", "text"]
] as const;

export function CheckoutClient() {
  const { items, subtotal } = useCart();
  const [payment, setPayment] = useState<"Stripe" | "PayPal">("Stripe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Record<string, string>>({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal: "",
    country: "United States"
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (payment !== "Stripe") {
        throw new Error("PayPal is coming soon. Please use Credit Card / Stripe for checkout.");
      }

      trackEvent({ eventType: "checkout_started" });
      const response = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: form })
      });
      const paymentData = await response.json();

      if (!response.ok) {
        throw new Error(paymentData.error || "Unable to start checkout.");
      }

      const redirectUrl = paymentData.checkoutUrl;

      if (!redirectUrl) {
        throw new Error("Stripe Checkout URL was not returned.");
      }

      window.location.href = redirectUrl;
      return;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream">
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[1fr_24rem] lg:px-8">
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">Secure Checkout</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-navy md:text-5xl">Checkout</h1>

          <form onSubmit={handleSubmit} className="mt-10 rounded-lg border border-line bg-white p-6 shadow-sm md:p-8">
            <h2 className="font-heading text-xl font-semibold text-navy">Shipping Information</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {fields.map(([name, label, type]) => (
                <label key={name} className={name === "address" ? "md:col-span-2" : ""}>
                  <span className="font-heading text-sm font-semibold text-charcoal">{label}</span>
                  <input
                    required
                    type={type}
                    value={form[name]}
                    onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}
                    className="mt-2 min-h-12 w-full rounded border border-line bg-cream px-4 outline-none focus:border-sand"
                  />
                </label>
              ))}
              <label>
                <span className="font-heading text-sm font-semibold text-charcoal">Country</span>
                <select
                  required
                  value={form.country}
                  onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))}
                  className="mt-2 min-h-12 w-full rounded border border-line bg-cream px-4 outline-none focus:border-sand"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </label>
            </div>

            <div className="mt-8">
              <h2 className="font-heading text-xl font-semibold text-navy">Payment Method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {([
                  { value: "Stripe", label: "Credit Card / Stripe" },
                  { value: "PayPal", label: "PayPal" }
                ] as const).map((method) => (
                  <button
                    type="button"
                    key={method.value}
                    onClick={() => setPayment(method.value)}
                    disabled={method.value === "PayPal"}
                    className={`rounded border p-4 text-left font-heading text-sm font-semibold ${
                      payment === method.value
                        ? "border-navy bg-navy text-white"
                        : method.value === "PayPal"
                          ? "cursor-not-allowed border-line bg-white text-muted"
                          : "border-line bg-cream text-charcoal"
                    }`}
                  >
                    {method.label}
                    {method.value === "PayPal" && <span className="mt-1 block text-xs font-medium">Coming soon</span>}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted">Secure checkout is processed by Stripe.</p>
            </div>

            {error && (
              <div className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" variant="secondary" className="mt-8 w-full" disabled={loading || items.length === 0}>
              {loading ? "Placing order..." : "Place Order"}
            </Button>
          </form>
        </div>
        <OrderSummary />
      </section>
    </div>
  );
}
