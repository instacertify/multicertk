import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CmsArticles, CmsHeading } from "@/components/cms-copy";
import { PageMedia } from "@/components/page-hero";
import { Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import {
  beeProducts,
  euSectors,
  getCountry,
  getScheme,
  gmarkProducts,
  productsByBisRoute,
  productsByScheme,
  schemes,
} from "@/data/catalog";
import { getPage } from "@/lib/cms";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return schemes.map((scheme) => ({ slug: scheme.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const scheme = getScheme(slug);
  if (!scheme) return {};
  return pageMetadata({
    locale,
    path: `/certifications/${scheme.slug}`,
    title: scheme.name,
    description: scheme.summary,
  });
}

export default async function SchemePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const scheme = getScheme(slug);
  if (!scheme) notFound();
  const mapped = productsByScheme(scheme.slug);
  const cms = await getPage("scheme-detail", locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd
        data={[
          breadcrumbLd(
            [
              { name: "Home", path: "/" },
              { name: "Certifications", path: "/certifications" },
              { name: scheme.name, path: `/certifications/${scheme.slug}` },
            ],
            locale,
          ),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: scheme.name,
            provider: { "@type": "Organization", name: "Certko" },
            description: scheme.summary,
            areaServed: scheme.countrySlugs,
          },
        ]}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/certifications", label: "Certifications" },
          { href: `/certifications/${scheme.slug}`, label: scheme.shortName },
        ]}
      />
      <p className="mt-4 text-[13px] text-muted">{scheme.regulator}</p>
      <h1 className="mt-2 font-display text-4xl text-navy">{scheme.name}</h1>
      <p className="lead mt-3 max-w-3xl text-muted">{scheme.summary}</p>
      <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || scheme.name} gallery={cms?.galleryUrls} />
      <p className="mt-3 text-sm text-muted">{scheme.whoNeedsIt}</p>

      <CmsHeading page={cms} sectionKey="process" fallback="Process" className="mt-10 border-b border-line pb-2" />
      <ol className="home-panel mt-4 divide-y divide-line">
        {scheme.process.map((step, index) => (
          <li key={step} className="grid grid-cols-[2.25rem_1fr] items-start gap-3 px-4 py-3 text-sm leading-6">
            <span className="text-[12px] text-muted">{String(index + 1).padStart(2, "0")}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <CmsHeading page={cms} sectionKey="markets" fallback="Markets" className="mt-10" />
      <div className="mt-4 flex flex-wrap gap-3">
        {scheme.countrySlugs.map((countrySlug) => (
          <Link
            key={countrySlug}
            href={`/certifications/countries/${countrySlug}`}
            className="rounded-md border border-line px-3 py-1 text-sm hover:border-gold-600 hover:text-gold-600"
          >
            {getCountry(countrySlug)?.name ?? countrySlug}
          </Link>
        ))}
      </div>

      {scheme.slug === "bis" ? (
        <>
          <h2 className="mt-10 font-display text-2xl text-navy">Two BIS routes</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            CRS is part of BIS. Products on the CRS list take Scheme II registration. Every product that is not covered in CRS takes the ISI mark licence.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <CardLink
              href="/products/all?bis=crs"
              title={`CRS registration · ${productsByBisRoute("crs").length} products`}
              meta="BIS Scheme II"
              body="Lab-test registration for the notified CRS list — mainly electronics and IT goods."
            />
            <CardLink
              href="/products/all?bis=isi"
              title={`ISI mark licence · ${productsByBisRoute("isi").length} products`}
              meta="BIS Scheme I"
              body="If the product is not on the CRS list, the BIS path is the ISI mark licence (test plus factory inspection)."
            />
          </div>
        </>
      ) : null}

      <CmsHeading page={cms} sectionKey="mapped" fallback="Mapped products & standards" className="mt-10" />
      <p className="mt-2 text-sm text-muted">{mapped.length} library records interlinked to this scheme.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {mapped.slice(0, 24).map((product) => (
          <CardLink
            key={product.slug}
            href={`/product/${product.slug}`}
            title={product.name}
            meta={product.standard}
            body={product.excerpt}
          />
        ))}
      </div>
      {mapped.length > 24 ? (
        <p className="mt-4 text-sm">
          <Link href={`/products/all?scheme=${scheme.slug}`} className="font-semibold text-navy underline">
            View all {mapped.length} mapped products →
          </Link>
        </p>
      ) : null}

      {scheme.slug === "bee" ? (
        <>
          <CmsHeading page={cms} sectionKey="bee" fallback="BEE labelled appliances" className="mt-10" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {beeProducts.map((item) => (
              <CardLink
                key={item.slug}
                href={`/certifications/bee/products/${item.slug}`}
                title={item.name}
                meta={item.starMandatory ? "Mandatory stars" : "Voluntary"}
                body={item.summary}
              />
            ))}
          </div>
        </>
      ) : null}

      {scheme.slug === "g-mark" ? (
        <>
          <CmsHeading page={cms} sectionKey="gmark" fallback="G-Mark listed categories" className="mt-10" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {gmarkProducts.map((item) => (
              <CardLink
                key={item.slug}
                href={`/certifications/g-mark/products/${item.slug}`}
                title={item.name}
                body={item.summary}
              />
            ))}
          </div>
        </>
      ) : null}

      {scheme.slug === "ce" ? (
        <>
          <CmsHeading page={cms} sectionKey="eu" fallback="EU sector mandates" className="mt-10" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {euSectors.map((item) => (
              <CardLink
                key={item.slug}
                href={`/certifications/ce/products/${item.slug}`}
                title={item.name}
                meta={item.legal}
                body={item.summary}
              />
            ))}
          </div>
        </>
      ) : null}

      <CmsArticles page={cms} skip={["process", "markets", "mapped", "bee", "gmark", "eu", "schemes"]} />
    </div>
  );
}
