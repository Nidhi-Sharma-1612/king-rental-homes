import "server-only";
import { addDays, differenceInCalendarDays, format, isValid, parseISO, startOfToday } from "date-fns";
import type Stripe from "stripe";
import { bookingEnabled, env, hostawayConfigured } from "@/lib/server/env";
import { esc, layout, para, rows, sendMail, textRows } from "@/lib/server/email";
import { site } from "@/data/site";
import { createReservation, findReservations, getCalendar, getPriceDetails, type CalendarDay } from "@/lib/server/hostaway";
import { getStripe } from "@/lib/server/stripe";
import { getProperty } from "@/lib/properties";
import type { Property } from "@/lib/types";

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const MAX_NIGHTS = 90;
const MAX_PETS = 3;

export class BookingError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "BookingError";
  }
}

export interface StayRequest {
  property: Property;
  arrival: string; // YYYY-MM-DD
  departure: string; // YYYY-MM-DD
  adults: number;
  children: number;
  pets: number;
}

const int = (v: unknown, min: number, max: number, fallback: number) => {
  const n = typeof v === "number" ? v : Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.trunc(n))) : fallback;
};

/** Validates untrusted input from the browser. Never trust prices from the client — only these fields. */
export function parseStayRequest(input: unknown): StayRequest {
  const o = (input ?? {}) as Record<string, unknown>;
  const property = typeof o.slug === "string" ? getProperty(o.slug) : undefined;
  if (!property) throw new BookingError("Unknown home.");

  const arrival = String(o.arrival ?? "");
  const departure = String(o.departure ?? "");
  const a = parseISO(arrival);
  const d = parseISO(departure);
  if (!ISO.test(arrival) || !ISO.test(departure) || !isValid(a) || !isValid(d)) throw new BookingError("Please choose your dates.");
  if (differenceInCalendarDays(a, startOfToday()) < 0) throw new BookingError("Check-in can't be in the past.");
  const n = differenceInCalendarDays(d, a);
  if (n < 1) throw new BookingError("Check-out must be after check-in.");
  if (n > MAX_NIGHTS) throw new BookingError(`For stays longer than ${MAX_NIGHTS} nights, please contact us.`);

  const adults = int(o.adults, 1, property.guests, 1);
  const children = int(o.children, 0, property.guests - adults, 0);
  const pets = int(o.pets, 0, MAX_PETS, 0);
  return { property, arrival, departure, adults, children, pets };
}

// ── Availability ────────────────────────────────────────────────────────────
function byDate(days: CalendarDay[]) {
  return new Map(days.map((d) => [d.date, d]));
}

/** Why a stay can't be booked (guest-friendly), or null if it can. Pure: works on calendar data. */
export function stayProblem(days: CalendarDay[], arrival: string, departure: string): string | null {
  const byDay = byDate(days);
  const first = byDay.get(arrival);
  const nightsCount = differenceInCalendarDays(parseISO(departure), parseISO(arrival));
  for (let i = 0; i < nightsCount; i++) {
    const day = byDay.get(format(addDays(parseISO(arrival), i), "yyyy-MM-dd"));
    if (!day || !day.isAvailable) return "Sorry, those dates aren't available. Please try different dates.";
  }
  if (first?.closedOnArrival) return "Check-in isn't available on that date. Please pick another day.";
  if (byDay.get(departure)?.closedOnDeparture) return "Check-out isn't available on that date. Please pick another day.";
  if (first && first.minimumStay > nightsCount) return `These dates need a minimum stay of ${first.minimumStay} nights.`;
  if (first?.maximumStay && first.maximumStay < nightsCount) return `The maximum stay for these dates is ${first.maximumStay} nights.`;
  return null;
}

/** Throws a guest-friendly BookingError if the stay can't be booked. Always reads live data. */
export async function assertBookable(s: StayRequest) {
  const problem = stayProblem(await getCalendar(s.property.id, s.arrival, s.departure), s.arrival, s.departure);
  if (problem) throw new BookingError(problem, 409);
}

export type SearchAvailability = Record<string, { available: boolean; reason?: string }>;

/**
 * Checks every home for the searched dates (for the Properties page). Uses a short cache since it's only
 * for display — booking re-checks live. Returns null if Hostaway isn't configured or can't be reached,
 * so the page falls back to showing all homes.
 */
export async function searchAvailability(properties: Property[], arrival: string, departure: string): Promise<SearchAvailability | null> {
  if (!hostawayConfigured()) return null;
  try {
    const entries = await Promise.all(
      properties.map(async (p) => {
        const problem = stayProblem(await getCalendar(p.id, arrival, departure, { cacheSeconds: 60 }), arrival, departure);
        return [p.slug, problem ? { available: false, reason: problem } : { available: true }] as const;
      }),
    );
    return Object.fromEntries(entries);
  } catch (error) {
    console.error("[search] availability check failed", error);
    return null;
  }
}

/** Unavailable nights for the date picker, for the next `months` months. */
export async function getBlockedNights(property: Property, months = 12) {
  const start = startOfToday();
  const days = await getCalendar(property.id, format(start, "yyyy-MM-dd"), format(addDays(start, months * 31), "yyyy-MM-dd"), { cacheSeconds: 120 });
  return {
    blocked: days.filter((d) => !d.isAvailable).map((d) => d.date),
    noArrival: days.filter((d) => d.isAvailable && d.closedOnArrival).map((d) => d.date),
    minStay: Object.fromEntries(days.filter((d) => d.isAvailable && d.minimumStay > 1).map((d) => [d.date, d.minimumStay])),
  };
}

// ── Quote ───────────────────────────────────────────────────────────────────
export interface Quote {
  nights: number;
  currency: string;
  total: number;
  lines: { label: string; amount: number }[];
}

export async function quoteStay(s: StayRequest): Promise<Quote> {
  await assertBookable(s);
  const details = await getPriceDetails(s.property.id, s.arrival, s.departure, s.adults + s.children);
  const nightsCount = differenceInCalendarDays(parseISO(s.departure), parseISO(s.arrival));

  const included = details.components.filter((c) => c.isIncludedInTotalPrice && c.total !== 0);
  // Nightly rate components collapse into one "N nights" line; fees, taxes and discounts stay itemised.
  // Hostaway labels the nightly rate "accommodation" (older accounts/docs: "price").
  const isNightly = (c: { type: string }) => c.type === "accommodation" || c.type === "price";
  const stay = included.filter(isNightly).reduce((sum, c) => sum + c.total, 0);
  const lines = [
    ...(stay ? [{ label: `${nightsCount} night${nightsCount === 1 ? "" : "s"}`, amount: stay }] : []),
    ...included.filter((c) => !isNightly(c)).map((c) => ({ label: c.title || c.name, amount: c.total })),
  ];
  if (!(details.totalPrice > 0)) throw new BookingError("We couldn't price those dates. Please contact us.", 502);
  return { nights: nightsCount, currency: env.hostaway.currency, total: details.totalPrice, lines };
}

// ── Fulfilment ──────────────────────────────────────────────────────────────
export type BookingStatus = "confirmed" | "refunded" | "pending" | "unpaid";

const META = {
  slug: "slug",
  arrival: "arrival",
  departure: "departure",
  adults: "adults",
  children: "children",
  pets: "pets",
  total: "quoted_total",
  status: "booking_status",
  reservationId: "hostaway_reservation_id",
  refundReason: "refund_reason",
  notified: "emails_sent",
  alerted: "host_alerted",
  source: "source",
} as const;

/** Marks checkout sessions created by this site (the Stripe account may have others). */
const SOURCE = "kingrentalhomes-web";

export function stayMetadata(s: StayRequest, quote: Quote): Stripe.MetadataParam {
  return {
    [META.source]: SOURCE,
    [META.slug]: s.property.slug,
    [META.arrival]: s.arrival,
    [META.departure]: s.departure,
    [META.adults]: String(s.adults),
    [META.children]: String(s.children),
    [META.pets]: String(s.pets),
    [META.total]: String(quote.total),
  };
}

export function readStay(session: Stripe.Checkout.Session): StayRequest {
  const m = session.metadata ?? {};
  return parseStayRequestLenient({
    slug: m[META.slug],
    arrival: m[META.arrival],
    departure: m[META.departure],
    adults: m[META.adults],
    children: m[META.children],
    pets: m[META.pets],
  });
}

// After payment the arrival date may be "today"; skip the past-date check but keep the rest.
function parseStayRequestLenient(input: Record<string, unknown>): StayRequest {
  const property = typeof input.slug === "string" ? getProperty(input.slug) : undefined;
  if (!property) throw new BookingError("Unknown home in checkout session.", 500);
  return {
    property,
    arrival: String(input.arrival),
    departure: String(input.departure),
    adults: int(input.adults, 1, property.guests, 1),
    children: int(input.children, 0, property.guests, 0),
    pets: int(input.pets, 0, MAX_PETS, 0),
  };
}

// One in-flight fulfilment per session per server instance (webhook, confirmation page and sweep can race).
const inFlight = new Map<string, Promise<BookingStatus>>();

/**
 * Turns a paid Stripe Checkout session into a Hostaway reservation and emails guest + host.
 * Safe to call any number of times: from the confirmation page, the background sweep and (if configured) the webhook.
 */
export function fulfillCheckout(sessionId: string): Promise<BookingStatus> {
  const existing = inFlight.get(sessionId);
  if (existing) return existing;
  const job = doFulfill(sessionId).finally(() => inFlight.delete(sessionId));
  inFlight.set(sessionId, job);
  return job;
}

async function doFulfill(sessionId: string): Promise<BookingStatus> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") return "unpaid";

  const done = session.metadata?.[META.status];
  if (done === "confirmed" || done === "refunded") {
    await notifyOnce(session, done); // covers a crash between saving the status and sending email
    return done;
  }

  const stay = readStay(session);
  const email = session.customer_details?.email ?? session.customer_email ?? "";
  const findOurs = async () =>
    (await findReservations({ listingId: stay.property.id, arrivalDate: stay.arrival, guestEmail: email || undefined })).find((r) =>
      r.hostNote?.includes(session.id),
    );
  const settle = async (status: "confirmed" | "refunded", extra: Record<string, string> = {}) => {
    const updated = await stripe.checkout.sessions.update(session.id, { metadata: { [META.status]: status, ...extra } });
    await notifyOnce(updated, status);
    return status;
  };

  // Idempotency across instances: a reservation carrying this session id already exists?
  const already = await findOurs();
  if (already) return settle("confirmed", { [META.reservationId]: String(already.id) });

  try {
    await assertBookable(stay); // dates may have been taken on another channel while the guest was paying
    const [first, ...rest] = (session.customer_details?.name ?? "").trim().split(/\s+/);
    const reservation = await createReservation({
      listingMapId: stay.property.id,
      arrivalDate: stay.arrival,
      departureDate: stay.departure,
      guestFirstName: first || "Guest",
      guestLastName: rest.join(" "),
      guestEmail: email,
      phone: session.customer_details?.phone ?? undefined,
      adults: stay.adults,
      children: stay.children,
      pets: stay.pets,
      totalPrice: (session.amount_total ?? 0) / 100,
      currency: (session.currency ?? env.hostaway.currency).toUpperCase(),
      hostNote: `Direct booking paid in full via Stripe checkout ${session.id} (payment ${String(session.payment_intent)}).${stay.pets ? ` Guest is bringing ${stay.pets} pet(s).` : ""}`,
    });
    return settle("confirmed", { [META.reservationId]: String(reservation.id) });
  } catch (error) {
    if (error instanceof BookingError) {
      // The "conflict" may be our own reservation, created a moment ago by a parallel call. Check before refunding.
      const ours = await findOurs();
      if (ours) return settle("confirmed", { [META.reservationId]: String(ours.id) });
      await stripe.refunds.create({ payment_intent: String(session.payment_intent), reason: "requested_by_customer" }, { idempotencyKey: `refund-${session.id}` });
      console.error(`[booking] ${session.id} refunded: ${error.message}`);
      return settle("refunded", { [META.refundReason]: error.message.slice(0, 450) });
    }
    // Anything else (e.g. Hostaway down): leave it pending so it's retried, and alert the host once.
    await alertHostOnce(session, error);
    throw error;
  }
}

// ── Emails ──────────────────────────────────────────────────────────────────
async function notifyOnce(session: Stripe.Checkout.Session, status: "confirmed" | "refunded") {
  if (session.metadata?.[META.notified] === status) return;
  const sent = await sendBookingEmails(session, status);
  if (sent) await getStripe().checkout.sessions.update(session.id, { metadata: { [META.notified]: status } });
}

async function alertHostOnce(session: Stripe.Checkout.Session, error: unknown) {
  if (session.metadata?.[META.alerted]) return;
  const stay = readStay(session);
  const message = error instanceof Error ? error.message : String(error);
  const details = bookingDetails(session, stay);
  const ok = await sendMail({
    to: env.emailTo,
    subject: `Action needed: paid booking not yet in Hostaway — ${stay.property.name}`,
    html: layout(
      "A paid booking needs attention",
      para(
        "A guest paid on the website, but the reservation couldn't be created in Hostaway yet. The site will keep retrying automatically; if it doesn't appear in Hostaway soon, please add it manually or refund the guest in Stripe.",
      ) +
        rows([...details, ["Error", message]]),
    ),
    text: `A guest paid but the Hostaway reservation couldn't be created yet (the site keeps retrying).\n\n${textRows([...details, ["Error", message]])}`,
  });
  if (ok) await getStripe().checkout.sessions.update(session.id, { metadata: { [META.alerted]: "1" } });
}

function bookingDetails(session: Stripe.Checkout.Session, stay: StayRequest): [string, unknown][] {
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: (session.currency ?? "usd").toUpperCase() });
  const guests = stay.adults + stay.children;
  return [
    ["Home", stay.property.name],
    ["Check-in", `${format(parseISO(stay.arrival), "EEE, MMM d, yyyy")} (from ${site.checkIn})`],
    ["Check-out", `${format(parseISO(stay.departure), "EEE, MMM d, yyyy")} (by ${site.checkOut})`],
    ["Guests", `${guests} guest${guests === 1 ? "" : "s"}${stay.pets ? `, ${stay.pets} pet${stay.pets === 1 ? "" : "s"}` : ""}`],
    ["Total paid", money.format((session.amount_total ?? 0) / 100)],
    ["Guest", [session.customer_details?.name, session.customer_details?.email, session.customer_details?.phone].filter(Boolean).join(" · ")],
    ["Hostaway reservation", session.metadata?.[META.reservationId]],
    ["Stripe payment", String(session.payment_intent ?? "")],
  ];
}

async function sendBookingEmails(session: Stripe.Checkout.Session, status: "confirmed" | "refunded"): Promise<boolean> {
  const stay = readStay(session);
  const p = stay.property;
  const all = bookingDetails(session, stay);
  const guestView = all.filter(([k]) => ["Home", "Check-in", "Check-out", "Guests", "Total paid"].includes(k));
  const guestEmail = session.customer_details?.email ?? "";
  const firstName = (session.customer_details?.name ?? "").trim().split(/\s+/)[0] || "there";
  const reason = session.metadata?.[META.refundReason];

  const mails: Parameters<typeof sendMail>[0][] =
    status === "confirmed"
      ? [
          {
            to: guestEmail,
            replyTo: env.emailTo,
            subject: `You're booked: ${p.name}`,
            html: layout(
              "You're booked!",
              para(`Hi ${esc(firstName)}, thanks for booking direct. Your stay at <strong>${esc(p.name)}</strong> in ${esc(p.city)}, ${esc(p.state)} is confirmed.`) +
                rows(guestView) +
                para(`<br>We'll be in touch before your arrival with check-in details. Questions? Just reply to this email or call ${esc(site.phone)}.`) +
                para("See you soon,<br>Todd, Bobbi &amp; Albert"),
            ),
            text: `Hi ${firstName}, your stay at ${p.name} is confirmed.\n\n${textRows(guestView)}\n\nWe'll be in touch before your arrival with check-in details. Questions? Reply to this email or call ${site.phone}.\n\nTodd, Bobbi & Albert`,
          },
          {
            to: env.emailTo,
            replyTo: guestEmail || undefined,
            subject: `New direct booking: ${p.name}, ${stay.arrival} → ${stay.departure}`,
            html: layout("New direct booking", para("A guest booked and paid in full on the website. The reservation is in Hostaway.") + rows(all)),
            text: `New direct booking (paid in full, created in Hostaway).\n\n${textRows(all)}`,
          },
        ]
      : [
          {
            to: guestEmail,
            replyTo: env.emailTo,
            subject: `Your payment has been refunded: ${p.name}`,
            html: layout(
              "Those dates were just taken",
              para(
                `Hi ${esc(firstName)}, we're sorry. These dates at <strong>${esc(p.name)}</strong> were booked moments before your payment went through, so we've refunded you in full. Refunds usually appear within 5–10 business days.`,
              ) +
                rows(guestView) +
                para(`<br>We'd love to host you another time. Reply to this email or call ${esc(site.phone)} and we'll help you find dates.`),
            ),
            text: `Hi ${firstName}, these dates at ${p.name} were booked moments before your payment went through, so we've refunded you in full (5–10 business days).\n\n${textRows(guestView)}\n\nReply to this email or call ${site.phone} and we'll help you find other dates.`,
          },
          {
            to: env.emailTo,
            replyTo: guestEmail || undefined,
            subject: `Refunded website booking: ${p.name}, ${stay.arrival} → ${stay.departure}`,
            html: layout("A website booking was refunded", para(`The dates became unavailable while the guest was paying, so the payment was refunded automatically. Reason: ${esc(reason)}`) + rows(all)),
            text: `A website booking was refunded automatically (dates became unavailable while paying). Reason: ${reason}\n\n${textRows(all)}`,
          },
        ];

  const results = await Promise.all(mails.filter((m) => m.to).map(sendMail));
  return results.length > 0 && results.every(Boolean);
}

// ── Safety net without webhooks ─────────────────────────────────────────────
const SWEEP_EVERY_MS = 2 * 60 * 1000;
let lastSweep = 0;

/**
 * Finds paid checkouts from the last 3 days that were never turned into reservations (e.g. the guest closed
 * the tab before returning to the site) and fulfils them. Throttled; runs in the background after normal
 * site traffic, and can also be triggered by a scheduled job via /api/booking/reconcile.
 */
export async function sweepPendingCheckouts({ force = false } = {}) {
  if (!bookingEnabled()) return { checked: 0, fulfilled: 0 };
  if (!force && Date.now() - lastSweep < SWEEP_EVERY_MS) return null;
  lastSweep = Date.now();

  const list = await getStripe().checkout.sessions.list({
    status: "complete",
    created: { gte: Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60 },
    limit: 100,
  });
  let fulfilled = 0;
  const ours = list.data.filter((s) => s.metadata?.[META.source] === SOURCE && s.payment_status === "paid");
  for (const s of ours) {
    const st = s.metadata?.[META.status];
    const needsEmail = (st === "confirmed" || st === "refunded") && s.metadata?.[META.notified] !== st;
    if ((st === "confirmed" || st === "refunded") && !needsEmail) continue;
    try {
      await fulfillCheckout(s.id);
      fulfilled++;
    } catch (error) {
      console.error(`[sweep] ${s.id} still pending`, error);
    }
  }
  return { checked: ours.length, fulfilled };
}

export async function getCheckoutSummary(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  return {
    session,
    stay: readStay(session),
    status: (session.metadata?.[META.status] as BookingStatus | undefined) ?? (session.payment_status === "paid" ? "pending" : "unpaid"),
  };
}
