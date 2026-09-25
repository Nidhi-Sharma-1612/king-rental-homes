import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SearchBar } from "@/components/booking/SearchBar";
import { PropertyExplorer } from "@/components/property/PropertyExplorer";
import { photos } from "@/data/site";
import { getProperties } from "@/lib/properties";
import { parseSearch } from "@/lib/search";

export const metadata: Metadata = {
  title: "Our Homes",
  description:
    "Browse our six vacation homes near Boston's beaches and between Boulder & Denver. They're pet-friendly and fully stocked, with free parking.",
};

export default async function PropertiesPage({ searchParams }: PageProps<"/properties">) {
  const params = await searchParams;
  const search = parseSearch(params);
  const sort = typeof params.sort === "string" ? params.sort : undefined;

  return (
    <>
      <PageHero
        size="compact"
        image={photos.sunset}
        eyebrow="Book direct"
        title="Find your home base"
        intro="Six hand-kept homes near Boston's beaches and between Boulder & Denver."
        crumbs={[{ label: "Properties" }]}
      >
        <SearchBar initial={search} className="mt-8" />
      </PageHero>
      <PropertyExplorer properties={getProperties()} search={search} initialSort={sort} />
    </>
  );
}
