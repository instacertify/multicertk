import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";
import { NewArticleForm } from "@/components/cms-editor";
import { Breadcrumbs, CardLink } from "@/components/ui";
import { getArticles, getPages } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/admin/content",
    title: "Edit headings & articles",
    description: "Directus-backed editor for page sections and blog articles.",
    index: false,
  });
}

export default async function ContentIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const pages = await getPages(locale);
  const articles = await getArticles(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/admin", label: "Backend" },
          { href: "/admin/content", label: "Content" },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">Headings & articles</h1>
      <p className="mt-3 text-muted">
        Every heading and every article word is editable here — page H1s, section headings, body copy, and blog articles. Add or remove sections, then save. Upload page images on each page. Changes publish on the site and sync to Directus when it is available.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <CardLink
          href="/admin/content/media"
          title="Trusted-by logos & reviews"
          meta="Runs on every public page"
          body="Upload school and customer logos in one library. Edit the customer review quotes that appear across the site."
        />
        <CardLink
          href="/admin/content/menu"
          title="Header menu"
          meta="Certification · Testing · QCOs · Labs"
          body="Rename items, add submenu links, or reorder the public header."
        />
      </div>
      <h2 className="mt-10 font-display text-2xl text-navy">Pages / sections</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {pages.map((page) => (
          <CardLink
            key={page.slug}
            href={`/admin/content/page/${page.slug}`}
            title={page.title}
            meta={`${page.sections.length} sections · ${page.path}`}
            body={page.intro}
          />
        ))}
      </div>
      <h2 className="mt-10 font-display text-2xl text-navy">Articles</h2>
      <NewArticleForm locale={locale} />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <CardLink
            key={article.slug}
            href={`/admin/content/article/${article.slug}`}
            title={article.heading || article.title}
            meta={article.date}
            body={article.excerpt}
          />
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/admin" className="font-semibold text-navy underline">
          Back to the backend home →
        </Link>
      </p>
    </div>
  );
}
