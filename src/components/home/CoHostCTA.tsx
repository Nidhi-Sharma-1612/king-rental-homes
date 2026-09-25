import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/data/site";

const points = ["Listing strategy & copywriting", "Guest communication & care", "Airbnb, VRBO & direct bookings"];

export function CoHostCTA() {
  return (
    <section className="section-y bg-sand">
      <div className="container-x">
        <Reveal className="grid overflow-hidden rounded-[2rem] bg-paper shadow-soft ring-1 ring-line lg:grid-cols-[1.1fr_1fr]">
          <div className="p-7 sm:p-12 lg:p-14">
            <p className="eyebrow mb-4 flex items-center gap-3 text-sage-deep">
              <span className="h-px w-8 bg-current" aria-hidden />
              For property owners
            </p>
            <h2 className="display-lg text-balance text-ink">Own a home in Colorado or Massachusetts?</h2>
            <p className="lede mt-5 text-muted">
              We co-host short- and mid-term rentals hands-on. The details matter, and we never outsource them.
            </p>
            <ul className="mt-7 space-y-3">
              {points.map((pt) => (
                <li key={pt} className="flex items-center gap-3 text-text">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-mist text-sage-deep">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/co-hosting" size="lg">
                Explore co-hosting <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline" size="lg">
                Talk to Todd
              </ButtonLink>
            </div>
          </div>
          <div className="relative min-h-72 lg:min-h-full">
            <Image
              src={photos.patio}
              alt="Covered patio and backyard at the Quincy Beach House"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
