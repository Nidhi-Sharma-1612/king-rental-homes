import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, CalendarCheck, Camera, Globe, Mail, MessagesSquare, PenLine, Phone, Star, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClass } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { photos, site } from "@/data/site";
import { getProperties, getStats } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Co Hosting",
  description:
    "Hands-on short- and mid-term rental co-hosting in Colorado and Massachusetts: listing strategy, copywriting, guest experience, and Airbnb, VRBO and direct-booking management.",
};

const services = [
  { Icon: TrendingUp, title: "Listing strategy", text: "Positioning, pricing and calendar strategy that fits your home, your market and your goals." },
  { Icon: PenLine, title: "Professional copywriting", text: "Listing titles and descriptions that sound human, rank well and set the right expectations." },
  { Icon: Camera, title: "Guest experience design", text: "Furnishing, stocking and the small touches that turn good stays into 5-star reviews." },
  { Icon: CalendarCheck, title: "Platform management", text: "Airbnb, VRBO and calendar sync handled day to day, so nothing slips through." },
  { Icon: MessagesSquare, title: "Guest communication", text: "Fast, friendly replies from booking to check-out, handled by us personally." },
  { Icon: Globe, title: "Marketing & direct booking", text: "Reach beyond the platforms with marketing and direct bookings through our own site." },
];

const steps = [
  { title: "Intro call", text: "Tell us about your property and what you want from it. We'll be honest about the opportunity." },
  { title: "Set up & launch", text: "We shape the listing, copy and guest experience, then launch across the platforms." },
  { title: "Hands-on hosting", text: "We manage the day-to-day and keep you informed, and we never outsource the details." },
];

export default function CoHostingPage() {
  const stats = getStats();
  const homes = getProperties();
  const proof = [
    { value: stats.averageRating?.toFixed(2) ?? "", label: "Average guest rating" },
    { value: `${stats.reviewTotal}`, label: "Guest reviews" },
    { value: `${new Date().getFullYear() - site.established}+`, label: "Years hosting" },
    { value: `${stats.homes}`, label: "Homes we host" },
  ];

  return (
    <>
      <PageHero
        image={photos.backyard}
        eyebrow="Co Hosting"
        title="Your property, hosted like it's ours"
        intro="We co-host short- and mid-term rentals across Colorado and Massachusetts. We're hands-on with every property: the details matter, and we don't outsource them."
        crumbs={[{ label: "Co Hosting" }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#inquiry" className={buttonClass({ variant: "accent", size: "lg" })}>
            Tell us about your property <ArrowDown className="size-4" aria-hidden />
          </a>
          <a href={site.phoneHref} className={buttonClass({ variant: "light", size: "lg" })}>
            <Phone className="size-4" aria-hidden /> {site.phone}
          </a>
        </div>
      </PageHero>

      {/* Proof band, styled like the site's trust bar */}
      <section aria-label="Our hosting record" className="border-b border-line bg-paper">
        <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
          {proof.map((p, i) => (
            <div
              key={p.label}
              className={[
                "relative flex flex-col-reverse items-start justify-center py-5 sm:py-6 lg:items-center",
                i % 2 === 1 ? "pl-5 sm:pl-7 lg:pl-0" : "",
                i < 2 ? "border-b border-line lg:border-b-0" : "",
              ].join(" ")}
            >
              {i > 0 && (
                <span
                  aria-hidden
                  className={[
                    "absolute left-0 top-1/2 h-12 w-px -translate-y-1/2 bg-linear-to-b from-transparent via-sage to-transparent",
                    i === 2 ? "hidden lg:block" : "",
                  ].join(" ")}
                />
              )}
              <dt className="mt-1 text-xs text-muted sm:text-sm">{p.label}</dt>
              <dd className="font-display text-2xl leading-none text-ink sm:text-[1.75rem]">{p.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Services */}
      <section className="section-y bg-sand">
        <div className="container-x">
          <SectionHeading eyebrow="What we handle" title="Full-service, personally delivered" intro="Pick the whole package or just the parts you need." />
          <Stagger className="grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-x-8 lg:grid-cols-3 lg:gap-y-12">
            {services.map(({ Icon, title, text }, i) => (
              <StaggerItem key={title} className="border-t border-ink/15 pt-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-ink text-mist sm:size-12 sm:rounded-2xl">
                    <Icon className="size-[1.1rem] sm:size-5" aria-hidden />
                  </span>
                  <span className="font-display text-2xl text-sage">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-4 font-display text-lg leading-snug text-ink sm:text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Proof: the homes we host */}
      <section className="section-y bg-mist/60">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our track record"
            title="The same care goes into every listing"
            intro={`These are the homes we host today, averaging ${stats.averageRating?.toFixed(2)} across ${stats.reviewTotal} guest reviews.`}
          />
          <Stagger className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {homes.map((h) => (
              <StaggerItem key={h.slug}>
                <Link
                  href={`/properties/${h.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-paper ring-1 ring-line transition-shadow hover:shadow-lift sm:flex-row"
                >
                  <div className="relative aspect-4/3 shrink-0 overflow-hidden sm:aspect-auto sm:w-2/5">
                    <Image
                      src={h.images[0]}
                      alt={h.name}
                      fill
                      sizes="(min-width: 1024px) 15vw, (min-width: 640px) 20vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-3.5 sm:p-5">
                    <p className="font-display text-base leading-snug text-ink sm:text-lg">{h.name}</p>
                    <p className="mt-0.5 text-xs text-muted sm:text-sm">
                      {h.city}, {h.state}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-text sm:text-sm">
                      <Star className="size-3.5 fill-clay text-clay" aria-hidden />
                      {h.rating?.toFixed(2)} <span className="font-normal text-muted">({h.reviewCount})</span>
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* How it works */}
      <section className="section-y bg-ink text-paper">
        <div className="container-x">
          <SectionHeading tone="light" eyebrow="How it works" title="Simple to start, easy to trust" />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <li className="relative border-t border-paper/15 pt-6">
                  <span className="absolute -top-px left-0 h-px w-16 bg-sage" aria-hidden />
                  <span className="font-display text-5xl text-sage">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-display text-2xl">{s.title}</h3>
                  <p className="mt-2 max-w-sm leading-relaxed text-paper/75">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Owner enquiry */}
      <section id="inquiry" className="section-y scroll-mt-(--header-h) bg-sand">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-4 flex items-center gap-3 text-sage-deep">
              <span className="h-px w-8 bg-current" aria-hidden />
              Get in touch
            </p>
            <h2 className="display-lg text-balance text-ink">Have a property you&apos;d like to discuss?</h2>
            <p className="lede mt-5 text-muted">
              We currently co-host in Colorado and Massachusetts. Tell us about your home and we&apos;ll be in touch.
            </p>
            <ul className="mt-8 space-y-3">
              <li>
                <a href={site.phoneHref} className="inline-flex items-center gap-3 font-semibold text-ink hover:text-clay-deep">
                  <span className="grid size-10 place-items-center rounded-full bg-mist text-sage-deep">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}?subject=Co-hosting%20enquiry`}
                  className="inline-flex items-center gap-3 break-all font-semibold text-ink hover:text-clay-deep"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-sage-deep">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  {site.email}
                </a>
              </li>
            </ul>
            <div className="relative mt-10 hidden aspect-4/3 overflow-hidden rounded-3xl lg:block">
              <Image src={photos.stonehamDining} alt="A styled dining room in one of our homes" fill sizes="35vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="self-start rounded-[1.75rem] bg-paper p-6 shadow-soft ring-1 ring-line sm:p-10">
            <h3 className="font-display text-2xl text-ink">Tell us about your property</h3>
            <ContactForm messagePlaceholder="Where is the property, how many bedrooms, and is it listed anywhere yet?" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
