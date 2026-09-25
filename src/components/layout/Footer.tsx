import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { nav, site } from "@/data/site";

const socials = [
  { href: site.socials.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.socials.youtube, label: "YouTube", Icon: YoutubeIcon },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink-deep text-paper/70">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:py-16 lg:grid-cols-[1.4fr_0.8fr_1fr_1.5fr] lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-pretty text-sm leading-relaxed">
              Family-hosted vacation homes near Boston&apos;s beaches and between Boulder &amp; Denver.
            </p>
            <ul className="mt-6 flex gap-2.5">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href || "#"}
                    {...(href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full bg-paper/5 text-paper/80 transition-colors hover:bg-sage hover:text-ink-deep"
                  >
                    <Icon className="size-[1.1rem]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <h2 className="eyebrow mb-4 text-sage">Explore</h2>
            <ul className="space-y-2.5 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hit transition-colors hover:text-paper">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="eyebrow mb-4 text-sage">Contact</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={site.phoneHref} className="hit flex items-center gap-2.5 transition-colors hover:text-paper">
                  <Phone className="size-4 shrink-0 text-sage" aria-hidden /> {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hit flex items-center gap-2.5 transition-colors hover:text-paper">
                  <Mail className="size-4 shrink-0 text-sage" aria-hidden />
                  <span className="sm:hidden">Email us</span>
                  <span className="break-all max-sm:hidden">{site.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden /> Massachusetts &amp; Colorado
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className="font-display text-xl text-paper">Get first dibs on open dates</h2>
            <p className="mt-1.5 text-sm">Last-minute openings and seasonal offers. No spam.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-paper/10 py-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} King Rental Homes. All rights reserved.</p>
          <a
            href="https://designbydial.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hit group inline-flex items-center gap-2.5 transition-colors hover:text-paper/80"
          >
            Designed &amp; developed by
            <Image
              src="/design-by-dial.png"
              alt="Design by Dial"
              width={440}
              height={102}
              className="h-6 w-auto opacity-85 transition-opacity group-hover:opacity-100"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
