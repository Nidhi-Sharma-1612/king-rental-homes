import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Clock, KeyRound, MapPin, PawPrint, PlugZap, Sparkles } from "lucide-react";
import { Gallery } from "@/components/property/Gallery";
import { Specs } from "@/components/property/Specs";
import { Description } from "@/components/property/Description";
import { Amenities } from "@/components/property/Amenities";
import { ReviewCard } from "@/components/property/ReviewCard";
import { PropertyCard } from "@/components/property/PropertyCard";
import { BookingWidget, BookingWidgetFromUrl } from "@/components/booking/BookingWidget";
import { ShareButton } from "@/components/property/ShareButton";
import { Rating } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { getLiveProperties, getLiveProperty } from "@/lib/server/listings";

// Rendered on every request so the details always match Hostaway (see getLiveProperty).
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getLiveProperty(slug))?.property;
  if (!p) return {};
  return {
    title: `${p.name}, ${p.city}`,
    description: `${p.tagline} Sleeps ${p.guests}. ${p.bedrooms} bedrooms, ${p.baths} baths. Book direct with King Rental Homes.`,
    openGraph: { images: [{ url: p.images[0] }] },
  };
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const { slug } = await params;
  const p = (await getLiveProperty(slug))?.property;
  if (!p) notFound();
  const selfCheckIn = p.amenities.some((a) => /contactless check-in|24-hour checkin/i.test(a));

  const others = (await getLiveProperties())
    .filter((o) => o.slug !== p.slug)
    .sort((a, b) => Number(b.region === p.region) - Number(a.region === p.region))
    .slice(0, 3);

  return (
    <article className="pb-28 pt-[calc(var(--header-h)+1.5rem)] lg:pb-0">
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <li>
              <Link href="/" className="hit hover:text-ink">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" aria-hidden />
              <Link href="/properties" className="hit hover:text-ink">
                Properties
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" aria-hidden />
              <span aria-current="page" className="text-text">
                {p.name}
              </span>
            </li>
          </ol>
        </nav>

        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="display-lg text-ink">{p.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.95rem]">
              <Rating rating={p.rating} count={p.reviewCount} />
              <span className="inline-flex items-center gap-1.5 text-muted">
                <MapPin className="size-4" aria-hidden />
                {p.city}, {p.state}
              </span>
            </div>
          </div>
          <ShareButton title={p.name} />
        </header>

        <Gallery images={p.images} name={p.name} />

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <div className="min-w-0">
            <Reveal>
              <p className="eyebrow text-sage-deep">{p.listingTitle}</p>
              <p className="mt-3 font-display text-2xl leading-snug text-ink sm:text-[1.75rem]">{p.tagline}</p>
              <Specs property={p} className="mt-6" />
            </Reveal>

            <Section title="Why guests love it">
              <ul className="grid gap-3 sm:grid-cols-2">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 rounded-2xl bg-mist/70 p-4">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ink text-paper">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-text">{h}</span>
                  </li>
                ))}
                {p.petFriendly && (
                  <li className="flex items-start gap-3 rounded-2xl bg-mist/70 p-4">
                    <PawPrint className="mt-0.5 size-5 shrink-0 text-sage-deep" aria-hidden />
                    <span>Pet-friendly: bring the whole family</span>
                  </li>
                )}
                {p.evCharging && !p.highlights.some((h) => /EV/.test(h)) && (
                  <li className="flex items-start gap-3 rounded-2xl bg-mist/70 p-4">
                    <PlugZap className="mt-0.5 size-5 shrink-0 text-sage-deep" aria-hidden />
                    <span>EV charging on site</span>
                  </li>
                )}
              </ul>
            </Section>

            <Section title="About this home">
              <Description paragraphs={p.description} />
            </Section>

            <Section title="What this home offers">
              <Amenities amenities={p.amenities} />
            </Section>

            <Section title="Good to know">
              <ul className="grid gap-4 sm:grid-cols-3">
                {[
                  { Icon: Clock, title: "Check-in", text: `From ${p.checkInTime ?? site.checkIn}` },
                  { Icon: Clock, title: "Check-out", text: `By ${p.checkOutTime ?? site.checkOut}` },
                  ...(selfCheckIn
                    ? [{ Icon: KeyRound, title: "Self check-in", text: "Contactless check-in, with details sent before arrival" }]
                    : []),
                ].map(({ Icon, title, text }) => (
                  <li key={title} className="rounded-2xl border border-line bg-paper p-5">
                    <Icon className="size-5 text-sage-deep" aria-hidden />
                    <p className="mt-3 font-semibold text-text">{title}</p>
                    <p className="text-sm text-muted">{text}</p>
                  </li>
                ))}
              </ul>
              {p.houseRules && p.houseRules.length > 0 && (
                <div className="mt-6 rounded-2xl border border-line bg-paper p-5 sm:p-6">
                  <p className="font-semibold text-text">House rules</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    {p.houseRules.map((rule) => (
                      <li key={rule} className="flex gap-2.5">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sage" aria-hidden />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Section>

            <Section title="Where you'll be">
              <div className="overflow-hidden rounded-[1.5rem] border border-line bg-paper">
                <div className="relative aspect-[16/7] bg-mist">
                  <iframe
                    title={`Map of ${p.city}, ${p.state}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`${p.city}, ${p.state}`)}&z=12&output=embed`}
                    className="absolute inset-0 h-full w-full grayscale-[35%]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="flex items-start gap-3 p-5 sm:p-6">
                  <MapPin className="mt-1 size-5 shrink-0 text-clay" aria-hidden />
                  <div>
                    <p className="font-semibold text-text">
                      {p.city}, {p.state}
                    </p>
                    <p className="mt-1 text-muted">{p.locationSummary}</p>
                    <Link
                      href={`/attractions?region=${p.region}`}
                      className="hit mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-4"
                    >
                      See nearby attractions <ChevronRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>
            </Section>
          </div>

          <div>
            <Suspense fallback={<BookingWidget property={p} />}>
              <BookingWidgetFromUrl property={p} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {p.reviews.length > 0 && (
        <section className="mt-16 border-t border-line bg-paper/60 py-16 lg:mt-20 lg:py-20" aria-labelledby="reviews-title">
          <div className="container-x">
            <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow mb-3 text-sage-deep">Guest reviews</p>
                <h2 id="reviews-title" className="display-md text-ink">
                  Rated {p.rating?.toFixed(2)} from {p.reviewCount} stays
                </h2>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-line bg-paper px-5 py-3">
                <Sparkles className="size-5 text-clay" aria-hidden />
                <span className="text-sm font-semibold text-text">Consistently 5-star hosting</span>
              </div>
            </div>
            <div className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 xl:grid-cols-3">
              {p.reviews.slice(0, 6).map((r) => (
                <ReviewCard key={r.name + r.date} review={r} className="w-[85%] shrink-0 snap-center sm:w-[60%] md:w-auto" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* More homes */}
      <section className="container-x py-16 lg:py-24" aria-labelledby="more-title">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 id="more-title" className="display-md text-ink">
            More homes you might like
          </h2>
          <Link href="/properties" className="hit hidden shrink-0 font-semibold text-ink underline underline-offset-4 sm:block">
            View all homes
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((o) => (
            <PropertyCard key={o.slug} property={o} />
          ))}
        </div>
      </section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="mt-12 border-t border-line pt-12">
      <h2 className="mb-6 font-display text-[1.75rem] leading-tight text-ink">{title}</h2>
      {children}
    </Reveal>
  );
}
