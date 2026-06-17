import { NextResponse } from "next/server";
import { brandEmailTemplate, escapeHtml, sendEmail } from "@/lib/email";

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
      html: brandEmailTemplate({
        eyebrow: "Contact Form",
        title: "New customer message",
        intro: "A visitor submitted a message through the KENSYDE contact page.",
        body: `
          <div style="border-top:1px solid #ebe5dc;padding:22px 0;">
            <h2 style="margin:0 0 12px;color:#111111;font-size:14px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;">Customer Details</h2>
            <table role="presentation" style="width:100%;border-collapse:collapse;" cellPadding="0" cellSpacing="0">
              <tr>
                <td style="padding:13px 0;border-bottom:1px solid #f0ebe4;color:#222222;font-size:13px;"><strong>Name</strong></td>
                <td style="padding:13px 0;border-bottom:1px solid #f0ebe4;color:#222222;font-size:13px;text-align:right;">${escapeHtml(normalized.name)}</td>
              </tr>
              <tr>
                <td style="padding:13px 0;border-bottom:1px solid #f0ebe4;color:#222222;font-size:13px;"><strong>Email</strong></td>
                <td style="padding:13px 0;border-bottom:1px solid #f0ebe4;color:#222222;font-size:13px;text-align:right;">${escapeHtml(normalized.email)}</td>
              </tr>
              <tr>
                <td style="padding:13px 0;border-bottom:1px solid #f0ebe4;color:#222222;font-size:13px;"><strong>Subject</strong></td>
                <td style="padding:13px 0;border-bottom:1px solid #f0ebe4;color:#222222;font-size:13px;text-align:right;">${escapeHtml(normalized.subject)}</td>
              </tr>
            </table>
          </div>
          <div style="border-top:1px solid #ebe5dc;padding:22px 0;">
            <h2 style="margin:0 0 12px;color:#111111;font-size:14px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;">Message</h2>
            <div style="background:#f7f3ed;border:1px solid #e8e1d8;padding:16px;color:#5f5952;font-size:14px;line-height:1.7;">
              ${escapeHtml(normalized.message).replace(/\n/g, "<br />")}
            </div>
          </div>
        `,
        ctaLabel: "Reply By Email",
        ctaHref: `mailto:${normalized.email}`,
        footerNote: "This message was sent from the KENSYDE website contact form."
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email failed", error);
    return NextResponse.json({ error: "Unable to send message." }, { status: 500 });
  }
}
