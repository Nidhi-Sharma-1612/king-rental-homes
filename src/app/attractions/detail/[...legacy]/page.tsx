import { notFound, permanentRedirect } from "next/navigation";
import { attractions } from "@/data/attractions";

// Old kingrentalhomes.com URLs like /attractions/detail/Denver Union Station → /attractions/denver-union-station
export default async function LegacyAttractionRedirect({ params }: PageProps<"/attractions/detail/[...legacy]">) {
  const legacy = decodeURIComponent((await params).legacy.join("/")).toLowerCase();
  const match = attractions.find((a) => a.legacySlug.toLowerCase() === legacy || a.slug === legacy);
  if (!match) notFound();
  permanentRedirect(`/attractions/${match.slug}`);
}
