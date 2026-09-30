"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, format, isBefore } from "date-fns";
import type { DateRange, Matcher } from "react-day-picker";
import type { Guests } from "@/components/booking/GuestPicker";

export interface Quote {
  nights: number;
  currency: string;
  total: number;
  lines: { label: string; amount: number }[];
}

interface Availability {
  blocked: Set<string>;
  noArrival: Set<string>;
  minStay: Record<string, number>;
}

type QuoteState = { status: "idle" } | { status: "loading" } | { status: "ready"; quote: Quote } | { status: "error"; message: string };

const iso = (d: Date) => format(d, "yyyy-MM-dd");

/**
 * Live booking state for one home: availability for the calendar, a Hostaway quote for the chosen stay,
 * and a `book()` that sends the guest to Stripe Checkout. `enabled` is false until the API keys are set,
 * in which case the widget falls back to estimates and a "contact us" path.
 */
export function useBooking(slug: string, range: DateRange | undefined, guests: Guests) {
  const [enabled, setEnabled] = useState<boolean | null>(null); // null = still checking
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [quote, setQuote] = useState<QuoteState>({ status: "idle" });
  const [booking, setBooking] = useState<{ busy: boolean; error?: string }>({ busy: false });

  // Availability (once per home)
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`/api/booking/availability?slug=${encodeURIComponent(slug)}`, { signal: ctrl.signal })
      .then(async (res) => {
        const data = await res.json();
        if (res.status === 503 || data.enabled === false) return setEnabled(false);
        if (!res.ok) return setEnabled(true); // live booking on, calendar data unavailable: server still validates
        setEnabled(true);
        setAvailability({ blocked: new Set(data.blocked), noArrival: new Set(data.noArrival), minStay: data.minStay ?? {} });
      })
      .catch((e) => e?.name !== "AbortError" && setEnabled(false));
    return () => ctrl.abort();
  }, [slug]);

  // Quote whenever the stay changes
  const from = range?.from ? iso(range.from) : undefined;
  const to = range?.to ? iso(range.to) : undefined;
  const { adults, children, pets } = guests;
  const [prevKey, setPrevKey] = useState("");
  const key = enabled && from && to && from !== to ? `${from}|${to}|${adults}|${children}|${pets}` : "";
  if (key !== prevKey) {
    setPrevKey(key);
    setQuote(key ? { status: "loading" } : { status: "idle" });
    setBooking({ busy: false });
  }

  useEffect(() => {
    if (!key) return;
    const ctrl = new AbortController();
    const t = window.setTimeout(() => {
      fetch("/api/booking/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, arrival: from, departure: to, adults, children, pets }),
        signal: ctrl.signal,
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok) setQuote({ status: "ready", quote: data.quote });
          else setQuote({ status: "error", message: data.error ?? "We couldn't price those dates." });
        })
        .catch((e) => e?.name !== "AbortError" && setQuote({ status: "error", message: "Couldn't reach the booking service. Please try again." }));
    }, 250);
    return () => {
      window.clearTimeout(t);
      ctrl.abort();
    };
  }, [key, slug, from, to, adults, children, pets]);

  // Calendar rules: booked nights can't be stayed; the first booked night after check-in can still be check-out.
  const disabled = useMemo<Matcher[]>(() => {
    if (!availability) return [];
    const { blocked, noArrival, minStay } = availability;
    if (!range?.from || range.to) return [(d: Date) => blocked.has(iso(d)) || noArrival.has(iso(d))];
    const start = range.from;
    let firstBlocked: Date | null = null;
    for (let d = addDays(start, 1), i = 0; i < 400; d = addDays(d, 1), i++) {
      if (blocked.has(iso(d))) {
        firstBlocked = d;
        break;
      }
    }
    const min = minStay[iso(start)] ?? 1;
    return [
      (d: Date) => isBefore(d, start) && (blocked.has(iso(d)) || noArrival.has(iso(d))),
      (d: Date) => !isBefore(d, addDays(start, 1)) && isBefore(d, addDays(start, min)),
      ...(firstBlocked ? [{ after: firstBlocked }] : []),
    ];
  }, [availability, range?.from, range?.to]);

  const book = async () => {
    if (!from || !to || booking.busy) return;
    setBooking({ busy: true });
    try {
      const res = await fetch("/api/booking/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, arrival: from, departure: to, adults, children, pets }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Couldn't start checkout.");
      window.location.assign(data.url);
    } catch (e) {
      setBooking({ busy: false, error: e instanceof Error ? e.message : "Couldn't start checkout." });
    }
  };

  return { enabled, disabled, quote, booking, book };
}
