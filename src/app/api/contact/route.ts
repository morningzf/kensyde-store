import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

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

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes("replace_me")) {
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const to = process.env.CONTACT_TO_EMAIL || "support@kensyde.com";

  try {
    await sendEmail({
      to,
      subject: `KENSYDE contact: ${body.subject}`,
      replyTo: body.email,
      html: `
        <h2>New KENSYDE contact message</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Subject:</strong> ${body.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message?.replace(/\n/g, "<br />")}</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email failed", error);
    return NextResponse.json({ error: "Unable to send message." }, { status: 500 });
  }
}
