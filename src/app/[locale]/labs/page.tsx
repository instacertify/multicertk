import { setRequestLocale } from "next-intl/server";
import { CatalogFilter } from "@/components/catalog-filter";
import { Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { filterLabs, formatRange, labs } from "@/data/catalog";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

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
  searchParams: Promise<{ q?: string; state?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const filters = await searchParams;
  const rows = filterLabs(filters);
  const states = [...new Set(labs.map((lab) => lab.state).filter(Boolean))].sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Labs", path: "/labs" }], locale)} />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/labs", label: "Labs" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">BIS testing labs directory</h1>
      <p className="mt-3 max-w-3xl text-muted">
        {rows.length} recognised testing laboratories from the library — compare locations, scopes and indicative charges, then open the standards they unlock.
      </p>
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
      </CatalogFilter>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {rows.map((lab) => (
          <CardLink
            key={lab.slug}
            href={`/labs/${lab.slug}`}
            title={lab.name}
            meta={`${lab.city}, ${lab.state} · ${formatRange(lab.costMin, lab.costMax)} · ${lab.scopes} scopes`}
            body={lab.standardCodes.slice(0, 8).join(" · ")}
          />
        ))}
      </div>
    </div>
  );
}
