"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import clsx from "clsx";
import { Stars } from "@/components/ui/Rating";
import type { Review } from "@/lib/types";

export function ReviewCard({
  review,
  home,
  homeHref,
  className,
  clamp = true,
}: {
  review: Review;
  /** Name of the home the guest stayed at, shown in the footer */
  home?: string;
  homeHref?: string;
  className?: string;
  clamp?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const long = review.text.length > 240;
  const initial = review.name.trim().charAt(0).toUpperCase();

  return (
    <figure
      className={clsx(
        "group/review flex flex-col rounded-[1.75rem] bg-paper p-6 shadow-soft ring-1 ring-line transition-all duration-500 hover:-translate-y-1 hover:shadow-lift sm:p-7",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-2xl bg-mist text-sage-deep transition-colors duration-500 group-hover/review:bg-ink group-hover/review:text-mist">
          <Quote className="size-5 fill-current" aria-hidden />
        </span>
        <Stars value={review.rating} />
      </div>

      <blockquote
        className={clsx(
          "mt-5 flex-1 text-pretty font-display text-[1.08rem] leading-[1.65] text-ink",
          clamp && long && !expanded && "line-clamp-6",
        )}
      >
        {review.text}
      </blockquote>
      {clamp && long && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="hit mt-3 self-start text-sm font-semibold text-clay-deep underline decoration-clay/40 underline-offset-4 hover:decoration-clay"
        >
          {expanded ? "Show less" : "Read full review"}
        </button>
      )}

      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-ink to-ink-soft font-display text-lg text-mist"
          aria-hidden
        >
          {initial}
        </span>
        <span className="min-w-0 flex-1 text-sm">
          <span className="block truncate font-semibold text-text">{review.name}</span>
          <span className="text-muted">{review.date}</span>
        </span>
      </figcaption>

      {home &&
        (homeHref ? (
          <Link
            href={homeHref}
            className="mt-4 inline-flex items-center justify-between gap-2 rounded-full bg-sand px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-mist"
          >
            <span className="truncate">
              <span className="font-normal text-muted">Stayed at </span>
              {home}
            </span>
            <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
          </Link>
        ) : (
          <p className="mt-4 rounded-full bg-sand px-4 py-2.5 text-xs text-muted">
            Stayed at <span className="font-semibold text-ink">{home}</span>
          </p>
        ))}
    </figure>
  );
}
