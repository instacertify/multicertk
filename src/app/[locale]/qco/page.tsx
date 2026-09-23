import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs, StatusBadge } from "@/components/ui";
import { getProduct, qcos } from "@/data/catalog";
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/qco", label: "QCO" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">Never miss a new mandatory product</h1>
      <p className="mt-3 text-muted">
        New Quality Control Orders keep adding products to the mandatory BIS list. Each order is interlinked to the standards and labs it unlocks.
      </p>
      <div className="mt-8 space-y-5">
        {qcos.map((qco) => (
          <article id={qco.slug} key={qco.slug} className="scroll-mt-24 rounded-2xl border border-line p-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={qco.status} />
              {qco.deadline ? <span className="text-xs text-muted">Deadline {qco.deadline}</span> : null}
            </div>
            <h2 className="mt-2 font-display text-2xl text-navy">{qco.name}</h2>
            <p className="text-sm text-muted">{qco.ministry}</p>
            <p className="mt-2 text-sm leading-6">{qco.summary}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {qco.productSlugs.map((slug) => {
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
          </article>
        ))}
      </div>
    </div>
  );
}
