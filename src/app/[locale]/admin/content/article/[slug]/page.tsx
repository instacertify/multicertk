import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArticleEditor } from "@/components/cms-editor";
import { Breadcrumbs } from "@/components/ui";
import { directusUrl, getArticle } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticle(slug, locale);
  return pageMetadata({
    locale,
    path: `/admin/content/article/${slug}`,
    title: article ? `Edit ${article.title}` : "Edit article",
    description: "Edit article heading and body.",
    index: false,
  });
}

export default async function EditArticle({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await getArticle(slug, locale);
  if (!article) notFound();
  const studio = directusUrl();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs
        items={[
          { href: "/admin", label: "Editor" },
          { href: "/admin/content", label: "Content" },
          { href: `/admin/content/article/${article.slug}`, label: article.title },
        ]}
      />
      <h1 className="mt-4 font-display text-4xl text-navy">Edit article</h1>
      <p className="mt-2 text-sm text-muted">
        Public URL: <Link href={`/blog/${article.slug}`} className="underline">/blog/{article.slug}</Link>
        {studio ? (
          <>
            {" "}
            ·{" "}
            <a href={`${studio}/admin/content/cms_articles`} className="underline" rel="noreferrer">
              Open in Directus
            </a>
          </>
        ) : null}
      </p>
      <div className="mt-8">
        <ArticleEditor article={article} locale={locale} />
      </div>
    </div>
  );
}
