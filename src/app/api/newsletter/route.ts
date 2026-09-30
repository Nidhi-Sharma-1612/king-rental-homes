import { emailConfigured, env } from "@/lib/server/env";
import { layout, para, rows, sendMail, textRows } from "@/lib/server/email";
import { clientIp, rateLimited } from "@/lib/server/rateLimit";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/newsletter { email } → notifies the host of a new subscriber (no mailing-list provider yet)
export async function POST(request: Request) {
  if (!emailConfigured()) return Response.json({ error: "Sign-up isn't available right now." }, { status: 503 });
  if (rateLimited(`newsletter:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
    return Response.json({ error: "Please try again later." }, { status: 429 });
  }
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (body && String(body.company ?? "").trim()) return Response.json({ ok: true }); // honeypot
  const email = String(body?.email ?? "").trim().slice(0, 200);
  if (!EMAIL.test(email)) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });

  const details: [string, unknown][] = [["Email", email], ["Signed up", new Date().toUTCString()]];
  const ok = await sendMail({
    to: env.emailTo,
    replyTo: email,
    subject: `New newsletter sign-up: ${email}`,
    html: layout("New newsletter sign-up", para("Someone asked to hear about open dates and offers. Add them to your mailing list.") + rows(details)),
    text: `New newsletter sign-up. Add them to your mailing list.\n\n${textRows(details)}`,
  });
  if (!ok) return Response.json({ error: "We couldn't sign you up right now. Please try again." }, { status: 502 });
  return Response.json({ ok: true });
}
