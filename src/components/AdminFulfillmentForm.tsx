"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminFulfillmentFormProps = {
  orderId: string;
  initialStatus: string;
  initialCarrier: string;
  initialTrackingNumber: string;
  initialNote: string;
};

const fieldClass = "mt-2 min-h-11 w-full rounded border border-line bg-cream px-3 text-sm outline-none focus:border-sand";

export function AdminFulfillmentForm({
  orderId,
  initialStatus,
  initialCarrier,
  initialTrackingNumber,
  initialNote
}: AdminFulfillmentFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [carrier, setCarrier] = useState(initialCarrier);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [adminNote, setAdminNote] = useState(initialNote);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillmentStatus: status, carrier, trackingNumber, adminNote })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update order.");
      }

      setMessage("Order operations updated.");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to update order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-base font-semibold text-navy">Fulfillment & Notes</h2>
          <p className="mt-1 text-xs leading-5 text-muted">Internal operations only. Payment status remains controlled by Stripe.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-muted">Fulfillment Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={fieldClass}>
            <option value="unfulfilled">Unfulfilled</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </label>
        <label>
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-muted">Carrier</span>
          <input value={carrier} onChange={(event) => setCarrier(event.target.value)} placeholder="UPS, USPS, DHL..." className={fieldClass} />
        </label>
        <label className="sm:col-span-2">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-muted">Tracking Number</span>
          <input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} className={fieldClass} />
        </label>
        <label className="sm:col-span-2">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-muted">Internal Note</span>
          <textarea
            value={adminNote}
            onChange={(event) => setAdminNote(event.target.value)}
            rows={5}
            placeholder="Packing notes, customer request, follow-up..."
            className={`${fieldClass} py-3`}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded bg-sand px-5 font-heading text-sm font-semibold text-navy hover:bg-[#C7A975] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={16} aria-hidden="true" />
        {saving ? "Saving..." : "Save Operations"}
      </button>
      {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </form>
  );
}
