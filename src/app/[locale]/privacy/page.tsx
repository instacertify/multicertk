import { setRequestLocale } from "next-intl/server";
import { CmsSimplePage, cmsPageMetadata } from "@/components/cms-page";
import { LegalReviewed } from "@/components/legal-extras";
import { getCookieSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return cmsPageMetadata(locale, "privacy", "Privacy policy", "How Certko handles personal data under DPDP and GDPR.");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <CmsSimplePage
      slug="privacy"
      locale={locale}
      showLead={false}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/privacy", label: "Privacy" },
      ]}
    >
      <div className="mx-auto max-w-3xl px-4 pb-10">
        <LegalReviewed settings={getCookieSettings()} />
      </div>
    </CmsSimplePage>
  );
}
