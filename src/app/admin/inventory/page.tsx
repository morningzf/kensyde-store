import Image from "next/image";
import { redirect } from "next/navigation";
import { products } from "@/data/products";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { ensureInventoryRecords } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage({
  searchParams
}: {
  searchParams: { updated?: string };
}) {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  await ensureInventoryRecords();
  const records = await prisma.inventory.findMany({ orderBy: { sku: "asc" } });
  const inventory = new Map(records.map((record) => [record.sku, record]));
  const totalUnits = records.reduce((sum, record) => sum + record.quantity, 0);
  const lowStock = records.filter((record) => record.quantity > 0 && record.quantity <= record.lowStockThreshold).length;
  const outOfStock = records.filter((record) => record.quantity <= 0).length;

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="border-b border-line pb-7">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">KENSYDE Admin</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">Inventory</h1>
        <p className="mt-2 text-sm text-muted">Review stock levels and update low-stock thresholds for each SKU.</p>
      </div>

      {searchParams.updated ? (
        <p className="mt-5 rounded border border-[#B8D8C0] bg-[#F1F8F3] px-4 py-3 text-sm text-[#26643A]">
          Inventory updated.
        </p>
      ) : null}

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded border border-line bg-white p-5">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-muted">Total Units</p>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">{totalUnits}</p>
        </div>
        <div className="rounded border border-line bg-white p-5">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-muted">Low Stock SKUs</p>
          <p className="mt-2 font-heading text-2xl font-bold text-[#A56B14]">{lowStock}</p>
        </div>
        <div className="rounded border border-line bg-white p-5">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-muted">Out of Stock</p>
          <p className="mt-2 font-heading text-2xl font-bold text-[#A63B3B]">{outOfStock}</p>
        </div>
      </div>

      <div className="mt-7 overflow-hidden rounded border border-line bg-white">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-heading text-base font-semibold text-navy">Stock by SKU</h2>
          <p className="mt-1 text-xs text-muted">Paid Stripe orders automatically reduce inventory once.</p>
        </div>
        <div className="divide-y divide-line">
          {products.map((product) => {
            const record = inventory.get(product.sku);
            const quantity = record?.quantity || 0;
            const threshold = record?.lowStockThreshold || 10;
            const status = quantity <= 0 ? "Out of stock" : quantity <= threshold ? "Low stock" : "In stock";
            const statusClass =
              quantity <= 0
                ? "border-[#F2B8B8] bg-[#FFF2F2] text-[#A63B3B]"
                : quantity <= threshold
                  ? "border-[#EBCB87] bg-[#FFF9E9] text-[#98600B]"
                  : "border-[#B8D8C0] bg-[#F1F8F3] text-[#26643A]";

            return (
              <div key={product.sku} className="grid gap-5 px-5 py-5 lg:grid-cols-[72px_1fr_420px] lg:items-center">
                <div className="relative h-[72px] w-[72px] rounded border border-line bg-cream">
                  <Image src={product.image} alt={product.altText} fill sizes="72px" className="object-contain p-2" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading font-semibold text-navy">{product.productSeries}</h3>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${statusClass}`}>
                      {status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-charcoal">{product.colorName} · {product.capacity}</p>
                  <p className="mt-1 text-xs text-muted">SKU: {product.sku}</p>
                </div>
                <form action={`/api/admin/inventory/${encodeURIComponent(product.sku)}`} method="post" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <label className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                    Quantity
                    <input
                      name="quantity"
                      type="number"
                      min="0"
                      max="999999"
                      defaultValue={quantity}
                      className="mt-2 min-h-10 w-full rounded border border-line bg-cream px-3 text-sm text-charcoal outline-none focus:border-sand"
                    />
                  </label>
                  <label className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                    Low-stock alert
                    <input
                      name="lowStockThreshold"
                      type="number"
                      min="0"
                      max="999999"
                      defaultValue={threshold}
                      className="mt-2 min-h-10 w-full rounded border border-line bg-cream px-3 text-sm text-charcoal outline-none focus:border-sand"
                    />
                  </label>
                  <button className="min-h-10 self-end rounded bg-sand px-4 font-heading text-sm font-semibold text-navy hover:bg-[#C7A975]">
                    Save
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
