"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { AttractionGrid } from "@/components/attractions/AttractionCard";
import { GroupHeader } from "@/components/ui/GroupHeader";
import type { Attraction, Region } from "@/lib/types";

const areas: { value?: Region; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "boston", label: "Boston & Quincy" },
  { value: "colorado", label: "Denver & Boulder" },
];

const groupCopy: Record<Region, { title: string; blurb: string }> = {
  boston: {
    title: "Boston & Quincy",
    blurb: "Historic landmarks, harbor views and Wollaston Beach, a short ride from our Boston-area homes.",
  },
  colorado: {
    title: "Denver & Boulder",
    blurb: "World-famous concerts, Front Range views and lively downtowns near the Sheridan Green House.",
  },
};

export function AttractionExplorer({ attractions, initialRegion }: { attractions: Attraction[]; initialRegion?: Region }) {
  const router = useRouter();
  const pathname = usePathname();
  const [region, setRegion] = useState<Region | undefined>(initialRegion);

  const changeRegion = (r?: Region) => {
    setRegion(r);
    router.replace(r ? `${pathname}?region=${r}` : pathname, { scroll: false });
  };

  const shownRegions: Region[] = region ? [region] : ["boston", "colorado"];

  return (
    <section className="section-y bg-sand pt-10! sm:pt-12!">
      <div className="container-x">
        {/* The only filter: which area */}
        <div className="mb-12 flex justify-center sm:mb-14">
          <div className="inline-flex max-w-full rounded-full bg-paper p-1 shadow-soft ring-1 ring-line" role="group" aria-label="Area">
            {areas.map((a) => {
              const on = region === a.value;
              const count = a.value ? attractions.filter((x) => x.region === a.value).length : attractions.length;
              return (
                <button
                  key={a.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => changeRegion(a.value)}
                  className={clsx(
                    "inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[0.8rem] font-semibold transition-colors min-[400px]:px-4 sm:h-11 sm:px-5 sm:text-sm",
                    on ? "bg-ink text-paper" : "text-text hover:bg-sand",
                  )}
                >
                  {a.label}
                  <span className={clsx("hidden text-xs sm:inline", on ? "text-paper/60" : "text-muted")}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-16 sm:space-y-20">
          {shownRegions.map((r) => {
            const items = attractions.filter((a) => a.region === r);
            return (
              <div key={r}>
                <GroupHeader region={r} title={groupCopy[r].title} blurb={groupCopy[r].blurb} count={items.length} noun={["attraction", "attractions"]} />
                {/* key restarts the entrance animation when the area changes */}
                <AttractionGrid key={`${region ?? "all"}-${r}`} items={items} priority={r === shownRegions[0]} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
