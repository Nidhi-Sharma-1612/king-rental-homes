import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { House, MapPin, Tag } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { FeaturedHomeCard } from "@/components/property/FeaturedHomeCard";
import { AttractionGrid } from "@/components/attractions/AttractionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { attractions, getAttraction, getAttractionsByRegion } from "@/data/attractions";
import { getLivePropertiesByRegion } from "@/lib/server/listings";

export function generateStaticParams() {
  return attractions.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/attractions/[slug]">): Promise<Metadata> {
  const a = getAttraction((await params).slug);
  if (!a) return {};
  return {
    title: a.name,
    description: a.description.slice(0, 155),
    openGraph: { images: [{ url: a.image }] },
  };
}

export default async function AttractionPage({ params }: PageProps<"/attractions/[slug]">) {
  const a = getAttraction((await params).slug);
  if (!a) notFound();

  const allHomes = await getLivePropertiesByRegion(a.region);
  const homes = allHomes.slice(0, 3);
  // Lead with the first sentence; the rest reads better as body copy.
  const [lead, ...rest] = a.description.split(/(?<=[.!?])\s+/);
  const more = getAttractionsByRegion(a.region)
    .filter((o) => o.slug !== a.slug)
    .slice(0, 3);
  const area = a.region === "boston" ? "Boston & Quincy" : "Denver & Boulder";

  return (
    <>
      <PageHero
        image={a.image}
        eyebrow={a.category}
        title={a.name}
        crumbs={[{ label: "Attractions", href: "/attractions" }, { label: a.name }]}
      >
        <p className="mt-5 inline-flex items-center gap-2 text-paper/80">
          <MapPin className="size-4" aria-hidden /> {a.location}
        </p>
      </PageHero>

      <section className="bg-sand">
        <div className="container-x section-y grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-4 flex items-center gap-3 text-sage-deep">
              <span className="h-px w-8 bg-current" aria-hidden />
              About {a.name}
            </p>
            <p className="font-display text-2xl leading-snug text-balance text-ink sm:text-[1.9rem]">{lead}</p>
            {rest.length > 0 && (
              <p className="mt-6 max-w-2xl text-pretty text-[1.05rem] leading-relaxed text-text/80">{rest.join(" ")}</p>
            )}
            {a.credit && (
              <p className="mt-8 text-xs text-muted">
                <a
                  href={a.credit.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-ink"
                >
                  {a.credit.text}
                </a>
              </p>
            )}
          </Reveal>
          <Reveal
            delay={0.1}
            className="self-start rounded-3xl bg-paper p-6 shadow-soft ring-1 ring-line lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]"
          >
            <dl className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-sage-deep" aria-hidden />
                <div>
                  <dt className="text-muted">Location</dt>
                  <dd className="font-semibold text-text">{a.location}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="mt-0.5 size-4 text-sage-deep" aria-hidden />
                <div>
                  <dt className="text-muted">Category</dt>
                  <dd className="font-semibold text-text">{a.category}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <House className="mt-0.5 size-4 text-sage-deep" aria-hidden />
                <div>
                  <dt className="text-muted">Our homes nearby</dt>
                  <dd className="font-semibold text-text">
                    {allHomes.length} in the {area} area
                  </dd>
                </div>
              </div>
            </dl>
            <ButtonLink href={`/properties?region=${a.region}#results`} className="mt-6 w-full">
              Find a home nearby
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <section className="bg-mist/60">
        <div className="container-x section-y">
          <SectionHeading
            eyebrow="Stay nearby"
            title={`Our homes near ${area}`}
            action={
              allHomes.length > homes.length ? (
                <ButtonLink href={`/properties?region=${a.region}#results`} variant="outline">
                  View all {allHomes.length} homes
                </ButtonLink>
              ) : undefined
            }
          />
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {homes.map((p) => (
              <FeaturedHomeCard key={p.slug} property={p} />
            ))}
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="bg-sand">
          <div className="container-x section-y">
            <SectionHeading
              eyebrow="Keep exploring"
              title={`More around ${area}`}
              action={
                <ButtonLink href={`/attractions?region=${a.region}`} variant="outline">
                  All {area} attractions
                </ButtonLink>
              }
            />
            <AttractionGrid items={more} />
          </div>
        </section>
      )}
    </>
  );
}
