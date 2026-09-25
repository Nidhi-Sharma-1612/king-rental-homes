"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import clsx from "clsx";

const slide = {
  enter: (d: number) => ({ opacity: 0, x: d * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -60 }),
};

export function Lightbox({
  images,
  name,
  index,
  onClose,
  onIndex,
}: {
  images: string[];
  name: string;
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState(1);

  const go = (dir: 1 | -1) => {
    if (index === null) return;
    setDirection(dir);
    onIndex((index + dir + images.length) % images.length);
  };

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  });

  useEffect(() => {
    thumbs.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photos`}
          className="fixed inset-0 z-[80] flex flex-col bg-ink-deep text-paper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="text-sm tabular-nums text-paper/70">
              {index + 1} / {images.length}
            </p>
            <p className="hidden truncate px-4 font-display text-lg sm:block">{name}</p>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close gallery" className="grid size-11 place-items-center rounded-full hover:bg-paper/10">
              <X className="size-6" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={index}
                custom={direction}
                variants={slide}
                className="relative h-full w-full"
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
              >
                <Image src={images[index]} alt={`${name}, photo ${index + 1}`} fill sizes="100vw" quality={85} className="pointer-events-none select-none object-contain" priority />
              </motion.div>
            </AnimatePresence>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-4 hidden size-12 place-items-center rounded-full bg-paper/10 hover:bg-paper/20 sm:grid">
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-4 hidden size-12 place-items-center rounded-full bg-paper/10 hover:bg-paper/20 sm:grid">
              <ChevronRight className="size-6" />
            </button>
          </div>

          <div ref={thumbs} className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-4 sm:px-6">
            {images.map((src, i) => (
              <button
                key={src}
                data-i={i}
                type="button"
                onClick={() => {
                  setDirection(i > (index ?? 0) ? 1 : -1);
                  onIndex(i);
                }}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={clsx(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-all sm:h-16 sm:w-24",
                  i === index ? "ring-2 ring-sage ring-offset-2 ring-offset-ink-deep" : "opacity-50 hover:opacity-90",
                )}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
