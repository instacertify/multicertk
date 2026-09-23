import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CmsArticles } from "@/components/cms-copy";
import { PageMedia } from "@/components/page-hero";
import { LeadForm } from "@/components/lead-form";
import { Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { beeProducts, euSectors, getCountry, getScheme, gmarkProducts, productsByScheme, schemes } from "@/data/catalog";
import { getPage, sectionHeading } from "@/lib/cms";
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
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold-600">{scheme.regulator}</p>
      <h1 className="mt-2 font-display text-4xl text-navy">{scheme.name}</h1>
      <p className="lead mt-3 max-w-3xl text-muted">{scheme.summary}</p>
      <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || scheme.name} gallery={cms?.galleryUrls} />
      <p className="mt-3 text-sm text-muted">{scheme.whoNeedsIt}</p>

      <h2 className="mt-10 font-display text-2xl text-navy">{sectionHeading(cms, "process", "Process")}</h2>
      <ol className="mt-4 grid gap-3 md:grid-cols-2">
        {scheme.process.map((step, index) => (
          <li key={step} className="rounded-2xl border border-line p-4 text-sm leading-6">
            <span className="font-display text-gold">{index + 1}.</span> {step}
          </li>
        ))}
      </ol>

      <h2 className="mt-10 font-display text-2xl text-navy">{sectionHeading(cms, "markets", "Markets")}</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {scheme.countrySlugs.map((countrySlug) => (
          <Link
            key={countrySlug}
            href={`/certifications/countries/${countrySlug}`}
            className="rounded-full border border-line px-3 py-1 text-sm font-semibold"
          >
            {getCountry(countrySlug)?.name ?? countrySlug}
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-display text-2xl text-navy">{sectionHeading(cms, "mapped", "Mapped products & standards")}</h2>
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
          <h2 className="mt-10 font-display text-2xl text-navy">{sectionHeading(cms, "bee", "BEE labelled appliances")}</h2>
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
          <h2 className="mt-10 font-display text-2xl text-navy">{sectionHeading(cms, "gmark", "G-Mark listed categories")}</h2>
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
          <h2 className="mt-10 font-display text-2xl text-navy">{sectionHeading(cms, "eu", "EU sector mandates")}</h2>
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

      <CmsArticles page={cms} skip={["process", "markets", "mapped", "bee", "gmark", "eu"]} />
      <div className="mt-12 max-w-xl">
        <LeadForm sourcePath={`/certifications/${scheme.slug}`} />
      </div>
    </div>
  );
}
