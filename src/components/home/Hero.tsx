"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SearchBar } from "@/components/booking/SearchBar";

const ease = [0.22, 1, 0.36, 1] as const;

// Aerial footage from the original kingrentalhomes.com hero, re-encoded for the web (see public/video).
const video = {
  poster: "/video/hero-poster.jpg",
  mobile: "/video/hero-1280.mp4",
  desktop: "/video/hero-1920.mp4",
};

export function Hero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 140]);

  // Respect reduced motion: show the poster frame instead of autoplaying.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (reduce) el.pause();
    else el.play().catch(() => {});
  }, [reduce]);

  const fade = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease } };

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center bg-ink-deep text-paper">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div className="absolute inset-0" style={{ y }}>
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full scale-105 object-cover"
            poster={video.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={video.mobile} type="video/mp4" media="(max-width: 1024px)" />
            <source src={video.desktop} type="video/mp4" />
          </video>
        </motion.div>
      </div>

      {/* Legibility layers: overall tint, a soft spotlight behind the copy, darker top and bottom edges */}
      <div className="absolute inset-0 bg-ink-deep/45" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgb(19_42_51/0.45),transparent_75%)]"
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink-deep/70 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink-deep/80 to-transparent" aria-hidden />

      <div className="container-x relative flex flex-col items-center pb-28 pt-36 text-center sm:pb-32">
        <motion.p {...fade(0.2)} className="eyebrow mb-6 flex items-center gap-3 whitespace-nowrap text-mist">
          <span className="hidden h-px w-8 bg-current min-[380px]:block" aria-hidden />
          Family-hosted since 2011
          <span className="hidden h-px w-8 bg-current min-[380px]:block" aria-hidden />
        </motion.p>

        <motion.h1 {...fade(0.35)} className="display-xl max-w-4xl text-balance [text-shadow:0_2px_24px_rgb(19_42_51/0.35)]">
          Escape the ordinary.
          <span className="mt-3 block text-[0.55em] italic leading-tight text-mist/90">
            Come home to the coast &amp; the mountains.
          </span>
        </motion.h1>

        <motion.div {...fade(0.55)} className="mt-10 w-full max-w-4xl text-left sm:mt-12">
          <SearchBar />
        </motion.div>
      </div>

      <motion.a
        href="#homes"
        {...fade(0.9)}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-paper/70 transition-colors hover:text-paper sm:flex"
      >
        Explore
        <ChevronDown className="size-5 animate-bounce motion-reduce:animate-none" aria-hidden />
      </motion.a>
    </section>
  );
}
