import { setRequestLocale } from "next-intl/server";
import { CmsSimplePage, cmsPageMetadata } from "@/components/cms-page";
import { JsonLd } from "@/components/ui";
import { organizationLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(locale, "about", site.brandLegal, `${site.brandLegal} — certification catalogue.`);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JsonLd data={organizationLd({ legal: true })} />
      <CmsSimplePage slug="about" locale={locale} />
    </>
  );
}
