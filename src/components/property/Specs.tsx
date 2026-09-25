import { Bath, BedDouble, DoorOpen, Users } from "lucide-react";
import clsx from "clsx";
import { formatBaths, plural } from "@/lib/format";
import type { Property } from "@/lib/types";

export function Specs({ property: p, className, compact }: { property: Property; className?: string; compact?: boolean }) {
  const items = [
    { Icon: Users, label: plural(p.guests, "guest") },
    { Icon: DoorOpen, label: plural(p.bedrooms, "bedroom") },
    { Icon: BedDouble, label: plural(p.beds, "bed") },
    { Icon: Bath, label: formatBaths(p.baths) },
  ];
  return (
    <ul className={clsx("flex flex-wrap text-text", compact ? "gap-x-4 gap-y-2 text-sm" : "gap-3", className)}>
      {items.map(({ Icon, label }) => (
        <li
          key={label}
          className={clsx("inline-flex items-center gap-1.5", !compact && "rounded-full border border-line bg-paper px-4 py-2 text-[0.95rem]")}
        >
          <Icon className={clsx("text-sage-deep", compact ? "size-4" : "size-[1.1rem]")} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );
}
