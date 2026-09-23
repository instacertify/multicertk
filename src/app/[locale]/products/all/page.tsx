import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CatalogFilter } from "@/components/catalog-filter";
import { PageHero } from "@/components/page-hero";
import { ListedPrice, PriceReassurance } from "@/components/price-reassurance";
import { Badge, Breadcrumbs, StatusBadge } from "@/components/ui";
import { categories, filterProducts, formatRange, schemes } from "@/data/catalog";
import { getPage } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/products/all",
    title: "All products — IS standards, HSN and schemes",
    description: "Full searchable table of mapped products with IS standard, HSN, QCO status and interlinked schemes.",
  });
}

export default async function AllProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string; scheme?: string; status?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const filters = await searchParams;
  const rows = filterProducts(filters);
  const cms = await getPage("products-all", locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Products" },
          { href: "/products/all", label: "All products" },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">{cms?.title ?? "All mapped products"}</h1>
      <p className="lead mt-2 text-muted">
        {cms?.intro ??
          `${rows.length} unique Indian Standard / CRS records from the Certko library — each opens as its own interlinked page in every language.`}
      </p>
      <PageHero src={cms?.heroImageUrl} alt={cms?.heroImageAlt || cms?.title || "All products"} />
      <PriceReassurance className="mt-6" />
      <CatalogFilter q={filters.q}>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Category</span>
          <select name="category" defaultValue={filters.category ?? ""} className="rounded-xl border border-line bg-white px-3 py-2">
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Scheme</span>
          <select name="scheme" defaultValue={filters.scheme ?? ""} className="rounded-xl border border-line bg-white px-3 py-2">
            <option value="">All schemes</option>
            {schemes.map((scheme) => (
              <option key={scheme.slug} value={scheme.slug}>
                {scheme.shortName}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-muted">QCO</span>
          <select name="status" defaultValue={filters.status ?? ""} className="rounded-xl border border-line bg-white px-3 py-2">
            <option value="">Any status</option>
            <option value="mandatory">Mandatory</option>
            <option value="upcoming">Upcoming</option>
            <option value="voluntary">Voluntary</option>
          </select>
        </label>
      </CatalogFilter>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-4 py-3">Product / standard</th>
              <th className="px-4 py-3">HSN</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Schemes</th>
              <th className="px-4 py-3">Test cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.slug} className="border-t border-line">
                <td className="px-4 py-3">
                  <Link href={`/product/${product.slug}`} className="font-semibold text-navy hover:underline">
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted">{product.standard}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{product.hsn}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={product.qcoStatus} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {product.schemeSlugs.map((slug) => (
                      <Link key={slug} href={`/certifications/${slug}`}>
                        <Badge tone="mist">{slug}</Badge>
                      </Link>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ListedPrice amount={formatRange(product.testCostMin, product.testCostMax)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
