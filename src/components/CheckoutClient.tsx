"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { OrderSummary } from "@/components/OrderSummary";
import { useCart } from "@/context/CartContext";

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
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [payment, setPayment] = useState<"Stripe" | "PayPal">("Stripe");
  const [loading, setLoading] = useState(false);
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

    const orderNo = `KEN-${Date.now().toString().slice(-8)}`;
    const shipping = items.length > 0 ? 6.95 : 0;
    const order = {
      orderNo,
      items,
      total: subtotal + shipping,
      shipping,
      payment,
      customer: form
    };

    window.sessionStorage.setItem("kensyde-last-order", JSON.stringify(order));
    const response = await fetch(payment === "Stripe" ? "/api/checkout/stripe" : "/api/checkout/paypal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });
    const paymentData = await response.json();
    const redirectUrl = paymentData.checkoutUrl || paymentData.approveUrl;

    if (redirectUrl && paymentData.mode !== "demo") {
      window.location.href = redirectUrl;
      return;
    }

    clearCart();
    router.push(`/order-confirmation?order=${orderNo}`);
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
                    className={`rounded border p-4 text-left font-heading text-sm font-semibold ${
                      payment === method.value ? "border-navy bg-navy text-white" : "border-line bg-cream text-charcoal"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted">Secure payment integration is currently in test mode.</p>
            </div>

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
