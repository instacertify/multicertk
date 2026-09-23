import { setRequestLocale } from "next-intl/server";
import { Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { SearchBox } from "@/components/search-box";
import { formatRange, labs } from "@/data/catalog";
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

export default async function LabsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Labs", path: "/labs" }], locale)} />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/labs", label: "Labs" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">BIS testing labs directory</h1>
      <p className="mt-3 max-w-3xl text-muted">
        Recognised testing laboratories — compare locations, scopes and indicative charges, then open the standards they unlock.
      </p>
      <div className="mt-6 max-w-2xl">
        <SearchBox size="sm" />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {labs.map((lab) => (
          <CardLink
            key={lab.slug}
            href={`/labs/${lab.slug}`}
            title={lab.name}
            meta={`${lab.city}, ${lab.state} · ${formatRange(lab.costMin, lab.costMax)} · ${lab.scopes} scopes`}
            body={lab.standardCodes.join(" · ")}
          />
        ))}
      </div>
    </div>
  );
}
