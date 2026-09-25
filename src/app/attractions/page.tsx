import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { AttractionExplorer } from "@/components/attractions/AttractionExplorer";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { attractions } from "@/data/attractions";
import { photos } from "@/data/site";

export const metadata: Metadata = {
  title: "Attractions",
  description:
    "Things to do near our homes: Wollaston Beach, the Freedom Trail, Fenway Park and more around Boston, plus Red Rocks, Pearl Street and Union Station in Colorado.",
};

export default async function AttractionsPage({ searchParams }: PageProps<"/attractions">) {
  const { region } = await searchParams;
  return (
    <>
      <PageHero
        size="compact"
        image="/attractions/wollaston-beach.jpg"
        eyebrow="Attractions"
        title="Make the most of your stay"
        intro="Our favorite things to see and do near our homes, from Boston's landmarks and Quincy's shoreline to Colorado's Front Range."
        crumbs={[{ label: "Attractions" }]}
      />
      <AttractionExplorer attractions={attractions} initialRegion={region === "boston" || region === "colorado" ? region : undefined} />

      <section className="bg-sand pb-20 sm:pb-24">
        <Reveal className="container-x">
          <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-ink px-7 py-12 text-paper sm:px-12 sm:py-14">
            <Image src={photos.beachSkyline} alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="-z-10 object-cover opacity-25" />
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 className="display-md text-balance">Stay close to it all</h2>
                <p className="mt-3 text-paper/80">
                  Our Quincy homes are minutes from Wollaston Beach and the T into Boston, and our Colorado home sits between
                  Boulder and Denver.
                </p>
              </div>
              <ButtonLink href="/properties" variant="light" size="lg" className="self-start lg:self-auto">
                Browse our homes <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
