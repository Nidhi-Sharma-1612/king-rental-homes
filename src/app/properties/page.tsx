import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SearchBar } from "@/components/booking/SearchBar";
import { PropertyExplorer } from "@/components/property/PropertyExplorer";
import { photos } from "@/data/site";
import { getLiveProperties } from "@/lib/server/listings";
import { parseSearch } from "@/lib/search";
import { format, isAfter } from "date-fns";
import { searchAvailability } from "@/lib/server/booking";

export const metadata: Metadata = {
  title: "Our Homes",
  description:
    "Browse our vacation homes near Boston's beaches and between Boulder & Denver. Fully stocked, with free parking, and most are pet-friendly.",
};

export default async function PropertiesPage({ searchParams }: PageProps<"/properties">) {
  const params = await searchParams;
  const search = parseSearch(params);
  const sort = typeof params.sort === "string" ? params.sort : undefined;
  const properties = await getLiveProperties();
  // With dates, only show homes that are actually free (live from Hostaway).
  const availability =
    search.start && search.end && isAfter(search.end, search.start)
      ? await searchAvailability(properties, format(search.start, "yyyy-MM-dd"), format(search.end, "yyyy-MM-dd"))
      : null;

  return (
    <>
      <PageHero
        size="compact"
        image={photos.sunset}
        eyebrow="Book direct"
        title="Find your home base"
        intro={`${properties.length} hand-kept homes near Boston's beaches and between Boulder & Denver.`}
        crumbs={[{ label: "Properties" }]}
      >
        <SearchBar initial={search} className="mt-8" />
      </PageHero>
      <PropertyExplorer properties={properties} search={search} initialSort={sort} availability={availability} />
    </>
  );
}
