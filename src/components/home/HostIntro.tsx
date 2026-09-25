import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { photos, site } from "@/data/site";

export function HostIntro() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="container-x section-y grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-[17rem] sm:max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[1.75rem]">
            <Image
              src={site.hostPhoto ?? photos.stonehamExterior}
              alt={site.hostPhoto ? "Todd, Bobbi and Albert King" : "The Chapel Way Manor, a sage-green colonial in Stoneham, MA"}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-1/2 w-28 -translate-x-1/2 rounded-full bg-ink p-2 sm:w-32">
            <Image src="/logo.png" alt="" width={128} height={128} className="rounded-full" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow mb-5 flex items-center gap-3 text-sage">
            <span className="h-px w-8 bg-current" aria-hidden />
            Meet your hosts
          </p>
          <h2 className="display-lg text-balance text-paper">Hi, we&apos;re Todd, Bobbi &amp; Albert</h2>
          <blockquote className="mt-6 border-l-2 border-sage pl-5 font-display text-xl italic leading-snug text-mist sm:text-2xl">
            “We&apos;re a fun-loving family who enjoy hosting and traveling, and we host the way we&apos;d want to be welcomed.”
          </blockquote>
          <div className="mt-7 space-y-4 text-pretty text-[1.05rem] leading-relaxed text-paper/85">
            <p>
              Todd grew up in Colorado, Bobbi grew up in Thailand, and together we call Massachusetts home. Todd runs King
              Rental Homes full-time, and Bobbi is a nurse.
            </p>
            <p>
              We love adventures, good food &amp; drink, the outdoors, sports, books, music and movies. We put that into every
              home: great beds, real kitchens, games for rainy days, and local tips we actually use.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/about" variant="light">
              Our story
            </ButtonLink>
            <a
              href={site.phoneHref}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-paper/25 px-5 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
            >
              <Phone className="size-4" aria-hidden /> {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-paper/25 px-5 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
            >
              <Mail className="size-4" aria-hidden /> Email us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
