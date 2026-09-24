import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageMedia } from "@/components/page-hero";
import { Breadcrumbs, StatusBadge } from "@/components/ui";
import { getProduct, qcos } from "@/data/catalog";
import { getPage } from "@/lib/cms";

export const dynamic = "force-dynamic";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/qco",
    title: "Quality Control Orders",
    description: "Mandatory and upcoming QCOs — never miss a new notified product.",
  });
}

export default async function QcoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getPage("qco", locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/qco", label: "QCO" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">{cms?.title ?? "Never miss a new mandatory product"}</h1>
      <p className="mt-3 text-muted">
        {cms?.intro ?? `${qcos.length} Quality Control Orders from the library. Each order is a unique page interlinked to the standards and labs it unlocks.`}
      </p>
      <PageMedia src={cms?.heroImageUrl} alt={cms?.heroImageAlt || cms?.title || "QCOs"} gallery={cms?.galleryUrls} />
      <div className="mt-8 space-y-5">
        {qcos.map((qco) => (
          <article id={qco.slug} key={qco.slug} className="scroll-mt-24 rounded-2xl border border-line p-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={qco.status} />
              {qco.deadline ? <span className="text-xs text-muted">Deadline {qco.deadline}</span> : null}
            </div>
            <h2 className="mt-2 font-display text-2xl text-navy">
              <Link href={`/qco/${qco.slug}`} className="hover:underline">
                {qco.name}
              </Link>
            </h2>
            <p className="text-sm text-muted">
              {qco.ministry}
              {qco.scheme ? ` · ${qco.scheme}` : ""}
              {qco.standard ? ` · ${qco.standard}` : ""}
            </p>
            <p className="mt-2 text-sm leading-6">{qco.summary}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {qco.productSlugs.slice(0, 8).map((slug) => {
                const product = getProduct(slug);
                if (!product) return null;
                return (
                  <li key={slug}>
                    <Link href={`/product/${product.slug}`} className="font-semibold text-navy underline">
                      {product.name}
                    </Link>{" "}
                    <span className="text-muted">({product.standard})</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-sm">
              <Link href={`/qco/${qco.slug}`} className="font-semibold text-navy underline">
                Open the unique QCO page →
              </Link>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
