import clsx from "clsx";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  className,
  action,
  actionClassName,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  action?: React.ReactNode;
  /** e.g. "max-md:hidden" when the page repeats the action below the content on phones */
  actionClassName?: string;
}) {
  const centered = align === "center";
  return (
    <Reveal
      className={clsx(
        "mb-10 flex flex-col gap-6 md:mb-14",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={clsx("max-w-2xl", centered && "mx-auto")}>
        {eyebrow && (
          <p className={clsx("eyebrow mb-4 flex items-center gap-3", centered && "justify-center", tone === "light" ? "text-sage" : "text-sage-deep")}>
            <span className="h-px w-8 bg-current" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h2 className={clsx("display-lg text-balance", tone === "light" ? "text-paper" : "text-ink")}>{title}</h2>
        {intro && (
          <p className={clsx("lede mt-5 text-pretty", tone === "light" ? "text-paper/75" : "text-muted")}>{intro}</p>
        )}
      </div>
      {action && <div className={clsx("shrink-0", actionClassName)}>{action}</div>}
    </Reveal>
  );
}
