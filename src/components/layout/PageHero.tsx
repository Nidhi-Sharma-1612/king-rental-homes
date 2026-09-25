import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";
import { Reveal } from "@/components/ui/Reveal";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  crumbs = [],
  size = "md",
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  image: string;
  crumbs?: { label: string; href?: string }[];
  /** "compact" hugs its content, for pages that put a search bar in the hero */
  size?: "compact" | "sm" | "md";
  children?: React.ReactNode;
}) {
  return (
    <section
      className={clsx(
        "relative flex items-end bg-ink-deep text-paper",
        size === "md" && "min-h-[32rem] sm:min-h-[36rem] lg:min-h-[40rem]",
        size === "sm" && "min-h-[26rem] sm:min-h-[30rem]",
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/65 to-ink-deep/50" aria-hidden />
      <div className={clsx("container-x relative", size === "compact" ? "pb-10 pt-28 sm:pb-14 sm:pt-32" : "pb-14 pt-32 sm:pb-20")}>
        <Reveal className={size === "compact" ? "max-w-4xl" : "max-w-3xl"}>
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className={size === "compact" ? "mb-4" : "mb-6"}>
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-paper/70">
                <li>
                  <Link href="/" className="hit hover:text-paper">
                    Home
                  </Link>
                </li>
                {crumbs.map((c) => (
                  <li key={c.label} className="flex items-center gap-1.5">
                    <ChevronRight className="size-3.5" aria-hidden />
                    {c.href ? (
                      <Link href={c.href} className="hit hover:text-paper">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-paper">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && <p className="eyebrow mb-4 text-mist/90">{eyebrow}</p>}
          <h1 className={clsx("text-balance", size === "compact" ? "display-lg" : "display-xl")}>{title}</h1>
          {intro && <p className={clsx("lede max-w-2xl text-pretty text-paper/80", size === "compact" ? "mt-4" : "mt-6")}>{intro}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
