import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HandHeart, Leaf, MapPinned, Quote, Sparkles } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Rating";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { photos, site } from "@/data/site";
import { getStats } from "@/lib/properties";
import { getLiveProperties } from "@/lib/server/listings";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet Todd, Bobbi and Albert King, the family behind King Rental Homes, hosting guests in Massachusetts and Colorado since 2011.",
};

const values = [
  {
    Icon: HandHeart,
    title: "Hands-on hosting",
    text: "We manage every home ourselves. When you message, you reach us, not a call center.",
  },
  {
    Icon: Sparkles,
    title: "Comfort in the details",
    text: "Memory-foam beds, stocked kitchens, coffee bars, games and good Wi-Fi, the way we'd want to find it.",
  },
  {
    Icon: MapPinned,
    title: "Local know-how",
    text: "Ask us for a beach, a trail or a dinner spot near your home and you'll get a real answer.",
  },
  {
    Icon: Leaf,
    title: "Escape the ordinary",
    text: "We want every stay to be the trip you're still talking about next year.",
  },
];

// Verbatim excerpts from guest reviews (see src/data/properties.ts).
const featuredQuote = {
  text: "The Kings are wonderful hosts and have thoughtfully maintained and prepared for their guests.",
  name: "David S.",
  home: "The Beachside Flat",
};
const quotes = [
  { text: "Todd's a great host. We always look forward to staying at his place.", name: "Ryan C.", home: "The Chapel Way Manor" },
  { text: "Todd was a great host with excellent communication from start to finish.", name: "Alett R.", home: "Sheridan Green House" },
];

export default async function AboutPage() {
  const homes = await getLiveProperties();
  const stats = getStats(homes);

  return (
    <>
      <PageHero
        image={photos.stonehamLiving}
        eyebrow="About us"
        title="A family business, built on hospitality"
        intro="King Rental Homes is Todd, Bobbi and Albert: a fun-loving family who love to travel, and love hosting even more."
        crumbs={[{ label: "About Us" }]}
      />

      {/* Our story */}
      <section className="section-y bg-sand">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative mx-auto w-full max-w-lg pb-10 lg:max-w-none">
            <div className="relative aspect-4/5 overflow-hidden rounded-[1.75rem] sm:aspect-5/4 lg:aspect-4/5">
              <Image
                src={site.hostPhoto ?? photos.stonehamExterior}
                alt={site.hostPhoto ? "Todd, Bobbi and Albert King" : "The Chapel Way Manor in Stoneham, MA"}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-2 bottom-0 w-[44%] overflow-hidden rounded-[1.25rem] border-4 border-sand shadow-lift sm:-right-6 sm:border-[6px]">
              <div className="relative aspect-square">
                <Image src={photos.coGameRoom} alt="Game room at the Sheridan Green House" fill sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover" />
              </div>
            </div>
            <div className="absolute -left-2 top-6 flex items-center gap-3 rounded-2xl bg-paper py-2.5 pl-2.5 pr-5 shadow-lift sm:-left-6">
              <Image src="/logo.png" alt="" width={48} height={48} className="size-11 rounded-full" />
              <span className="leading-tight">
                <span className="block font-display text-xl text-ink">Est. {site.established}</span>
                <span className="text-xs text-muted">Massachusetts &amp; Colorado</span>
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow mb-4 flex items-center gap-3 text-sage-deep">
              <span className="h-px w-8 bg-current" aria-hidden />
              Our story
            </p>
            <h2 className="display-lg text-balance text-ink">From Colorado to Massachusetts, by way of Thailand</h2>
            <div className="mt-6 space-y-5 text-pretty text-[1.05rem] leading-relaxed text-text/80">
              <p>
                Hello! Todd manages our short-term rental business, King Rental Homes, which has homes in Massachusetts and
                Colorado, and Bobbi is a nurse. Todd is from Colorado, Bobbi grew up in Thailand, and we live in
                Massachusetts with our son, Albert.
              </p>
              <p>
                We&apos;re fun and easy-going. We love adventures, good food &amp; drink, the outdoors, sports, books, music and
                movies, and time with family and friends. We&apos;ve been welcoming guests since {site.established}, and we
                still get excited when someone tells us our home made their trip.
              </p>
            </div>
            <p className="mt-8 font-display text-xl italic text-sage-deep">Todd, Bobbi &amp; Albert</p>
          </Reveal>
        </div>
      </section>

      <TrustStrip
        rating={stats.averageRating}
        reviews={stats.reviewTotal}
        homes={stats.homes}
        petFriendly={homes.filter((p) => p.petFriendly).length}
        since={site.established}
      />

      {/* How we host */}
      <section className="section-y bg-mist/60">
        <div className="container-x">
          <SectionHeading
            eyebrow="How we host"
            title="More than a place to sleep"
            intro="We want each home to be a place where families, friends and groups can connect, celebrate and make memories that last."
          />
          <Stagger className="grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-x-8 lg:grid-cols-4">
            {values.map(({ Icon, title, text }, i) => (
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

      {/* In our guests' words */}
      <section className="section-y bg-ink text-paper">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16">
          <Reveal>
            <Quote className="size-10 fill-sage text-sage" aria-hidden />
            <blockquote className="mt-6 font-display text-[1.75rem] leading-snug text-balance sm:text-4xl">
              “{featuredQuote.text}”
            </blockquote>
            <p className="mt-6 text-paper/70">
              <span className="font-semibold text-paper">{featuredQuote.name}</span> · stayed at {featuredQuote.home}
            </p>
          </Reveal>
          <Stagger className="grid gap-4">
            {quotes.map((q) => (
              <StaggerItem key={q.name} className="rounded-2xl bg-paper/5 p-6 ring-1 ring-paper/10">
                <Stars value={5} />
                <p className="mt-3 leading-relaxed text-paper/90">“{q.text}”</p>
                <p className="mt-3 text-sm text-paper/60">
                  {q.name} · {q.home}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Call to action */}
      <section className="section-y bg-sand">
        <Reveal className="container-x text-center">
          <p className="eyebrow mb-4 text-sage-deep">Stay with us</p>
          <h2 className="display-lg mx-auto max-w-2xl text-balance text-ink">Come see what hosting done right feels like</h2>
          <p className="lede mx-auto mt-5 max-w-2xl text-muted">
            Beach homes in Quincy, a Victorian in Melrose, family houses in Milton and Stoneham, and a home between Boulder &amp; Denver.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/properties" size="lg">
              Browse our homes <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Say hello
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-muted">
            Own a home in Colorado or Massachusetts?{" "}
            <Link href="/co-hosting" className="font-semibold text-ink underline underline-offset-4 hover:text-clay-deep">
              Explore co-hosting
            </Link>
          </p>
        </Reveal>
      </section>
    </>
  );
}
