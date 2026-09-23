import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LeadForm } from "@/components/lead-form";
import { Badge, Breadcrumbs, CardLink, JsonLd, StatusBadge } from "@/components/ui";
import {
  beeForProduct,
  formatInr,
  formatRange,
  getCategory,
  getProduct,
  getQco,
  getScheme,
  gmarkForProduct,
  labsForProduct,
  relatedProducts,
  scopesForProduct,
  testsForProduct,
} from "@/data/catalog";
import { breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return pageMetadata({
    locale,
    path: `/product/${product.slug}`,
    title: `${product.name} | ${product.standard}`,
    description: product.excerpt,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.categorySlug);
  const qco = product.qcoSlug ? getQco(product.qcoSlug) : undefined;
  const labs = labsForProduct(product.slug);
  const tests = testsForProduct(product.slug);
  const related = relatedProducts(product.slug);
  const scopes = scopesForProduct(product.slug);
  const bee = beeForProduct(product.slug);
  const gmark = gmarkForProduct(product.slug);
  const faqs = [
    {
      q: `Is certification mandatory for ${product.name}?`,
      a: `${product.qcoStatus === "mandatory" ? "Yes." : product.qcoStatus === "upcoming" ? "A QCO has been notified." : "It is currently voluntary / buyer-driven."} ${product.qcoLabel ?? ""} The governing standard is ${product.standard}.`,
    },
    {
      q: `How much does testing cost for ${product.standard}?`,
      a: `Reported laboratory charges range ${formatRange(product.testCostMin, product.testCostMax)} excluding GST across ${product.labCount} recognised labs.`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd
        data={[
          breadcrumbLd(
            [
              { name: "Home", path: "/" },
              { name: "Products", path: "/products" },
              { name: product.name, path: `/product/${product.slug}` },
            ],
            locale,
          ),
          faqLd(faqs),
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.excerpt,
            sku: product.hsn,
            brand: { "@type": "Brand", name: site.name },
            additionalProperty: [
              { "@type": "PropertyValue", name: "Standard", value: product.standard },
              { "@type": "PropertyValue", name: "HSN", value: product.hsn },
            ],
          },
        ]}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Products" },
          { href: `/category/${product.categorySlug}`, label: category?.name ?? "Category" },
          { href: `/product/${product.slug}`, label: product.standard },
        ]}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge status={product.qcoStatus} />
        {product.schemeLabel ? <Badge tone="mist">{product.schemeLabel}</Badge> : null}
        {product.schemeSlugs.map((schemeSlug) => (
          <Link key={schemeSlug} href={`/certifications/${schemeSlug}`}>
            <Badge>{getScheme(schemeSlug)?.shortName ?? schemeSlug}</Badge>
          </Link>
        ))}
      </div>
      <h1 className="mt-4 font-display text-4xl text-navy">{product.name}</h1>
      <p className="mt-3 max-w-3xl text-muted">{product.excerpt}</p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["IS standard", product.standard],
          ["HSN code", product.hsn || product.hsn4 || "—"],
          ["Test cost range", formatRange(product.testCostMin, product.testCostMax)],
          ["Typical timeline", product.timeline],
        ].map(([dt, dd]) => (
          <div key={dt} className="rounded-2xl border border-line bg-paper p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">{dt}</dt>
            <dd className="mt-1 font-semibold text-navy">{dd}</dd>
          </div>
        ))}
      </dl>
      {product.unit || product.qcoOrder ? (
        <p className="mt-4 text-sm text-muted">
          {product.unit ? `Unit of product: ${product.unit}. ` : null}
          {product.qcoOrder ? `Order note: ${product.qcoOrder}` : null}
        </p>
      ) : null}

      <h2 className="mt-12 font-display text-2xl text-navy">Annual BIS marking fee</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Object.entries(product.markingFee).map(([size, value]) => (
          <div key={size} className="rounded-2xl border border-line p-4">
            <p className="text-xs uppercase text-muted">{size}</p>
            <p className="font-display text-2xl text-navy">{formatInr(value)}</p>
          </div>
        ))}
      </div>

      {qco ? (
        <p className="mt-6 text-sm">
          Applicable order:{" "}
          <Link href={`/qco/${qco.slug}`} className="font-semibold text-navy underline">
            {qco.name}
          </Link>
        </p>
      ) : null}

      <h2 className="mt-12 font-display text-2xl text-navy">Recognised labs</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {labs.length ? (
          labs.map((lab) => (
            <CardLink
              key={lab.slug}
              href={`/labs/${lab.slug}`}
              title={lab.name}
              meta={`${lab.city}, ${lab.state} · ${lab.bisCode}`}
              body={lab.standardCodes.slice(0, 8).join(" · ")}
            />
          ))
        ) : (
          <p className="text-sm text-muted">No recognised-lab price row is mapped yet for {product.standard}. Ask Certko to confirm current BIS LIMS coverage.</p>
        )}
      </div>

      {scopes.length ? (
        <>
          <h2 className="mt-12 font-display text-2xl text-navy">Scope & indicative test prices</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-4 py-3">Lab</th>
                  <th className="px-4 py-3">Scope</th>
                  <th className="px-4 py-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {scopes.slice(0, 20).map((scope) => {
                  const lab = labs.find((item) => item.slug === scope.labSlug);
                  return (
                    <tr key={`${scope.labSlug}-${scope.standard}-${scope.productScope}`} className="border-t border-line">
                      <td className="px-4 py-3">
                        <Link href={`/labs/${scope.labSlug}`} className="font-semibold text-navy underline">
                          {lab?.name ?? scope.labSlug}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted">{scope.productScope || scope.standard}</td>
                      <td className="px-4 py-3">{formatInr(scope.price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      {tests.length ? (
        <>
          <h2 className="mt-12 font-display text-2xl text-navy">Relevant product testing</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {tests.map((test) => (
              <CardLink
                key={test.slug}
                href={`/testing/${test.discipline}/${test.slug}`}
                title={test.name}
                meta={`${test.standard} · ${test.turnaround}`}
                body={test.summary}
              />
            ))}
          </div>
        </>
      ) : null}

      {bee.length || gmark.length ? (
        <>
          <h2 className="mt-12 font-display text-2xl text-navy">Stacked energy & export marks</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {bee.map((item) => (
              <CardLink
                key={item.slug}
                href={`/certifications/bee/products/${item.slug}`}
                title={item.name}
                meta={item.starMandatory ? "BEE mandatory" : "BEE voluntary"}
                body={item.summary}
              />
            ))}
            {gmark.map((item) => (
              <CardLink
                key={item.slug}
                href={`/certifications/g-mark/products/${item.slug}`}
                title={item.name}
                meta={item.standard ?? "G-Mark"}
                body={item.summary}
              />
            ))}
          </div>
        </>
      ) : null}

      <h2 className="mt-12 font-display text-2xl text-navy">Related standards & schemes</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {related.map((item) => (
          <CardLink
            key={item.slug}
            href={`/product/${item.slug}`}
            title={item.name}
            meta={item.standard}
            body={item.excerpt}
          />
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-navy">Need a quote?</h2>
          <p className="mt-2 text-sm text-muted">Free mapping of the certification and lab path within 24 hours.</p>
        </div>
        <LeadForm sourcePath={`/product/${product.slug}`} />
      </div>
    </div>
  );
}
