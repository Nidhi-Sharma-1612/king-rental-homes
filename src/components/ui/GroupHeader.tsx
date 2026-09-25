import { Mountain, Waves } from "lucide-react";
import type { Region } from "@/lib/types";

/** Heading for a region group in a results list (Properties, Attractions). */
export function GroupHeader({ region, title, blurb, count, noun }: { region: Region; title: string; blurb: string; count: number; noun: [string, string] }) {
  const Icon = region === "boston" ? Waves : Mountain;
  return (
    <div className="mb-8 flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-ink text-mist">
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-2xl leading-tight text-ink sm:text-3xl">{title}</h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{blurb}</p>
        </div>
      </div>
      <p className="shrink-0 text-sm font-semibold text-sage-deep sm:pb-1">
        {count} {count === 1 ? noun[0] : noun[1]}
      </p>
    </div>
  );
}
