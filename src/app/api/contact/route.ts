import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const required = ["name", "email", "subject", "message"];
  const missing = required.filter((field) => !body[field]);

  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing fields: ${missing.join(", ")}` }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    to: process.env.CONTACT_TO_EMAIL || "support@kensyde.com",
    message:
      "Contact form received. Connect this route to Resend, SendGrid, Postmark, or your preferred email provider."
  });
}
