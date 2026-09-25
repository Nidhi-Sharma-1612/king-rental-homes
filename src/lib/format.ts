import { differenceInCalendarDays, format } from "date-fns";

export const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function formatBaths(n: number) {
  return plural(Number.isInteger(n) ? n : Number(n.toFixed(1)), "bath");
}

export function formatRange(start?: Date, end?: Date) {
  if (!start) return "";
  if (!end) return format(start, "MMM d");
  const sameMonth = start.getMonth() === end.getMonth();
  return `${format(start, "MMM d")} – ${format(end, sameMonth ? "d" : "MMM d")}`;
}

export function nights(start?: Date, end?: Date) {
  return start && end ? Math.max(0, differenceInCalendarDays(end, start)) : 0;
}

/** The scraped descriptions use short, period-less lines as section titles. */
export function isSubheading(p: string) {
  return p.length < 70 && !/[.!?)]$/.test(p);
}
