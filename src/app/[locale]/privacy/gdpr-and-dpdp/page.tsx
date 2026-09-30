import { setRequestLocale } from "next-intl/server";
import { CmsSimplePage, cmsPageMetadata } from "@/components/cms-page";
import { GdprCompare } from "@/components/legal-extras";
import { getCookieSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(locale, "gdpr-and-dpdp", "GDPR and DPDP", "EU GDPR and India’s DPDP Act as they apply to Certko.");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <CmsSimplePage
      slug="gdpr-and-dpdp"
      locale={locale}
      showLead={false}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/privacy", label: "Privacy" },
        { href: "/privacy/gdpr-and-dpdp", label: "GDPR & DPDP" },
      ]}
    >
      <GdprCompare settings={getCookieSettings()} />
    </CmsSimplePage>
  );
}
