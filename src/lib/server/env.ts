import "server-only";

/** Server-side configuration. Values come from .env.local (see .env.example). */
export const env = {
  hostaway: {
    accountId: process.env.HOSTAWAY_ACCOUNT_ID?.trim() ?? "",
    apiSecret: process.env.HOSTAWAY_API_SECRET?.trim() ?? "",
    accessToken: process.env.HOSTAWAY_ACCESS_TOKEN?.trim() ?? "",
    currency: (process.env.HOSTAWAY_CURRENCY?.trim() || "USD").toUpperCase(),
    // Only for testing against a mock server; leave unset in production.
    apiUrl: (process.env.HOSTAWAY_API_URL?.trim() || "https://api.hostaway.com/v1").replace(/\/$/, ""),
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY?.trim() ?? "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? "",
    // Only for testing against a mock server (e.g. "http://localhost:12111"); leave unset in production.
    apiHost: process.env.STRIPE_API_HOST?.trim() ?? "",
  },
  smtp: {
    host: process.env.SMTP_HOST?.trim() ?? "",
    port: Number(process.env.SMTP_PORT?.trim() || 465),
    user: process.env.SMTP_USER?.trim() ?? "",
    pass: process.env.SMTP_PASS?.replace(/\s+/g, "") ?? "", // Google shows app passwords with spaces
  },
  /** Sender shown to recipients, e.g. "King Rental Homes <todd@kingrentalhomes.com>" */
  emailFrom: process.env.EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || "",
  /** Where contact messages and booking alerts go */
  emailTo: process.env.EMAIL_TO?.trim() || process.env.SMTP_USER?.trim() || "",
  /** Optional: protects /api/booking/reconcile for a scheduled job (e.g. Vercel Cron) */
  cronSecret: process.env.CRON_SECRET?.trim() ?? "",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000").replace(/\/$/, ""),
};

export const hostawayConfigured = () => Boolean(env.hostaway.accessToken || (env.hostaway.accountId && env.hostaway.apiSecret));
export const stripeConfigured = () => Boolean(env.stripe.secretKey);
export const emailConfigured = () => Boolean(env.smtp.host && env.smtp.user && env.smtp.pass && env.emailTo);

/** Online booking needs both: live prices/availability from Hostaway and payments through Stripe. */
export const bookingEnabled = () => hostawayConfigured() && stripeConfigured();
