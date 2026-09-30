import "server-only";
import nodemailer from "nodemailer";
import { emailConfigured, env } from "@/lib/server/env";
import { site } from "@/data/site";

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransport() {
  transport ??= nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465, // 465 = TLS from the start; 587 = STARTTLS
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
  return transport;
}

export interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/** Sends an email. Returns false (and logs) instead of throwing, so email trouble never breaks a booking. */
export async function sendMail(mail: Mail): Promise<boolean> {
  if (!emailConfigured()) {
    console.warn(`[email] not configured, skipped: ${mail.subject}`);
    return false;
  }
  try {
    await getTransport().sendMail({ from: env.emailFrom, ...mail });
    return true;
  } catch (error) {
    console.error(`[email] failed: ${mail.subject}`, error);
    return false;
  }
}

export function verifyEmail() {
  return getTransport().verify();
}

// ── Templates ───────────────────────────────────────────────────────────────
export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Minimal, email-client-safe layout (tables + inline styles) in the site's colors. */
export function layout(title: string, body: string, footer = `${site.name} · ${site.phone} · ${site.email}`) {
  return `<!doctype html><html><body style="margin:0;background:#f7f3ec;font-family:Helvetica,Arial,sans-serif;color:#22282b">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ec;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffdf9;border-radius:16px;overflow:hidden;border:1px solid #e3ddd2">
<tr><td style="background:#1f3f4c;padding:22px 28px;color:#eef4e2;font-family:Georgia,serif;font-size:20px">${esc(site.name)}</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:normal;font-size:24px;color:#1f3f4c">${esc(title)}</h1>
${body}
</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid #e3ddd2;font-size:12px;color:#5e6a6e">${esc(footer)}</td></tr>
</table></td></tr></table></body></html>`;
}

/** A two-column details table. Values are escaped. */
export function rows(pairs: [string, unknown][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse">${pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:#5e6a6e;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;font-weight:600;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("")}</table>`;
}

export const textRows = (pairs: [string, unknown][]) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

export const para = (s: string) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.6">${s}</p>`;
