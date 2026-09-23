import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs, CardLink } from "@/components/ui";

export const dynamic = "force-dynamic";
import { getArticles, getPage } from "@/lib/cms";
import { cmsPageMetadata } from "@/components/cms-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(locale, "blog", "Certification & testing notes", "Practical notes on HSN mapping, QCOs, multi-market testing and lab strategy.");
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await getPage("blog", locale);
  const articles = await getArticles(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }]} />
      <h1 className="mt-4 font-display text-4xl text-navy">{page?.title ?? "Notes from the certification desk"}</h1>
      {page?.intro ? <p className="mt-3 text-muted">{page.intro}</p> : null}
      <PageHero src={page?.heroImageUrl} alt={page?.heroImageAlt || page?.title || "Blog"} />
      <div className="mt-8 grid gap-4">
        {articles.map((article) => (
          <CardLink
            key={article.slug}
            href={`/blog/${article.slug}`}
            title={article.heading || article.title}
            meta={article.date}
            body={article.excerpt}
          />
        ))}
      </div>
    </div>
  );
}
