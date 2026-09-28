import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CmsArticles } from "@/components/cms-copy";
import { PageMedia } from "@/components/page-hero";
import { ListedPrice, PriceReassurance } from "@/components/price-reassurance";
import { Badge, Breadcrumbs, JsonLd, RecordTable, StatusBadge } from "@/components/ui";
import {
  beeForProduct,
  bisRouteLabel,
  bisRouteSummary,
  formatInr,
  formatRange,
  getCategory,
  getProduct,
  getQco,
  getScheme,
  gmarkForProduct,
  isCrsProduct,
  relatedProducts,
  testsForProduct,
} from "@/data/catalog";
import { getPage, listArticles, sectionHeading } from "@/lib/cms";
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
  const tests = testsForProduct(product.slug);
  const related = relatedProducts(product.slug);
  const bee = beeForProduct(product.slug);
  const gmark = gmarkForProduct(product.slug);
  const cms = await getPage("product-detail", locale);
  const notes = listArticles(locale)
    .filter((article) => article.relatedProductSlugs.includes(product.slug))
    .slice(0, 8);
  const faqs = [
    {
      q: `Is ${product.name} under CRS or the ISI mark?`,
      a: bisRouteSummary(product),
    },
    {
      q: `Is certification mandatory for ${product.name}?`,
      a: `${product.qcoStatus === "mandatory" ? "Yes." : product.qcoStatus === "upcoming" ? "A QCO has been notified." : "It is currently voluntary / buyer-driven."} ${product.qcoLabel ?? ""} The governing standard is ${product.standard}.`,
    },
    {
      q: `How much does testing cost for ${product.standard}?`,
      a: `Listed laboratory charges range ${formatRange(product.testCostMin, product.testCostMax)} excluding GST.`,
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
        <Badge tone={isCrsProduct(product) ? "gold" : "mist"}>{bisRouteLabel(product)}</Badge>
        {product.schemeSlugs.map((schemeSlug) => (
          <Link key={schemeSlug} href={`/certifications/${schemeSlug}`}>
            <Badge>{getScheme(schemeSlug)?.shortName ?? schemeSlug}</Badge>
          </Link>
        ))}
      </div>
      <h1 className="mt-4 font-display text-navy">{product.name}</h1>
      <p className="lead mt-3 max-w-3xl text-muted">{product.excerpt}</p>
      <p className="mt-3 max-w-3xl rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink">{bisRouteSummary(product)}</p>
      <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || product.name} gallery={cms?.galleryUrls} />

      <RecordTable>
        <table className="mt-8 min-w-full text-left">
          <tbody>
            <tr className="border-t border-line">
              <th className="w-48 bg-mist px-4 py-2.5 font-medium text-muted">IS standard</th>
              <td className="px-4 py-2.5 font-semibold text-navy">{product.standard}</td>
            </tr>
            <tr className="border-t border-line">
              <th className="bg-mist px-4 py-2.5 font-medium text-muted">HSN code</th>
              <td className="px-4 py-2.5 font-mono text-navy">{product.hsn || product.hsn4 || "—"}</td>
            </tr>
            <tr className="border-t border-line">
              <th className="bg-mist px-4 py-2.5 font-medium text-muted">Test cost range</th>
              <td className="px-4 py-2.5">
                <ListedPrice amount={formatRange(product.testCostMin, product.testCostMax)} />
              </td>
            </tr>
            <tr className="border-t border-line">
              <th className="bg-mist px-4 py-2.5 font-medium text-muted">Typical timeline</th>
              <td className="px-4 py-2.5 text-navy">{product.timeline}</td>
            </tr>
          </tbody>
        </table>
      </RecordTable>
      <PriceReassurance className="mt-6" />
      {product.unit || product.qcoOrder ? (
        <p className="mt-4 text-sm text-muted">
          {product.unit ? `Unit of product: ${product.unit}. ` : null}
          {product.qcoOrder ? `Order note: ${product.qcoOrder}` : null}
        </p>
      ) : null}

      <h2 className="mt-12 border-b border-line pb-2 font-display text-navy">{sectionHeading(cms, "marking", "Annual BIS marking fee")}</h2>
      <RecordTable>
        <table className="mt-4 min-w-full text-left">
          <thead className="bg-gold/20 text-navy">
            <tr>
              <th className="px-4 py-2 font-medium">Unit size</th>
              <th className="px-4 py-2 font-medium">Marking fee</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(product.markingFee).map(([size, value]) => (
              <tr key={size} className="border-t border-line">
                <td className="px-4 py-2.5 capitalize">{size}</td>
                <td className="px-4 py-2.5">
                  <ListedPrice amount={formatInr(value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </RecordTable>

      {qco ? (
        <p className="mt-6 text-sm">
          Applicable order:{" "}
          <Link href={`/qco/${qco.slug}`} className="font-semibold text-navy underline">
            {qco.name}
          </Link>
        </p>
      ) : null}

      {tests.length ? (
        <>
          <h2 className="mt-12 border-b border-line pb-2 font-display text-navy">{sectionHeading(cms, "tests", "Relevant product testing")}</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line bg-white">
            {tests.map((test) => (
              <li key={test.slug}>
                <Link href={`/testing/${test.discipline}/${test.slug}`} className="flex items-baseline justify-between gap-4 py-2.5 hover:text-gold-600">
                  <span>{test.name}</span>
                  <span className="font-mono text-[11px] text-muted">
                    {test.standard} · {test.turnaround}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {bee.length || gmark.length ? (
        <>
          <h2 className="mt-12 border-b border-line pb-2 font-display text-navy">{sectionHeading(cms, "stacked", "Stacked energy & export marks")}</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line bg-white">
            {bee.map((item) => (
              <li key={item.slug}>
                <Link href={`/certifications/bee/products/${item.slug}`} className="block py-2.5 hover:text-gold-600">
                  <span className="font-semibold text-navy">{item.name}</span>
                  <span className="ms-2 font-mono text-[11px] text-muted">{item.starMandatory ? "BEE mandatory" : "BEE voluntary"}</span>
                </Link>
              </li>
            ))}
            {gmark.map((item) => (
              <li key={item.slug}>
                <Link href={`/certifications/g-mark/products/${item.slug}`} className="block py-2.5 hover:text-gold-600">
                  <span className="font-semibold text-navy">{item.name}</span>
                  <span className="ms-2 font-mono text-[11px] text-muted">{item.standard ?? "G-Mark"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {isCrsProduct(product) && notes.length ? (
        <>
          <h2 className="mt-12 border-b border-line pb-2 font-display text-navy">CRS notes for this product</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line bg-white">
            {notes.map((article) => (
              <li key={article.slug}>
                <Link href={`/blog/${article.slug}`} className="flex items-baseline justify-between gap-4 py-2.5 hover:text-gold-600">
                  <span>{article.heading || article.title}</span>
                  <span className="font-mono text-[11px] text-muted">{article.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h2 className="mt-12 border-b border-line pb-2 font-display text-navy">{sectionHeading(cms, "related", "Related standards & schemes")}</h2>
      <RecordTable>
        <table className="mt-4 min-w-full text-left">
          <thead className="bg-gold/20 text-navy">
            <tr>
              <th className="px-4 py-2 font-medium">Product</th>
              <th className="px-4 py-2 font-medium">Standard</th>
            </tr>
          </thead>
          <tbody>
            {related.map((item) => (
              <tr key={item.slug} className="border-t border-line">
                <td className="px-4 py-2.5">
                  <Link href={`/product/${item.slug}`} className="font-semibold text-navy underline">
                    {item.name}
                  </Link>
                </td>
                <td className="px-4 py-2.5 font-mono">{item.standard}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </RecordTable>
      <CmsArticles page={cms} skip={["marking", "labs", "prices", "tests", "stacked", "related", "quote"]} />
    </div>
  );
}
