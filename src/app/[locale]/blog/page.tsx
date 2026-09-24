import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CatalogFilter } from "@/components/catalog-filter";
import { PageMedia } from "@/components/page-hero";
import { Breadcrumbs, CardLink } from "@/components/ui";
import { getArticles, getPage } from "@/lib/cms";
import { cmsPageMetadata } from "@/components/cms-page";
import { rankByCatalogSearch } from "@/lib/search";

export const dynamic = "force-dynamic";

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
  searchParams: Promise<{ page?: string; tag?: string; q?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const page = await getPage("blog", locale);
  const tag = query.tag?.trim();
  const all = await getArticles(locale);
  const tagged = tag ? all.filter((article) => article.tags.includes(tag)) : all;
  const articles = rankByCatalogSearch(tagged, query.q, "post", (article) => `/blog/${article.slug}`);
  const current = Math.max(1, Number(query.page) || 1);
  const pages = Math.max(1, Math.ceil(articles.length / pageSize));
  const safePage = Math.min(current, pages);
  const slice = articles.slice((safePage - 1) * pageSize, safePage * pageSize);
  const crsCount = all.filter((article) => article.tags.includes("CRS")).length;
  const listQuery = {
    ...(tag ? { tag } : {}),
    ...(query.q ? { q: query.q } : {}),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">{page?.title ?? "Notes from the certification desk"}</h1>
      {page?.intro ? <p className="mt-3 text-muted">{page.intro}</p> : null}
      <p className="mt-3 text-sm text-muted">
        CRS is part of BIS. {crsCount} notes cover only products on the CRS list. Products not covered in CRS take the ISI mark licence — they are not in this CRS series.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link
          href={{ pathname: "/blog", query: query.q ? { q: query.q } : {} }}
          className={`rounded-full px-3 py-1 ${!tag ? "bg-navy text-white" : "border border-line text-navy"}`}
        >
          All ({all.length})
        </Link>
        <Link
          href={{ pathname: "/blog", query: { tag: "CRS", ...(query.q ? { q: query.q } : {}) } }}
          className={`rounded-full px-3 py-1 ${tag === "CRS" ? "bg-navy text-white" : "border border-line text-navy"}`}
        >
          CRS ({crsCount})
        </Link>
      </div>
      <CatalogFilter q={query.q}>
        {tag ? <input type="hidden" name="tag" value={tag} /> : null}
      </CatalogFilter>
      <PageMedia src={page?.heroImageUrl} alt={page?.heroImageAlt || page?.title || "Blog"} gallery={page?.galleryUrls} />
      <div className="mt-8 grid gap-4">
        {slice.length === 0 ? (
          <p className="rounded-2xl border border-line bg-paper p-6 text-muted">
            No notes match that search. Try a product name, CRS, or HSN — the same live catalogue as site search.
          </p>
        ) : (
          slice.map((article) => (
            <CardLink
              key={article.slug}
              href={`/blog/${article.slug}`}
              title={article.heading || article.title}
              meta={article.date}
              body={article.excerpt}
              image={article.heroImageUrl}
            />
          ))
        )}
      </div>
      {pages > 1 ? (
        <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm" aria-label="Blog pages">
          {safePage > 1 ? (
            <Link
              href={{ pathname: "/blog", query: { ...listQuery, page: String(safePage - 1) } }}
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
              href={{ pathname: "/blog", query: { ...listQuery, page: String(safePage + 1) } }}
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
