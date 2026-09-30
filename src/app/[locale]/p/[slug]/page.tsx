import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CmsSimplePage } from "@/components/cms-page";
import { getPage } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = await getPage(slug, locale);
  if (!page || page.path !== `/p/${slug}`) {
    return pageMetadata({ locale, path: `/p/${slug}`, title: "Page", description: "", index: false });
  }
  return pageMetadata({
    locale,
    path: page.path,
    title: page.title,
    description: page.intro,
  });
}

export default async function CustomCmsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = await getPage(slug, locale);
  if (!page || page.path !== `/p/${slug}`) notFound();
  return <CmsSimplePage slug={slug} locale={locale} crumbs={[{ href: "/", label: "Home" }, { href: page.path, label: page.title }]} />;
}
