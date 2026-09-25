import { Star } from "lucide-react";
import clsx from "clsx";

export function Rating({
  rating,
  count,
  className,
  size = "sm",
}: {
  rating: number | null;
  count?: number;
  className?: string;
  size?: "sm" | "md";
}) {
  if (rating == null) return null;
  return (
    <span className={clsx("inline-flex items-center gap-1.5 font-semibold text-text", size === "md" ? "text-base" : "text-sm", className)}>
      <Star className={clsx("fill-clay text-clay", size === "md" ? "size-4.5" : "size-4")} aria-hidden />
      {rating.toFixed(2)}
      {count != null && <span className="font-normal text-muted">({count} reviews)</span>}
      <span className="sr-only">out of 5</span>
    </span>
  );
}

export function Stars({ value = 5, className }: { value?: number; className?: string }) {
  return (
    <span className={clsx("inline-flex gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={clsx("size-4", i < Math.round(value) ? "fill-clay text-clay" : "text-line")} aria-hidden />
      ))}
    </span>
  );
}
