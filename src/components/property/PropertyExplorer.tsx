"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, Mail, PawPrint, Phone, PlugZap, SearchX, X } from "lucide-react";
import clsx from "clsx";
import { PropertyCard } from "@/components/property/PropertyCard";
import { buttonClass } from "@/components/ui/Button";
import { GroupHeader } from "@/components/ui/GroupHeader";
import { destinations, site } from "@/data/site";
import { formatRange } from "@/lib/format";
import { searchQuery, type SearchState } from "@/lib/search";
import type { Property, Region } from "@/lib/types";

type Sort = "recommended" | "price-asc" | "price-desc" | "guests";

const sorts: { value: Sort; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "guests", label: "Most guests" },
];

const regions: { value?: Region; label: string }[] = [
  { value: undefined, label: "All homes" },
  { value: "boston", label: "Boston & Coast" },
  { value: "colorado", label: "Colorado" },
];

export function PropertyExplorer({
  properties,
  search,
  initialSort,
}: {
  properties: Property[];
  search: SearchState;
  initialSort?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [region, setRegion] = useState<Region | undefined>(search.region);
  const [petsOnly, setPetsOnly] = useState(search.pets > 0);
  const [evOnly, setEvOnly] = useState(false);
  const [sort, setSort] = useState<Sort>(sorts.some((s) => s.value === initialSort) ? (initialSort as Sort) : "recommended");
  const guests = search.adults + search.children;

  // A new search from the SearchBar changes the URL; follow it.
  const [synced, setSynced] = useState({ region: search.region, pets: search.pets });
  if (synced.region !== search.region || synced.pets !== search.pets) {
    setSynced({ region: search.region, pets: search.pets });
    setRegion(search.region);
    setPetsOnly(search.pets > 0);
  }

  const results = useMemo(() => {
    const list = properties.filter(
      (p) => (!region || p.region === region) && p.guests >= guests && (!petsOnly || p.petFriendly) && (!evOnly || p.evCharging),
    );
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === "price-desc") sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (sort === "guests") sorted.sort((a, b) => b.guests - a.guests);
    return sorted;
  }, [properties, region, guests, petsOnly, evOnly, sort]);

  // Showing everything in the default order? Group by destination so guests can orient themselves.
  const groups = useMemo(() => {
    if (region || sort !== "recommended") return null;
    return destinations
      .map((d) => ({ ...d, homes: results.filter((p) => p.region === d.region) }))
      .filter((g) => g.homes.length > 0);
  }, [region, sort, results]);

  // Keep the URL shareable without re-running the server render on every click.
  const syncUrl = (next: { region?: Region; sort?: Sort }) => {
    const qs = searchQuery({ ...search, region: next.region }, { sort: next.sort && next.sort !== "recommended" ? next.sort : undefined });
    router.replace(`${pathname}${qs}`, { scroll: false });
  };

  const changeRegion = (r?: Region) => {
    setRegion(r);
    syncUrl({ region: r, sort });
  };
  const changeSort = (s: Sort) => {
    setSort(s);
    syncUrl({ region, sort: s });
  };
  const clearAll = () => {
    setRegion(undefined);
    setPetsOnly(false);
    setEvOnly(false);
    setSort("recommended");
    router.replace(pathname, { scroll: false });
  };

  // Detail pages keep the guest's dates and party size.
  const cardQuery = searchQuery({ ...search, region: undefined });

  const active = [
    region && { label: regions.find((r) => r.value === region)!.label, clear: () => changeRegion(undefined) },
    petsOnly && { label: "Pet-friendly", clear: () => setPetsOnly(false) },
    evOnly && { label: "EV charging", clear: () => setEvOnly(false) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const chip = (on: boolean) =>
    clsx(
      "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
      on ? "bg-ink text-paper" : "bg-paper text-text ring-1 ring-line hover:ring-ink/40",
    );

  const grid = (homes: Property[], offset = 0) => (
    <motion.div layout className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {homes.map((p, i) => (
          <motion.div
            key={p.slug}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, delay: (offset + i) * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <PropertyCard property={p} query={cardQuery} priority={offset + i < 3} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <section id="results" className="scroll-mt-(--header-h) bg-sand">
      {/* Sticky filter bar */}
      <div className="sticky top-(--header-h) z-30 border-b border-line bg-sand/90 backdrop-blur-xl">
        <div className="container-x flex items-center gap-3 py-3">
          <div className="no-scrollbar relative -mx-1 flex flex-1 items-center gap-2 overflow-x-auto px-1 py-0.5 mask-[linear-gradient(to_right,black_82%,transparent)] sm:mask-none">
            <div className="flex shrink-0 rounded-full bg-paper p-1 ring-1 ring-line" role="group" aria-label="Destination">
              {regions.map((r) => {
                const on = region === r.value;
                return (
                  <button
                    key={r.label}
                    type="button"
                    aria-pressed={on}
                    onClick={() => changeRegion(r.value)}
                    className={clsx(
                      "h-8 shrink-0 rounded-full px-3.5 text-sm font-semibold transition-colors",
                      on ? "bg-ink text-paper" : "text-text hover:bg-sand",
                    )}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
            <button type="button" className={chip(petsOnly)} aria-pressed={petsOnly} onClick={() => setPetsOnly((v) => !v)}>
              <PawPrint className="size-4" aria-hidden /> Pet-friendly
            </button>
            <button type="button" className={chip(evOnly)} aria-pressed={evOnly} onClick={() => setEvOnly((v) => !v)}>
              <PlugZap className="size-4" aria-hidden /> EV charging
            </button>
          </div>

          {/* Sort: icon button on phones, full select from tablet up */}
          <label className="relative flex h-10 shrink-0 items-center rounded-full bg-paper ring-1 ring-line hover:ring-ink/40">
            <span className="sr-only">Sort by</span>
            <ArrowUpDown className="pointer-events-none absolute left-3 size-4 text-ink sm:left-3.5" aria-hidden />
            <select
              value={sort}
              onChange={(e) => changeSort(e.target.value as Sort)}
              className="h-10 w-10 cursor-pointer appearance-none rounded-full bg-transparent text-transparent sm:w-auto sm:pl-10 sm:pr-5 sm:text-sm sm:font-semibold sm:text-text"
            >
              {sorts.map((s) => (
                <option key={s.value} value={s.value} className="text-text">
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="container-x section-y pt-8! sm:pt-10!">
        {/* Result summary + active filters */}
        <div className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-3">
          <p className="text-muted" aria-live="polite">
            <span className="font-display text-2xl text-ink">
              {results.length} {results.length === 1 ? "home" : "homes"}
            </span>
            {guests > 2 && ` · ${guests} guests`}
            {search.start && ` · ${formatRange(search.start, search.end)}`}
          </p>
          {active.length > 0 && (
            <ul className="flex flex-wrap items-center gap-2">
              {active.map((f) => (
                <li key={f.label}>
                  <button
                    type="button"
                    onClick={f.clear}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-mist pl-3 pr-2 text-xs font-semibold text-ink transition-colors hover:bg-sage/40"
                    aria-label={`Remove ${f.label} filter`}
                  >
                    {f.label} <X className="size-3.5" aria-hidden />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={clearAll} className="text-xs font-semibold text-clay-deep underline underline-offset-4">
                  Clear all
                </button>
              </li>
            </ul>
          )}
        </div>

        {results.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-card border border-dashed border-line bg-paper px-6 py-16 text-center">
            <SearchX className="size-10 text-sage-deep" aria-hidden />
            <h2 className="mt-5 font-display text-2xl text-ink">No homes match those filters</h2>
            <p className="mt-2 text-muted">Try another destination or fewer filters. Our largest home sleeps 12.</p>
            <button type="button" className={buttonClass({ className: "mt-6" })} onClick={clearAll}>
              Clear all filters
            </button>
          </div>
        ) : groups ? (
          <div className="space-y-16 sm:space-y-20">
            {groups.map((g, gi) => {
              const offset = groups.slice(0, gi).reduce((n, x) => n + x.homes.length, 0);
              return (
                <div key={g.region}>
                  <GroupHeader region={g.region} title={g.name} blurb={g.blurb} count={g.homes.length} noun={["home", "homes"]} />
                  {grid(g.homes, offset)}
                </div>
              );
            })}
          </div>
        ) : (
          grid(results)
        )}

        {/* Help for undecided guests */}
        <div className="mt-20 flex flex-col gap-6 rounded-[1.75rem] bg-paper p-7 ring-1 ring-line sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Not sure which home fits your group?</h2>
            <p className="mt-2 max-w-xl text-muted">
              Tell us your dates, who&apos;s coming and what you&apos;re planning. We&apos;ll point you to the right home.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={site.phoneHref} className={buttonClass({})}>
              <Phone className="size-4" aria-hidden /> Call {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className={buttonClass({ variant: "outline" })}>
              <Mail className="size-4" aria-hidden /> Email us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
