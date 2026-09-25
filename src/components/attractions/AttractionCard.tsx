import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import clsx from "clsx";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import type { Attraction } from "@/lib/types";

/** Editorial attraction card: compact row on phones, photo-on-top card from tablet up. */
export function AttractionCard({
  attraction: a,
  priority = false,
  featured = false,
}: {
  attraction: Attraction;
  priority?: boolean;
  /** Wide horizontal layout on laptops (used to fill an otherwise lonely last row) */
  featured?: boolean;
}) {
  return (
    <Link
      href={`/attractions/${a.slug}`}
      className={clsx("group flex h-full gap-4 rounded-2xl bg-paper p-3 ring-1 ring-line transition-shadow duration-500 hover:shadow-lift sm:flex-col sm:gap-0 sm:overflow-hidden sm:rounded-[1.5rem] sm:p-0", featured && "lg:flex-row")}
    >
      <div className={clsx("relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl sm:aspect-4/3 sm:w-full sm:rounded-none", featured && "lg:aspect-auto lg:min-h-80 lg:w-[58%]")}>
        <Image
          src={a.image}
          alt={a.name}
          fill
          priority={priority}
          sizes={featured ? "(min-width: 1024px) 720px, (min-width: 640px) 50vw, 112px" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 112px"}
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute left-3 top-3 hidden rounded-full bg-paper/90 px-2.5 py-1 text-[0.7rem] font-semibold text-ink backdrop-blur sm:block">
          {a.category}
        </span>
      </div>

      <div className={clsx("flex min-w-0 flex-1 flex-col py-1 sm:p-6", featured && "lg:justify-center lg:p-10")}>
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="size-3.5 shrink-0 text-clay" aria-hidden />
          <span className="truncate">{a.location}</span>
          <span className="sm:hidden">· {a.category}</span>
        </p>
        <h3 className={clsx("mt-1.5 font-display text-lg leading-snug text-ink sm:text-[1.4rem]", featured && "lg:text-3xl")}>{a.name}</h3>
        <p className={clsx("mt-2 hidden text-sm leading-relaxed text-muted sm:line-clamp-3", featured && "lg:mt-4 lg:line-clamp-5 lg:text-base")}>{a.description}</p>
        <span className={clsx("mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-clay-deep sm:pt-5", featured && "lg:mt-6")}>
          Read more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function AttractionGrid({ items, priority = false }: { items: Attraction[]; priority?: boolean }) {
  // On the 3-column laptop grid, a count like 10 would leave one card alone; feature the first instead.
  const featureFirst = items.length > 3 && (items.length - 1) % 3 === 0;
  return (
    <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
      {items.map((a, i) => (
        <StaggerItem key={a.slug} className={featureFirst && i === 0 ? "lg:col-span-3" : undefined}>
          <AttractionCard attraction={a} priority={priority && i < 3} featured={featureFirst && i === 0} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
