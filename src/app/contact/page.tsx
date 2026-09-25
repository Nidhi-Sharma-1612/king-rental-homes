import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, House, KeyRound, Mail, MessageSquareText, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm, type Topic } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { photos, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions about a stay or co-hosting? Reach Todd at King Rental Homes by phone, text, email or the contact form.",
};

const topics: Topic[] = [
  { label: "Booking a stay", placeholder: "Your dates, how many guests (and pets), and which home you're interested in…" },
  { label: "A current reservation", placeholder: "Which home and dates, and how can we help?" },
  { label: "Co-hosting my property", placeholder: "Where is the property, how many bedrooms, and is it listed anywhere yet?" },
  { label: "Something else", placeholder: "How can we help?" },
];

export default function ContactPage() {
  const smsHref = site.phoneHref.replace("tel:", "sms:");
  const methods = [
    { Icon: Phone, label: "Call us", value: site.phone, href: site.phoneHref },
    { Icon: MessageSquareText, label: "Send a text", value: site.phone, href: smsHref },
    { Icon: Mail, label: "Email us", value: site.email, href: `mailto:${site.email}` },
  ];

  return (
    <>
      <PageHero
        size="compact"
        image={photos.quincyGarden}
        eyebrow="Contact us"
        title="We're here to help"
        intro="Planning a trip, already booked, or thinking about co-hosting? Get in touch and we'll get back to you."
        crumbs={[{ label: "Contact Us" }]}
      />

      <section className="section-y bg-sand">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          {/* Ways to reach us */}
          <Reveal className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="" width={56} height={56} className="size-14 rounded-full" />
              <div>
                <h2 className="display-md text-ink">Talk to a real host</h2>
                <p className="text-sm text-muted">Messages come straight to us, not a call center.</p>
              </div>
            </div>

            <ul className="mt-8 overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
              {methods.map(({ Icon, label, value, href }, i) => (
                <li key={label} className={i > 0 ? "border-t border-line" : ""}>
                  <a href={href} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-mist/50">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mist text-ink transition-colors group-hover:bg-ink group-hover:text-mist">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-muted">{label}</span>
                      <span className="block truncate font-semibold text-text">{value}</span>
                    </span>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-3xl bg-ink p-6 text-paper">
              <p className="eyebrow text-sage">Good to know</p>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden />
                  <div>
                    <dt className="text-paper/60">Check-in</dt>
                    <dd className="font-semibold">From {site.checkIn}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <KeyRound className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden />
                  <div>
                    <dt className="text-paper/60">Check-out</dt>
                    <dd className="font-semibold">By {site.checkOut}</dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/properties"
                className="group flex items-center justify-between gap-3 rounded-2xl bg-paper px-5 py-4 ring-1 ring-line transition-colors hover:ring-ink/40"
              >
                <span className="flex items-center gap-3">
                  <House className="size-4 text-sage-deep" aria-hidden />
                  <span className="text-sm font-semibold text-ink">Browse our homes</span>
                </span>
                <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                href="/co-hosting"
                className="group flex items-center justify-between gap-3 rounded-2xl bg-paper px-5 py-4 ring-1 ring-line transition-colors hover:ring-ink/40"
              >
                <span className="flex items-center gap-3">
                  <KeyRound className="size-4 text-sage-deep" aria-hidden />
                  <span className="text-sm font-semibold text-ink">Co-hosting for owners</span>
                </span>
                <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1} className="self-start rounded-[1.75rem] bg-paper p-6 shadow-soft ring-1 ring-line sm:p-10">
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Send us a message</h2>
            <p className="mt-2 text-sm text-muted">We&apos;ll reply by email, or by phone if you leave a number.</p>
            <ContactForm topics={topics} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
