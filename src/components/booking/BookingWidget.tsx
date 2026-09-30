"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { CalendarDays, ChevronDown, Loader2, Lock, ShieldCheck, TriangleAlert, Users, X } from "lucide-react";
import clsx from "clsx";
import { Panel } from "@/components/ui/Panel";
import { Rating } from "@/components/ui/Rating";
import { DateRangePicker } from "@/components/booking/DateRangePicker";
import { GuestPicker, guestSummary, type Guests } from "@/components/booking/GuestPicker";
import { useBooking } from "@/components/booking/useBooking";
import { formatRange, nights, usd } from "@/lib/format";
import { parseSearch, type SearchState } from "@/lib/search";
import type { Property } from "@/lib/types";

export function BookingWidgetFromUrl({ property }: { property: Property }) {
  const params = useSearchParams();
  return <BookingWidget property={property} initial={parseSearch(params)} />;
}

export function BookingWidget({ property: p, initial }: { property: Property; initial?: SearchState }) {
  const [range, setRange] = useState<DateRange | undefined>(initial?.start ? { from: initial.start, to: initial.end } : undefined);
  const [guests, setGuests] = useState<Guests>({
    adults: Math.min(initial?.adults ?? 2, p.guests),
    children: Math.min(initial?.children ?? 0, Math.max(0, p.guests - (initial?.adults ?? 2))),
    pets: initial?.pets ?? 0,
  });
  const [field, setField] = useState<"dates" | "guests" | null>(null);
  const [sheet, setSheet] = useState(false);

  const n = nights(range?.from, range?.to);
  const hasDates = n > 0;
  const { enabled, disabled, quote, booking, book } = useBooking(p.slug, range, guests);
  const live = enabled !== false; // keys configured (or still checking)
  const money = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: quote.status === "ready" ? quote.quote.currency : "USD" }).format(v);
  const canBook = live && hasDates && quote.status === "ready" && !booking.busy;
  const bookLabel = booking.busy ? "Opening secure checkout…" : quote.status === "loading" ? "Checking price…" : "Book now";

  const form = (inSheet: boolean) => (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-line">
        <button
          type="button"
          data-panel-trigger
          onClick={() => setField(field === "dates" ? null : "dates")}
          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-sand"
          aria-expanded={field === "dates"}
        >
          <CalendarDays className="size-5 text-sage-deep" aria-hidden />
          <span className="flex-1">
            <span className="eyebrow block text-[0.62rem]! text-muted">Check-in → Check-out</span>
            <span className={clsx("font-semibold", !range?.from && "text-muted/80")}>{range?.from ? formatRange(range.from, range.to) : "Add your dates"}</span>
          </span>
          <ChevronDown className="size-4 text-muted" aria-hidden />
        </button>
        <button
          type="button"
          data-panel-trigger
          onClick={() => setField(field === "guests" ? null : "guests")}
          className="flex w-full items-center gap-3 border-t border-line px-4 py-3 text-left hover:bg-sand"
          aria-expanded={field === "guests"}
        >
          <Users className="size-5 text-sage-deep" aria-hidden />
          <span className="flex-1">
            <span className="eyebrow block text-[0.62rem]! text-muted">Guests</span>
            <span className="font-semibold">{guestSummary(guests)}</span>
          </span>
          <ChevronDown className="size-4 text-muted" aria-hidden />
        </button>
      </div>

      {inSheet ? (
        <AnimatePresence initial={false}>
          {field && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pt-4">
                {field === "dates" ? <DateRangePicker value={range} onChange={setRange} disabled={disabled} /> : <GuestPicker value={guests} onChange={setGuests} maxGuests={p.guests} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <>
          <Panel open={field === "dates"} onClose={() => setField(null)} title="Select dates" align="right" className="w-max"
            footer={
              <div className="flex items-center justify-between">
                <button type="button" className="text-sm font-semibold underline underline-offset-4" onClick={() => setRange(undefined)}>Clear</button>
                <button type="button" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper" onClick={() => setField(null)}>Done</button>
              </div>
            }
          >
            <DateRangePicker value={range} onChange={setRange} disabled={disabled} />
          </Panel>
          <Panel open={field === "guests"} onClose={() => setField(null)} title="Guests" align="right" className="w-[22rem]">
            <GuestPicker value={guests} onChange={setGuests} maxGuests={p.guests} />
          </Panel>
        </>
      )}

      {!hasDates ? (
        <button type="button" data-panel-trigger onClick={() => setField("dates")} className="mt-4 flex h-13 w-full items-center justify-center rounded-full bg-ink font-semibold text-paper transition-colors hover:bg-ink-deep">
          Check availability
        </button>
      ) : live ? (
        <button
          type="button"
          onClick={book}
          disabled={!canBook}
          className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-clay font-semibold text-white shadow-soft transition-colors hover:bg-clay-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {(booking.busy || quote.status === "loading") && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {bookLabel}
        </button>
      ) : (
        <Link href="/contact" className="mt-4 flex h-13 w-full items-center justify-center rounded-full bg-clay font-semibold text-white shadow-soft transition-colors hover:bg-clay-deep">
          Request to book
        </Link>
      )}

      {(quote.status === "error" || booking.error) && (
        <p role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-clay/10 px-3 py-2.5 text-sm text-clay-deep">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {booking.error ?? (quote.status === "error" ? quote.message : "")}
        </p>
      )}

      {hasDates && quote.status === "ready" && (
        <dl className="mt-5 space-y-2.5 text-[0.95rem]" aria-live="polite">
          {quote.quote.lines.map((l) => (
            <div key={l.label} className="flex justify-between gap-4 text-muted">
              <dt>{l.label}</dt>
              <dd>{money(l.amount)}</dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-line pt-3 font-semibold text-text">
            <dt>Total</dt>
            <dd>{money(quote.quote.total)}</dd>
          </div>
        </dl>
      )}
      {hasDates && quote.status === "loading" && (
        <div className="mt-5 space-y-3" aria-hidden>
          <div className="h-4 w-3/4 animate-pulse rounded bg-sand" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-sand" />
          <div className="h-5 w-full animate-pulse rounded bg-sand" />
        </div>
      )}
      {hasDates && !live && (
        <dl className="mt-5 space-y-2.5 text-[0.95rem]">
          <div className="flex justify-between text-muted">
            <dt className="underline decoration-line underline-offset-4">
              {usd(p.pricePerNight)} × {n} night{n === 1 ? "" : "s"}
            </dt>
            <dd>{usd(p.pricePerNight * n)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 font-semibold text-text">
            <dt>Estimated total</dt>
            <dd>{usd(p.pricePerNight * n)}</dd>
          </div>
        </dl>
      )}

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
        {live ? (
          <>
            <Lock className="mt-0.5 size-4 shrink-0 text-sage-deep" aria-hidden />
            Secure payment by Stripe. Your reservation is confirmed as soon as your payment goes through.
          </>
        ) : (
          <>
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sage-deep" aria-hidden />
            Nightly rates vary by date. Send us your dates and we&apos;ll confirm the price and availability.
          </>
        )}
      </p>
    </div>
  );

  return (
    <>
      {/* Desktop: sticky card */}
      <aside className="sticky top-[calc(var(--header-h)+1.5rem)] hidden rounded-[1.75rem] border border-line bg-paper p-6 shadow-lift lg:block" aria-label="Book this home">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <p>
            <span className="text-sm text-muted">From </span>
            <span className="font-display text-3xl text-ink">{usd(p.pricePerNight)}</span>
            <span className="text-muted"> / night</span>
          </p>
          <Rating rating={p.rating} />
        </div>
        {form(false)}
      </aside>

      {/* Mobile & tablet: bottom bar + sheet */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate">
              {hasDates && quote.status === "ready" ? (
                <>
                  <span className="text-lg font-bold text-text">{money(quote.quote.total)}</span>
                  <span className="text-sm text-muted"> total</span>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold text-text">{usd(p.pricePerNight)}</span>
                  <span className="text-sm text-muted"> / night</span>
                </>
              )}
            </p>
            <p className="truncate text-sm text-muted">{range?.from ? formatRange(range.from, range.to) : `Rated ${p.rating?.toFixed(2)} ★ · ${p.reviewCount} reviews`}</p>
          </div>
          {hasDates ? (
            <button
              type="button"
              onClick={() => {
                setSheet(true);
                setField(null);
              }}
              className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-full bg-clay px-6 font-semibold text-white"
            >
              {live ? "Review & book" : "Request to book"}
            </button>
          ) : (
            <button type="button" onClick={() => { setSheet(true); setField("dates"); }} className="h-12 shrink-0 rounded-full bg-ink px-6 font-semibold text-paper">
              Check dates
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {sheet && (
          <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Book this home">
            <motion.div className="absolute inset-0 bg-ink-deep/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
            <motion.div
              className="absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[1.75rem] bg-paper px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-lift sm:mx-auto sm:max-w-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
            >
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-line" aria-hidden />
              <div className="mb-5 flex items-center justify-between">
                <p>
                  <span className="font-display text-2xl text-ink">{usd(p.pricePerNight)}</span>
                  <span className="text-muted"> / night</span>
                </p>
                <button type="button" onClick={() => setSheet(false)} aria-label="Close" className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
                  <X className="size-5" />
                </button>
              </div>
              {form(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
