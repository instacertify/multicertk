import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CmsArticles } from "@/components/cms-copy";
import { LeadForm } from "@/components/lead-form";
import { ListedPrice, PriceReassurance } from "@/components/price-reassurance";
import { Breadcrumbs, CardLink } from "@/components/ui";
import { beeProducts, euSectors, getBee, getEu, getGmark, getProduct, getScheme, gmarkProducts } from "@/data/catalog";
import { getPage, sectionHeading } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [
    ...beeProducts.map((item) => ({ slug: "bee", productSlug: item.slug })),
    ...gmarkProducts.map((item) => ({ slug: "g-mark", productSlug: item.slug })),
    ...euSectors.map((item) => ({ slug: "ce", productSlug: item.slug })),
  ];
}

function schemeItem(schemeSlug: string, productSlug: string) {
  if (schemeSlug === "bee") return getBee(productSlug);
  if (schemeSlug === "g-mark") return getGmark(productSlug);
  if (schemeSlug === "ce") return getEu(productSlug);
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; productSlug: string }>;
}) {
  const { locale, slug, productSlug } = await params;
  const scheme = getScheme(slug);
  const item = schemeItem(slug, productSlug);
  if (!scheme || !item) return {};
  return pageMetadata({
    locale,
    path: `/certifications/${slug}/products/${productSlug}`,
    title: `${item.name} — ${scheme.shortName}`,
    description: item.summary,
  });
}

export default async function SchemeProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; productSlug: string }>;
}) {
  const { locale, slug, productSlug } = await params;
  setRequestLocale(locale);
  const scheme = getScheme(slug);
  const item = schemeItem(slug, productSlug);
  if (!scheme || !item) notFound();
  const relatedSlug = "relatedProductSlug" in item ? item.relatedProductSlug : undefined;
  const related = relatedSlug ? getProduct(relatedSlug) : undefined;
  const bee = slug === "bee" ? getBee(productSlug) : undefined;
  const gmark = slug === "g-mark" ? getGmark(productSlug) : undefined;
  const eu = slug === "ce" ? getEu(productSlug) : undefined;
  const cms = await getPage("scheme-product", locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: `/certifications/${scheme.slug}`, label: scheme.shortName },
          { href: `/certifications/${scheme.slug}/products/${item.slug}`, label: item.name },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">{item.name}</h1>
      <p className="lead mt-3 text-muted">{item.summary}</p>
      <p className="mt-6 text-sm">
        Scheme:{" "}
        <Link href={`/certifications/${scheme.slug}`} className="font-semibold underline">
          {scheme.name}
        </Link>
      </p>

      {bee ? (
        <>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Regime", bee.regime],
              ["Test standard", bee.standard],
              ["Star table", bee.starTable],
              ["Indicative test price", bee.price],
              ["Recognised labs", bee.labs],
            ]
              .filter(([, value]) => value)
              .map(([dt, dd]) => (
                <div key={dt} className="rounded-2xl border border-line p-4">
                  <dt className="text-xs uppercase tracking-wide text-muted">{dt}</dt>
                  <dd className="mt-1 text-sm text-navy">
                    {dt === "Indicative test price" ? <ListedPrice amount={String(dd)} /> : dd}
                  </dd>
                </div>
              ))}
          </dl>
          {bee.price ? <PriceReassurance className="mt-6" /> : null}
        </>
      ) : null}

      {gmark ? (
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            ["Family", gmark.family],
            ["Main standard", gmark.standard],
            ["Typical tests", gmark.tests],
            ["EMC required", gmark.emc],
            ["IECEE CB accepted", gmark.cb],
            ["GSO notified body", gmark.nb],
            ["Remarks", gmark.remarks],
          ]
            .filter(([, value]) => value)
            .map(([dt, dd]) => (
              <div key={dt} className="rounded-2xl border border-line p-4">
                <dt className="text-xs uppercase tracking-wide text-muted">{dt}</dt>
                <dd className="mt-1 text-sm text-navy">{dd}</dd>
              </div>
            ))}
        </dl>
      ) : null}

      {eu ? (
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            ["Mandate", eu.mandate],
            ["Legal reference", eu.legal],
            ["Testing", eu.testing],
            ["Notified body", eu.nb],
            ["When NB applies", eu.whenNb],
            ["Conformity route", eu.route],
            ["Recent updates", eu.updates],
          ]
            .filter(([, value]) => value)
            .map(([dt, dd]) => (
              <div key={dt} className="rounded-2xl border border-line p-4">
                <dt className="text-xs uppercase tracking-wide text-muted">{dt}</dt>
                <dd className="mt-1 text-sm text-navy">{dd}</dd>
              </div>
            ))}
        </dl>
      ) : null}

      {eu?.url ? (
        <p className="mt-4 text-sm">
          Official sector page:{" "}
          <a href={eu.url} className="font-semibold underline" rel="noreferrer">
            {eu.url}
          </a>
        </p>
      ) : null}

      {related ? (
        <div className="mt-8">
          <h2 className="font-display text-2xl text-navy">{sectionHeading(cms, "linked", "Linked IS / product record")}</h2>
          <div className="mt-4">
            <CardLink href={`/product/${related.slug}`} title={related.name} meta={related.standard} body={related.excerpt} />
          </div>
        </div>
      ) : null}

      <CmsArticles page={cms} skip={["linked"]} />
      <div className="mt-10 max-w-xl">
        <LeadForm sourcePath={`/certifications/${scheme.slug}/products/${item.slug}`} />
      </div>
    </div>
  );
}
