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

const money = (value: unknown, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(Number(value));

const orderItemRows = (order: OrderEmailData) =>
  order.items
    .map(
      (item) => `
        <tr>
          <td>${item.productName}</td>
          <td>${item.color}</td>
          <td>${item.capacity}</td>
          <td>${item.quantity}</td>
          <td>${money(item.totalPrice, order.currency)}</td>
        </tr>
      `
    )
    .join("");

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
  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td>${item.sku}</td>
          <td>${item.productName}</td>
          <td>${item.color}</td>
          <td>${item.capacity}</td>
          <td>${item.quantity}</td>
          <td>${money(item.unitPrice, order.currency)}</td>
          <td>${money(item.totalPrice, order.currency)}</td>
        </tr>
      `
    )
    .join("");

  return sendEmail({
    to,
    subject: `KENSYDE paid order ${order.orderNumber}`,
    replyTo: order.customerEmail,
    html: `
      <h2>New paid KENSYDE order</h2>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Shipping Address:</strong><br />
        ${order.shippingAddress}<br />
        ${order.city}, ${order.state} ${order.postalCode}<br />
        ${order.country}
      </p>
      <p><strong>Total:</strong> ${money(order.total, order.currency)}</p>
      <p><strong>Stripe Session ID:</strong> ${order.stripeSessionId || ""}</p>
      <table border="1" cellpadding="8" cellspacing="0">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product</th>
            <th>Color</th>
            <th>Capacity</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
    `
  });
}

export async function sendCustomerOrderConfirmation(order: OrderEmailData) {
  return sendEmail({
    to: order.customerEmail,
    subject: `KENSYDE order confirmation ${order.orderNumber}`,
    replyTo: "support@kensyde.com",
    html: `
      <h2>Thank you for your KENSYDE order</h2>
      <p>Hi ${order.customerName},</p>
      <p>Your payment has been confirmed and we are preparing your order.</p>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Total:</strong> ${money(order.total, order.currency)}</p>
      <p><strong>Shipping Address:</strong><br />
        ${order.shippingAddress}<br />
        ${order.city}, ${order.state} ${order.postalCode}<br />
        ${order.country}
      </p>
      <table border="1" cellpadding="8" cellspacing="0">
        <thead>
          <tr>
            <th>Product</th>
            <th>Color</th>
            <th>Capacity</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${orderItemRows(order)}</tbody>
      </table>
      <p>For product or order support, reply to this email or contact support@kensyde.com.</p>
    `
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
    html: `
      <h2>Your KENSYDE order has been ${refundDescription}</h2>
      <p>Hi ${order.customerName},</p>
      <p>A refund of <strong>${money(refundedAmount, order.currency)}</strong> has been issued for order
        <strong>${order.orderNumber}</strong>.</p>
      <p>Refund timing depends on your bank or card provider.</p>
      <p>For questions, reply to this email or contact support@kensyde.com.</p>
    `
  });
}
