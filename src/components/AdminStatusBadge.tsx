const statusStyles: Record<string, string> = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  failed: "border-red-200 bg-red-50 text-red-800",
  cancelled: "border-line bg-cream text-muted",
  refunded: "border-blue-200 bg-blue-50 text-blue-800",
  partially_refunded: "border-blue-200 bg-blue-50 text-blue-800"
};

export function AdminStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 font-heading text-[11px] font-semibold uppercase tracking-[0.08em] ${
        statusStyles[status] || "border-line bg-cream text-muted"
      }`}
    >
      {paymentStatusLabel(status)}
    </span>
  );
}

const fulfillmentStyles: Record<string, string> = {
  unfulfilled: "border-line bg-cream text-muted",
  processing: "border-amber-200 bg-amber-50 text-amber-800",
  shipped: "border-blue-200 bg-blue-50 text-blue-800",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-800"
};

export function AdminFulfillmentBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 font-heading text-[11px] font-semibold uppercase tracking-[0.08em] ${
        fulfillmentStyles[status] || fulfillmentStyles.unfulfilled
      }`}
    >
      {fulfillmentStatusLabel(status)}
    </span>
  );
}
import { fulfillmentStatusLabel, paymentStatusLabel } from "@/lib/adminLocale";
