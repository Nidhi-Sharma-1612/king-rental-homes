import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { usd } from "@/lib/format";
import type { Property } from "@/lib/types";

/** A lighter card for the home page: one photo, name, a single detail line and price. */
export function FeaturedHomeCard({ property: p, priority = false }: { property: Property; priority?: boolean }) {
  return (
    <Link href={`/properties/${p.slug}`} className="group block focus-visible:outline-none">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist ring-offset-4 ring-offset-sand group-focus-visible:ring-2 group-focus-visible:ring-clay">
        <Image
          src={p.images[0]}
          alt={p.name}
          fill
          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 46vw, 80vw"
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
          priority={priority}
        />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.7rem] font-semibold text-ink backdrop-blur">
          {p.region === "boston" ? "Boston area" : "Colorado"}
        </span>
        <span
          className="absolute bottom-3 right-3 grid size-10 translate-y-2 place-items-center rounded-full bg-paper text-ink opacity-0 shadow-soft transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          aria-hidden
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="font-display text-xl leading-snug text-ink">{p.name}</h3>
        {p.rating != null && (
          <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-text">
            <Star className="size-3.5 fill-clay text-clay" aria-hidden />
            {p.rating.toFixed(2)}
            <span className="sr-only">out of 5</span>
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        {p.city}, {p.state} · {p.guests} guests · {p.bedrooms} bedrooms
      </p>
      <p className="mt-2 text-sm text-text">
        <span className="font-semibold">{usd(p.pricePerNight)}</span>
        <span className="text-muted"> / night</span>
      </p>
    </Link>
  );
}
