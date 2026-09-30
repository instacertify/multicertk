import { setRequestLocale } from "next-intl/server";
import { CmsHeading } from "@/components/cms-copy";
import { PageMedia } from "@/components/page-hero";
import { Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { countries, productsByScheme, schemes } from "@/data/catalog";
import { getPage } from "@/lib/cms";

export const dynamic = "force-dynamic";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/certifications",
    title: "Certifications & global market access",
    description: "GMA framework plus full Certko programmes for India, the EU, the US, GCC and Saudi Arabia — and country guides for 39 other markets.",
  });
}

export default async function CertificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getPage("certifications", locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Certifications", path: "/certifications" }], locale)} />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/certifications", label: "Certifications" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">{cms?.title ?? "Certifications & global market access"}</h1>
      <p className="lead mt-3 max-w-3xl text-muted">
        {cms?.intro ??
          "Start with the scheme you need, then open the products and markets it covers."}
      </p>
      <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || cms?.title || "Certifications"} gallery={cms?.galleryUrls} />
      <CmsHeading page={cms} sectionKey="how" fallback="How GMA works" className="mt-10 border-b border-line pb-2" />
      <ol className="home-panel mt-4 divide-y divide-line">
        {(
          [
            ["how-1", "Regulatory determination"],
            ["how-2", "Testing to the national standard"],
            ["how-3", "Local representation"],
            ["how-4", "Filing & follow-up"],
          ] as const
        ).map(([key, step], index) => (
          <li key={key} className="grid grid-cols-[2.25rem_1fr] items-start gap-3 px-4 py-3">
            <p className="text-[12px] text-muted">{String(index + 1).padStart(2, "0")}</p>
            <p className="font-semibold text-navy">{step}</p>
          </li>
        ))}
      </ol>
      <CmsHeading page={cms} sectionKey="programmes" fallback="Certification programmes" className="mt-12" />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {schemes.map((scheme) => (
          <CardLink
            key={scheme.slug}
            href={`/certifications/${scheme.slug}`}
            title={scheme.name}
            meta={`${productsByScheme(scheme.slug).length} products · ${scheme.regulator}`}
            iconKey="schemes"
            body={scheme.summary}
          />
        ))}
      </div>
      <CmsHeading page={cms} sectionKey="markets" fallback="Destination markets" className="mt-12" />
      <p className="mt-2 text-sm">
        <a className="font-semibold text-navy underline" href="/certifications/countries">
          Browse all country guides →
        </a>
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {countries.slice(0, 8).map((country) => (
          <CardLink key={country.slug} href={`/certifications/countries/${country.slug}`} title={country.name} meta={country.region} iconKey="markets" />
        ))}
      </div>
    </div>
  );
}
