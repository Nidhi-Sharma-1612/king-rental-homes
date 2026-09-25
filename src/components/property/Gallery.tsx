"use client";

import { useState } from "react";
import Image from "next/image";
import { Grid2x2 } from "lucide-react";
import clsx from "clsx";
import { Lightbox } from "@/components/property/Lightbox";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const tiles = images.slice(0, 5);

  return (
    <>
      <div className="relative">
        {/* Phones: swipeable strip */}
        <div className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:hidden">
          {images.slice(0, 10).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setOpen(i)}
              className="relative aspect-[4/3] w-[88%] shrink-0 snap-center overflow-hidden rounded-2xl bg-mist"
              aria-label={`Open photo ${i + 1} of ${images.length}`}
            >
              <Image src={src} alt={`${name}, photo ${i + 1}`} fill sizes="88vw" className="object-cover" priority={i === 0} />
            </button>
          ))}
        </div>

        {/* Tablet & up: 1 large + 4 mosaic */}
        <div className="hidden h-[26rem] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[1.75rem] sm:grid lg:h-[32rem]">
          {tiles.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setOpen(i)}
              className={clsx("group relative overflow-hidden bg-mist", i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1")}
              aria-label={`Open photo ${i + 1} of ${images.length}`}
            >
              <Image
                src={src}
                alt={`${name}, photo ${i + 1}`}
                fill
                sizes={i === 0 ? "(min-width: 1280px) 640px, 50vw" : "(min-width: 1280px) 320px, 25vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={i === 0}
              />
              <span className="absolute inset-0 bg-ink-deep/0 transition-colors duration-500 group-hover:bg-ink-deep/10" />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen(0)}
          className="absolute bottom-4 right-4 hidden items-center gap-2 rounded-full border border-ink/10 bg-paper px-4 py-2.5 text-sm font-semibold text-ink shadow-soft transition-colors hover:bg-mist sm:inline-flex"
        >
          <Grid2x2 className="size-4" aria-hidden /> Show all {images.length} photos
        </button>
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="hit mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ink underline underline-offset-4 sm:hidden"
        >
          <Grid2x2 className="size-4" aria-hidden /> See all {images.length} photos
        </button>
      </div>

      <Lightbox images={images} name={name} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
