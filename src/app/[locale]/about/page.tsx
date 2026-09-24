import { setRequestLocale } from "next-intl/server";
import { CmsSimplePage, cmsPageMetadata } from "@/components/cms-page";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(locale, "about", "About Certko", "Certification and compliance solution partner.");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CmsSimplePage slug="about" locale={locale} />;
}
