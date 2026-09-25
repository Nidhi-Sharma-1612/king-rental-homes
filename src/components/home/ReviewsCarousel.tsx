"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ReviewCard } from "@/components/property/ReviewCard";
import type { ReviewWithHome } from "@/lib/properties";

const INTERVAL = 6; // seconds per review
const GAP = 20; // px, matches gap-5

export function ReviewsCarousel({ reviews }: { reviews: ReviewWithHome[] }) {
  const track = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "-20% 0px" });
  const reduce = useReducedMotion();

  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [tick, setTick] = useState(0); // bumped on every move, restarting the autoplay timer

  const autoplay = !reduce;
  const paused = hovering || focused || touching || !inView;

  const cardStep = () => {
    const card = track.current?.querySelector<HTMLElement>("[data-card]");
    return (card?.offsetWidth ?? 360) + GAP;
  };

  const goTo = (i: number) => {
    track.current?.scrollTo({ left: i * cardStep(), behavior: "smooth" });
    setTick((t) => t + 1);
  };

  const atEnd = () => {
    const el = track.current;
    return !el || el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
  };

  const next = () => goTo(atEnd() ? 0 : active + 1);
  const prev = () => goTo(active === 0 ? reviews.length - 1 : active - 1);

  const onScroll = () => {
    const el = track.current;
    if (el) setActive(Math.min(reviews.length - 1, Math.round(el.scrollLeft / cardStep())));
  };

  // Autoplay: advance every INTERVAL seconds unless paused. Any move restarts the countdown.
  const advance = useEffectEvent(() => next());
  useEffect(() => {
    if (!autoplay || paused) return;
    const t = window.setTimeout(advance, INTERVAL * 1000);
    return () => window.clearTimeout(t);
  }, [autoplay, paused, tick]);

  // Resume a moment after a swipe ends, so the carousel doesn't jump under the user's finger.
  useEffect(() => {
    if (!touching) return;
    const end = () => window.setTimeout(() => setTouching(false), 2500);
    window.addEventListener("touchend", end, { once: true });
    return () => window.removeEventListener("touchend", end);
  }, [touching]);

  return (
    <div ref={root}>
      <div
        ref={track}
        onScroll={onScroll}
        onTouchStart={() => setTouching(true)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
        aria-roledescription="carousel"
        aria-label="Guest reviews"
        className="no-scrollbar relative flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 pt-2 scroll-px-4 sm:scroll-px-6 lg:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        <span className="w-px shrink-0 sm:w-2 lg:w-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]" aria-hidden />
        {reviews.map((r, i) => (
          <div
            key={r.name + r.slug}
            data-card
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${reviews.length}`}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className="flex w-[86%] shrink-0 snap-start sm:w-[23rem] lg:w-[24rem]"
          >
            <ReviewCard review={r} home={r.home} homeHref={`/properties/${r.slug}`} className="w-full" />
          </div>
        ))}
        <span className="w-px shrink-0 sm:w-2" aria-hidden />
      </div>

      <div className="container-x mt-4 flex justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous review"
          className="grid size-12 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          <ArrowLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next review"
          className="grid size-12 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          <ArrowRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
