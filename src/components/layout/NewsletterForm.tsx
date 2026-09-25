"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

// Phase 1: UI only. Phase 2 posts to the newsletter provider.
export function NewsletterForm() {
  const [done, setDone] = useState(false);
  return (
    <form
      className="mt-6 flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="you@example.com"
        disabled={done}
        className="h-12 w-full min-w-0 rounded-full sm:flex-1 border border-paper/15 bg-paper/5 px-5 text-paper placeholder:text-paper/40 focus:border-sage focus:outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={done}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sage px-6 font-semibold text-ink-deep transition-colors hover:bg-mist disabled:opacity-90"
      >
        {done ? (
          <>
            <Check className="size-4" aria-hidden /> Subscribed
          </>
        ) : (
          <>
            Subscribe <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
