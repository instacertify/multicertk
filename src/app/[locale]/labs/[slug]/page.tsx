import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge, Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { formatRange, getCategory, getLab, labs, productsByLab } from "@/data/catalog";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return labs.map((lab) => ({ slug: lab.slug }));
}

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
            address: {
              "@type": "PostalAddress",
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
      <div className="mt-4 flex flex-wrap gap-2">
        {lab.categorySlugs.map((categorySlug) => (
          <Link key={categorySlug} href={`/category/${categorySlug}`}>
            <Badge tone="mist">{getCategory(categorySlug)?.name ?? categorySlug}</Badge>
          </Link>
        ))}
      </div>
      <h2 className="mt-10 font-display text-2xl text-navy">Standards in scope</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
        {lab.standardCodes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <h2 className="mt-10 font-display text-2xl text-navy">Products / schemes this lab unlocks</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {mapped.map((product) => (
          <CardLink key={product.slug} href={`/product/${product.slug}`} title={product.name} meta={product.standard} body={product.excerpt} />
        ))}
      </div>
    </div>
  );
}
