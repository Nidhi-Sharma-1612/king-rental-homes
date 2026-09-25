"use client";

import { Minus, Plus } from "lucide-react";

export interface Guests {
  adults: number;
  children: number;
  pets: number;
}

export const defaultGuests: Guests = { adults: 2, children: 0, pets: 0 };

export function guestSummary(g: Guests) {
  const people = g.adults + g.children;
  const parts = [`${people} guest${people === 1 ? "" : "s"}`];
  if (g.pets) parts.push(`${g.pets} pet${g.pets === 1 ? "" : "s"}`);
  return parts.join(", ");
}

export function GuestPicker({ value, onChange, maxGuests = 16 }: { value: Guests; onChange: (g: Guests) => void; maxGuests?: number }) {
  const people = value.adults + value.children;
  const rows: { key: keyof Guests; label: string; hint: string; min: number; max: number }[] = [
    { key: "adults", label: "Adults", hint: "Ages 13+", min: 1, max: maxGuests - value.children },
    { key: "children", label: "Children", hint: "Ages 2–12", min: 0, max: maxGuests - value.adults },
    { key: "pets", label: "Pets", hint: "Well-behaved pets welcome", min: 0, max: 3 },
  ];
  return (
    <div className="divide-y divide-line">
      {rows.map((r) => (
        <div key={r.key} className="flex items-center justify-between gap-6 py-4 first:pt-1 last:pb-1">
          <div>
            <p className="font-semibold text-text">{r.label}</p>
            <p className="text-sm text-muted">{r.hint}</p>
          </div>
          <div className="flex items-center gap-3">
            <Stepper
              label={`Fewer ${r.label.toLowerCase()}`}
              disabled={value[r.key] <= r.min}
              onClick={() => onChange({ ...value, [r.key]: value[r.key] - 1 })}
            >
              <Minus className="size-4" />
            </Stepper>
            <span className="w-6 text-center font-semibold tabular-nums" aria-live="polite">
              {value[r.key]}
            </span>
            <Stepper
              label={`More ${r.label.toLowerCase()}`}
              disabled={value[r.key] >= r.max}
              onClick={() => onChange({ ...value, [r.key]: value[r.key] + 1 })}
            >
              <Plus className="size-4" />
            </Stepper>
          </div>
        </div>
      ))}
      {people >= maxGuests && <p className="pt-3 text-xs text-muted">This home sleeps up to {maxGuests} guests.</p>}
    </div>
  );
}

function Stepper({ children, label, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line"
      {...rest}
    >
      {children}
    </button>
  );
}
