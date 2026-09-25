"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { CalendarDays, MapPin, Mountain, Search, Users, Waves } from "lucide-react";
import clsx from "clsx";
import { Panel } from "@/components/ui/Panel";
import { DateRangePicker } from "@/components/booking/DateRangePicker";
import { GuestPicker, defaultGuests, guestSummary, type Guests } from "@/components/booking/GuestPicker";
import { destinations } from "@/data/site";
import { formatRange } from "@/lib/format";
import { searchQuery, type SearchState } from "@/lib/search";
import type { Region } from "@/lib/types";

type Field = "where" | "when" | "who" | null;

export function SearchBar({ initial, className }: { initial?: Partial<SearchState>; className?: string }) {
  const router = useRouter();
  const [region, setRegion] = useState<Region | undefined>(initial?.region);
  const [range, setRange] = useState<DateRange | undefined>(
    initial?.start ? { from: initial.start, to: initial.end } : undefined,
  );
  const [guests, setGuests] = useState<Guests>({
    adults: initial?.adults ?? defaultGuests.adults,
    children: initial?.children ?? 0,
    pets: initial?.pets ?? 0,
  });
  const [active, setActive] = useState<Field>(null);
  const close = () => setActive(null);
  const toggle = (f: Field) => setActive((cur) => (cur === f ? null : f));

  const submit = () => {
    close();
    router.push(`/properties${searchQuery({ region, start: range?.from, end: range?.to, ...guests })}#results`);
  };

  const whereLabel = region ? destinations.find((d) => d.region === region)?.short : "Anywhere";
  const whenLabel = range?.from ? formatRange(range.from, range.to) : "Add dates";

  const segment = (f: Exclude<Field, null>, Icon: typeof MapPin, label: string, value: string, placeholder: boolean) => (
    <button
      type="button"
      data-panel-trigger
      onClick={() => toggle(f)}
      aria-expanded={active === f}
      className={clsx(
        "flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors md:rounded-full md:px-6 md:py-3.5",
        active === f ? "bg-mist" : "hover:bg-sand",
      )}
    >
      <Icon className="size-5 shrink-0 text-sage-deep" aria-hidden />
      <span className="min-w-0">
        <span className="eyebrow block text-[0.65rem]! text-muted">{label}</span>
        <span className={clsx("block truncate font-semibold", placeholder ? "text-muted/80" : "text-text")}>{value}</span>
      </span>
    </button>
  );

  return (
    <div className={clsx("relative", className)}>
      <div className="flex flex-col gap-1 rounded-[1.75rem] bg-paper p-2 shadow-lift md:flex-row md:items-center md:gap-0 md:rounded-full">
        {segment("where", MapPin, "Where", whereLabel!, !region)}
        <span className="mx-1 hidden h-8 w-px bg-line md:block" aria-hidden />
        {segment("when", CalendarDays, "When", whenLabel, !range?.from)}
        <span className="mx-1 hidden h-8 w-px bg-line md:block" aria-hidden />
        {segment("who", Users, "Who", guestSummary(guests), false)}
        <button
          type="button"
          onClick={submit}
          className="mt-1 inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-clay px-6 font-semibold text-white transition-colors hover:bg-clay-deep md:ml-2 md:mt-0 md:size-14 md:rounded-full md:px-0 lg:w-auto lg:px-7"
        >
          <Search className="size-5" aria-hidden />
          <span className="md:sr-only lg:not-sr-only">Search</span>
        </button>
      </div>

      <Panel open={active === "where"} onClose={close} title="Where are you headed?" className="w-[26rem]">
        <div className="grid gap-2">
          {[{ region: undefined, name: "All destinations", short: "", Icon: MapPin }, ...destinations.map((d) => ({ ...d, Icon: d.region === "boston" ? Waves : Mountain }))].map(
            (d) => (
              <button
                key={d.name}
                type="button"
                onClick={() => {
                  setRegion(d.region);
                  setActive("when");
                }}
                className={clsx(
                  "flex items-center gap-4 rounded-2xl border p-3 text-left transition-colors",
                  region === d.region ? "border-ink bg-mist" : "border-line hover:border-ink/40",
                )}
              >
                <span className="grid size-11 place-items-center rounded-xl bg-sand text-ink">
                  <d.Icon className="size-5" aria-hidden />
                </span>
                <span className="font-semibold text-text">{d.name}</span>
              </button>
            ),
          )}
        </div>
      </Panel>

      <Panel
        open={active === "when"}
        onClose={close}
        title="When's your trip?"
        align="center"
        className="w-max"
        footer={
          <div className="flex items-center justify-between gap-4">
            <button type="button" className="text-sm font-semibold text-ink underline underline-offset-4" onClick={() => setRange(undefined)}>
              Clear dates
            </button>
            <button type="button" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper" onClick={() => setActive("who")}>
              Next
            </button>
          </div>
        }
      >
        <DateRangePicker value={range} onChange={setRange} />
      </Panel>

      <Panel
        open={active === "who"}
        onClose={close}
        title="Who's coming?"
        align="right"
        className="w-[24rem]"
        footer={
          <button type="button" onClick={submit} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-clay font-semibold text-white hover:bg-clay-deep">
            <Search className="size-4" aria-hidden /> Search homes
          </button>
        }
      >
        <GuestPicker value={guests} onChange={setGuests} />
      </Panel>
    </div>
  );
}
