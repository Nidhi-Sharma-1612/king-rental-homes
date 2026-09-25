import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/data/site";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink-deep text-paper">
      <Image src={photos.sunset} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-60" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-deep via-ink-deep/60 to-ink-deep/40" aria-hidden />
      <div className="container-x py-32 text-center">
        <p className="font-display text-[clamp(6rem,20vw,12rem)] leading-none text-mist/90">404</p>
        <h1 className="display-md mt-4">This path leads out to sea</h1>
        <p className="mx-auto mt-4 max-w-md text-paper/75">The page you&apos;re looking for has moved or doesn&apos;t exist. Let&apos;s get you back to shore.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="light" size="lg">
            Go home
          </ButtonLink>
          <ButtonLink href="/properties" variant="accent" size="lg">
            Browse homes <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
