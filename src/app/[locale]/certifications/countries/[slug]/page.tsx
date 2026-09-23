import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { countries, getCountry, getScheme, productsByCountry } from "@/data/catalog";
import { CmsArticles } from "@/components/cms-copy";
import { getPage, sectionHeading } from "@/lib/cms";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return countries.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const country = getCountry(slug);
  if (!country) return {};
  return pageMetadata({
    locale,
    path: `/certifications/countries/${country.slug}`,
    title: `${country.name} certifications`,
    description: country.summary,
  });
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const country = getCountry(slug);
  if (!country) notFound();
  const mapped = productsByCountry(country.slug);
  const cms = await getPage("country-detail", locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd
        data={breadcrumbLd(
          [
            { name: "Home", path: "/" },
            { name: "Certifications", path: "/certifications" },
            { name: "Markets", path: "/certifications/countries" },
            { name: country.name, path: `/certifications/countries/${country.slug}` },
          ],
          locale,
        )}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/certifications/countries", label: "Markets" },
          { href: `/certifications/countries/${country.slug}`, label: country.name },
        ]}
      />
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold-600">{country.region}</p>
      <h1 className="mt-2 font-display text-4xl text-navy">{country.name} certifications</h1>
      <p className="lead mt-3 max-w-3xl text-muted">{country.summary}</p>
      <h2 className="mt-10 font-display text-2xl text-navy">{sectionHeading(cms, "checklist", "Scoping checklist")}</h2>
      <ol className="mt-4 grid gap-3 md:grid-cols-2">
        {country.checklist.map((item, index) => (
          <li key={item} className="rounded-2xl border border-line p-4 text-sm">
            {index + 1}. {item}
          </li>
        ))}
      </ol>
      <h2 className="mt-10 font-display text-2xl text-navy">{sectionHeading(cms, "schemes", "Schemes for this market")}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {country.schemeSlugs.map((schemeSlug) => {
          const scheme = getScheme(schemeSlug);
          if (!scheme) return null;
          return (
            <CardLink
              key={scheme.slug}
              href={`/certifications/${scheme.slug}`}
              title={scheme.name}
              meta={scheme.regulator}
              body={scheme.summary}
            />
          );
        })}
      </div>
      {mapped.length ? (
        <>
          <h2 className="mt-10 font-display text-2xl text-navy">{sectionHeading(cms, "products", "Products often scoped here")}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {mapped.slice(0, 24).map((product) => (
              <CardLink key={product.slug} href={`/product/${product.slug}`} title={product.name} meta={product.standard} />
            ))}
          </div>
          {mapped.length > 24 ? (
            <p className="mt-4 text-sm">
              <Link href="/products/all" className="font-semibold text-navy underline">
                Browse the full product library →
              </Link>
            </p>
          ) : null}
        </>
      ) : null}
      <CmsArticles page={cms} skip={["checklist", "schemes", "products"]} />
    </div>
  );
}
