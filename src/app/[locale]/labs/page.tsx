import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CatalogFilter } from "@/components/catalog-filter";
import { PageMedia } from "@/components/page-hero";
import { ListedPrice, PriceReassurance } from "@/components/price-reassurance";
import { Breadcrumbs, JsonLd, RecordTable } from "@/components/ui";
import { categories, filterLabs, formatRange } from "@/data/catalog";
import { rankByCatalogSearch } from "@/lib/search";
import { getPage } from "@/lib/cms";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/labs",
    title: "BIS testing labs directory",
    description: "Compare laboratories by BIS code, scope count and indicative test charges, then open the standards they unlock.",
  });
}

export default async function LabsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; state?: string; category?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const filters = await searchParams;
  const rows = rankByCatalogSearch(
    filterLabs({ ...filters, q: undefined }),
    filters.q,
    "lab",
    (lab) => `/labs/${lab.slug}`,
    2000,
  );
  const cms = await getPage("labs", locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Labs", path: "/labs" }], locale)} />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/labs", label: "Labs" }]} />
      <h1 className="mt-4 font-display text-navy">{cms?.title ?? "BIS testing labs directory"}</h1>
      <p className="lead mt-3 max-w-3xl text-muted">
        {cms?.intro ??
          `${rows.length} testing laboratories from the library — compare BIS codes, scopes and indicative charges, then open the standards they unlock. Direct lab addresses and contact details are not published.`}
      </p>
      <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || cms?.title || "Labs"} gallery={cms?.galleryUrls} />
      <PriceReassurance className="mt-6" />
      <CatalogFilter q={filters.q}>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Category</span>
          <select name="category" defaultValue={filters.category ?? ""} className="border border-line bg-white px-3 py-2">
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </CatalogFilter>
      <RecordTable>
        <table className="mt-6 min-w-full text-left">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-4 py-2 font-medium">Laboratory</th>
              <th className="px-4 py-2 font-medium">BIS code</th>
              <th className="px-4 py-2 font-medium">Scopes</th>
              <th className="px-4 py-2 font-medium">Indicative cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-muted">
                  No labs match that search. The directory uses the same live catalogue as site search.
                </td>
              </tr>
            ) : null}
            {rows.map((lab) => (
              <tr key={lab.slug} className="border-t border-line">
                <td className="px-4 py-2.5">
                  <Link href={`/labs/${lab.slug}`} className="font-semibold text-navy underline">
                    {lab.name}
                  </Link>
                </td>
                <td className="px-4 py-2.5 font-mono">{lab.bisCode || "—"}</td>
                <td className="px-4 py-2.5">{lab.scopes}</td>
                <td className="px-4 py-2.5">
                  <ListedPrice amount={formatRange(lab.costMin, lab.costMax)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </RecordTable>
    </div>
  );
}
