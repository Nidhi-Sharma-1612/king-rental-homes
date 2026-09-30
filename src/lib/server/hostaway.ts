import "server-only";
import { env } from "@/lib/server/env";

// Hostaway Public API v1 — https://api.hostaway.com/documentation
const BASE = () => env.hostaway.apiUrl;

export class HostawayError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "HostawayError";
  }
}

// ── Auth ────────────────────────────────────────────────────────────────────
// Tokens last ~24 months, so one per server instance is plenty. HOSTAWAY_ACCESS_TOKEN skips the exchange.
let tokenPromise: Promise<string> | null = null;

async function requestToken(): Promise<string> {
  if (env.hostaway.accessToken) return env.hostaway.accessToken;
  const res = await fetch(`${BASE()}/accessTokens`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-control": "no-cache" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.hostaway.accountId,
      client_secret: env.hostaway.apiSecret,
      scope: "general",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new HostawayError(`Hostaway auth failed (${res.status})`, res.status);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new HostawayError("Hostaway auth returned no token", 500);
  return data.access_token;
}

function getToken(): Promise<string> {
  tokenPromise ??= requestToken().catch((e) => {
    tokenPromise = null;
    throw e;
  });
  return tokenPromise;
}

async function hostaway<T>(path: string, init: RequestInit & { revalidate?: number } = {}, retried = false): Promise<T> {
  const { revalidate, ...rest } = init;
  const res = await fetch(`${BASE()}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${await getToken()}`,
      "Content-Type": "application/json",
      "Cache-control": "no-cache",
      ...rest.headers,
    },
    ...(revalidate ? { next: { revalidate } } : { cache: "no-store" as const }),
  });

  // A revoked/expired token: fetch a fresh one once (only when we're minting our own).
  if ((res.status === 401 || res.status === 403) && !retried && !env.hostaway.accessToken) {
    tokenPromise = null;
    return hostaway<T>(path, init, true);
  }

  const body = (await res.json().catch(() => null)) as { status?: string; result?: T; message?: string } | null;
  if (!res.ok || body?.status !== "success") {
    throw new HostawayError(body?.message || `Hostaway request failed: ${path} (${res.status})`, res.status);
  }
  return body.result as T;
}

// ── Calendar & pricing ──────────────────────────────────────────────────────
export interface CalendarDay {
  date: string; // YYYY-MM-DD, the night starting on this date
  isAvailable: 0 | 1;
  price: number;
  minimumStay: number;
  maximumStay: number;
  closedOnArrival: 0 | 1 | null;
  closedOnDeparture: 0 | 1 | null;
}

/**
 * `cacheSeconds` is only for display (the date picker). Anything that decides whether a stay can be
 * booked or charged must read live data, since other channels can book at any moment.
 */
export function getCalendar(listingId: number, startDate: string, endDate: string, { cacheSeconds = 0 } = {}) {
  const qs = new URLSearchParams({ startDate, endDate });
  return hostaway<CalendarDay[]>(`/listings/${listingId}/calendar?${qs}`, cacheSeconds ? { revalidate: cacheSeconds } : {});
}

export interface PriceComponent {
  type: string; // accommodation (nightly rate; "price" in older docs) | fee | tax | discount
  name: string;
  title: string;
  total: number;
  isIncludedInTotalPrice: 0 | 1;
}

export interface PriceDetails {
  totalPrice: number;
  components: PriceComponent[];
}

export function getPriceDetails(listingId: number, startingDate: string, endingDate: string, numberOfGuests: number) {
  return hostaway<PriceDetails>(`/listings/${listingId}/calendar/priceDetails`, {
    method: "POST",
    body: JSON.stringify({ startingDate, endingDate, numberOfGuests, version: 2 }),
  });
}

// ── Reservations ────────────────────────────────────────────────────────────
export interface HostawayReservation {
  id: number;
  listingMapId: number;
  status: string;
  arrivalDate: string;
  departureDate: string;
  guestEmail: string | null;
  hostNote: string | null;
}

export function findReservations(params: { listingId: number; arrivalDate: string; guestEmail?: string }) {
  const qs = new URLSearchParams({
    listingId: String(params.listingId),
    arrivalStartDate: params.arrivalDate,
    arrivalEndDate: params.arrivalDate,
    limit: "50",
  });
  if (params.guestEmail) qs.set("guestEmail", params.guestEmail);
  return hostaway<HostawayReservation[]>(`/reservations?${qs}`);
}

export interface NewReservation {
  listingMapId: number;
  arrivalDate: string;
  departureDate: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  phone?: string;
  adults: number;
  children: number;
  pets: number;
  totalPrice: number;
  currency: string;
  hostNote: string;
  guestNote?: string;
}

export function createReservation(r: NewReservation) {
  return hostaway<HostawayReservation>(`/reservations`, {
    method: "POST",
    body: JSON.stringify({
      channelId: 2000, // direct booking
      listingMapId: r.listingMapId,
      arrivalDate: r.arrivalDate,
      departureDate: r.departureDate,
      guestName: `${r.guestFirstName} ${r.guestLastName}`.trim(),
      guestFirstName: r.guestFirstName,
      guestLastName: r.guestLastName,
      guestEmail: r.guestEmail,
      phone: r.phone,
      numberOfGuests: r.adults + r.children,
      adults: r.adults,
      children: r.children,
      pets: r.pets,
      totalPrice: r.totalPrice,
      currency: r.currency,
      isPaid: 1,
      status: "new",
      hostNote: r.hostNote,
      guestNote: r.guestNote,
    }),
  });
}
