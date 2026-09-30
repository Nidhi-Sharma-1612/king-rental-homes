import { emailConfigured, env } from "@/lib/server/env";
import { layout, para, rows, sendMail, textRows } from "@/lib/server/email";
import { clientIp, rateLimited } from "@/lib/server/rateLimit";
import { site } from "@/data/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

// POST /api/contact — contact page and co-hosting enquiries → emailed to the host (reply-to: the sender)
export async function POST(request: Request) {
  if (!emailConfigured()) {
    return Response.json({ error: `Our message form isn't available right now. Please email us at ${site.email}.` }, { status: 503 });
  }
  if (rateLimited(`contact:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
    return Response.json({ error: "You've sent a few messages already. Please try again in a few minutes." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Invalid request." }, { status: 400 });
  if (clip(body.company, 200)) return Response.json({ ok: true }); // honeypot: bots fill hidden fields

  const firstName = clip(body.firstName, 80);
  const lastName = clip(body.lastName, 80);
  const email = clip(body.email, 200);
  const message = clip(body.message, 5000);
  if (!firstName || !lastName || !EMAIL.test(email) || message.length < 10) {
    return Response.json({ error: "Please fill in your name, a valid email and a short message." }, { status: 400 });
  }
  const topic = clip(body.topic, 60) || clip(body.context, 60) || "General enquiry";
  const details: [string, unknown][] = [
    ["Topic", topic],
    ["Name", `${firstName} ${lastName}`],
    ["Email", email],
    ["Phone", clip(body.phone, 40)],
    ["Heard about us", clip(body.source, 40)],
    ["Message", message],
  ];

  const ok = await sendMail({
    to: env.emailTo,
    replyTo: `${firstName} ${lastName} <${email}>`,
    subject: `Website message (${topic}) from ${firstName} ${lastName}`,
    html: layout("New website message", para("Reply to this email to answer them directly.") + rows(details)),
    text: `New website message. Reply to this email to answer them directly.\n\n${textRows(details)}`,
  });
  if (!ok) return Response.json({ error: `We couldn't send your message. Please email us at ${site.email}.` }, { status: 502 });
  return Response.json({ ok: true });
}
