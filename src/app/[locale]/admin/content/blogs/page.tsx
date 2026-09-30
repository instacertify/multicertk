import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NewArticleForm } from "@/components/cms-editor";
import { Breadcrumbs, CardLink } from "@/components/ui";
import { getArticles } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

const pageSize = 24;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin/content/blogs",
    title: "Edit blogs",
    description: "Add and edit blog articles.",
    index: false,
  });
}

export default async function BlogsAdmin({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const all = await getArticles(locale);
  const q = query.q?.trim().toLowerCase() ?? "";
  const filtered = q
    ? all.filter((article) => `${article.title} ${article.heading} ${article.excerpt} ${article.tags.join(" ")}`.toLowerCase().includes(q))
    : all;
  const current = Math.max(1, Number(query.page) || 1);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(current, pages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/admin", label: "Editor" },
          { href: "/admin/content/blogs", label: "Blogs" },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">Blogs</h1>
      <p className="mt-3 text-muted">
        {all.length} articles. Publish a new one, then open it to edit every field, image, table, bar and spacer.
      </p>
      <div className="mt-8">
        <NewArticleForm locale={locale} />
      </div>
      <form method="get" className="mt-8 flex flex-wrap items-end gap-3">
        <label className="min-w-[16rem] flex-1 text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-muted">Find an article</span>
          <input name="q" defaultValue={query.q} className="w-full rounded-xl border border-line px-3 py-2" />
        </label>
        <button type="submit" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white">
          Search
        </button>
      </form>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {slice.map((article) => (
          <CardLink
            key={article.slug}
            href={`/admin/content/article/${article.slug}`}
            title={article.heading || article.title}
            meta={article.date}
            body={article.excerpt}
          />
        ))}
      </div>
      {pages > 1 ? (
        <nav className="mt-8 flex justify-between text-sm">
          {safePage > 1 ? (
            <Link href={{ pathname: "/admin/content/blogs", query: { ...(q ? { q: query.q } : {}), page: String(safePage - 1) } }} className="font-semibold text-navy underline">
              Previous
            </Link>
          ) : (
            <span />
          )}
          <p className="text-muted">
            Page {safePage} of {pages}
          </p>
          {safePage < pages ? (
            <Link href={{ pathname: "/admin/content/blogs", query: { ...(q ? { q: query.q } : {}), page: String(safePage + 1) } }} className="font-semibold text-navy underline">
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
