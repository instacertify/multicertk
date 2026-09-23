import { setRequestLocale } from "next-intl/server";
import { CmsSimplePage, cmsPageMetadata } from "@/components/cms-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(locale, "guide", "BIS certification guide", "Process, cost, documents and timelines for ISI mark licences and CRS registration.");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CmsSimplePage slug="guide" locale={locale} />;
}
