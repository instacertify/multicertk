import { setRequestLocale } from "next-intl/server";
import { CmsSimplePage, cmsPageMetadata } from "@/components/cms-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(locale, "msds-authoring-service", "MSDS / SDS authoring", "Safety data sheet authoring for chemicals, batteries and dangerous goods shipments.");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CmsSimplePage slug="msds-authoring-service" locale={locale} />;
}
