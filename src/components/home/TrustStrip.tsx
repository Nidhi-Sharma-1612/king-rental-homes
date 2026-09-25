"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { CalendarHeart, House, PawPrint, Star } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Counts up to `value` the first time it scrolls into view. */
function CountUp({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, { duration: 1.6, ease, onUpdate: setShown });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {(reduce ? value : shown).toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function TrustStrip({
  rating,
  reviews,
  homes,
  petFriendly,
  since,
}: {
  rating: number | null;
  reviews: number;
  homes: number;
  petFriendly: number;
  since: number;
}) {
  const reduce = useReducedMotion();
  const years = new Date().getFullYear() - since;

  const items = [
    {
      Icon: Star,
      value: <CountUp value={rating ?? 5} decimals={2} />,
      extra: (
        <span className="hidden gap-0.5 sm:flex" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-3 fill-clay text-clay" />
          ))}
        </span>
      ),
      label: `Guest rating · ${reviews} reviews`,
    },
    { Icon: CalendarHeart, value: <CountUp value={years} suffix="+" />, label: `Years hosting · since ${since}` },
    { Icon: House, value: <CountUp value={homes} />, label: "Homes in MA & CO" },
    { Icon: PawPrint, value: <CountUp value={Math.round((petFriendly / homes) * 100)} suffix="%" />, label: "Pet-friendly homes" },
  ];

  return (
    <section aria-label="Why guests trust us" className="border-b border-line bg-paper">
      <motion.ul
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="container-x grid grid-cols-2 lg:grid-cols-4"
      >
        {items.map(({ Icon, value, extra, label }, i) => (
          <li
            key={label}
            className={clsx(
              "relative flex items-center gap-3 py-4 sm:gap-4 sm:py-5 lg:justify-center lg:py-6",
              i % 2 === 1 && "pl-5 sm:pl-7 lg:pl-0",
            )}
          >
            {/* Vertical divider: a fading sage line with a small diamond, echoing the logo's crest */}
            {i > 0 && (
              <span
                aria-hidden
                className={clsx(
                  "pointer-events-none absolute left-0 top-1/2 h-14 w-px -translate-y-1/2 bg-linear-to-b from-transparent via-sage to-transparent",
                  i === 2 && "hidden lg:block",
                )}
              >
                <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-sage ring-4 ring-paper" />
              </span>
            )}
            {/* Horizontal divider between rows on phones and tablets */}
            {i < 2 && (
              <span
                aria-hidden
                className={clsx(
                  "pointer-events-none absolute bottom-0 h-px bg-linear-to-r from-transparent via-line to-transparent lg:hidden",
                  i === 0 ? "left-0 right-3" : "left-3 right-0",
                )}
              />
            )}
            <span className="hidden size-10 shrink-0 place-items-center rounded-full bg-mist text-ink sm:grid">
              <Icon className="size-4" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="font-display text-2xl leading-none text-ink sm:text-[1.75rem]">{value}</span>
                {extra}
              </span>
              <span className="mt-1 block text-xs leading-snug text-muted sm:text-sm">{label}</span>
            </span>
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
