import { setRequestLocale } from "next-intl/server";
import { Breadcrumbs, CardLink, JsonLd, Section } from "@/components/ui";
import { SearchBox } from "@/components/search-box";
import { categories, productsByCategory, schemes } from "@/data/catalog";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/products",
    title: "Certification solutions — products by category",
    description: "Match the right certification to your product, then browse the mapped IS standard, HSN, QCO status, fees and labs.",
  });
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="bg-paper/40">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }], locale)} />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/products", label: "Products" }]} />
        <h1 className="mt-4 font-display text-4xl text-navy">Certification solutions — products by category</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Match the right mark to your product, then open the HSN / IS record for QCO status, labs and interlinked tests.
        </p>
        <div className="mt-6 max-w-2xl">
          <SearchBox size="sm" />
        </div>
      </div>
      <Section title="Start with a scheme">
        <div className="grid gap-4 md:grid-cols-3">
          {schemes.slice(0, 6).map((scheme) => (
            <CardLink key={scheme.slug} href={`/certifications/${scheme.slug}`} title={scheme.name} body={scheme.summary} />
          ))}
        </div>
      </Section>
      <Section title="Browse by product category">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CardLink
              key={category.slug}
              href={`/category/${category.slug}`}
              title={category.name}
              meta={`${productsByCategory(category.slug).length} products`}
              body={category.summary}
            />
          ))}
        </div>
        <p className="mt-6">
          <a className="font-semibold text-navy underline" href="/products/all">
            Open the full product table →
          </a>
        </p>
      </Section>
    </div>
  );
}
