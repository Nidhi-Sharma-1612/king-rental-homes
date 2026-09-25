import { format, isValid, parseISO } from "date-fns";
import type { Region } from "@/lib/types";

export interface SearchState {
  region?: Region;
  start?: Date;
  end?: Date;
  adults: number;
  children: number;
  pets: number;
}

type Params = URLSearchParams | Record<string, string | string[] | undefined>;

const get = (p: Params, k: string) => {
  const v = p instanceof URLSearchParams ? p.get(k) : p[k];
  return (Array.isArray(v) ? v[0] : v) ?? undefined;
};

const date = (v?: string) => {
  if (!v) return undefined;
  const d = parseISO(v);
  return isValid(d) ? d : undefined;
};

const int = (v: string | undefined, fallback: number, min: number) => {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) && n >= min ? n : fallback;
};

export function parseSearch(p: Params): SearchState {
  const region = get(p, "region");
  return {
    region: region === "boston" || region === "colorado" ? region : undefined,
    start: date(get(p, "checkin")),
    end: date(get(p, "checkout")),
    adults: int(get(p, "adults"), 2, 1),
    children: int(get(p, "children"), 0, 0),
    pets: int(get(p, "pets"), 0, 0),
  };
}

/** Serializes the booking-relevant part of a search, dropping defaults. */
export function searchQuery(s: Partial<SearchState>, extra: Record<string, string | undefined> = {}) {
  const q = new URLSearchParams();
  if (s.region) q.set("region", s.region);
  if (s.start) q.set("checkin", format(s.start, "yyyy-MM-dd"));
  if (s.end) q.set("checkout", format(s.end, "yyyy-MM-dd"));
  if (s.adults != null && s.adults !== 2) q.set("adults", String(s.adults));
  if (s.children) q.set("children", String(s.children));
  if (s.pets) q.set("pets", String(s.pets));
  for (const [k, v] of Object.entries(extra)) if (v) q.set(k, v);
  const str = q.toString();
  return str ? `?${str}` : "";
}
