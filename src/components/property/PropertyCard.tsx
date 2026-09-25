"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, PawPrint, PlugZap, Star } from "lucide-react";
import clsx from "clsx";
import { formatBaths, plural, usd } from "@/lib/format";
import type { Property } from "@/lib/types";

const CAROUSEL_COUNT = 5;

export function PropertyCard({ property: p, query = "", priority = false }: { property: Property; query?: string; priority?: boolean }) {
  const href = `/properties/${p.slug}${query}`;
  const images = p.images.slice(0, CAROUSEL_COUNT);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * Math.max(0, Math.min(images.length - 1, index + dir)), behavior: "smooth" });
  };

  const specs = [plural(p.guests, "guest"), plural(p.bedrooms, "bedroom"), plural(p.beds, "bed"), formatBaths(p.baths)];

  return (
    <article className="group/card relative flex flex-col">
      {/* Photo carousel: swipe on touch, arrows on hover */}
      <div className="relative overflow-hidden rounded-2xl bg-mist">
        <div
          ref={track}
          onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="no-scrollbar flex aspect-4/3 snap-x snap-mandatory overflow-x-auto"
          aria-label={`${p.name} photos`}
        >
          {images.map((src, i) => (
            <Link key={src} href={href} tabIndex={-1} aria-hidden={i > 0} className="relative block h-full w-full shrink-0 snap-center">
              <Image
                src={src}
                alt={i === 0 ? p.name : ""}
                fill
                sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover/card:scale-[1.04]"
                priority={priority && i === 0}
                loading={priority && i === 0 ? undefined : "lazy"}
              />
            </Link>
          ))}
        </div>

        {/* soft shade so badges and dots stay legible on bright photos */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-ink-deep/25 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-ink-deep/30 to-transparent" aria-hidden />

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-paper/90 px-2.5 py-1 text-[0.7rem] font-semibold text-ink backdrop-blur">
            {p.region === "boston" ? "Boston area" : "Colorado"}
          </span>
          <span className="flex gap-1.5">
            {p.evCharging && (
              <span className="grid size-7 place-items-center rounded-full bg-paper/90 text-ink backdrop-blur" title="EV charging">
                <PlugZap className="size-3.5" aria-hidden />
                <span className="sr-only">EV charging</span>
              </span>
            )}
            {p.petFriendly && (
              <span className="grid size-7 place-items-center rounded-full bg-paper/90 text-sage-deep backdrop-blur" title="Pet-friendly">
                <PawPrint className="size-3.5" aria-hidden />
                <span className="sr-only">Pet-friendly</span>
              </span>
            )}
          </span>
        </div>

        {index > 0 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 hidden size-8 -translate-y-1/2 place-items-center rounded-full bg-paper/95 text-ink opacity-0 shadow-soft transition-opacity hover:bg-paper group-hover/card:opacity-100 md:grid"
          >
            <ChevronLeft className="size-4" />
          </button>
        )}
        {index < images.length - 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 hidden size-8 -translate-y-1/2 place-items-center rounded-full bg-paper/95 text-ink opacity-0 shadow-soft transition-opacity hover:bg-paper group-hover/card:opacity-100 md:grid"
          >
            <ChevronRight className="size-4" />
          </button>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1" aria-hidden>
          {images.map((_, i) => (
            <span key={i} className={clsx("h-1 rounded-full bg-paper transition-all duration-300", i === index ? "w-4" : "w-1 opacity-60")} />
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="relative mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-snug text-ink">
            <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {p.name}
            </Link>
          </h3>
          {p.rating != null && (
            <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-text">
              <Star className="size-3.5 fill-clay text-clay" aria-hidden />
              {p.rating.toFixed(2)}
              <span className="font-normal text-muted">({p.reviewCount})</span>
              <span className="sr-only">out of 5 from {p.reviewCount} reviews</span>
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted">
          {p.city}, {p.state}
        </p>
        <p className="mt-3 text-sm text-text/80">{specs.join(" · ")}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-text">
            <span className="text-sm text-muted">From </span>
            <span className="font-semibold">{usd(p.pricePerNight)}</span>
            <span className="text-sm text-muted"> / night</span>
          </p>
          <span
            className="grid size-9 place-items-center rounded-full border border-line text-ink transition-all duration-300 group-hover/card:border-ink group-hover/card:bg-ink group-hover/card:text-paper"
            aria-hidden
          >
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/card:rotate-45" />
          </span>
        </div>
      </div>
    </article>
  );
}
