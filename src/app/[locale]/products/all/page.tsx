import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge, Breadcrumbs, StatusBadge } from "@/components/ui";
import { formatRange, products } from "@/data/catalog";
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

export default async function AllProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Products" },
          { href: "/products/all", label: "All products" },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">All mapped products</h1>
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
            {products.map((product) => (
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
                <td className="px-4 py-3">{formatRange(product.testCostMin, product.testCostMax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
