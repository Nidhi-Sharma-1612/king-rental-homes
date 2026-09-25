import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import clsx from "clsx";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import type { Attraction } from "@/lib/types";

type Tile = { lg: string; md: string; large: boolean; wide: boolean };

/*
 * Bento spans for a 4-column (laptop) / 2-column (tablet) grid.
 * Full chunks of 6 use:   A A B C
 *                         A A D C
 *                         E E F F
 * A leftover chunk of 1–5 gets its own pattern so every row is filled; a single leftover
 * joins the previous chunk as a 7-tile pattern (A A B C / A A D C / E F G G).
 */
const LG: Record<number, string[]> = {
  7: ["lg:col-span-2 lg:row-span-2", "", "lg:row-span-2", "", "", "", "lg:col-span-2"],
  6: ["lg:col-span-2 lg:row-span-2", "", "lg:row-span-2", "", "lg:col-span-2", "lg:col-span-2"],
  5: ["lg:col-span-2 lg:row-span-2", "", "", "", ""],
  4: ["lg:col-span-2 lg:row-span-2", "", "", "lg:col-span-2"],
  3: ["lg:col-span-2 lg:row-span-2", "lg:col-span-2", "lg:col-span-2"],
  2: ["lg:col-span-2", "lg:col-span-2"],
  1: ["lg:col-span-4"],
};

function layout(count: number): Tile[] {
  const tiles: Tile[] = [];
  for (let start = 0; start < count; ) {
    const left = count - start;
    const size = left === 7 ? 7 : Math.min(6, left);
    LG[size].forEach((lg, i) => {
      // phones & tablets (2 columns): the chunk's first tile spans both; keep the rest paired
      const singles = size - 1;
      const wide = i === 0 || (singles % 2 === 1 && i === size - 1);
      const md = wide ? (lg.includes("lg:col-span") ? "col-span-2" : "col-span-2 lg:col-span-1") : "";
      tiles.push({ lg, md, large: i === 0 && size >= 3, wide });
    });
    start += size;
  }
  return tiles;
}

export function AttractionBento({ items, priority = false }: { items: Attraction[]; priority?: boolean }) {
  const tiles = layout(items.length);
  return (
    <Stagger className="grid auto-rows-[11.5rem] grid-cols-2 gap-3 sm:auto-rows-[16rem] sm:gap-4 lg:auto-rows-[14.5rem] lg:grid-cols-4 lg:gap-5">
      {items.map((a, i) => (
        <StaggerItem key={a.slug} className={clsx(tiles[i].md, tiles[i].lg)}>
          <AttractionTile attraction={a} large={tiles[i].large} compact={!tiles[i].wide} priority={priority && i < 2} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function AttractionTile({ attraction: a, large, compact, priority }: { attraction: Attraction; large: boolean; compact: boolean; priority: boolean }) {
  return (
    <Link
      href={`/attractions/${a.slug}`}
      className="group relative flex h-full flex-col justify-end overflow-hidden rounded-[1.5rem] bg-ink-deep text-paper focus-visible:outline-offset-4"
    >
      <Image
        src={a.image}
        alt=""
        fill
        priority={priority}
        sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
        className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
      />
      <span className="absolute inset-0 bg-linear-to-t from-ink-deep/85 via-ink-deep/20 to-transparent" aria-hidden />

      <span className={clsx("absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.65rem] font-semibold text-ink backdrop-blur sm:left-4 sm:top-4 sm:text-[0.7rem]", compact && "max-sm:hidden")}>
        {a.category}
      </span>
      <span
        className="absolute right-3 top-3 grid size-8 place-items-center sm:right-4 sm:top-4 sm:size-9 rounded-full bg-paper/15 text-paper backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-paper group-hover:text-ink"
        aria-hidden
      >
        <ArrowUpRight className="size-4" />
      </span>

      <span className={clsx("relative p-3.5 sm:p-5", large && "lg:p-7")}>
        <span className="flex items-center gap-1.5 text-[0.7rem] text-paper/75 sm:text-xs">
          <MapPin className="size-3" aria-hidden />
          {a.location}
        </span>
        <span className={clsx("mt-1 block font-display leading-tight sm:mt-1.5", large ? "text-2xl lg:text-[2rem]" : "text-base sm:text-xl")}>{a.name}</span>
        {large && <span className="mt-2 hidden max-w-lg text-pretty text-sm leading-relaxed text-paper/80 lg:line-clamp-2">{a.description}</span>}
      </span>
    </Link>
  );
}
