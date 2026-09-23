import { setRequestLocale } from "next-intl/server";
import { CmsSimplePage, cmsPageMetadata } from "@/components/cms-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(locale, "marketplaces", "Marketplace compliance", "Amazon, Flipkart and other marketplaces verify BIS registration numbers on notified products.");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CmsSimplePage slug="marketplaces" locale={locale} />;
}
