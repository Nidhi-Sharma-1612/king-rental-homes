import Image from "next/image";
import { CookingPot, Laptop, PawPrint, Sparkles } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { photos } from "@/data/site";

const features = [
  {
    Icon: Sparkles,
    title: "Thoughtful & comfortable",
    text: "Memory-foam beds, crisp linens, stocked coffee bars and the small extras that make a rental feel like home.",
  },
  {
    Icon: CookingPot,
    title: "Fully equipped kitchens",
    text: "Modern appliances, real cookware and pantry basics, so you can cook a family feast or just make a great breakfast.",
  },
  {
    Icon: PawPrint,
    title: "Pet-friendly stays",
    text: "Most of our homes welcome well-behaved pets, because the whole family deserves a vacation.",
  },
  {
    Icon: Laptop,
    title: "Easy for work & play",
    text: "Fast Wi-Fi, proper desks and smart TVs. Take the call in the morning and hit the beach by afternoon.",
  },
];

export function WhyStay() {
  return (
    <section className="section-y overflow-hidden bg-mist/60">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative aspect-[16/11] overflow-hidden rounded-[1.75rem] sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image src={photos.stonehamDining} alt="Dining room set for a family dinner at the Chapel Way Manor" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-2 w-[38%] overflow-hidden rounded-[1.25rem] border-4 border-paper shadow-lift sm:-bottom-8 sm:-right-6 sm:w-[46%] sm:border-[6px]">
            <div className="relative aspect-square">
              <Image src={photos.coffee} alt="A stocked coffee and tea station" fill sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover" />
            </div>
          </div>
          <div className="absolute -left-2 top-5 rounded-2xl bg-paper px-4 py-3 shadow-lift sm:-left-6 sm:top-8 sm:px-5 sm:py-4">
            <p className="font-display text-2xl text-ink sm:text-3xl">65+</p>
            <p className="text-sm text-muted">amenities in every home</p>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow mb-4 flex items-center gap-3 text-sage-deep">
              <span className="h-px w-8 bg-current" aria-hidden />
              The King Rental Homes difference
            </p>
            <h2 className="display-lg text-balance text-ink">Everything you need, nothing you don&apos;t</h2>
            <p className="lede mt-5 text-muted">
              We stock, style and look after every home ourselves, so you can unpack once and settle in.
            </p>
          </Reveal>
          <Stagger className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7 sm:mt-10 sm:gap-x-8 sm:gap-y-8">
            {features.map(({ Icon, title, text }) => (
              <StaggerItem key={title}>
                <span className="grid size-10 place-items-center rounded-xl bg-ink text-mist sm:size-12 sm:rounded-2xl">
                  <Icon className="size-[1.1rem] sm:size-5" aria-hidden />
                </span>
                <h3 className="mt-3 font-display text-lg leading-snug text-ink sm:mt-4 sm:text-xl">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted sm:mt-2 sm:text-base">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
