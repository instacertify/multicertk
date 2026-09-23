import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge, Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import {
  formatInr,
  formatRange,
  getCategory,
  getLab,
  productsByLab,
  productsByStandardKey,
  scopesForLab,
} from "@/data/catalog";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const lab = getLab(slug);
  if (!lab) return {};
  return pageMetadata({
    locale,
    path: `/labs/${lab.slug}`,
    title: lab.name,
    description: `${lab.name} in ${lab.city}, ${lab.state} — BIS code ${lab.bisCode}.`,
  });
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lab = getLab(slug);
  if (!lab) notFound();
  const mapped = productsByLab(lab.slug);
  const scopes = scopesForLab(lab.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd
        data={[
          breadcrumbLd(
            [
              { name: "Home", path: "/" },
              { name: "Labs", path: "/labs" },
              { name: lab.name, path: `/labs/${lab.slug}` },
            ],
            locale,
          ),
          {
            "@context": "https://schema.org",
            "@type": "Laboratory",
            name: lab.name,
            telephone: lab.phone,
            email: lab.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: lab.address,
              addressLocality: lab.city,
              addressRegion: lab.state,
              addressCountry: "IN",
            },
          },
        ]}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/labs", label: "Labs" },
          { href: `/labs/${lab.slug}`, label: lab.name },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">{lab.name}</h1>
      <p className="mt-2 text-muted">
        {lab.city}, {lab.state} · BIS code {lab.bisCode} · {formatRange(lab.costMin, lab.costMax)}
      </p>
      {lab.address ? <p className="mt-2 text-sm text-muted">{lab.address}</p> : null}
      <p className="mt-1 text-sm text-muted">
        {lab.contact ? `${lab.contact} · ` : null}
        {lab.phone ? lab.phone : null}
        {lab.email ? ` · ${lab.email}` : null}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {lab.categorySlugs.map((categorySlug) => (
          <Link key={categorySlug} href={`/category/${categorySlug}`}>
            <Badge tone="mist">{getCategory(categorySlug)?.name ?? categorySlug}</Badge>
          </Link>
        ))}
      </div>
      <h2 className="mt-10 font-display text-2xl text-navy">Standards in scope</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-4 py-3">Standard</th>
              <th className="px-4 py-3">Product / scope</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Mapped products</th>
            </tr>
          </thead>
          <tbody>
            {(scopes.length ? scopes : lab.standardCodes.map((code) => ({
              labSlug: lab.slug,
              standard: code,
              standardKey: code,
              productScope: "",
              category: "",
              categorySlug: "",
              price: 0,
            }))).map((scope) => {
              const linked = productsByStandardKey(scope.standardKey).slice(0, 3);
              return (
                <tr key={`${scope.standard}-${scope.productScope}`} className="border-t border-line">
                  <td className="px-4 py-3 font-semibold text-navy">{scope.standard}</td>
                  <td className="px-4 py-3 text-muted">{scope.productScope || "—"}</td>
                  <td className="px-4 py-3">{formatInr(scope.price)}</td>
                  <td className="px-4 py-3">
                    {linked.length
                      ? linked.map((product) => (
                          <div key={product.slug}>
                            <Link href={`/product/${product.slug}`} className="underline">
                              {product.name}
                            </Link>
                          </div>
                        ))
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h2 className="mt-10 font-display text-2xl text-navy">Products / schemes this lab unlocks</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {mapped.map((product) => (
          <CardLink key={product.slug} href={`/product/${product.slug}`} title={product.name} meta={product.standard} body={product.excerpt} />
        ))}
      </div>
    </div>
  );
}
