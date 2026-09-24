import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PageMedia } from "@/components/page-hero";
import { ListedPrice } from "@/components/price-reassurance";
import { Breadcrumbs, CardLink, JsonLd, StatusBadge } from "@/components/ui";
import { bisRouteLabel, categories, formatRange, getCategory, isCrsProduct, productsByCategory } from "@/data/catalog";
import { getPage } from "@/lib/cms";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return pageMetadata({
    locale,
    path: `/category/${category.slug}`,
    title: category.name,
    description: category.summary,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const category = getCategory(slug);
  if (!category) notFound();
  const mapped = productsByCategory(category.slug);
  const cms = await getPage("category-detail", locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd
        data={breadcrumbLd(
          [
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: category.name, path: `/category/${category.slug}` },
          ],
          locale,
        )}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Products" },
          { href: `/category/${category.slug}`, label: category.name },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">{category.name}</h1>
      <p className="lead mt-3 max-w-3xl text-muted">{category.summary}</p>
      <p className="mt-3 max-w-3xl text-sm text-muted">
        CRS is part of BIS. Products in this category that are not on the CRS list take the ISI mark licence.
      </p>
      <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || category.name} gallery={cms?.galleryUrls} />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {mapped.map((product) => (
          <article key={product.slug} className="rounded-2xl border border-line p-5">
            <div className="mb-2 flex flex-wrap gap-2">
              <StatusBadge status={product.qcoStatus} />
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${isCrsProduct(product) ? "bg-gold text-navy" : "bg-mist text-navy"}`}>
                {bisRouteLabel(product)}
              </span>
            </div>
            <CardLink href={`/product/${product.slug}`} title={product.name} meta={product.standard} body={product.excerpt} />
            <ListedPrice className="mt-3" amount={formatRange(product.testCostMin, product.testCostMax)} />
          </article>
        ))}
      </div>
    </div>
  );
}
