import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "accent" | "outline" | "ghost" | "light";
type Size = "md" | "lg" | "sm";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink-deep shadow-soft hover:shadow-lift",
  accent: "bg-clay text-white hover:bg-clay-deep shadow-soft hover:shadow-lift",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink hover:bg-ink/5",
  light: "bg-paper text-ink hover:bg-mist shadow-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };

export function buttonClass({ variant = "primary", size = "md", className }: Omit<Common, "children">) {
  return clsx(base, variants[variant], sizes[size], className);
}

export function ButtonLink({
  href,
  external,
  ...props
}: Common & { href: string; external?: boolean }) {
  const cls = buttonClass(props);
  if (external)
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {props.children}
    </Link>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClass({ variant, size, className })} {...rest}>
      {children}
    </button>
  );
}
