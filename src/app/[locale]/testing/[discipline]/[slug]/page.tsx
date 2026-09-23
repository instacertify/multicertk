import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/lead-form";
import { Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { getLab, getProduct, getTest, tests } from "@/data/catalog";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return tests.map((test) => ({ discipline: test.discipline, slug: test.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; discipline: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const test = getTest(slug);
  if (!test) return {};
  return pageMetadata({
    locale,
    path: `/testing/${test.discipline}/${test.slug}`,
    title: test.name,
    description: test.summary,
  });
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ locale: string; discipline: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const test = getTest(slug);
  if (!test) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd
        data={breadcrumbLd(
          [
            { name: "Home", path: "/" },
            { name: "Testing", path: "/testing" },
            { name: test.discipline, path: `/testing/${test.discipline}` },
            { name: test.name, path: `/testing/${test.discipline}/${test.slug}` },
          ],
          locale,
        )}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: `/testing/${test.discipline}`, label: test.discipline },
          { href: `/testing/${test.discipline}/${test.slug}`, label: test.name },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">{test.name}</h1>
      <p className="mt-2 text-sm font-semibold text-gold-600">{test.standard} · {test.turnaround}</p>
      <p className="mt-3 text-muted">{test.summary}</p>
      <h2 className="mt-10 font-display text-2xl text-navy">Standards / products this unlocks</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {test.productSlugs.map((productSlug) => {
          const product = getProduct(productSlug);
          if (!product) return null;
          return (
            <CardLink key={product.slug} href={`/product/${product.slug}`} title={product.name} meta={product.standard} />
          );
        })}
      </div>
      <h2 className="mt-10 font-display text-2xl text-navy">Labs that typically run this scope</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {test.labSlugs.map((labSlug) => {
          const lab = getLab(labSlug);
          if (!lab) return null;
          return <CardLink key={lab.slug} href={`/labs/${lab.slug}`} title={lab.name} meta={`${lab.city}, ${lab.state}`} />;
        })}
      </div>
      <div className="mt-12 max-w-xl">
        <LeadForm sourcePath={`/testing/${test.discipline}/${test.slug}`} />
      </div>
    </div>
  );
}
