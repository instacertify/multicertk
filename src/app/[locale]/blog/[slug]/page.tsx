import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
import { ArticleBlocks } from "@/components/article-blocks";
import { CmsHeading } from "@/components/cms-copy";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs, CardLink, JsonLd } from "@/components/ui";
import { getProduct, getScheme } from "@/data/catalog";
import { articleBlocks } from "@/data/cms-seed";
import { getArticle, getPage, listArticles } from "@/lib/cms";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return listArticles("en").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticle(slug, locale);
  if (!article) return {};
  return pageMetadata({
    locale,
    path: `/blog/${article.slug}`,
    title: article.title,
    description: article.excerpt,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await getArticle(slug, locale);
  if (!article) notFound();
  const cms = await getPage("blog-detail", locale);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={breadcrumbLd(
          [
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: article.title, path: `/blog/${article.slug}` },
          ],
          locale,
        )}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/blog", label: "Blog" },
          { href: `/blog/${article.slug}`, label: article.title },
        ]}
      />
      <p className="mt-4 text-[13px] text-muted">{article.date}</p>
      <h1 className="mt-2 font-display text-navy">{article.heading || article.title}</h1>
      <p className="mt-3 text-muted">{article.excerpt}</p>
      <PageHero src={article.heroImageUrl} alt={article.heading || article.title} />
      <ArticleBlocks blocks={articleBlocks(article)} />
      <CmsHeading page={cms} sectionKey="linked" fallback="Linked schemes & standards" className="mt-10" />
      <div className="mt-4 grid gap-4">
        {article.relatedSchemeSlugs.map((schemeSlug) => {
          const scheme = getScheme(schemeSlug);
          if (!scheme) return null;
          return <CardLink key={scheme.slug} href={`/certifications/${scheme.slug}`} title={scheme.name} body={scheme.summary} />;
        })}
        {article.relatedProductSlugs.map((productSlug) => {
          const product = getProduct(productSlug);
          if (!product) return null;
          return <CardLink key={product.slug} href={`/product/${product.slug}`} title={product.name} meta={product.standard} />;
        })}
      </div>
    </article>
  );
}
