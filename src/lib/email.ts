type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

type OrderEmailItem = {
  sku: string;
  productName: string;
  color: string;
  capacity: string;
  quantity: number;
  unitPrice: unknown;
  totalPrice: unknown;
};

type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  shippingAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  total: unknown;
  currency: string;
  stripeSessionId: string | null;
  items: OrderEmailItem[];
};

const fromEmail = "KENSYDE <support@kensyde.com>";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kensyde.com";

export const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const money = (value: unknown, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(Number(value));

const emailStyles = {
  page: "margin:0;background:#f4f1ea;padding:0;font-family:Arial,Helvetica,sans-serif;color:#161616;",
  shell: "width:100%;background:#f4f1ea;padding:28px 12px;",
  card:
    "width:100%;max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5ded3;border-radius:0;overflow:hidden;",
  topbar: "background:#111111;color:#ffffff;text-align:center;padding:10px 18px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;",
  header: "padding:28px 32px 20px;border-bottom:1px solid #ebe5dc;",
  logo: "font-size:22px;line-height:1;font-weight:800;letter-spacing:0.18em;color:#111111;margin:0;",
  eyebrow: "margin:26px 0 10px;color:#9a745d;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;",
  h1: "margin:0;color:#111111;font-size:30px;line-height:1.12;font-weight:800;",
  intro: "margin:14px 0 0;color:#55504a;font-size:15px;line-height:1.7;",
  body: "padding:0 32px 30px;",
  section: "border-top:1px solid #ebe5dc;padding:22px 0;",
  sectionTitle: "margin:0 0 12px;color:#111111;font-size:14px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;",
  muted: "color:#6f6961;font-size:13px;line-height:1.65;",
  table: "width:100%;border-collapse:collapse;",
  th: "padding:10px 0;border-bottom:1px solid #e8e1d8;color:#756f68;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;text-align:left;",
  td: "padding:13px 0;border-bottom:1px solid #f0ebe4;color:#222222;font-size:13px;line-height:1.45;text-align:left;vertical-align:top;",
  totalRow: "padding:13px 0;border-top:1px solid #111111;color:#111111;font-size:16px;font-weight:800;",
  button:
    "display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:14px 22px;font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;",
  note: "background:#f7f3ed;border:1px solid #e8e1d8;padding:14px 16px;color:#5f5952;font-size:13px;line-height:1.6;",
  footer:
    "background:#111111;color:#d9d1c7;text-align:center;padding:22px 28px;font-size:12px;line-height:1.7;"
};

type BrandEmailTemplateOptions = {
  eyebrow?: string;
  title: string;
  intro?: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  footerNote?: string;
};

export function brandEmailTemplate({
  eyebrow = "KENSYDE",
  title,
  intro,
  body,
  ctaLabel,
  ctaHref,
  footerNote = "For product or order support, reply to this email or contact support@kensyde.com."
}: BrandEmailTemplateOptions) {
  const cta =
    ctaLabel && ctaHref
      ? `<div style="padding-top:6px;"><a href="${escapeHtml(ctaHref)}" style="${emailStyles.button}">${escapeHtml(
          ctaLabel
        )}</a></div>`
      : "";

  return `
    <!doctype html>
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="${emailStyles.page}">
        <div style="${emailStyles.shell}">
          <table role="presentation" style="${emailStyles.card}" cellPadding="0" cellSpacing="0">
            <tr>
              <td style="${emailStyles.topbar}">Compact drinkware for everyday flow</td>
            </tr>
            <tr>
              <td style="${emailStyles.header}">
                <p style="${emailStyles.logo}">KENSYDE</p>
                <p style="${emailStyles.eyebrow}">${escapeHtml(eyebrow)}</p>
                <h1 style="${emailStyles.h1}">${escapeHtml(title)}</h1>
                ${intro ? `<p style="${emailStyles.intro}">${intro}</p>` : ""}
              </td>
            </tr>
            <tr>
              <td style="${emailStyles.body}">
                ${body}
                ${cta}
              </td>
            </tr>
            <tr>
              <td style="${emailStyles.footer}">
                <strong style="color:#ffffff;">KENSYDE</strong><br />
                ${escapeHtml(footerNote)}<br />
                <span style="color:#9f968d;">United States / United Kingdom / Germany / France</span>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `;
}

const section = (title: string, content: string) => `
  <div style="${emailStyles.section}">
    <h2 style="${emailStyles.sectionTitle}">${escapeHtml(title)}</h2>
    ${content}
  </div>
`;

const addressBlock = (order: OrderEmailData) => `
  <p style="${emailStyles.muted};margin:0;">
    ${escapeHtml(order.customerName)}<br />
    ${escapeHtml(order.shippingAddress)}<br />
    ${escapeHtml(order.city)}, ${escapeHtml(order.state)} ${escapeHtml(order.postalCode)}<br />
    ${escapeHtml(order.country)}
  </p>
`;

const orderSummaryBlock = (order: OrderEmailData) => `
  <table role="presentation" style="${emailStyles.table}" cellPadding="0" cellSpacing="0">
    <tr>
      <td style="${emailStyles.td}"><strong>Order Number</strong></td>
      <td style="${emailStyles.td};text-align:right;">${escapeHtml(order.orderNumber)}</td>
    </tr>
    <tr>
      <td style="${emailStyles.td}"><strong>Email</strong></td>
      <td style="${emailStyles.td};text-align:right;">${escapeHtml(order.customerEmail)}</td>
    </tr>
    <tr>
      <td style="${emailStyles.td}"><strong>Phone</strong></td>
      <td style="${emailStyles.td};text-align:right;">${escapeHtml(order.phone || "Not provided")}</td>
    </tr>
    <tr>
      <td style="${emailStyles.totalRow}">Total</td>
      <td style="${emailStyles.totalRow};text-align:right;">${money(order.total, order.currency)}</td>
    </tr>
  </table>
`;

const customerItemRows = (order: OrderEmailData) =>
  order.items
    .map(
      (item) => `
        <tr>
          <td style="${emailStyles.td}">
            <strong>${escapeHtml(item.productName)}</strong><br />
            <span style="color:#77716a;">${escapeHtml(item.color)} / ${escapeHtml(item.capacity)}</span>
          </td>
          <td style="${emailStyles.td};text-align:center;">${item.quantity}</td>
          <td style="${emailStyles.td};text-align:right;">${money(item.totalPrice, order.currency)}</td>
        </tr>
      `
    )
    .join("");

const customerItemsTable = (order: OrderEmailData) => `
  <table role="presentation" style="${emailStyles.table}" cellPadding="0" cellSpacing="0">
    <thead>
      <tr>
        <th style="${emailStyles.th}">Item</th>
        <th style="${emailStyles.th};text-align:center;">Qty</th>
        <th style="${emailStyles.th};text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>${customerItemRows(order)}</tbody>
  </table>
`;

const adminItemsTable = (order: OrderEmailData) => `
  <table role="presentation" style="${emailStyles.table}" cellPadding="0" cellSpacing="0">
    <thead>
      <tr>
        <th style="${emailStyles.th}">SKU</th>
        <th style="${emailStyles.th}">Product</th>
        <th style="${emailStyles.th}">Qty</th>
        <th style="${emailStyles.th};text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.items
        .map(
          (item) => `
            <tr>
              <td style="${emailStyles.td}">${escapeHtml(item.sku)}</td>
              <td style="${emailStyles.td}">
                <strong>${escapeHtml(item.productName)}</strong><br />
                <span style="color:#77716a;">${escapeHtml(item.color)} / ${escapeHtml(item.capacity)}</span>
              </td>
              <td style="${emailStyles.td}">${item.quantity}</td>
              <td style="${emailStyles.td};text-align:right;">${money(item.totalPrice, order.currency)}</td>
            </tr>
          `
        )
        .join("")}
    </tbody>
  </table>
`;

export async function sendEmail({ to, subject, html, replyTo }: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes("replace_me")) {
    console.warn("RESEND_API_KEY is not configured. Email was not sent.");
    return { skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject,
      html,
      reply_to: replyTo
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend email failed: ${text}`);
  }

  return response.json();
}

export async function sendOrderNotification(order: OrderEmailData) {
  const to = process.env.ORDER_NOTIFY_EMAIL || process.env.CONTACT_TO_EMAIL || "support@kensyde.com";

  return sendEmail({
    to,
    subject: `KENSYDE paid order ${order.orderNumber}`,
    replyTo: order.customerEmail,
    html: brandEmailTemplate({
      eyebrow: "Admin Notification",
      title: "New paid order",
      intro: `A paid KENSYDE order is ready for review.`,
      body:
        section("Customer", orderSummaryBlock(order)) +
        section("Ship To", addressBlock(order)) +
        section("Items", adminItemsTable(order)) +
        section(
          "Payment",
          `<p style="${emailStyles.muted};margin:0;"><strong>Stripe Session ID:</strong><br />${escapeHtml(
            order.stripeSessionId || ""
          )}</p>`
        ),
      ctaLabel: "Open Orders",
      ctaHref: `${siteUrl}/admin/orders`
    })
  });
}

export async function sendCustomerOrderConfirmation(order: OrderEmailData) {
  return sendEmail({
    to: order.customerEmail,
    subject: `KENSYDE order confirmation ${order.orderNumber}`,
    replyTo: "support@kensyde.com",
    html: brandEmailTemplate({
      eyebrow: "Order Confirmed",
      title: "Thank you for your order",
      intro: `Hi ${escapeHtml(order.customerName)}, your payment has been confirmed and we are preparing your KENSYDE order.`,
      body:
        section("Order Summary", orderSummaryBlock(order)) +
        section("Items", customerItemsTable(order)) +
        section("Shipping Address", addressBlock(order)) +
        section(
          "What happens next",
          `<div style="${emailStyles.note}">We will send another email when your order ships. Please keep this confirmation for your records.</div>`
        ),
      ctaLabel: "Visit KENSYDE",
      ctaHref: siteUrl
    })
  });
}

export async function sendCustomerRefundNotification(
  order: OrderEmailData,
  status: "refunded" | "partially_refunded",
  refundedAmount: number
) {
  const refundDescription = status === "refunded" ? "fully refunded" : "partially refunded";

  return sendEmail({
    to: order.customerEmail,
    subject: `KENSYDE refund update ${order.orderNumber}`,
    replyTo: "support@kensyde.com",
    html: brandEmailTemplate({
      eyebrow: "Refund Update",
      title: `Your order has been ${refundDescription}`,
      intro: `Hi ${escapeHtml(order.customerName)}, we have issued a refund update for your KENSYDE order.`,
      body:
        section(
          "Refund Details",
          `<table role="presentation" style="${emailStyles.table}" cellPadding="0" cellSpacing="0">
            <tr>
              <td style="${emailStyles.td}"><strong>Order Number</strong></td>
              <td style="${emailStyles.td};text-align:right;">${escapeHtml(order.orderNumber)}</td>
            </tr>
            <tr>
              <td style="${emailStyles.totalRow}">Refund Amount</td>
              <td style="${emailStyles.totalRow};text-align:right;">${money(refundedAmount, order.currency)}</td>
            </tr>
          </table>`
        ) +
        section(
          "Timing",
          `<div style="${emailStyles.note}">Refund timing depends on your bank or card provider.</div>`
        ),
      ctaLabel: "Contact Support",
      ctaHref: `mailto:support@kensyde.com`
    })
  });
}

export async function sendCustomerShippingNotification(
  order: OrderEmailData,
  carrier: string,
  trackingNumber: string
) {
  return sendEmail({
    to: order.customerEmail,
    subject: `Your KENSYDE order has shipped ${order.orderNumber}`,
    replyTo: "support@kensyde.com",
    html: brandEmailTemplate({
      eyebrow: "Shipping Update",
      title: "Your order is on the way",
      intro: `Hi ${escapeHtml(order.customerName)}, your KENSYDE order has shipped.`,
      body:
        section(
          "Tracking",
          `<table role="presentation" style="${emailStyles.table}" cellPadding="0" cellSpacing="0">
            <tr>
              <td style="${emailStyles.td}"><strong>Order Number</strong></td>
              <td style="${emailStyles.td};text-align:right;">${escapeHtml(order.orderNumber)}</td>
            </tr>
            <tr>
              <td style="${emailStyles.td}"><strong>Carrier</strong></td>
              <td style="${emailStyles.td};text-align:right;">${escapeHtml(carrier)}</td>
            </tr>
            <tr>
              <td style="${emailStyles.totalRow}">Tracking Number</td>
              <td style="${emailStyles.totalRow};text-align:right;">${escapeHtml(trackingNumber)}</td>
            </tr>
          </table>`
        ) +
        section("Items", customerItemsTable(order)) +
        section("Shipping Address", addressBlock(order)),
      ctaLabel: "Contact Support",
      ctaHref: `mailto:support@kensyde.com`
    })
  });
}
