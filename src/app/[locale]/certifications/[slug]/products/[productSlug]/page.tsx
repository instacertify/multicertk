import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs, CardLink } from "@/components/ui";
import { beeProducts, getProduct, getScheme, gmarkProducts } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return [
    ...beeProducts.map((item) => ({ slug: "bee", productSlug: item.slug })),
    ...gmarkProducts.map((item) => ({ slug: "g-mark", productSlug: item.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; productSlug: string }>;
}) {
  const { locale, slug, productSlug } = await params;
  const scheme = getScheme(slug);
  const item =
    slug === "bee"
      ? beeProducts.find((row) => row.slug === productSlug)
      : gmarkProducts.find((row) => row.slug === productSlug);
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
  const item =
    slug === "bee"
      ? beeProducts.find((row) => row.slug === productSlug)
      : gmarkProducts.find((row) => row.slug === productSlug);
  if (!scheme || !item) notFound();
  const related = "relatedProductSlug" in item && item.relatedProductSlug ? getProduct(item.relatedProductSlug) : undefined;

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
      <p className="mt-3 text-muted">{item.summary}</p>
      <p className="mt-6 text-sm">
        Scheme:{" "}
        <Link href={`/certifications/${scheme.slug}`} className="font-semibold underline">
          {scheme.name}
        </Link>
      </p>
      {related ? (
        <div className="mt-8">
          <h2 className="font-display text-2xl text-navy">Linked IS / product record</h2>
          <div className="mt-4">
            <CardLink href={`/product/${related.slug}`} title={related.name} meta={related.standard} body={related.excerpt} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
