"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Send } from "lucide-react";
import clsx from "clsx";

const sources = ["Instagram", "Facebook", "Google", "Friend", "Email", "TikTok", "Airbnb", "VRBO", "Other"];

type Errors = Partial<Record<"firstName" | "lastName" | "email" | "message", string>>;

// Phase 1: validates and confirms in the UI. Phase 2 wires this to email/CRM.
export interface Topic {
  label: string;
  /** Message prompt shown when this topic is picked */
  placeholder: string;
}

export function ContactForm({
  messagePlaceholder = "Dates, number of guests, which home you're interested in…",
  topics,
}: {
  messagePlaceholder?: string;
  /** Optional "What can we help with?" picker; each topic swaps the message prompt */
  topics?: Topic[];
} = {}) {
  const [errors, setErrors] = useState<Errors>({});
  const [topic, setTopic] = useState(0);
  const placeholder = topics?.[topic]?.placeholder ?? messagePlaceholder;
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(data.get("firstName")).trim()) next.firstName = "Please enter your first name.";
    if (!String(data.get("lastName")).trim()) next.lastName = "Please enter your last name.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email")))) next.email = "Please enter a valid email address.";
    if (String(data.get("message")).trim().length < 10) next.message = "Tell us a little more (at least 10 characters).";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="sent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-16 text-center">
          <CircleCheck className="size-14 text-sage-deep" aria-hidden />
          <p className="mt-5 font-display text-2xl text-ink">Thanks, message received!</p>
          <p className="mt-2 max-w-sm text-muted">We&apos;ll get back to you as soon as we can.</p>
        </motion.div>
      ) : (
        <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, y: -12 }} className="mt-8 grid grid-cols-2 gap-4 sm:gap-5">
          {topics && (
            <fieldset className="col-span-2">
              <legend className="mb-3 text-sm font-semibold text-text">What can we help with?</legend>
              <div className="flex flex-wrap gap-2">
                {topics.map((t, i) => (
                  <label
                    key={t.label}
                    className={clsx(
                      "inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-clay",
                      topic === i ? "bg-ink text-paper" : "bg-sand text-text ring-1 ring-line hover:ring-ink/40",
                    )}
                  >
                    <input type="radio" name="topic" value={t.label} checked={topic === i} onChange={() => setTopic(i)} className="sr-only" />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <Field name="firstName" label="First name" autoComplete="given-name" error={errors.firstName} />
          <Field name="lastName" label="Last name" autoComplete="family-name" error={errors.lastName} />
          <Field name="email" type="email" label="Email address" autoComplete="email" error={errors.email} className="max-sm:col-span-2" />
          <Field name="phone" type="tel" label="Phone number" autoComplete="tel" optional className="max-sm:col-span-2" />
          <div className="col-span-2">
            <label htmlFor="source" className="mb-2 block text-sm font-semibold text-text">
              How did you hear about us? <span className="font-normal text-muted">(optional)</span>
            </label>
            <select id="source" name="source" defaultValue="" className={inputClass()}>
              <option value="" disabled>
                Select an option
              </option>
              {sources.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label htmlFor="message" className="mb-2 block text-sm font-semibold text-text">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={clsx(inputClass(!!errors.message), "h-auto resize-y py-3.5")}
              placeholder={placeholder}
            />
            {errors.message && <p id="message-error" className="mt-1.5 text-sm text-clay-deep">{errors.message}</p>}
          </div>
          <button type="submit" className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ink px-8 font-semibold text-paper transition-colors hover:bg-ink-deep col-span-2 sm:justify-self-start">
            Send message <Send className="size-4" aria-hidden />
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function inputClass(invalid?: boolean) {
  return clsx(
    "h-13 w-full rounded-2xl border bg-sand/50 px-4 text-text placeholder:text-muted/70 transition-colors focus:border-ink focus:bg-paper focus:outline-none",
    invalid ? "border-clay" : "border-line",
  );
}

function Field({
  name,
  label,
  error,
  optional,
  className,
  ...rest
}: { name: string; label: string; error?: string; optional?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-text">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClass(!!error)}
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-clay-deep">
          {error}
        </p>
      )}
    </div>
  );
}
