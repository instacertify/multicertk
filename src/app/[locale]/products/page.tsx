import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs, CardLink, JsonLd, Section } from "@/components/ui";
import { PageMedia } from "@/components/page-hero";
import { SearchBox } from "@/components/search-box";
import { categories, productsByCategory, schemes } from "@/data/catalog";
import { getPage, sectionHeading } from "@/lib/cms";

export const dynamic = "force-dynamic";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/products",
    title: "Products by IS number and HSN",
    description: "Match the right certification to your product, then browse the mapped IS standard, HSN, QCO status and fees.",
  });
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getPage("products", locale);

  return (
    <div className="bg-paper/40">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }], locale)} />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/products", label: "Products" }]} />
        <h1 className="mt-4 font-display text-navy">{cms?.title ?? "Products by IS number and HSN"}</h1>
        <p className="lead mt-3 max-w-3xl text-muted">
          {cms?.intro ?? "Match the right mark to your product, then open the HSN / IS record for QCO status and fees."}
        </p>
        <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || cms?.title || "Products"} gallery={cms?.galleryUrls} />
        <div className="mt-6 max-w-2xl">
          <SearchBox size="sm" />
        </div>
      </div>
      <Section title="BIS: CRS or ISI mark">
        <p className="mb-4 max-w-3xl text-sm text-muted">
          CRS is part of BIS. Products on the CRS list take Scheme II. Products not covered in CRS take the ISI mark licence.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <CardLink
            href="/products/all?bis=crs"
            title="CRS registration"
            meta="Part of BIS"
            body="Notified electronics and IT goods on the Compulsory Registration list."
          />
          <CardLink
            href="/products/all?bis=isi"
            title="ISI mark licence"
            meta="BIS — not on CRS"
            body="Every other BIS product. If it is not on the CRS list, the path is the ISI mark."
          />
        </div>
      </Section>
      <Section title={sectionHeading(cms, "schemes", "Start with a scheme")}>
        <div className="grid gap-4 md:grid-cols-3">
          {schemes.slice(0, 6).map((scheme) => (
            <CardLink key={scheme.slug} href={`/certifications/${scheme.slug}`} title={scheme.name} body={scheme.summary} />
          ))}
        </div>
      </Section>
      <Section title="Browse by product family">
        <div className="columns-1 gap-x-10 sm:columns-2 lg:columns-3">
          {categories.map((category) => (
            <p key={category.slug} className="mb-2 break-inside-avoid border-b border-line pb-2">
              <Link href={`/category/${category.slug}`} className="text-navy hover:text-gold-600">
                {category.name}
              </Link>
              <span className="ms-2 font-mono text-[11px] text-muted">{productsByCategory(category.slug).length}</span>
            </p>
          ))}
        </div>
        <p className="mt-6">
          <Link className="font-semibold text-navy underline" href="/products/all">
            Open the full product table →
          </Link>
        </p>
      </Section>
    </div>
  );
}
