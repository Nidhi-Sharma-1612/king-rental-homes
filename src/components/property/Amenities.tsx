"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { amenityIcon, groupAmenities, topAmenities } from "@/lib/amenities";

export function Amenities({ amenities }: { amenities: string[] }) {
  const [open, setOpen] = useState(false);
  const top = topAmenities(amenities, 10);
  const { visible, groups } = groupAmenities(amenities);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {top.map((a) => {
          const Icon = amenityIcon(a);
          return (
            <li key={a} className="flex items-center gap-3.5 text-text">
              <Icon className="size-5 shrink-0 text-sage-deep" aria-hidden />
              {a}
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 rounded-full border border-ink/25 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
      >
        Show all {visible.length} amenities
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="All amenities">
            <motion.div className="absolute inset-0 bg-ink-deep/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div
              className="relative flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.75rem] bg-paper shadow-lift sm:rounded-[1.75rem]"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <h2 className="font-display text-2xl text-ink">What this home offers</h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
                  <X className="size-5" />
                </button>
              </div>
              <div className="overflow-y-auto px-6 py-6">
                {groups.map(([group, items]) => (
                  <section key={group} className="mb-8 last:mb-0">
                    <h3 className="eyebrow mb-3 text-sage-deep">{group}</h3>
                    <ul className="divide-y divide-line">
                      {items.map((a) => {
                        const Icon = amenityIcon(a);
                        return (
                          <li key={a} className="flex items-center gap-4 py-3.5 text-text">
                            <Icon className="size-5 shrink-0 text-muted" aria-hidden />
                            {a}
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
