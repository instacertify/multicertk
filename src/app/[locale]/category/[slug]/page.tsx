import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageMedia } from "@/components/page-hero";
import { ListedPrice, PriceReassurance } from "@/components/price-reassurance";
import { Breadcrumbs, JsonLd, RecordTable, StatusBadge } from "@/components/ui";
import { bisRouteLabel, categories, formatRange, getCategory, productsByCategory } from "@/data/catalog";
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
      <h1 className="mt-4 font-display text-navy">{category.name}</h1>
      <p className="lead mt-3 max-w-3xl text-muted">{category.summary}</p>
      <p className="mt-3 max-w-3xl text-sm text-muted">
        CRS is part of BIS. Products in this category that are not on the CRS list take the ISI mark licence.
      </p>
      <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || category.name} gallery={cms?.galleryUrls} />
      <PriceReassurance className="mt-6" />
      <RecordTable>
        <table className="mt-6 min-w-full text-left">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-4 py-2 font-medium">Product</th>
              <th className="px-4 py-2 font-medium">Standard</th>
              <th className="px-4 py-2 font-medium">Route</th>
              <th className="px-4 py-2 font-medium">Test cost</th>
            </tr>
          </thead>
          <tbody>
            {mapped.map((product) => (
              <tr key={product.slug} className="border-t border-line">
                <td className="px-4 py-2.5">
                  <Link href={`/product/${product.slug}`} className="font-semibold text-navy underline">
                    {product.name}
                  </Link>
                  <span className="ms-2">
                    <StatusBadge status={product.qcoStatus} />
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono">{product.standard}</td>
                <td className="px-4 py-2.5">{bisRouteLabel(product)}</td>
                <td className="px-4 py-2.5">
                  <ListedPrice amount={formatRange(product.testCostMin, product.testCostMax)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </RecordTable>
    </div>
  );
}
