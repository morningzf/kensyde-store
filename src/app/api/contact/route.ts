import { NextResponse } from "next/server";
import { escapeHtml, sendEmail } from "@/lib/email";

export const runtime = "nodejs";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ContactBody;
  const required: Array<keyof ContactBody> = ["name", "email", "subject", "message"];
  const missing = required.filter((field) => !body[field]?.trim());

  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing fields: ${missing.join(", ")}` }, { status: 400 });
  }

  const normalized = {
    name: body.name!.trim(),
    email: body.email!.trim(),
    subject: body.subject!.trim().replace(/[\r\n]+/g, " "),
    message: body.message!.trim()
  };

  if (!emailPattern.test(normalized.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (
    normalized.name.length > 120 ||
    normalized.email.length > 254 ||
    normalized.subject.length > 160 ||
    normalized.message.length > 5000
  ) {
    return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes("replace_me")) {
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const to = process.env.CONTACT_TO_EMAIL || "support@kensyde.com";

  try {
    await sendEmail({
      to,
      subject: `KENSYDE contact: ${normalized.subject}`,
      replyTo: normalized.email,
      html: `
        <h2>New KENSYDE contact message</h2>
        <p><strong>Name:</strong> ${escapeHtml(normalized.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(normalized.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(normalized.subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(normalized.message).replace(/\n/g, "<br />")}</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email failed", error);
    return NextResponse.json({ error: "Unable to send message." }, { status: 500 });
  }
}
