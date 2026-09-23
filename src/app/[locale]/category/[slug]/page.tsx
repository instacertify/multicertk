import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumbs, CardLink, JsonLd, StatusBadge } from "@/components/ui";
import { categories, getCategory, productsByCategory } from "@/data/catalog";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return pageMetadata({
    locale,
    path: `/category/${category.slug}`,
    title: category.name,
    description: category.summary,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const category = getCategory(slug);
  if (!category) notFound();
  const mapped = productsByCategory(category.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd
        data={breadcrumbLd(
          [
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: category.name, path: `/category/${category.slug}` },
          ],
          locale,
        )}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Products" },
          { href: `/category/${category.slug}`, label: category.name },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">{category.name}</h1>
      <p className="mt-3 max-w-3xl text-muted">{category.summary}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {mapped.map((product) => (
          <article key={product.slug} className="rounded-2xl border border-line p-5">
            <StatusBadge status={product.qcoStatus} />
            <CardLink href={`/product/${product.slug}`} title={product.name} meta={product.standard} body={product.excerpt} />
          </article>
        ))}
      </div>
    </div>
  );
}
