import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { WhyStay } from "@/components/home/WhyStay";
import { HostIntro } from "@/components/home/HostIntro";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { CoHostCTA } from "@/components/home/CoHostCTA";
import { AttractionBento } from "@/components/attractions/AttractionBento";
import { FeaturedHomeCard } from "@/components/property/FeaturedHomeCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Rating";
import { ButtonLink } from "@/components/ui/Button";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { attractions, getFeaturedAttractions } from "@/data/attractions";
import { getFeaturedProperties, getFeaturedReviews, getStats } from "@/lib/properties";
import { getLiveProperties } from "@/lib/server/listings";

export default async function HomePage() {
  const homes = await getLiveProperties();
  const stats = getStats(homes);
  const featured = getFeaturedProperties(homes);

  return (
    <>
      <Hero />
      <TrustStrip
        rating={stats.averageRating}
        reviews={stats.reviewTotal}
        homes={stats.homes}
        petFriendly={homes.filter((p) => p.petFriendly).length}
        since={site.established}
      />

      <section id="homes" className="section-y scroll-mt-16 overflow-x-clip bg-sand">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our homes"
            actionClassName="max-md:hidden"
            title="Guest favorites"
            intro="A sample of our homes, from a woodland manor to a beach house and a Colorado retreat, all stocked, styled and hosted by us."
            action={
              <ButtonLink href="/properties" variant="outline">
                View all {homes.length} homes <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </ButtonLink>
            }
          />
        </div>
        {/* Swipeable rail on phones & tablets, three columns on laptops */}
        <Stagger className="no-scrollbar container-x relative flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto pb-2 after:w-px after:shrink-0 after:content-[''] sm:scroll-px-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0 lg:after:hidden">
          {featured.map((p, i) => (
            <StaggerItem key={p.slug} className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
              <FeaturedHomeCard property={p} priority={i === 0} />
            </StaggerItem>
          ))}
        </Stagger>
        <div className="container-x mt-8 md:hidden">
          <ButtonLink href="/properties" variant="outline" className="w-full">
            View all {homes.length} homes <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </section>

      <WhyStay />

      <section id="reviews" className="section-y scroll-mt-16 overflow-hidden bg-sand">
        <div className="container-x">
          <SectionHeading
            eyebrow="Guest reviews"
            title={
              <>
                What our <em className="italic text-clay-deep">guests</em> say
              </>
            }
            intro="Real words from recent guests across our homes."
            action={
              <div className="flex items-center gap-4 rounded-2xl bg-paper px-5 py-4 shadow-soft ring-1 ring-line">
                <span className="font-display text-4xl leading-none text-ink">{stats.averageRating?.toFixed(2)}</span>
                <span className="text-sm">
                  <Stars value={5} />
                  <span className="mt-1 block text-muted">from {stats.reviewTotal} guest reviews</span>
                </span>
              </div>
            }
          />
        </div>
        <ReviewsCarousel reviews={getFeaturedReviews(9)} />
      </section>

      <section id="attractions" className="section-y scroll-mt-16 bg-mist/60">
        <div className="container-x">
          <SectionHeading
            eyebrow="Local attractions"
            actionClassName="max-md:hidden"
            title="Things to see near our homes"
            intro="Beaches, landmarks and neighborhoods near our Boston-area homes and between Boulder and Denver."
            action={
              <ButtonLink href="/attractions" variant="outline">
                View all {attractions.length} attractions <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </ButtonLink>
            }
          />
          <AttractionBento items={getFeaturedAttractions()} />
          <ButtonLink href="/attractions" variant="outline" className="mt-8 w-full md:hidden">
            View all {attractions.length} attractions <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </section>
      <HostIntro />
      <CoHostCTA />
    </>
  );
}
