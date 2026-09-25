"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Mail, Menu, Phone, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "@/components/ui/Logo";
import { buttonClass } from "@/components/ui/Button";
import { nav, site } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Pages without a dark image hero get a solid header from the start.
  const solidOnTop = /^\/properties\/.+/.test(pathname);
  const solid = scrolled || solidOnTop || open;

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Close the drawer when the route changes.
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          solid ? "bg-sand/90 shadow-[0_1px_0_var(--line)] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div className="container-x flex h-(--header-h) items-center justify-between gap-6">
          <Logo tone={solid ? "dark" : "light"} />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "relative whitespace-nowrap rounded-full px-2 py-2 text-[0.88rem] font-medium transition-colors xl:px-3.5 xl:text-[0.92rem]",
                      solid ? "text-text hover:text-ink" : "text-paper/85 hover:text-paper",
                    )}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="nav-underline"
                        className={clsx("absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full xl:inset-x-3.5", solid ? "bg-clay" : "bg-paper")}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/properties"
              className={buttonClass({
                variant: solid ? "primary" : "light",
                size: "sm",
                className: "max-md:hidden",
              })}
            >
              Book your stay
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={clsx(
                "grid size-11 place-items-center rounded-full transition-colors lg:hidden",
                solid ? "text-ink hover:bg-ink/5" : "text-paper hover:bg-paper/10",
              )}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-x-0 bottom-0 top-(--header-h) z-40 overflow-y-auto bg-sand lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile" className="container-x flex min-h-full flex-col pb-10 pt-6">
              <ul className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
                    className="border-b border-line"
                  >
                    <Link
                      href={item.href}
                      className={clsx(
                        "flex items-center justify-between py-4 font-display text-[1.75rem]",
                        isActive(item.href) ? "text-clay-deep" : "text-ink",
                      )}
                    >
                      {item.label}
                      <ArrowRight className="size-5 opacity-40" aria-hidden />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto space-y-3 pt-10">
                <Link href="/properties" className={buttonClass({ variant: "primary", size: "lg", className: "w-full" })}>
                  Book your stay
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <a href={site.phoneHref} className={buttonClass({ variant: "outline", size: "md" })}>
                    <Phone className="size-4" aria-hidden /> Call
                  </a>
                  <a href={`mailto:${site.email}`} className={buttonClass({ variant: "outline", size: "md" })}>
                    <Mail className="size-4" aria-hidden /> Email
                  </a>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
