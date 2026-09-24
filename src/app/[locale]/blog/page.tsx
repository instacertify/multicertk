import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageMedia } from "@/components/page-hero";
import { Breadcrumbs, CardLink } from "@/components/ui";

export const dynamic = "force-dynamic";
import { getArticles, getPage } from "@/lib/cms";
import { cmsPageMetadata } from "@/components/cms-page";

const pageSize = 24;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(
    locale,
    "blog",
    "Certification & testing notes",
    "Practical notes on HSN mapping, QCOs, multi-market testing and lab strategy.",
  );
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; tag?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const page = await getPage("blog", locale);
  const tag = query.tag?.trim();
  const all = await getArticles(locale);
  const articles = tag ? all.filter((article) => article.tags.includes(tag)) : all;
  const current = Math.max(1, Number(query.page) || 1);
  const pages = Math.max(1, Math.ceil(articles.length / pageSize));
  const safePage = Math.min(current, pages);
  const slice = articles.slice((safePage - 1) * pageSize, safePage * pageSize);
  const crsCount = all.filter((article) => article.tags.includes("CRS")).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">{page?.title ?? "Notes from the certification desk"}</h1>
      {page?.intro ? <p className="mt-3 text-muted">{page.intro}</p> : null}
      <p className="mt-3 text-sm text-muted">
        {crsCount} CRS product notes were published on 23–24 Sep 2026 — manufacture licences, China and Vietnam import, and the India assembly route from spare parts.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link
          href="/blog"
          className={`rounded-full px-3 py-1 ${!tag ? "bg-navy text-white" : "border border-line text-navy"}`}
        >
          All ({all.length})
        </Link>
        <Link
          href={{ pathname: "/blog", query: { tag: "CRS" } }}
          className={`rounded-full px-3 py-1 ${tag === "CRS" ? "bg-navy text-white" : "border border-line text-navy"}`}
        >
          CRS ({crsCount})
        </Link>
      </div>
      <PageMedia src={page?.heroImageUrl} alt={page?.heroImageAlt || page?.title || "Blog"} gallery={page?.galleryUrls} />
      <div className="mt-8 grid gap-4">
        {slice.map((article) => (
          <CardLink
            key={article.slug}
            href={`/blog/${article.slug}`}
            title={article.heading || article.title}
            meta={article.date}
            body={article.excerpt}
            image={article.heroImageUrl}
          />
        ))}
      </div>
      {pages > 1 ? (
        <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm" aria-label="Blog pages">
          {safePage > 1 ? (
            <Link
              href={{ pathname: "/blog", query: { ...(tag ? { tag } : {}), page: String(safePage - 1) } }}
              className="font-semibold text-navy underline"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          <p className="text-muted">
            Page {safePage} of {pages}
          </p>
          {safePage < pages ? (
            <Link
              href={{ pathname: "/blog", query: { ...(tag ? { tag } : {}), page: String(safePage + 1) } }}
              className="font-semibold text-navy underline"
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}
