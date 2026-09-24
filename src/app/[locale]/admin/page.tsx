import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NewArticleForm, NewPageForm } from "@/components/cms-editor";
import { ImageLibrary } from "@/components/image-library";
import { CardLink } from "@/components/ui";
import { getArticles, getPages, isCustomCmsPage } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin",
    title: "Editor",
    description: "Edit Certko pages, blogs, images and tools.",
    index: false,
  });
}

export default async function AdminHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const pages = await getPages(locale);
  const articles = await getArticles(locale);
  const customPages = pages.filter(isCustomCmsPage);
  const recentBlogs = articles.slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">After sign in</p>
      <h1 className="mt-2 font-display text-navy">Site editor</h1>
      <p className="lead mt-3 max-w-3xl text-muted">
        Add pages, blogs and images here. Every heading and article field is editable. Saves show on the public site immediately.
      </p>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-navy">Pages</h2>
            <p className="mt-1 text-sm text-muted">Edit existing public pages or add a new one with its own sections and images.</p>
          </div>
          <Link href="/admin/content" className="text-sm font-semibold text-navy underline">
            Open all pages →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <NewPageForm locale={locale} />
          <div className="grid content-start gap-3">
            {customPages.length ? (
              customPages.map((page) => (
                <CardLink
                  key={page.slug}
                  href={`/admin/content/page/${page.slug}`}
                  title={page.title}
                  meta={`${page.path} · added page`}
                  body={page.intro}
                />
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
                No extra pages yet. Use the form to add one — it publishes at /p/your-slug.
              </p>
            )}
            {pages
              .filter((page) => !isCustomCmsPage(page))
              .slice(0, 6)
              .map((page) => (
                <CardLink
                  key={page.slug}
                  href={`/admin/content/page/${page.slug}`}
                  title={page.title}
                  meta={`${page.sections.length} sections · ${page.path}`}
                  body={page.intro}
                />
              ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-navy">Blogs</h2>
            <p className="mt-1 text-sm text-muted">Write a new note or open an existing article to edit every field, image, table, bar or spacer.</p>
          </div>
          <Link href="/admin/content/blogs" className="text-sm font-semibold text-navy underline">
            Open all blogs →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <NewArticleForm locale={locale} />
          <div className="grid content-start gap-3">
            {recentBlogs.map((article) => (
              <CardLink
                key={article.slug}
                href={`/admin/content/article/${article.slug}`}
                title={article.heading || article.title}
                meta={article.date}
                body={article.excerpt}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-navy">Images</h2>
            <p className="mt-1 text-sm text-muted">Upload once, copy the URL, then drop it into any page or blog image field.</p>
          </div>
          <Link href="/admin/content/images" className="text-sm font-semibold text-navy underline">
            Open image library →
          </Link>
        </div>
        <div className="mt-6">
          <ImageLibrary />
        </div>
      </section>

      <section className="mt-14" id="tools">
        <h2 className="font-display text-2xl text-navy">Other tools</h2>
        <p className="mt-1 text-sm text-muted">Header menu, trusted-by logos, SEO, cookies and translations.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <CardLink
            href="/admin/content/media"
            title="Logos & reviews"
            meta="Trusted-by strip"
            body="Upload school and customer logos. Edit the review library shown on public pages."
          />
          <CardLink
            href="/admin/content/menu"
            title="Header menu"
            meta="Certification · Testing · QCOs · Labs · Resources"
            body="Rename items and add submenu links, including a page or blog you just created."
          />
          <CardLink
            href="/admin/content/seo"
            title="SEO"
            meta="Titles, robots, share image"
            body="Default title, description, keywords and search-index rules."
          />
          <CardLink
            href="/admin/content/cookies"
            title="Cookies & consent"
            meta="DPDP · GDPR"
            body="Banner copy and whether analytics or marketing cookies may load after consent."
          />
          <CardLink
            href="/admin/translations"
            title="Translations"
            meta="Human review"
            body="AI drafts plus approve / edit / reject for locale copy."
          />
        </div>
      </section>
    </div>
  );
}
