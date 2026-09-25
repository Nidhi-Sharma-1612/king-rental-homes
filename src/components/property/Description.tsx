"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { isSubheading } from "@/lib/format";

const PREVIEW = 3;

export function Description({ paragraphs }: { paragraphs: string[] }) {
  const [open, setOpen] = useState(false);
  const preview = paragraphs.slice(0, PREVIEW);
  const rest = paragraphs.slice(PREVIEW);

  const render = (list: string[], offset = 0) =>
    list.map((p, i) =>
      isSubheading(p) ? (
        <h3 key={i + offset} className="pt-3 font-display text-xl text-ink">
          {p}
        </h3>
      ) : (
        <p key={i + offset}>{p}</p>
      ),
    );

  return (
    <div>
      <div className="space-y-4 text-pretty leading-[1.75] text-text/90">
        {render(preview)}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 overflow-hidden"
            >
              {render(rest, PREVIEW)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="hit mt-6 inline-flex items-center gap-1.5 font-semibold text-ink underline underline-offset-4"
        >
          {open ? "Show less" : "Read the full description"}
          <ChevronDown className={clsx("size-4 transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      )}
    </div>
  );
}
