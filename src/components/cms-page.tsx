import { SimplePage } from "./simple-page";
import { getPage } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function cmsPageMetadata(locale: string, slug: string, fallbackTitle: string, fallbackDescription: string) {
  const page = await getPage(slug, locale);
  return pageMetadata({
    locale,
    path: page?.path || `/${slug}`,
    title: page?.title || fallbackTitle,
    description: page?.intro || fallbackDescription,
  });
}

export async function CmsSimplePage({
  slug,
  locale,
  showLead = true,
}: {
  slug: string;
  locale: string;
  showLead?: boolean;
}) {
  const page = await getPage(slug, locale);
  if (!page) return null;
  return <SimplePage title={page.title} path={page.path} intro={page.intro} sections={page.sections} showLead={showLead} />;
}
