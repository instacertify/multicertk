import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LeadForm } from "@/components/lead-form";
import { Breadcrumbs, CardLink, JsonLd, StatusBadge } from "@/components/ui";
import { getProduct, getQco, qcos } from "@/data/catalog";
import { CmsArticles } from "@/components/cms-copy";
import { PageMedia } from "@/components/page-hero";
import { getPage, sectionHeading } from "@/lib/cms";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return qcos.map((qco) => ({ slug: qco.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const qco = getQco(slug);
  if (!qco) return {};
  return pageMetadata({
    locale,
    path: `/qco/${qco.slug}`,
    title: qco.name,
    description: qco.summary,
  });
}

export default async function QcoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const qco = getQco(slug);
  if (!qco) notFound();
  const mapped = qco.productSlugs.map((item) => getProduct(item)).filter(Boolean);
  const cms = await getPage("qco-detail", locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd
        data={breadcrumbLd(
          [
            { name: "Home", path: "/" },
            { name: "QCO", path: "/qco" },
            { name: qco.name, path: `/qco/${qco.slug}` },
          ],
          locale,
        )}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/qco", label: "QCO" },
          { href: `/qco/${qco.slug}`, label: qco.name },
        ]}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge status={qco.status} />
        {qco.deadline ? <span className="text-xs text-muted">Enforcement {qco.deadline}</span> : null}
      </div>
      <h1 className="mt-3 font-display text-4xl text-navy">{qco.name}</h1>
      <p className="mt-2 text-sm text-muted">
        {qco.ministry}
        {qco.scheme ? ` · ${qco.scheme}` : ""}
        {qco.standard ? ` · ${qco.standard}` : ""}
      </p>
      <p className="mt-4 max-w-3xl text-muted">{qco.summary}</p>
      <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || qco.name} gallery={cms?.galleryUrls} />
      <h2 className="mt-10 font-display text-2xl text-navy">{sectionHeading(cms, "mapped", "Mapped products & standards")}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {mapped.map((product) =>
          product ? (
            <CardLink
              key={product.slug}
              href={`/product/${product.slug}`}
              title={product.name}
              meta={product.standard}
              body={product.excerpt}
            />
          ) : null,
        )}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/qco" className="font-semibold text-navy underline">
          Browse every Quality Control Order →
        </Link>
      </p>
      <CmsArticles page={cms} skip={["mapped"]} />
      <div className="mt-10 max-w-xl">
        <LeadForm sourcePath={`/qco/${qco.slug}`} />
      </div>
    </div>
  );
}
