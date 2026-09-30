import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { CalendarDays, CircleCheck, Clock, Mail, RotateCcw, Users } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { after } from "next/server";
import { fulfillCheckout, getCheckoutSummary, sweepPendingCheckouts, type BookingStatus } from "@/lib/server/booking";
import { stripeConfigured } from "@/lib/server/env";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Booking confirmation", robots: { index: false } };

export default async function BookingConfirmedPage({ searchParams }: PageProps<"/booking/confirmed">) {
  const { session_id } = await searchParams;
  if (!stripeConfigured() || typeof session_id !== "string" || !session_id.startsWith("cs_")) notFound();

  let summary;
  try {
    summary = await getCheckoutSummary(session_id);
  } catch {
    notFound();
  }

  // Finish the booking here (there's no Stripe webhook yet). Safe to repeat.
  let status: BookingStatus = summary.status;
  if (status === "pending" || status === "confirmed" || status === "refunded") status = await fulfillCheckout(session_id).catch(() => summary.status);
  after(() => sweepPendingCheckouts().catch((e) => console.error("[sweep]", e)));

  const { session, stay } = summary;
  const p = stay.property;
  const guests = stay.adults + stay.children;
  const paid = new Intl.NumberFormat("en-US", { style: "currency", currency: (session.currency ?? "usd").toUpperCase() }).format((session.amount_total ?? 0) / 100);
  const email = session.customer_details?.email;

  const heading = {
    confirmed: { Icon: CircleCheck, tone: "text-sage-deep bg-mist", title: "You're booked!", text: `Your stay at ${p.name} is confirmed. We've got it from here.` },
    pending: { Icon: Clock, tone: "text-clay-deep bg-clay/10", title: "Payment received", text: "We're finalizing your reservation now. If anything needs attention, we'll reach out by email." },
    refunded: {
      Icon: RotateCcw,
      tone: "text-clay-deep bg-clay/10",
      title: "Those dates were just taken",
      text: "Someone booked these dates moments before your payment went through, so we've refunded you in full. Refunds usually appear within 5–10 business days.",
    },
    unpaid: { Icon: Clock, tone: "text-muted bg-sand", title: "Payment not completed", text: "Your payment didn't go through, so you haven't been charged." },
  }[status];

  return (
    <section className="bg-sand pb-24 pt-[calc(var(--header-h)+3rem)] sm:pt-[calc(var(--header-h)+4rem)]">
      <div className="container-x max-w-2xl!">
        <div className="text-center">
          <span className={`mx-auto grid size-16 place-items-center rounded-full ${heading.tone}`}>
            <heading.Icon className="size-8" aria-hidden />
          </span>
          <h1 className="display-lg mt-6 text-ink">{heading.title}</h1>
          <p className="lede mx-auto mt-4 max-w-lg text-muted">{heading.text}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.75rem] bg-paper shadow-soft ring-1 ring-line">
          <div className="relative aspect-[16/7]">
            <Image src={p.images[0]} alt={p.name} fill sizes="(min-width: 768px) 672px, 100vw" className="object-cover" />
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-sm text-muted">
              {p.city}, {p.state}
            </p>
            <h2 className="mt-1 font-display text-2xl text-ink">{p.name}</h2>
            <dl className="mt-6 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-4 text-sage-deep" aria-hidden />
                <div>
                  <dt className="text-muted">Dates</dt>
                  <dd className="font-semibold text-text">
                    {format(parseISO(stay.arrival), "EEE, MMM d")} → {format(parseISO(stay.departure), "EEE, MMM d, yyyy")}
                  </dd>
                  <dd className="text-muted">
                    Check-in from {site.checkIn} · Check-out by {site.checkOut}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 size-4 text-sage-deep" aria-hidden />
                <div>
                  <dt className="text-muted">Guests</dt>
                  <dd className="font-semibold text-text">
                    {guests} guest{guests === 1 ? "" : "s"}
                    {stay.pets ? `, ${stay.pets} pet${stay.pets === 1 ? "" : "s"}` : ""}
                  </dd>
                </div>
              </div>
            </dl>
            <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
              <span className="font-semibold text-text">{status === "refunded" ? "Refunded" : "Total paid"}</span>
              <span className="font-display text-2xl text-ink">{paid}</span>
            </div>
            {email && status !== "unpaid" && (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Mail className="size-4 text-sage-deep" aria-hidden /> Booked under {email}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {status === "confirmed" || status === "pending" ? (
            <Link href="/attractions" className={buttonClass({})}>
              Plan your trip
            </Link>
          ) : (
            <Link href={`/properties/${p.slug}`} className={buttonClass({})}>
              Choose new dates
            </Link>
          )}
          <a href={`mailto:${site.email}`} className={buttonClass({ variant: "outline" })}>
            Questions? Email us
          </a>
        </div>
      </div>
    </section>
  );
}
