import { setRequestLocale } from "next-intl/server";
import { PageMedia } from "@/components/page-hero";
import { Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { countries } from "@/data/catalog";
import { getPage } from "@/lib/cms";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/certifications/countries",
    title: "Country certification guides",
    description: "Destination-market guides with the schemes, local representation and overlays that usually apply.",
  });
}

export default async function CountriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const regions = [...new Set(countries.map((item) => item.region))];
  const cms = await getPage("countries", locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd
        data={breadcrumbLd(
          [
            { name: "Home", path: "/" },
            { name: "Certifications", path: "/certifications" },
            { name: "Countries", path: "/certifications/countries" },
          ],
          locale,
        )}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/certifications", label: "Certifications" },
          { href: "/certifications/countries", label: "Markets" },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">{cms?.title ?? "Destination markets"}</h1>
      {cms?.intro ? <p className="lead mt-3 max-w-3xl text-muted">{cms.intro}</p> : null}
      <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || cms?.title || "Markets"} gallery={cms?.galleryUrls} />
      {regions.map((region) => (
        <section key={region} className="mt-10">
          <h2 className="font-display text-2xl text-navy">{region}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {countries
              .filter((item) => item.region === region)
              .map((country) => (
                <CardLink
                  key={country.slug}
                  href={`/certifications/countries/${country.slug}`}
                  title={country.name}
                  meta={country.schemeSlugs.join(" · ") || "Local marks"}
                  body={country.summary}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
