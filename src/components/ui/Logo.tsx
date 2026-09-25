import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" className={clsx("flex items-center gap-3", className)} aria-label="King Rental Homes, home">
      <Image src="/logo.png" alt="" width={48} height={48} className="size-11 shrink-0 rounded-full sm:size-12" priority />
      <span className="leading-none">
        <span
          className={clsx(
            "block whitespace-nowrap font-display text-[1.2rem] tracking-tight sm:text-[1.35rem]",
            tone === "light" ? "text-paper" : "text-ink",
          )}
        >
          King Rental Homes
        </span>
        <span className={clsx("eyebrow mt-1 hidden text-[0.6rem]! sm:block", tone === "light" ? "text-paper/60" : "text-muted")}>
          Est. 2011 · MA & CO
        </span>
      </span>
    </Link>
  );
}
