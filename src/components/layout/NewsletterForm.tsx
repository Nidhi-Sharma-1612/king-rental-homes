"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

// Sends the sign-up to the host by email (/api/newsletter) until a mailing-list provider is chosen.
export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state !== "idle") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "We couldn't sign you up right now.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't sign you up right now.");
      setState("idle");
    }
  };

  const done = state === "done";
  return (
    <form className="mt-6" onSubmit={onSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          disabled={state !== "idle"}
          className="h-12 w-full min-w-0 rounded-full border border-paper/15 bg-paper/5 px-5 text-paper placeholder:text-paper/40 focus:border-sage focus:outline-none disabled:opacity-60 sm:flex-1"
        />
        {/* Honeypot: hidden from people, filled in by bots */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] size-px opacity-0" />
        <button
          type="submit"
          disabled={state !== "idle"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sage px-6 font-semibold text-ink-deep transition-colors hover:bg-mist disabled:opacity-90"
        >
          {done ? (
            <>
              <Check className="size-4" aria-hidden /> Subscribed
            </>
          ) : state === "sending" ? (
            <>
              Subscribing <Loader2 className="size-4 animate-spin" aria-hidden />
            </>
          ) : (
            <>
              Subscribe <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-clay">
          {error}
        </p>
      )}
    </form>
  );
}
