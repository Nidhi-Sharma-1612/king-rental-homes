"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * A dropdown panel on tablet/desktop that becomes a bottom sheet on phones.
 * Closes on outside click and on Escape.
 */
export function Panel({
  open,
  onClose,
  title,
  children,
  className,
  align = "left",
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
  footer?: React.ReactNode;
}) {
  const isSheet = !useMediaQuery("(min-width: 768px)");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: PointerEvent) => {
      if (isSheet) return; // the sheet has its own backdrop
      const target = e.target as HTMLElement;
      if (ref.current && !ref.current.contains(target) && !target.closest("[data-panel-trigger]")) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    if (isSheet) document.body.style.overflow = "hidden";
    // Dropdowns near the bottom of the hero would otherwise open below the fold.
    const t = isSheet ? undefined : window.setTimeout(() => ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 220);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
      if (isSheet) document.body.style.overflow = "";
    };
  }, [open, onClose, isSheet]);

  return (
    <AnimatePresence>
      {open &&
        (isSheet ? (
          <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={title}>
            <motion.div
              className="absolute inset-0 bg-ink-deep/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              ref={ref}
              className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[1.75rem] bg-paper text-text shadow-lift"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => info.offset.y > 120 && onClose()}
            >
              <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-line" aria-hidden />
              <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-3">
                <h2 className="font-display text-xl text-ink">{title}</h2>
                <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
                  <X className="size-5" />
                </button>
              </div>
              <div className="overflow-y-auto px-5 pb-4">{children}</div>
              {footer && <div className="shrink-0 border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
            </motion.div>
          </div>
        ) : (
          <motion.div
            ref={ref}
            role="dialog"
            aria-label={title}
            className={clsx(
              "absolute top-[calc(100%+0.75rem)] z-[60] rounded-3xl border border-line bg-paper p-6 text-text shadow-lift",
              align === "left" && "left-0",
              align === "right" && "right-0",
              align === "center" && "left-1/2 -translate-x-1/2",
              className,
            )}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
            {footer && <div className="mt-5 border-t border-line pt-4">{footer}</div>}
          </motion.div>
        ))}
    </AnimatePresence>
  );
}
