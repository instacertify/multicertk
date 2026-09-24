import { setRequestLocale } from "next-intl/server";
import { CatalogFilter } from "@/components/catalog-filter";
import { PageMedia } from "@/components/page-hero";
import { PriceOffer, PriceReassurance } from "@/components/price-reassurance";
import { Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { categories, filterLabs, formatRange, labs } from "@/data/catalog";
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
    description: "Compare recognised laboratories by location, scope and indicative test charges before you book.",
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
  const states = [...new Set(labs.map((lab) => lab.state).filter(Boolean))].sort();
  const cms = await getPage("labs", locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Labs", path: "/labs" }], locale)} />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/labs", label: "Labs" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">{cms?.title ?? "BIS testing labs directory"}</h1>
      <p className="lead mt-3 max-w-3xl text-muted">
        {cms?.intro ??
          `${rows.length} recognised testing laboratories from the library — compare locations, scopes and indicative charges, then open the standards they unlock.`}
      </p>
      <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || cms?.title || "Labs"} gallery={cms?.galleryUrls} />
      <PriceReassurance className="mt-6" />
      <CatalogFilter q={filters.q}>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-muted">State</span>
          <select name="state" defaultValue={filters.state ?? ""} className="rounded-xl border border-line bg-white px-3 py-2">
            <option value="">All states</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
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
      </CatalogFilter>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-line bg-paper p-6 text-muted md:col-span-2">
            No labs match that search. The directory uses the same live catalogue as site search.
          </p>
        ) : null}
        {rows.map((lab) => (
          <div key={lab.slug} className="rounded-2xl border border-line p-1">
            <CardLink
              href={`/labs/${lab.slug}`}
              title={lab.name}
              meta={`${lab.city}, ${lab.state} · ${formatRange(lab.costMin, lab.costMax)} · ${lab.scopes} scopes`}
              body={lab.standardCodes.slice(0, 8).join(" · ")}
            />
            <div className="px-5 pb-4">
              <PriceOffer />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
